// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
/**
 * @title IStaking.
 * @dev interface for staking
 * with params enum and functions.
 */
interface IStaking {
    /**
    * @dev 
    * defines privelege type of address.
    */
    enum Tiers {
        None,
        Starter,
        Investor,                   
        Strategist,
        Evangelist
    }

    function setPoolsEndTime(address, uint256) external;

    function stakedAmountOf(address) external view returns (uint256);

    function stake(uint256) external;

    function unstake(uint256) external;

    function getTierOf(address) external view returns (Tiers);
}
