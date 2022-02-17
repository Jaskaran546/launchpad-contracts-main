// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Staking", () => {
//   let staking;
//   let token;
//   let admin;
//   let accounts;
//   const Tiers = ["None", "Starter", "Investor", "Strategist", "Evangelist"];

//   before(async () => {
//     const { deploy } = deployments;
//     accounts = await ethers.getNamedSigners();

//     await deploy("LPToken", {
//       from: accounts.deployer.address,
//       args: ["LPToken", "LPT"],
//       log: true,
//     });

//     token = await ethers.getContract("LPToken");

//     await deploy("Admin", {
//       from: accounts.deployer.address,
//       args: [],
//       log: true,
//     });

//     admin = await ethers.getContract("Admin");

//     await deploy("Staking", {
//       from: accounts.deployer.address,
//       args: [token.address, admin.address],
//       log: true,
//     });

//     staking = await ethers.getContract("Staking");

//     await admin.addOperator(accounts.deployer.address);
//     await admin.setMasterContract(staking.address);

//     await token.mint(
//       accounts.staker.address,
//       ethers.utils.parseEther("70000000")
//     );
//     await token
//       .connect(accounts.staker)
//       .approve(staking.address, ethers.constants.MaxUint256);
//   });

//   describe("Stake function: ", async () => {
//     let snapshotId;
//     const stakedAmount = 10000;
//     beforeEach(async () => {
//       snapshotId = await ethers.provider.send("evm_snapshot");
//     });

//     afterEach(async () => {
//       await ethers.provider.send("evm_revert", [snapshotId]);
//     });

//     it("Should revert with msg 'Staking: deposited amount must be greater than 0'", async () => {
//       await expect(
//         staking.connect(accounts.staker).stake(0)
//       ).to.be.revertedWith("Staking: deposited amount must be greater than 0");
//     });

//     it("Should stake given amount", async () => {
//       const userDepositAmounts = await staking.stakedAmountOf(
//         accounts.staker.address
//       );

//       await expect(() =>
//         staking.connect(accounts.staker).stake(stakedAmount)
//       ).to.changeTokenBalances(
//         token,
//         [accounts.staker, staking],
//         [-stakedAmount, stakedAmount]
//       );

//       expect(await staking.stakedAmountOf(accounts.staker.address)).to.equal(
//         userDepositAmounts.add(stakedAmount)
//       );
//     });
//   });

//   describe("Unstake function: ", async () => {
//     let snapshotId;
//     const stakedAmount = 20000;
//     before(async () => {
//       await staking.connect(accounts.staker).stake(stakedAmount);
//       // await staking.connect(accounts.deployer).setPoolsEndTime(accounts.staker.address, new Date().getTime() + 60)
//     });
//     beforeEach(async () => {
//       snapshotId = await ethers.provider.send("evm_snapshot");
//     });

//     afterEach(async () => {
//       await ethers.provider.send("evm_revert", [snapshotId]);
//     });

//     xit("Should revert with msg 'Staking: wait to be able unstake", async () => {
//       await expect(
//         staking.connect(accounts.staker).stake(0)
//       ).to.be.revertedWith("Staking: wait to be able unstake");
//     });

//     it("Should unstake given amount", async () => {
//       const userDepositAmounts = await staking.stakedAmountOf(
//         accounts.staker.address
//       );

//       await expect(() =>
//         staking.connect(accounts.staker).unstake(stakedAmount / 2)
//       ).to.changeTokenBalances(
//         token,
//         [staking, accounts.staker],
//         [-(stakedAmount / 2), stakedAmount / 2]
//       );

//       expect(await staking.stakedAmountOf(accounts.staker.address)).to.equal(
//         userDepositAmounts.sub(stakedAmount / 2)
//       );
//     });

//     it("Should unstake all amount if arg equal 0", async () => {
//       const userDepositAmounts = await staking.stakedAmountOf(
//         accounts.staker.address
//       );

//       await expect(() =>
//         staking.connect(accounts.staker).unstake(0)
//       ).to.changeTokenBalances(
//         token,
//         [staking, accounts.staker],
//         [-userDepositAmounts, userDepositAmounts]
//       );

//       expect(await staking.stakedAmountOf(accounts.staker.address)).to.equal(0);
//     });
//   });

//   describe("getTierOf function: ", async () => {
//     let snapshotId;
//     const stakedAmount = 20000;
//     before(async () => {
//       await staking.connect(accounts.staker).stake(stakedAmount);
//       // await staking.connect(accounts.deployer).setPoolsEndTime(accounts.staker.address, new Date().getTime() + 60)
//     });
//     beforeEach(async () => {
//       snapshotId = await ethers.provider.send("evm_snapshot");
//     });

//     afterEach(async () => {
//       await ethers.provider.send("evm_revert", [snapshotId]);
//     });

//     it("Should return correct tier", async () => {
//       let tier;

//       await staking.connect(accounts.staker).stake(stakedAmount);
//       tier = await staking.getTierOf(accounts.staker.address);
//       expect(Tiers[tier]).to.equal(Tiers[0]);

//       await staking
//         .connect(accounts.staker)
//         .stake(ethers.utils.parseEther("200000"));
//       tier = await staking.getTierOf(accounts.staker.address);
//       expect(Tiers[tier]).to.equal(Tiers[1]);

//       await staking
//         .connect(accounts.staker)
//         .stake(ethers.utils.parseEther("400000"));
//       tier = await staking.getTierOf(accounts.staker.address);
//       expect(Tiers[tier]).to.equal(Tiers[2]);

//       await staking
//         .connect(accounts.staker)
//         .stake(ethers.utils.parseEther("2500000"));
//       tier = await staking.getTierOf(accounts.staker.address);
//       expect(Tiers[tier]).to.equal(Tiers[3]);

//       await staking
//         .connect(accounts.staker)
//         .stake(ethers.utils.parseEther("7000000"));
//       tier = await staking.getTierOf(accounts.staker.address);
//       expect(Tiers[tier]).to.equal(Tiers[4]);
//     });
//   });
// });
