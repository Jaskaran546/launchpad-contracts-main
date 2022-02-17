// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IAdmin.sol";

/**
 * @title Admin.
 * @dev contract creates tokenSales.
 * 
 */

contract Admin is AccessControl, IAdmin {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR = keccak256("OPERATOR");

    address[] public tokenSales;

    address public masterTokenSale;
    address public stakingContract;
    address public override forAirdrop;
    address public exchangeOracle;
    address public override wallet; 

    mapping(address => bool) public override tokenSalesM;
    
     /**
     * @dev Emitted when pool is created.
     */
    event CreateTokenSale (address instanceAddress);
    /**
     * @dev Emitted when airdrop is set.
     */
     event SetAirdrop(address airdrop);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(OPERATOR, DEFAULT_ADMIN_ROLE);
        wallet = msg.sender;
    }

    /**
     * @dev Modifier that checks address is not ZERO address.
     */
    modifier validation(address _address) {
        require(_address != address(0), "Zero address");
        _;
    }
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'Sender is not an admin');
        _;
    }


    function setWallet(address _address) external validation(_address) onlyAdmin{
        wallet = _address;
    }

    function addOperator(address _address) external virtual onlyAdmin {
        grantRole(OPERATOR, _address);
    }

    function removeOperator(address _address) external virtual onlyAdmin {
        revokeRole(OPERATOR, _address);
    }

    /**
     * @dev creates new pool.
     * initialize staking, admin, oracle contracts for it.
     * @param _params describes prices, timeline, limits of new pool.
     */

    function createPool(ITokenSale.Params calldata _params)
        external
        override
        onlyRole(OPERATOR)
    {
        require(
            _params.totalSupply > 0,
            "Token supply for sale should be greater then 0"
        );
        require(
            _params.privateEnd > _params.privateStart,
            "End time should be greater then start time"
        );
        require(
            _params.publicStart > _params.privateStart,
            "Public round should start after private round"
        );
        require(
            _params.publicEnd > _params.publicStart,
            "End time should be greater then start time"
        );
        require(
            _params.initial != address(0) && _params.token != address(0),
            "initialAddress || token == 0"
        );
        for(uint256 i = 0; i < _params.escrowReturnMilestones.length; i++){
            require(_params.escrowReturnMilestones[i][0] < 100 && _params.escrowReturnMilestones[i][1] < 100);
        }
        require(_params.escrowPercentage < 100, 'must be less than 100');
        //require(_params.claimPct <= 100, 'must be less than 100');
        address instance = Clones.clone(masterTokenSale);

        ITokenSale(instance).initialize(
            _params,
            stakingContract,
            address(this),
            exchangeOracle
        );
        tokenSales.push(instance);
        tokenSalesM[instance] = true;

        IERC20(_params.token).safeTransferFrom(
            _params.initial,
            instance,
            _params.totalSupply
        );

        emit CreateTokenSale(instance);
    }

     /**
     * @dev returns all token sales
     */

    function getTokenSales() external view override returns (address[] memory) {
        return tokenSales;
    }

    function setMasterContract(address _address)
        external
        override
        validation(_address)
        onlyRole(OPERATOR)
        
    {
        masterTokenSale = _address;
    }

     /**
     * @dev set address for airdrop distribution.
     */

    function setAirdrop(address _address)
        external
        override
        validation(_address)
        onlyRole(OPERATOR)
    {
        forAirdrop = _address;
        emit SetAirdrop(_address);
    }

    /**
     * @dev set address for staking logic contract.
     */

    function setStakingContract(address _address)
        external
        override
        validation(_address)
        onlyRole(OPERATOR)
    {
        stakingContract = _address;
    }

    /**
     * @dev set oracle contract address
     */

    function setOracleContract(address _address)
        external
        override
        validation(_address)
        onlyRole(OPERATOR)
    {
        exchangeOracle = _address;
    }
}
