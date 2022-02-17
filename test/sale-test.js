// const { expect } = require("chai");

// describe("TokenSale Contract", () => {
//   let tokenSaleContract;
//   let token;
//   let alice;
//   let bob;
//   let pol;

//   const tokenSaleSettings = {};

//   beforeEach(async () => {
//     const TokenSale = await ethers.getContractFactory("TokenSale");
//     const Token = await ethers.getContractFactory("LPToken");
//     [owner, alice, bob, pol] = await ethers.getSigners();

//     token = await Token.deploy("Token", "tkn");
//     await token.deployed();

//     tokenSaleContract = await TokenSale.deploy();
//     await tokenSaleContract.deployed();
//     console.log(tokenSaleContract.address);
//     console.log(token.address);
//   });

//   describe("Blacklist checks", async () => {
//     it("Should add an array of addresses to blacklist", () => {
//       expect(tokenSaleContract.address).to.not.equal(null);
//     });
//     it("Should reverted: add to the blacklist after the start of sales", async () => {});
//     it("Should");
//   });
//   describe("Deposit", () => {});
// });
