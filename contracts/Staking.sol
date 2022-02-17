// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IStaking.sol";
import "./interfaces/IAdmin.sol";

/**
 * @title Staking.
 * @dev contract for staking tokens.
 * 
 */
contract Staking is IStaking {
    using SafeERC20 for IERC20;

    /**
    * EBSC required for different tiers
    */
    bytes32 public constant OPERATOR = keccak256("OPERATOR");

    uint256 constant STARTER_TIER = 2e5 gwei;
    uint256 constant INVESTOR_TIER = 6e5 gwei;
    uint256 constant STRATEGIST_TIER = 25e5 gwei;
    uint256 constant EVANGELIST_TIER = 7e6 gwei;

    IERC20 public lpToken;
    IAdmin public admin;

    mapping(address => uint256) private _userDepositAmounts;
    mapping(address => uint256) public poolsEndTime;

    constructor(address _token, address _admin) {
        lpToken = IERC20(_token);
        admin = IAdmin(_admin);
    }

    modifier onlyInstances() {
        require(admin.tokenSalesM(msg.sender), "Sender is not instance");
        _;
    }

    modifier canUnstake() {
        require(
            block.timestamp > poolsEndTime[msg.sender],
            "Staking: wait to be able unstake"
        );
        _;
    }
    modifier validation(address _address) {
        require(_address != address(0), "Zero address");
        _;
    }
    modifier onlyOperator() {
        require(admin.hasRole(OPERATOR, msg.sender), 'Sender is not an operator');
        _;
    }

    function stakedAmountOf(address _address)
        external
        view
        override
        returns (uint256)
    {
        return _userDepositAmounts[_address];
    }
    
    function setAdmin(address _address) external validation(_address) onlyOperator{
        admin = IAdmin(_address);
    }

    function setToken(address _address) external validation(_address) onlyOperator{
        lpToken = IERC20(_address);
    }


    function getTierOf(address _address)
        external
        view
        override
        returns (Tiers)
    {
        return _tierByAmount(_userDepositAmounts[_address]);
    }

    function setPoolsEndTime(address _address, uint256 _time)
        external
        override
        onlyInstances
    {
        if (poolsEndTime[_address] < _time) {
            poolsEndTime[_address] = _time;
        }
    }

    function stake(uint256 _amount) external override {
        require(
            _amount > 0,
            "Staking: deposited amount must be greater than 0"
        );
        _userDepositAmounts[msg.sender] += _amount;
        lpToken.safeTransferFrom(msg.sender, address(this), _amount);
    }

    function unstake(uint256 _amount) external override canUnstake {
        uint256 amount = _amount > 0
            ? _amount
            : _userDepositAmounts[msg.sender];
        _withdraw(amount);
    }

    function _tierByAmount(uint256 _amount) internal pure returns (Tiers) {
        if (_amount >= EVANGELIST_TIER) {
            return Tiers.Evangelist;
        }
        if (_amount >= STRATEGIST_TIER) {
            return Tiers.Strategist;
        }
        if (_amount >= INVESTOR_TIER) {
            return Tiers.Investor;
        }
        if (_amount >= STARTER_TIER) {
            return Tiers.Starter;
        }
        return Tiers.None;
    }

    function _withdraw(uint256 _amount) private {
        _userDepositAmounts[msg.sender] -= _amount;
        lpToken.safeTransfer(msg.sender, _amount);
    }
}
