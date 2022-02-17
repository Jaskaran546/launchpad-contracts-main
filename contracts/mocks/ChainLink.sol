// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;


contract ChainLink {


    function latestRoundData() external pure returns(uint80, int256, uint256, uint256, uint80) {
        uint80 roundId = 0;
        int256 answer = 6;
        uint256 startedAt = 0;
        uint256 updatedAt=0;
        uint80 answeredInRound = 0;
        unchecked {
            answer = 48887406263;
            
        }
        return (roundId,answer,startedAt, updatedAt, answeredInRound);
    }


} 