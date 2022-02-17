// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// // const {mineBlocks} = require("../../launchpad-contracts/test/utilities/utilities");

// const {
//   time, // time
//   constants
// } = require("@openzeppelin/test-helpers");

// const BN = require("ethers").BigNumber;

// const duration = {
//   seconds(val) {
//     return BN.from(val);
//   },
//   minutes(val) {
//     return BN.from(val).mul(this.seconds("60"));
//   },
//   hours(val) {
//     return new BN.from(val).mul(this.minutes("60"));
//   },
//   days(val) {
//     return new BN.from(val).mul(this.hours("24"));
//   },
//   weeks(val) {
//     return new BN.from(val).mul(this.days("7"));
//   },
//   years(val) {
//     return new BN.from(val).mul(this.days("365"));
//   },
// };

// describe("TokenSale Contract", ()=>{
//   beforeEach(async ()=>{
//     Admin = await ethers.getContractFactory("Admin");
//     TokenSale = await ethers.getContractFactory("TokenSale");
//     Token = await ethers.getContractFactory("Token");
//     LpToken = await ethers.getContractFactory("Token");
//     Staking = await ethers.getContractFactory("Staking");
//     Oracle = await ethers.getContractFactory("ChainLink");
//     Airdrops = await ethers.getContractFactory("Airdrops");
//     Weth = await ethers.getContractFactory("WETH");
//     Pair = await ethers.getContractFactory("UniswapV2Pair");
//     Factory = await ethers.getContractFactory("UniswapV2Factory");
//     Router = await ethers.getContractFactory("UniswapV2Router01");
//     [owner] = await ethers.getSigners();
//     provider = await ethers.provider;
//     hash = await ethers.getContractFactory("CallHash");
  
//     hashReq = await hash.deploy();
//     await hashReq.deployed();
  
//     const getHash = await hashReq.getInitHash();
//     console.log("getHash", getHash);
  
//     tokenSaleContract = await TokenSale.deploy();
//     await tokenSaleContract.deployed();
  
//     oracle = await Oracle.deploy();
//     await oracle.deployed();
  
//     factory = await Factory.deploy(owner.address);
//     await factory.deployed();
  
//     weth = await Weth.deploy();
//     await weth.deployed();
   
//     router = await Router.deploy(factory.address, weth.address);
//     await router.deployed();
  
//     token = await Token.deploy("Token", "tkn");
//     await token.deployed();
  
//     lpToken = await Token.deploy("LPToken", "lptkn");
//     await lpToken.deployed();
  
//     adminContract = await Admin.deploy();
//     await adminContract.deployed();
  
//     const EbscReq = [[200000,600000,1000000,2500000,5000000,7000000],[200000,600000,1000000,2500000,5000000,7000000],[200000,600000,1000000,2500000,5000000,7000000],[200000,600000,1000000,2500000,5000000,7000000,30000000]];
//     stakingContract = await Staking.deploy();
//     await stakingContract.deployed();
  
//     await stakingContract.initialize(lpToken.address, adminContract.address, router.address, weth.address,EbscReq);
    
//     airdrops = await Airdrops.deploy(stakingContract.address, adminContract.address, lpToken.address);
//     await airdrops.deployed();
  
//     await adminContract.addOperator(owner.address);
//     await adminContract.setMasterContract(tokenSaleContract.address);
//     await adminContract.setOracleContract(oracle.address);
//     await adminContract.setStakingContract(stakingContract.address);
//     await adminContract.setAirdrop(airdrops.address);
    
//     await adminContract.addOperator(owner.address);
//       // console.log("operator hash", await adminContract.OPERATOR);

//       const newAuuurray = [[15, 60, 120, 360, 750, 1125], [30,120,240,720,1500,2250], [45,180,360,1080,2250,3375], [75,300,600,1800,3750,5625,7500]]
//       const newArray = [
//         [
//           BN.from("100").mul(BN.from("10").pow("18")),
//           BN.from("250").mul(BN.from("10").pow("18")),
//           BN.from("500").mul(BN.from("10").pow("18")),
//           BN.from("1250").mul(BN.from("10").pow("18")),
//           BN.from("1300").mul(BN.from("10").pow("18")),
//           BN.from("1550").mul(BN.from("10").pow("18")),
//         ],
//         [
//           BN.from("125").mul(BN.from("10").pow("18")),
//           BN.from("325").mul(BN.from("10").pow("18")),
//           BN.from("625").mul(BN.from("10").pow("18")),
//           BN.from("1350").mul(BN.from("10").pow("18")),
//           BN.from("1400").mul(BN.from("10").pow("18")),
//           BN.from("1600").mul(BN.from("10").pow("18")),
//         ],
//         [
//           BN.from("150").mul(BN.from("10").pow("18")),
//           BN.from("400").mul(BN.from("10").pow("18")),
//           BN.from("650").mul(BN.from("10").pow("18")),
//           BN.from("1450").mul(BN.from("10").pow("18")),
//           BN.from("1500").mul(BN.from("10").pow("18")),
//           BN.from("1650").mul(BN.from("10").pow("18")),
//         ],
//         [
//           BN.from("175").mul(BN.from("10").pow("18")),
//           BN.from("475").mul(BN.from("10").pow("18")),
//           BN.from("675").mul(BN.from("10").pow("18")),
//           BN.from("1550").mul(BN.from("10").pow("18")),
//           BN.from("1600").mul(BN.from("10").pow("18")),
//           BN.from("1750").mul(BN.from("10").pow("18")),
//         ]
//       ]


//       console.log("role check:", await adminContract.hasRole(
//         "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c",
//         owner.address
//       ));

