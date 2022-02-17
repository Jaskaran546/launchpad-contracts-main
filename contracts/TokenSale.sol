// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Staking.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/ITokenSale.sol";
import "./interfaces/IAdmin.sol";
import "./interfaces/IERC20D.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

// import "./interfaces/IStaking.sol";

/*
A tokensale includes 3 stages: 
1. Private round. Only EBSC token holders can participate in this round. The BNB/USD price is fixed in the beginning of the tokensale. All tokens available in the pre-sale will be made available through the private sale round. A single investor can purchase up to their maximum allowed investment defined by the tier. Investors can claim their tokens only when the private round is finished. If the total supply is higher than the total demand for this tokensale, investors purchase tokens up to their max allocation. If the the demand is higher than supply, the number of tokens investors will receive is adjusted, and then the native token used to invest are partially refunded.

2. Public round. After the private round has been completed, the public round opens. Any unsold tokens from the private round  become available publicly. Anyone can participate in the public round. Investment in the public sale round is limited to 1000$ per wallet. Investors who have purchased tokens in the private sale round will be able to invest further in the public sale round.

3. Airdrop. 1% of tokens allocated to each tokensale are transferred to the distributor address to be distributed among participants with two highest tiers. (The distribution is centralised in this version)
*/

contract TokenSale is Initializable, ITokenSale {
    using SafeERC20 for IERC20D;

    uint64 constant PCT_BASE = 1 ether;
    uint64 constant ORACLE_MUL = 10**10;

    enum Epoch {
        Incoming,
        Private,
        Waiting,
        Public,
        Finished
    }
    AggregatorV3Interface internal priceFeed;

    IStaking stakingContract;
    IERC20D token;
    Params params;
    IAdmin admin;
    /**
     * @dev current tokensale stage (epoch)
     */
    Epoch public epoch;

    mapping(address => Staked) public override stakes;
    mapping(address => bool) blacklist;

    /**
     * @dev The maximum amount for which a specific tier can buy in a private round
     */

    mapping(IStaking.Tiers => uint256) public maxValuesByTier;
    mapping(address => bool) claimed;
    mapping(address => uint256) public publicPurchased;
    mapping(address => IStaking.Tiers) public tokensaleTiers;

    /** @dev The exchange rate BNB / USD at the time of the first deposit */
    int256 public exchangeRate;

    /** @dev it was sold in a private round (in tokens) */
    uint256 public totalPrivateSold;

    /** @dev it was sold in a public round (in tokens) */
    uint256 public totalPublicSold;

    /** @dev the totalSupply reduced to 18 decimals*/
    uint256 totalSupplyDecimals;

    /** @dev maximum available amount to purchase in tokens*/
    uint256 public publicMaxValues;

    /** @dev decimals of the token which we sell */
    uint8 tokenDecimals;
    bool only;
    bool airdrop;
    bool leftovers;
    bytes32 public constant OPERATOR = keccak256("OPERATOR");

    function initialize(
        Params calldata _params,
        address _stakingContract,
        address _admin,
        address _priceFeed
    ) external override initializer {
        params = _params;
        stakingContract = IStaking(_stakingContract);
        admin = IAdmin(_admin);
        token = IERC20D(_params.token);
        tokenDecimals = token.decimals();
        totalSupplyDecimals = _multiply(_params.totalSupply);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    modifier isBlacklisted() {
        require(!blacklist[msg.sender], "blacklist");
        _;
    }

    modifier onlyInitiator() {
        require(msg.sender == params.initial, "not initial");
        _;
    }

    /**
     * @dev setup the current tokensale stage (epoch)
     */
    function checkingEpoch() internal {
        uint256 time = block.timestamp;
        if (
            epoch != Epoch.Private &&
            time >= params.privateStart &&
            time <= params.privateEnd
        ) {
            epoch = Epoch.Private;
            return;
        } else if (
            epoch != Epoch.Public &&
            time >= params.publicStart &&
            time <= params.publicEnd &&
            _overcomeThreshold()
        ) {
            epoch = Epoch.Public;
            return;
        } else if (
            (epoch != Epoch.Finished &&
                (time > params.privateEnd && !_overcomeThreshold())) ||
            time > params.publicEnd
        ) {
            epoch = Epoch.Finished;
            return;
        } else if (
            (epoch != Epoch.Waiting && epoch != Epoch.Finished) &&
            (time > params.privateEnd && time < params.publicStart)
        ) {
            epoch = Epoch.Waiting;
            return;
        } else {
            return;
        }
    }

    function giftTier(address[] calldata users, IStaking.Tiers[] calldata tiers)
        public
    {
        require(admin.hasRole(OPERATOR, msg.sender), "OnlyOperator");
        require(users.length == tiers.length, "invalid length");
        for (uint256 i = 0; i < users.length; i++) {
            if (stakingContract.getTierOf(users[i]) < tiers[i]) {
                
                tokensaleTiers[users[i]] = tiers[i];
            }
        }
    }

    function onlygiftTier(bool _onlytier) external{
            require(admin.hasRole(OPERATOR, msg.sender), "OnlyOperator");
            require(only != _onlytier,"Invalid bool");
            checkingEpoch();
            console.log(block.timestamp,params.privateStart);
            require(uint8(epoch) < 1, "Incorrect time");
            only = _onlytier;
    }

    // function DeleteTier(address[] calldata users) external{
    // require(admin.hasRole(OPERATOR,msg.sender),"OnlyOperator");
    //   for(uint j=0;j<=users.length;j++) {
    //     delete tokensaleTiers[users[j]];
    // }
    // }

    /**
     * @dev invest BNB to the tokensale
     */
    function deposit() external payable isBlacklisted {
        checkingEpoch();
        address sender = msg.sender;
        uint256 value = msg.value;
        if (exchangeRate == 0) {
            //    (, exchangeRate, , ,) = priceFeed.latestRoundData();
            exchangeRate = 29770000000;
            _setMaxValueByPrice(params.tierPrices);
        }
        require(epoch != Epoch.Incoming, "not started");
        require(epoch != Epoch.Finished, "over");
        require(epoch != Epoch.Waiting, "Waiting");
        require(value > 0, "deposit 0");

        if (epoch == Epoch.Private) {
            _processPrivate(sender, value);
        } else if (epoch == Epoch.Public) {
            _processPublic(sender, value);
        }
    }

    function getTimeParams()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            params.privateStart,
            params.privateEnd,
            params.publicStart,
            params.publicEnd
        );
    }

    function getParams()
        external
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256[4] memory,
            uint256[2][] memory
        )
    {
        return (
            params.initial,
            params.token,
            params.totalSupply,
            params.privateTokenPrice,
            params.publicTokenPrice,
            params.escrowPercentage,
            params.thresholdPublicAmount,
            params.claimTime,
            params.claimPct,
            params.airdrop,
            params.tierPrices,
            params.escrowReturnMilestones
        );
    }

    /**
     * @dev processing BNB investment to the private round
     * @param _sender - transaction sender
     * @param _amount - investment amount in BNB
     */
    function _processPrivate(address _sender, uint256 _amount) internal {
        IStaking.Tiers t;
        
        if(only){
            t = tokensaleTiers[_sender];
            
        }else{
            if (uint256(tokensaleTiers[_sender]) > uint256(stakingContract.getTierOf(_sender))) {
                t = tokensaleTiers[_sender];
            } else {
                t = stakingContract.getTierOf(_sender);
            }
            
        }
        
        console.log("tier", uint256(t));
        // IStaking.Tiers t = stakingContract.getTierOf(_sender);
        require(uint8(t) > 0, "no tier");
        _amount = (_amount * PCT_BASE) / params.privateTokenPrice;
        require(_amount > 0, "small value");
        Staked storage s = stakes[_sender];
        uint256 max = maxValuesByTier[t];
        uint256 sum = s.amount + _amount;
        bool limit = sum >= max;
        uint256 left = limit ? sum - max : 0;
        uint256 add = limit ? (max - s.amount) : _amount;
        if (s.tier != t) {
            s.tier = t;
        }
        totalPrivateSold += add;
        s.amount += add;
        /**@notice Forbid unstaking*/
        stakingContract.setPoolsEndTime(_sender, params.privateEnd);
        emit DepositPrivate(_sender, _amount);
        left = (left * params.privateTokenPrice) / PCT_BASE;
        if (left > 0) {
            (bool success, ) = _sender.call{value: left}("");
            require(success);
        }
    }

    /**
     * @dev processing BNB investment to the public round
     * @param _sender - transaction sender
     * @param _amount - investment amount in BNB
     */
    function _processPublic(address _sender, uint256 _amount) internal {
        /** @notice Calculate the token price in BNB and maximum available amount to purchase in tokens*/
        if (totalPublicSold == 0) {
            uint256 inValue = (params.publicBuyLimit * PCT_BASE) /
                (uint256(exchangeRate) * ORACLE_MUL);
            publicMaxValues = (inValue * PCT_BASE) / (params.publicTokenPrice);
        }

        /** @notice Calculate and transfer max amount of token the investor can purchase */
        (uint256 want, uint256 left) = _leftWant(_sender, _amount);
        uint256 amount = left < want ? left : want;
        token.safeTransfer(_sender, _shift(amount));
        publicPurchased[_sender] += amount;
        totalPublicSold += amount;

        /** @notice If the investor is trying to but more tokens than is allowed, the rest of BNB is returned to them */
        if (left < want) {
            uint256 refund = _amount -
                ((left * params.publicTokenPrice) / PCT_BASE);
            (bool success, ) = _sender.call{value: refund}("");
            require(success);
        }
        emit DepositPublic(_sender, _shift(amount));
    }

    /**
     * @dev calculates the amount of tokens an investor want and can actually purchase
     * @param _sender - transaction sender
     * @param _amount - investment amount in BNB
     */
    function _leftWant(address _sender, uint256 _amount)
        internal
        view
        returns (uint256 want, uint256 left)
    {
        want = (_amount * PCT_BASE) / params.publicTokenPrice;
        uint256 forUser = (publicMaxValues - publicPurchased[_sender]);
        uint256 forContract = saleTokensAmountWithoutAirdrop() -
            (totalPrivateSold + totalPublicSold);
        left = forUser < forContract ? forUser : forContract;
    }

    /**
     * @dev converts the amount of tokens from 18 decimals to {tokenDecimals}
     */
    function _shift(uint256 _amount) internal view returns (uint256 value) {
        if (tokenDecimals != 18) {
            value = tokenDecimals < 18
                ? (_amount / 10**(18 - tokenDecimals))
                : (_amount * 10**(tokenDecimals - 18));
        } else {
            value = _amount;
        }
    }

    /**
     * @dev converts the amount of tokens from {tokenDecimals} to 18 decimals
     */
    function _multiply(uint256 _amount) internal view returns (uint256 value) {
        if (tokenDecimals != 18) {
            value = tokenDecimals < 18
                ? (_amount * 10**(18 - tokenDecimals))
                : (_amount / 10**(tokenDecimals - 18));
        } else {
            value = _amount;
        }
    }

    /**
     * @dev allows the participants of the private round to claim their tokens
     */
    function claim() external override {
        checkingEpoch();
        require(uint8(epoch) > 1, "Incorrect time");
        address sender = msg.sender;
        require(!claimed[sender], "claimed");
        Staked memory s = stakes[sender];
        if (!s.piece) {
            _claim(sender, s);
        } else {
            _claimLeft(sender, s);
        }
        revert();
    }

    function _claimLeft(address _sender, Staked memory _s) internal {
        require(block.timestamp >= params.claimTime, "Incorrect time");
        uint256 value = _s.share;
        claimed[_sender] = true;
        _s.share = 0;
        stakes[_sender] = _s;
        token.safeTransfer(_sender, _shift(value));
        emit Claim(_sender, _shift(value), 0);
    }

    function _claim(address _sender, Staked memory _s) internal {
        /** @notice An investor can withdraw no more tokens than they bought or than allowed by their tier */
        uint256 supply = saleTokensAmountWithoutAirdrop();
        uint256 value;
        uint256 left;
        /** @notice If the demand is higher than supply, the amount of available token for each investor is decreased proportionally to their tiers */
        if (totalPrivateSold > supply) {
            uint256 rate = (supply * PCT_BASE) / totalPrivateSold;
            _s.share = (_s.amount * rate) / PCT_BASE;
            left = _s.amount - _s.share;
        } else {
            _s.share = _s.amount;
        }
        if (block.timestamp < params.claimTime) {
            value = (_s.share * params.claimPct) / 100;
            _s.share = _s.share - value;
            claimed[_sender] = params.claimPct == 100 ? true : false;
        } else {
            value = _s.share;
            _s.share = 0;
            claimed[_sender] = true;
        }
        _s.piece = true;
        stakes[_sender] = _s;
        if (value > 0) {
            token.safeTransfer(_sender, _shift(value));
        }
        left = (left * params.privateTokenPrice) / PCT_BASE;
        emit Claim(_sender, _shift(value), left);
        if (left > 0) {
            (bool success, ) = _sender.call{value: left}("");
            require(success);
        }
    }

    /**
     * @dev add users to blacklist
     * @param _blacklist - the list of users to add to the blacklist
     */
    function addToBlackList(address[] memory _blacklist)
        external
        override
        onlyInitiator
    {
        checkingEpoch();
        require(_blacklist.length <= 500, "large array");
        require(epoch == Epoch.Incoming, "Sale started");
        for (uint256 i = 0; i < _blacklist.length; i++) {
            blacklist[_blacklist[i]] = true;
        }
    }

    /**
     * @dev sends the unsold tokens and corresponding part of the escrow to the admin address
     */
    function takeLeftovers() external override {
        checkingEpoch();
        require(epoch == Epoch.Finished && airdrop, "no time");
        require(!leftovers, "payed");
        uint256 returnAmount = _returnEscrow();

        uint256 fee = (_escrowAmount() - returnAmount);
        bool soldOut = (totalPrivateSold + totalPublicSold) >
            saleTokensAmountWithoutAirdrop();
        uint256 earned = _earned(saleTokensAmountWithoutAirdrop(), soldOut);
        //total - PublicSold * private
        leftovers = true;
        if (saleTokensAmountWithoutAirdrop() > totalTokenSold()) {
            returnAmount += (saleTokensAmountWithoutAirdrop() -
                totalTokenSold());
        }
        if (fee > 0) {
            token.safeTransfer(admin.wallet(), _shift(fee));
        }
        if (returnAmount > 0) {
            token.safeTransfer(params.initial, _shift(returnAmount));
        }
        if (earned > 0) {
            uint256 returnValue = earned <= address(this).balance
                ? earned
                : address(this).balance;
            (bool success, ) = params.initial.call{value: returnValue}("");
            require(success);
        }
        emit TransferLeftovers(_shift(returnAmount), _shift(fee), earned);
    }

    function _earned(uint256 _saleAmount, bool _soldOut)
        internal
        view
        returns (uint256 earned)
    {
        if (_soldOut) {
            earned =
                (((_saleAmount - totalPublicSold) * params.privateTokenPrice) +
                    (totalPublicSold * params.publicTokenPrice)) /
                PCT_BASE;
        } else {
            earned =
                ((totalPrivateSold * params.privateTokenPrice) +
                    (totalPublicSold * params.publicTokenPrice)) /
                PCT_BASE;
        }
    }

    /**
     * @dev sends the tokens locked for airdrop to the admin address
     */
    function takeAirdrop() external override {
        checkingEpoch();
        require(epoch == Epoch.Finished, "not over");
        require(!airdrop, "paid");
        uint256 amount = params.airdrop;
        airdrop = true;
        token.safeTransfer(admin.forAirdrop(), _shift(amount));
        emit TransferAirdrop(_shift(amount));
    }

    function takeLocked() external override {
        require(block.timestamp >= (params.publicEnd + 2592e3), "not time");
        uint256 amountTkn = token.balanceOf(address(this));
        uint256 amountValue = address(this).balance;

        if (amountTkn > 0) {
            token.safeTransfer(admin.wallet(), amountTkn);
        }

        if (address(this).balance > 0) {
            (bool success, ) = admin.wallet().call{value: amountValue}("");
            require(success);
        }
    }

    /**
     * @dev sends the tokens locked for airdrop to the admin address
     */
    function _setMaxValueByPrice(uint256[4] memory _limits) internal {
        for (uint256 i = 0; i < _limits.length; i++) {
            unchecked {
                require(exchangeRate > 0);

                uint256 inValue = (_limits[i] * PCT_BASE) /
                    (uint256(exchangeRate) * ORACLE_MUL);

                uint256 amount = (inValue * PCT_BASE) /
                    (params.privateTokenPrice);

                maxValuesByTier[IStaking.Tiers(i + 1)] = amount;
            }
        }
    }

    function _returnEscrow() internal view returns (uint256 returnAmount) {
        uint256 blockedAmount = _escrowAmount();
        uint256[2][] memory sortingMilestones = _sortMilestones(
            params.escrowReturnMilestones
        );
        for (uint256 i = 0; i < sortingMilestones.length; i++) {
            uint256 mustSold = (saleTokensAmountWithoutAirdrop() *
                sortingMilestones[i][0]) / 100;
            if (mustSold <= totalTokenSold()) {
                if (sortingMilestones[i][1] > 0) {
                    returnAmount =
                        (blockedAmount * sortingMilestones[i][1]) /
                        100;
                } else {
                    returnAmount = blockedAmount;
                }
                break;
            }
        }
    }

    function totalTokenSold() public view returns (uint256) {
        return totalPrivateSold + totalPublicSold;
    }

    function _escrowAmount() internal view returns (uint256) {
        return (totalSupplyDecimals * params.escrowPercentage) / 100;
    }

    function _overcomeThreshold() internal view returns (bool overcome) {
        if (saleTokensAmountWithoutAirdrop() > totalPrivateSold) {
            overcome = ((saleTokensAmountWithoutAirdrop() - totalPrivateSold) >=
                _multiply(params.thresholdPublicAmount));
        }
    }

    /**
     * @dev amount reserved for entire process without airdrop
     */
    function saleTokensAmountWithoutAirdrop() public view returns (uint256) {
        return (totalSupplyDecimals - _escrowAmount()) - params.airdrop;
    }

    function _saleTokensAmount() internal view returns (uint256) {
        return (totalSupplyDecimals - _escrowAmount());
    }

    function _sortMilestones(uint256[2][] memory arr)
        internal
        pure
        returns (uint256[2][] memory)
    {
        uint256 l = arr.length;
        for (uint256 i = 0; i < l; i++) {
            for (uint256 j = i + 1; j < l; j++) {
                if (arr[i][0] < arr[j][0]) {
                    uint256[2] memory temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
}
