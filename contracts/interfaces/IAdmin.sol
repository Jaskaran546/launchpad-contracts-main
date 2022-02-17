// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
import '@openzeppelin/contracts/access/IAccessControl.sol';
import './ITokenSale.sol';

/**
 * @title IAdmin.
 * @dev interface of Admin contract
 * which can set addresses for contracts for:
 * airdrop, token sales maintainers, staking.
 * Also Admin can create new pool.
 */
interface IAdmin is IAccessControl {
    function forAirdrop() external returns(address);
    function tokenSalesM(address) external returns(bool);
    function setMasterContract(address) external;
    function setAirdrop(address _newAddress) external;
    function setStakingContract(address) external;
    function setOracleContract(address) external;
    function createPool(ITokenSale.Params calldata _params) external;
    function getTokenSales() external view returns (address[] memory);
    function wallet() external view returns(address);
    
}