//         await stakingContract.setAllocations(newArray);
//         await lpToken.mint(owner.address,BN.from("6000000").mul(BN.from("10").pow("18")));
//         // console.log("lpToken5ytyttr balance", String(await lpToken.balanceOf(owner.address)));
//         await lpToken.connect(owner).approve(stakingContract.address, BN.from("5000000").mul(BN.from("10").pow("18")));
//         await lpToken.connect(owner).approve
//         (router.address, BN.from("100000").mul(BN.from("10").pow("18")));
//         await router.connect(owner).addLiquidityETH(lpToken.address,BN.from("100").mul(BN.from("10").pow("18")) ,1,
//              1, owner.address, 1675748851, { value: BN.from("10").mul(BN.from("10").pow("18"))});
//         //console.log("bnb - airdrop initial ", String (await weth.balanceOf(airdrops.address)));
//         console.log("airdrops balance before  ",String(await airdrops.viewBalance()));
//         await stakingContract.stake(1, BN.from("700000").mul(BN.from("10").pow("18")), {value :BN.from("10").mul(BN.from("10").pow("18"))});
//         console.log("airdrops balance after",String(await airdrops.viewBalance()));

//         // let a = await stakingContract.getUserState(owner.address);
//         //   console.log("a",String(a));

//       const gettingAlloc = await stakingContract.getAllocationOf(owner.address)
//       console.log("Allocation :----------",String(gettingAlloc));
//       // console.log("new alloc", String(await stakingContract.allocation(1,3)));

//       await token.mint(owner.address,BN.from("6000000000000000").mul(BN.from("10").pow("18")));
//       await token.connect(owner).approve(adminContract.address,BN.from("20000000000").mul(BN.from("10").pow("18")));

//       const now = (await time.latest()).toNumber();
//       const newNow =  BN.from(now).add(duration.seconds(9));
//       const end = BN.from(now).add(duration.seconds(15));

//       const newPublicNow = BN.from(newNow).add(duration.seconds(16));
//       const newPublicEnd = BN.from(newPublicNow).add(duration.seconds(04))  

//       // const newDtae = new Date();
//       // const upTime = parseInt(newDtae.getTime()/1000);
//       // const updatedTime = upTime+60;
//       //   console.log("updatedTime", updatedTime);

//       defaultParams = {
//         initial: owner.address,
//         token: token.address,
//         totalSupply: BN.from("300000").mul(BN.from("10").pow("18")),
//         privateStart: String(newNow),
//         privateEnd: String(end),
//         publicStart: String(newPublicNow),
//         publicEnd: String(newPublicEnd),
//         privateTokenPrice: BN.from("10000"),
//         publicTokenPrice: BN.from("20000"),
//         publicBuyLimit: BN.from("1000").mul(BN.from("10").pow("18")),
//         escrowPercentage: BN.from("600"),
//         escrowReturnMilestones: [
//           [BN.from("300"), BN.from("600")],
//           // [BN.from('600'), BN.from('600')],
//           [BN.from("900"), BN.from("200")],
//           [BN.from("600"), BN.from("200")],
//         ],
//         thresholdPublicAmount: BN.from("1"),
//         vestingPoints: [
//           [end.add(duration.seconds(10)), BN.from('100')],
//           [end.add(duration.seconds(20)), BN.from('100')],
//           [end.add(duration.seconds(30)), BN.from('100')],
//           [end.add(duration.seconds(40)), BN.from('100')],
//           [end.add(duration.seconds(50)), BN.from('100')],
//           [end.add(duration.seconds(60)), BN.from('100')],
//           [end.add(duration.seconds(70)), BN.from('100')],
//           [end.add(duration.seconds(80)), BN.from('100')],
//           [end.add(duration.seconds(90)), BN.from('100')],
//           [end.add(duration.seconds(100)), BN.from('100')],
//         ],
//         tokenFeePct: BN.from('10'),
//         valueFeePct: BN.from('30'),
//       };

//       console.log("private start: ", String(newNow))
//       console.log("private end: ", String(end))
//       console.log("public start", String(newPublicNow))
//       console.log("public end", String(newPublicEnd))

//       await adminContract.createPool(defaultParams);
//       const tx = await adminContract.createPool(defaultParams);
//       const receipt = await tx.wait();
//       const event = receipt.events.filter((x) => x.event === "CreateTokenSale");
//       defaultInstance = TokenSale.attach(event[0].args.instanceAddress);
//       // return event[0].args.instanceAddress;
//       await adminContract.setMasterContract(tokenSaleContract.address);
//       await adminContract.setOracleContract(oracle.address);
//       await adminContract.setStakingContract(stakingContract.address);

//       // console.log("bal before deposit", String(await token.balanceOf(defaultInstance.address)));
//       const gettingState = await defaultInstance.getState();
//       console.log("get state before ", String(gettingState));
//   })


//   describe("DEPOSIT", async () => {
//     it.only("deposit done successfully", async () => {
//       async function sleep(ms){
//         return new Promise(resolve => setTimeout(resolve, ms));
//       }
//       await sleep(9000).then(async ()=>{
//       const bal = await ethers.provider.getBalance(defaultInstance.address);
//         console.log("bal before deposit", String(bal));
//         // await ethers.provider.send("evm_increaseTime", [10]);
//         // await ethers.provider.send("evm_mine");
//         await defaultInstance.connect(owner).deposit({value: BN.from("10000000000000") })
//         // const ownerBal = await token.balanceOf(owner.address)
//         // console.log("owner balance", String(ownerBal));
//         // console.log("after deposit tokennnnn returned", String(await token.balanceOf(owner.address)));
//         const nativeCoinAmount = String(await ethers.provider.getBalance(defaultInstance.address));
//         console.log("balance after deposit", nativeCoinAmount);
//         await expect(await nativeCoinAmount).to.be.eq("9500000000000");
//       })
//     })
// })
// })