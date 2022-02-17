// SPDX-License-Identifier: UNLICENSED

/**
 * @title ITokenSale.
 * @dev interface of ITokenSale
 * params structure and functions.
 */
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;
import './IStaking.sol';

interface ITokenSale {

    struct Staked {
        IStaking.Tiers tier;
        uint256 amount;
        uint256 share;
        bool piece;
    }
    /**
    * @dev describe initial params for token sale
    * @param totalSupply set total amount of tokens. (Token decimals)
    * @param privateStart set starting time for private sale.
    * @param privateEnd set finish time for private sale.
    * @param publicStart set starting time for public sale.
    * @param privateEnd set finish time for private sale.
    * @param privateTokenPrice set price for private sale per token in $ (18 decimals).
    * @param publicTokenPrice set price for public sale per token in $ (18 decimals).
    * @param publicBuyLimit set limit for tokens per address in $ (18 decimals).
    * @param escrowPercentage set interest rate for depositor. > 
    * @param tierPrices set price to calculate maximum value by tier for staking.
    * @param thresholdPublicAmount - should be sold more than that.
    * @param airdrop - amount reserved for airdrop 
    */
    struct Params {
        address initial;
        address token;
        uint256 totalSupply; //MUST BE 10**18;
        uint256 privateStart;
        uint256 privateEnd;
        uint256 publicStart;
        uint256 publicEnd;
        uint256 privateTokenPrice;// MUST BE 10**18 in bnb
        uint256 publicTokenPrice;// MUST BE 10**18 in $
        uint256 publicBuyLimit;//// MUST BE 10**18 in $
        uint256 escrowPercentage; // 
        uint256[4] tierPrices; // MUST BE 10**18 in $
        uint256[2][] escrowReturnMilestones;
        //in erc decimals
        uint256 thresholdPublicAmount;
        uint256 claimTime;  //the time from which users can claim
        uint256 claimPct;
        uint256 airdrop;
    }
    /**
    * @dev initialize implementation logic contracts addresses
    * @param _stakingContract for staking contract.
    * @param _admin for admin contract.
    * @param _priceFeed for price aggregator contract.
    */
    function initialize(Params memory, address _stakingContract, address _admin, address _priceFeed) external;
    /**
    * @dev claim to sell tokens in airdrop.
    */
    function claim() external;
    /**
    * @dev get banned list of addresses from participation in sales in this contract.
    */
    function addToBlackList(address[] memory) external;
    function takeLeftovers() external;
    function takeAirdrop() external;
    function stakes(address) external returns(IStaking.Tiers, uint256, uint256, bool);
    function takeLocked() external;

    event DepositPrivate(address indexed user, uint256 amount);
    event DepositPublic(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount, uint256 change);
    event TransferAirdrop(uint256 amount);
    event TransferLeftovers(uint256 leftovers, uint256 fee, uint256 earned);
}