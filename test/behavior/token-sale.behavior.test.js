// /* eslint-disable no-plusplus */
// /* eslint-disable new-cap */
// /* eslint-disable no-undef */
// const {
//     time, // time
//   } = require("@openzeppelin/test-helpers");
  
//   const chai = require("chai");
  
//   const { expect } = chai;
//   const BN = require("ethers").BigNumber;
//   const { parseEther } = require("ethers").utils;
//   chai.use(require("chai-bignumber")());
  
//   const duration = {
//     seconds(val) {
//       return BN.from(val);
//     },
//     minutes(val) {
//       return BN.from(val).mul(this.seconds("60"));
//     },
//     hours(val) {
//       return new BN.from(val).mul(this.minutes("60"));
//     },
//     days(val) {
//       return new BN.from(val).mul(this.hours("24"));
//     },
//     weeks(val) {
//       return new BN.from(val).mul(this.days("7"));
//     },
//     years(val) {
//       return new BN.from(val).mul(this.days("365"));
//     },
//   };
  
//   describe("TokenSale contract", () => {
//     const hour = 3600;
//     const decimals = BN.from("18");
  
//     const EXCHANGE_RATE = BN.from(48887406263);
//     const PCT_BASE = BN.from("10").pow("18");
//     const ORACLE_MUL = BN.from("10").pow("10");
  
//     const STARTER_TIER = BN.from(2e5).mul(BN.from('10').pow('9'));
//     const INVESTOR_TIER = BN.from(6e5).mul(BN.from('10').pow('9'));
//     const STRATEGIST_TIER = BN.from(25e5).mul(BN.from('10').pow('9'));
//     const EVANGELIST_TIER =  BN.from(7e6).mul(BN.from('10').pow('9'));

//     let provider;
//     let publicPrice;
  
//     let Admin;
//     let TokenSale;
//     let Token;
//     let Staking;
//     let Oracle;
  
//     let oracle;
//     let masterContract;
//     let adminContract;
//     let stakingContract;
//     let lpToken;
//     let owner;
//     let alice;
//     let bob;
//     let pol;
//     let tod;
//     let larry;
//     let oliver;
//     let olivia;
//     let defaultInstance;
//     let defaultToken;
//     let defaultParams;
  
  
//     async function createPool(params = defaultParams) {
//       const tx = await adminContract.createPool(params);
//       const receipt = await tx.wait();
//       const event = receipt.events.filter((x) => x.event === "CreateTokenSale");
//       defaultInstance = TokenSale.attach(event[0].args.instanceAddress);
//       return event[0].args.instanceAddress;
//     }
  
//     beforeEach(async () => {
//       Admin = await ethers.getContractFactory("Admin");
//       TokenSale = await ethers.getContractFactory("TokenSale");
//       Token = await ethers.getContractFactory("LPToken");
//       Staking = await ethers.getContractFactory("Staking");
//       Oracle = await ethers.getContractFactory("ChainLink");
  
//       [owner, alice, bob, pol, tod, larry, oliver, olivia] = await ethers.getSigners();
//       provider = ethers.provider;
  
//       masterContract = await TokenSale.deploy();
//       await masterContract.deployed();
  
//       oracle = await Oracle.deploy();
//       await oracle.deployed();
  
//       lpToken = await Token.deploy("LPToken", "lp");
//       await lpToken.deployed();
  
//       adminContract = await Admin.deploy();
//       await adminContract.deployed();
  
//       stakingContract = await Staking.deploy(
//         lpToken.address,
//         adminContract.address
//       );
  
//       await adminContract.addOperator(owner.address);
//       await adminContract.setMasterContract(masterContract.address);
//       await adminContract.setOracleContract(oracle.address);
//       await adminContract.setStakingContract(stakingContract.address);
//       await adminContract.setAirdrop(larry.address);
  
//       defaultToken = await Token.deploy("DefaultToken", "def");
//       await defaultToken.deployed();
  
//       await defaultToken.changeDecimals(decimals);
//       const total = BN.from("1000").mul(BN.from("10").pow(decimals));
  
//       await defaultToken.mint(
//         owner.address,
//         total
//       );
//       await defaultToken.approve(
//         adminContract.address,
//         total
//       );
  
//       const now = (await time.latest()).toNumber();
  
//       defaultParams = {
//         initial: owner.address,
//         token: defaultToken.address,
//         totalSupply: total,
//         privateStart: BN.from(now).add(duration.hours(1)),
//         privateEnd: BN.from(now).add(duration.hours(5)),
//         publicStart: BN.from(now).add(duration.hours(6)),
//         publicEnd: BN.from(now).add(duration.hours(11)),
//         privateTokenPrice: BN.from('818206631475019474'),
//         publicTokenPrice: BN.from('1022758289343774343'),
//         publicBuyLimit: BN.from("6500").mul(BN.from("10").pow("18")),
//         escrowPercentage: BN.from('60'),
//         tierPrices: [
//           BN.from('200').mul(BN.from('10').pow('18')), 
//           BN.from('500').mul(BN.from('10').pow('18')), 
//           BN.from('1000').mul(BN.from('10').pow('18')), 
//           BN.from('2500').mul(BN.from('10').pow('18'))
//         ],
//         escrowReturnMilestones: [
//           [BN.from(30), BN.from(60)],
//           [BN.from(50), BN.from(40)],
//           [BN.from(50), BN.from(40)],
//         ],
//         thresholdPublicAmount: BN.from('0'),
//         claimTime: BN.from(now).add(duration.hours(8)) 
//       };
  
//       await createPool(defaultParams);
//     })
//     async function stake(account, amount) {
//         await lpToken.mint(account.address, amount);
//         await lpToken.connect(account).approve(stakingContract.address, amount);
//         await stakingContract.connect(account).stake(amount);
//       }


//     describe('Check behavior', async () => {
//         // stakes
//         const stakes {
//             alice: {public: }
//         }
//         await stake()
//     })
// });