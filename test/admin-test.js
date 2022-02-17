// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// const { BigNumber } = ethers;

// function setTokenSaleParams(params) {
//   return [
//     params.initial,
//     params.token,
//     params.totalSupply, // MUST BE 10**18;
//     params.privateStart,
//     params.privateEnd,
//     params.publicStart,
//     params.publicEnd,
//     params.privateTokenPrice, // MUST BE 10**18 in $
//     params.publicTokenPrice, // MUST BE 10**18 in $
//     params.publicBuyLimit, // LIKE ERC20
//     params.escrowPercentage,
//     params.tierPrices, // MUST BE 10**18 in $
//     params.escrowReturnMilestones,
//     params.thresholdPublicAmount,
//   ];
// }

// describe("Admin", () => {
//   const hour = 3600;
//   const day = hour * 24;
//   const week = day * 7;

//   let params;
//   let masterContract;
//   let adminContract;
//   let accounts;
//   let instance;
//   let token;

//   before(async () => {
//     const { deploy } = deployments;
//     accounts = await ethers.getNamedSigners();

//     await deploy("Admin", {
//       from: accounts.deployer.address,
//       args: [],
//       log: true,
//     });

//     await deploy("TokenSale", {
//       from: accounts.deployer.address,
//       args: [],
//       log: true,
//     });

//     adminContract = await ethers.getContract("Admin");
//     masterContract = await ethers.getContract("TokenSale");

//     await adminContract
//       .connect(accounts.deployer)
//       .addOperator(accounts.deployer.address);
//     await adminContract.setMasterContract(masterContract.address);

//     await deploy("LPToken", {
//       from: accounts.deployer.address,
//       args: ["Token", "tkn"],
//       log: true,
//     });

//     token = await ethers.getContract("LPToken");

//     await token.mint(accounts.alice.address, ethers.utils.parseEther("10"));
//     await token
//       .connect(accounts.alice)
//       .approve(adminContract.address, ethers.constants.MaxUint256);

//     params = {
//       initial: accounts.alice.address,
//       token: token.address,
//       totalSupply: ethers.utils.parseEther("10"), // MUST BE 10**18;
//       privateStart: BigNumber.from(new Date().getTime() + hour),
//       privateEnd: BigNumber.from(new Date().getTime() + hour + week),
//       publicStart: BigNumber.from(new Date().getTime() + hour + week + hour),
//       publicEnd: BigNumber.from(
//         new Date().getTime() + hour + week + hour + week
//       ),
//       privateTokenPrice: BigNumber.from(100), // MUST BE 10**18 in $
//       publicTokenPrice: BigNumber.from(200), // MUST BE 10**18 in $
//       publicBuyLimit: ethers.utils.parseEther("1"), // LIKE ERC20
//       escrowPercentage: BigNumber.from(60),
//       tierPrices: [
//         BigNumber.from("2500").pow("8"),
//         BigNumber.from("4500").pow("8"),
//         BigNumber.from("6500").pow("8"),
//         BigNumber.from("13000").pow("8"),
//       ], // MUST BE 10**18 in $
//       escrowReturnMilestones: [
//         [BigNumber.from(30), BigNumber.from(60)],
//         [BigNumber.from(50), BigNumber.from(40)],
//         [BigNumber.from(50), BigNumber.from(40)],
//       ],
//       thresholdPublicAmount: BigNumber.from(600),
//     };
//   });

//   describe("Create contract", async () => {
//     it("Should create contract and initialize", async () => {
//       const tokenSaleParams = setTokenSaleParams(params);
//       const deployedParams = [
//         params.initial,
//         params.token,
//         params.totalSupply, // MUST BE 10**18;
//         params.privateTokenPrice, // MUST BE 10**18 in $
//         params.publicTokenPrice, // MUST BE 10**18 in $
//         params.publicBuyLimit, // LIKE ERC20
//         params.escrowPercentage,
//         params.thresholdPublicAmount,
//         params.tierPrices, // MUST BE 10**18 in $
//         params.escrowReturnMilestones,
//       ];
//       await adminContract.createPool(tokenSaleParams);
//       const addresses = await adminContract.getTokenSales();
//       instance = await ethers.getContractAt("TokenSale", addresses[0]);

//       expect(await adminContract.tokenSalesM(instance.address)).to.equal(true);
//       expect(await instance.getParams()).to.deep.equal(deployedParams);
//     });

//     it("Should revert with msg 'Token supply for sale should be greater then 0'", async () => {
//       const tokenSaleParams = setTokenSaleParams(params);
//       tokenSaleParams[2] = 0;
//       await expect(
//         adminContract.createPool(tokenSaleParams)
//       ).to.be.revertedWith("Token supply for sale should be greater then 0");
//     });

//     it("Should revert with msg 'End time should be greater then start time'", async () => {
//       const tokenSaleParams = setTokenSaleParams(params);
//       const a = tokenSaleParams[3];
//       tokenSaleParams[3] = tokenSaleParams[4];
//       tokenSaleParams[4] = a;
//       await expect(
//         adminContract.createPool(tokenSaleParams)
//       ).to.be.revertedWith("End time should be greater then start time");
//     });

//     it("Should revert with msg 'Public round should start after private round'", async () => {
//       const tokenSaleParams = setTokenSaleParams(params);
//       tokenSaleParams[3] = 5;
//       tokenSaleParams[4] = 10;
//       tokenSaleParams[5] = 4;
//       tokenSaleParams[6] = 15;
//       await expect(
//         adminContract.createPool(tokenSaleParams)
//       ).to.be.revertedWith("Public round should start after private round");
//     });

//     it("Should revert with msg 'End time should be greater then start time'", async () => {
//       const tokenSaleParams = setTokenSaleParams(params);
//       const a = tokenSaleParams[5];
//       tokenSaleParams[5] = tokenSaleParams[6];
//       tokenSaleParams[6] = a;
//       await expect(
//         adminContract.createPool(tokenSaleParams)
//       ).to.be.revertedWith("End time should be greater then start time");
//     });
//   });
// });
