// /* eslint-disable no-plusplus */
// /* eslint-disable new-cap */
// /* eslint-disable no-undef */
// const {
//     time,
//     expectEvent // time
//   } = require("@openzeppelin/test-helpers");
// const { assert } = require("chai");

  
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

// // const paramsForTest = [
// //      {  
// //         decimals: BN.from('18'),
// //         totalSupply: () => BN.from("100").mul(BN.from("10").pow(this.decimals)),
// //         privateStart: BN.from(now).add(duration.hours(1)),
// //         privateEnd: BN.from(now).add(duration.hours(5)), 
// //         publicStart: BN.from(now).add(duration.hours(6)),
// //         publicEnd: BN.from(now).add(duration.hours(11)),
// //         privateTokenPrice: BN.from("818206631475019474"),
// //         publicTokenPrice: BN.from("1022758289343774343"),
// //         publicBuyLimit: BN.from("25000").mul(BN.from("10").pow("18")),
// //         escrowPercentage: BN.from("60"),
// //         escrowReturnMilestones: [
// //             [BN.from(95), BN.from(0)],
// //             [BN.from(90), BN.from(90)],
// //             [BN.from(60), BN.from(60)],
// //             [BN.from(30), BN.from(30)],
// //           ],
// //         claimTime: BN.from(now).add(duration.hours(6)),
// //         claimPct: BN.from("50"),
// //         airdrop: () => this.totalSupply.div("100"),
// //     }
// // ]


// // describe('Contract', () => {
// //     for(let i = 0; i < paramsForTest.length; i++){

// //     }
// // })
// // async function tokenBehavior () {

// // }
// describe('Token behavior', async () => {
//     const hour = 3600;
//     const decimals = BN.from("18");
//     const totalMint = BN.from("100").mul(BN.from("10").pow(decimals));
  
//     const EXCHANGE_RATE = BN.from(48887406263);
//     const PCT_BASE = BN.from("10").pow("18");
//     const ORACLE_MUL = BN.from("10").pow("10");
  
//     const STARTER_TIER = BN.from(2e5).mul(BN.from("10").pow("9"));
//     const INVESTOR_TIER = BN.from(6e5).mul(BN.from("10").pow("9"));
//     const STRATEGIST_TIER = BN.from(25e5).mul(BN.from("10").pow("9"));
//     const EVANGELIST_TIER = BN.from(7e6).mul(BN.from("10").pow("9"));
  
//     let provider;
  
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
//     let airdropAccount;
//     let initialAccount;
//     let instance;
//     let defaultToken;
//     let params;
  
//     async function initialization({
//         initial,
//         token,
//         totalSupply,
//         privateStart,
//         privateEnd,
//         publicStart,
//         publicEnd,
//         privateTokenPrice,
//         publicTokenPrice,
//         publicBuyLimit,
//         escrowPercentage,
//         tierPrices,
//         escrowReturnMilestones,
//         thresholdPublicAmount,
//         claimTime,
//         claimPct,
//         airdrop,
    
//     }) {
//         Admin = await ethers.getContractFactory("Admin");
//         TokenSale = await ethers.getContractFactory("TokenSale");
//         Token = await ethers.getContractFactory("LPToken");
//         Staking = await ethers.getContractFactory("Staking");
//         Oracle = await ethers.getContractFactory("ChainLink");
    
//         [owner, alice, bob, pol, tod, larry, jimmy] = await ethers.getSigners();
//         provider = ethers.provider;
//         airdropAccount = larry;
//         initialAccount = jimmy;
    
//         masterContract = await TokenSale.deploy();
//         await masterContract.deployed();
    
//         oracle = await Oracle.deploy();
//         await oracle.deployed();
    
//         lpToken = await Token.deploy("LPToken", "lp");
//         await lpToken.deployed();
    
//         adminContract = await Admin.deploy();
//         await adminContract.deployed();
    
//         stakingContract = await Staking.deploy(
//           lpToken.address,
//           adminContract.address
//         );
//         await adminContract.addOperator(owner.address);
//         await adminContract.setMasterContract(masterContract.address);
//         await adminContract.setOracleContract(oracle.address);
//         await adminContract.setStakingContract(stakingContract.address);
//         await adminContract.setAirdrop(airdropAccount.address);
    
//         const now = (await time.latest()).toNumber();
//         params = {
//           initial: initial || initialAccount.address,
//           totalSupply: totalSupply || totalMint,
//           privateStart: privateStart || BN.from(now).add(duration.hours(1)),
//           privateEnd: privateEnd || BN.from(now).add(duration.hours(5)),
//           publicStart: publicStart|| BN.from(now).add(duration.hours(6)),
//           publicEnd: publicEnd || BN.from(now).add(duration.hours(11)),
//           privateTokenPrice: privateTokenPrice || BN.from("818206631475019474"),
//           publicTokenPrice: publicTokenPrice || BN.from("1022758289343774343"),
//           publicBuyLimit: publicBuyLimit || BN.from("25000").mul(BN.from("10").pow("18")),
//           escrowPercentage: escrowPercentage || BN.from("60"),
//           tierPrices: tierPrices || [
//             BN.from("200").mul(BN.from("10").pow("18")),
//             BN.from("500").mul(BN.from("10").pow("18")),
//             BN.from("1000").mul(BN.from("10").pow("18")),
//             BN.from("25000").mul(BN.from("10").pow("18")),
//           ],
//           escrowReturnMilestones: escrowReturnMilestones || [
//             [BN.from(95), BN.from(0)],
//             [BN.from(90), BN.from(90)],
//             [BN.from(60), BN.from(60)],
//             [BN.from(30), BN.from(30)],
//           ],
//           thresholdPublicAmount: thresholdPublicAmount || BN.from("5").mul(BN.from("10").pow(decimals)),
//           claimTime:  claimTime || BN.from(now).add(duration.hours(6)),
//           claimPct: claimPct || BN.from("50"),
//           airdrop: airdrop || totalMint.div("100"),
//         };

//         defaultToken = await Token.deploy("DefaultToken", "def");
//         await defaultToken.deployed();
//         await defaultToken.changeDecimals(decimals);
//         await defaultToken.mint(initialAccount.address, totalMint);
//         await defaultToken.connect(initialAccount).approve(adminContract.address, totalMint);
//         params.token = defaultToken.address;
        
//         const tx = await adminContract.createPool(params);
//         const receipt = await tx.wait();
//         const event = receipt.events.filter((x) => x.event === "CreateTokenSale");
//         instance = TokenSale.attach(event[0].args.instanceAddress);
//     }
//     beforeEach(async () => {
//         await initialization({});
//     })
//     async function stake(account, amount) {
//         await lpToken.mint(account.address, amount);
//         await lpToken.connect(account).approve(stakingContract.address, amount);
//         await stakingContract.connect(account).stake(amount);
//     }
    
//     async function deposit(
//         {
//         account,
//         amount,
//         stakeAmount,
//         increase = false,
//         }
//     ) {
//         await stake(account, stakeAmount || STARTER_TIER);
//         if (increase) {
//             await time.increaseTo(
//             params.privateStart.add(duration.minutes(61)).toString()
//             );
//         }
//         await instance.connect(account).deposit({ value: amount });
//     }
//     function tierByAmount(amount) {
//         const MaxTiers = {
//             EVANGELIST_TIER: params?.tierPrices[3],
//             STRATEGIST_TIER: params?.tierPrices[2],
//             INVESTOR_TIER: params?.tierPrices[1],
//             STARTER_TIER: params?.tierPrices[0]
//         }
//         if (amount.gte(EVANGELIST_TIER)) {
//           return MaxTiers.EVANGELIST_TIER;
//         }
//         if (amount.gte(STRATEGIST_TIER)) {
//           return MaxTiers.STRATEGIST_TIER;
//         }
//         if (amount.gte(INVESTOR_TIER)) {
//           return MaxTiers.INVESTOR_TIER;
//         }
//         if (amount.gte(STARTER_TIER)) {
//           return MaxTiers.STARTER_TIER;
//         }
//       }
//     async function calculateGasCost(tx) {
//         const receipt = await tx.wait();
//         return (await provider.getGasPrice()).mul(receipt.gasUsed);
//     }
//     function maxByTier(tier) {
//         const tierOfUser = tierByAmount(tier)
//         if(tierOfUser){
//             return tierOfUser.mul(PCT_BASE).div(EXCHANGE_RATE.mul(ORACLE_MUL));
//         }
//     }
//     function shift(amount) {
//         if (decimals.toNumber() !== 18) {
//           return decimals.toNumber() < 18
//             ? amount.div(BN.from("10").pow(BN.from("18").sub(decimals)))
//             : _amount.mul(BN.from("10").pow(decimals.sub(BN.from("18"))));
//         }
//         return amount;
//       }    
//     function calculateTokenAmount(amount) {
//         return amount.mul(PCT_BASE).div(params.privateTokenPrice);
//     }
//     function overcameThreshold(saleAmount, totalPrivate){
//         if(saleAmount > totalPrivate){
//             return (saleAmount - totalPrivate) >= params.thresholdPublicAmount;
//         }else{
//             return false
//         }
//     }
//     function calculateAmountByTokens(tokens) {
//         return tokens.mul(params.privateTokenPrice).div(PCT_BASE);
//     }
//     function calculateLeftValue(total, claim) {
//         return total.eq(claim) ? BN.from('0') : (total.sub(claim).mul(params.privateTokenPrice).div(PCT_BASE));
//     }
//     function returnEscrowAmount(blocked, returnAmount) {
//         return returnAmount.toString() === "0"
//           ? blocked
//           : blocked.mul(returnAmount).div(BN.from(100));
//     }
//     function publicAmount(amount, left){
//         const maxValue = params.publicBuyLimit.mul(PCT_BASE).div(EXCHANGE_RATE.mul(ORACLE_MUL));
//         const maxToken = maxValue.mul(PCT_BASE).div(params.publicTokenPrice);
//         const amountToken = amount.mul(PCT_BASE).div(params.publicTokenPrice);
//         if(amountToken.gte(maxToken)){
//             return maxToken.gte(left) ? left : maxToken;
//         } else {
//             return amountToken.gte(left) ? left : amountToken
//         }
//     }
//     function escrow(blocked, saleTokenAmount, totalSold){
//         for(let i = 0; i < params.escrowReturnMilestones.length; i++){
//             const must = saleTokenAmount.mul(params.escrowReturnMilestones[i][0]).div(BN.from('100'))
//             if(totalSold.gte(must)){
//                 if(params.escrowReturnMilestones[i][1].gt(BN.from('0'))){
//                     return blocked.mul(params.escrowReturnMilestones[i][1]).div('100');
//                 }else{
//                     return blocked;
//                 }
                
//             }
//             break;
//         }
//     }
//     it(`Deposits`, async () => {
//         const deposits = [
//             {user: alice, stakeAmount: STARTER_TIER, amount: maxByTier(STARTER_TIER)},
//             {user: bob, stakeAmount: INVESTOR_TIER, amount: maxByTier(INVESTOR_TIER)},
//             {user: tod, stakeAmount: STRATEGIST_TIER, amount: maxByTier(STRATEGIST_TIER)},
//             {user: pol, stakeAmount: EVANGELIST_TIER, amount: parseEther('100')}
//         ]
//         //deposits
//        for(let i = 0; i < deposits.length; i++){
//         await deposit({account: deposits[i].user, increase: i==0, stakeAmount: deposits[i].stakeAmount, amount: deposits[i].amount});
//         const stakeUser = await instance.stakes(deposits[i].user.address);
//         expect(stakeUser[1]).to.be.equal(calculateTokenAmount(maxByTier(deposits[i].stakeAmount)))
//        }
       
//        //check totalSupply
//        let demand = BN.from('0');
//        deposits.forEach(({stakeAmount}) => {
//         demand = demand.add(calculateTokenAmount(maxByTier(stakeAmount)))
//        })
//        expect(demand).to.be.equal(await instance.totalPrivateSold())

//        //to Private End
//        await time.increaseTo(params.privateEnd.add(duration.seconds('2')).toString());

//         //claim
//         const sold = await instance.totalPrivateSold.call();
//         const supply = await instance.saleTokensAmountWithoutAirdrop();
//         const isClaimTime =  (await time.latest()).toNumber() >= params.claimTime.toNumber();
//         for(let i = 0; i < deposits.length; i++){
//             let share;
//             const stakeUs = await instance.stakes(deposits[i].user.address);
//             if(sold.gte(supply)){
//                 const rate = (supply.mul(PCT_BASE).div(sold))
//                 share = stakeUs[1].mul(rate).div(PCT_BASE);
//             }else{
//                 share = stakeUs[1];
//             }
//             const tx = await instance.connect(deposits[i].user).claim();
//             const change = calculateLeftValue(stakeUs[1], share);
//             const tokenAfter = await defaultToken.balanceOf(deposits[i].user.address);
//             if(!isClaimTime){
//                 const pct = params.claimPct;
//                 const val = share.mul(pct).div('100');
//                 deposits[i].left = share.sub(val);
//                 share = val;
//             }else{
//                 deposits[i].left = BN.from('0');
//             }
//             await expect(tx)
//                 .to.emit(instance, 'Claim')
//                 .withArgs(deposits[i].user.address, share, change);
//             expect(share).to.be.equal(tokenAfter);
//         }
//         if(!isClaimTime){
//             //to ClaimTime
//             await time.increaseTo(params.claimTime.toString());
//             for(let i = 0; i < deposits.length; i++){
//                 const tx = await instance.connect(deposits[i].user).claim();
//                 await expect(tx)
//                 .to.emit(instance, 'Claim')
//                 .withArgs(deposits[i].user.address, deposits[i].left, BN.from('0'));

//             }
//         }
//         //airdrop
//         const tx = await instance.takeAirdrop();
//         await expect(tx)
//         .to.emit(instance, 'TransferAirdrop')
//         .withArgs(shift(params.airdrop));
//         const balanceAirdrop = await defaultToken.balanceOf(airdropAccount.address);
//         expect(balanceAirdrop).to.be.equal(params.airdrop)

//         // take Leftovers
//         const blocked = params.totalSupply.mul(params.escrowPercentage).div(BN.from('100'));
//         const returnToken = escrow(blocked, supply, sold);
//         const fee = blocked.sub(returnToken);
//         let earned;
//         if(supply.gt(sold)){
//             returnToken = returnToken.add(supply.sub(sold));
//             earned = calculateAmountByTokens(sold);
//         }else{
//             earned = calculateAmountByTokens(supply)
//         }
//         const walletBefore = await defaultToken.balanceOf(owner.address);
//         const initialBefore = await defaultToken.balanceOf(initialAccount.address);
//         const balanceInitialBefore = await provider.getBalance(initialAccount.address);
//         await expect(await instance.takeLeftovers())
//         .to.emit(instance, 'TransferLeftovers')
//         .withArgs(shift(returnToken), shift(fee), earned);
//         const expectWallet = walletBefore.add(shift(fee))
//         const expectInitial = initialBefore.add(shift(returnToken));
//         const expectBalanceInitial = balanceInitialBefore.add(earned);
//         expect(await defaultToken.balanceOf(owner.address)).to.be.equal(expectWallet);
//         expect(await defaultToken.balanceOf(initialAccount.address)).to.be.equal(expectInitial);
//         expect(await provider.getBalance(initialAccount.address)).to.be.closeTo(expectBalanceInitial, BN.from('5'), '');

//         //take Locked
//         const tokenContract = await defaultToken.balanceOf(instance.address);
//         const balanceContract = await provider.getBalance(instance.address);
//         if(tokenContract.gte(BN.from('0')) || balanceContract.gte(BN.from('0'))){
//             //to Locked time
//             await time.increaseTo(params.publicEnd.add(BN.from(2592e3)).toString());
//             await instance.takeLocked();
//             expect(await provider.getBalance(instance.address)).to.be.equal(BN.from('0'));
//             expect(await defaultToken.balanceOf(instance.address)).to.be.equal(BN.from('0'));
//         }
//     });
//     it('Deposit public', async () => {
//         const depositsPrivate = [
//             {user: alice, stakeAmount: STRATEGIST_TIER, amount: maxByTier(STRATEGIST_TIER)},
//             {user: bob, stakeAmount: STRATEGIST_TIER, amount: maxByTier(STRATEGIST_TIER)},
//             {user: tod, stakeAmount: STRATEGIST_TIER, amount: maxByTier(STRATEGIST_TIER)},
//             {user: pol, stakeAmount: STRATEGIST_TIER, amount: maxByTier(STRATEGIST_TIER)}
//         ]
//         const depositsPublic = [
//             {user: alice, amount: parseEther('5')},
//             {user: bob, amount: parseEther('7')},
//             {user: tod, amount: parseEther('3')},
//             {user: pol, amount: parseEther('200')}
//         ]
//         // Private deposits
//         for(let i = 0; i < depositsPrivate.length; i++){
//             await deposit({account: depositsPrivate[i].user, increase: i==0, stakeAmount: depositsPrivate[i].stakeAmount, amount: depositsPrivate[i].amount});
//             const stakeUser = await instance.stakes(depositsPrivate[i].user.address);
//             expect(stakeUser[1]).to.be.equal(calculateTokenAmount(maxByTier(depositsPrivate[i].stakeAmount)))
//         }
//         //check totalSupply
//        let demand = BN.from('0');
//        depositsPrivate.forEach(({stakeAmount}) => {
//         demand = demand.add(calculateTokenAmount(maxByTier(stakeAmount)))
//        })
//        expect(demand).to.be.equal(await instance.totalPrivateSold());

//        //to Private End
//        await time.increaseTo(params.privateEnd.add(duration.seconds('5')).toString());

//         //claim
//         let factSold = BN.from('0');

//         const sold = await instance.totalPrivateSold.call();
//         const supply = await instance.saleTokensAmountWithoutAirdrop();
//         const isClaimTime =  (await time.latest()).toNumber() >= params.claimTime.toNumber();
//         for(let i = 0; i < depositsPrivate.length; i++){
//             let share;
//             const stakeUs = await instance.stakes(depositsPrivate[i].user.address);
//             if(sold.gte(supply)){
//                 const rate = (supply.mul(PCT_BASE).div(sold))
//                 share = stakeUs[1].mul(rate).div(PCT_BASE);
//             }else{
//                 share = stakeUs[1];
//             }
//             factSold = factSold.add(share);
//             const tx = await instance.connect(depositsPrivate[i].user).claim();
//             const change = calculateLeftValue(stakeUs[1], share);
//             const tokenAfter = await defaultToken.balanceOf(depositsPrivate[i].user.address);
//             if(!isClaimTime){
//                 const pct = params.claimPct;
//                 const val = share.mul(pct).div('100');
//                 depositsPrivate[i].left = share.sub(val);
//                 share = val;
//             }else{
//                 depositsPrivate[i].left = BN.from('0');
//             }
//             await expect(tx)
//                 .to.emit(instance, 'Claim')
//                 .withArgs(depositsPrivate[i].user.address, share, change);
//             expect(share).to.be.equal(tokenAfter);
//         }
//         if(!isClaimTime){
//             //to ClaimTime
//             await time.increaseTo(params.claimTime.toString());
//             for(let i = 0; i < depositsPrivate.length; i++){
//                 const tx = await instance.connect(depositsPrivate[i].user).claim();
//                 await expect(tx)
//                 .to.emit(instance, 'Claim')
//                 .withArgs(depositsPrivate[i].user.address, depositsPrivate[i].left, BN.from('0'));

//             }
//         }
//        if((await time.latest()).toNumber() < params.publicStart.toNumber()){
//              //To public round
//             await time.increaseTo(params.publicStart.toString());
//        }

//        let factPublicSold = BN.from('0');
//        // Public round
//        const isOvercame = overcameThreshold(supply, sold);
//        if(isOvercame){
//         for(let i = 0; i < depositsPublic.length; i++){
//             const totalTokenSold = await instance.totalTokenSold();
//             const leftTokens = supply.sub(totalTokenSold);
//             const tx = await instance.connect(depositsPublic[i].user).deposit({ value: depositsPublic[i].amount });
//             const want = depositsPublic[i].amount.mul(PCT_BASE).div(params.publicTokenPrice);
//             const expectPublicAmount = publicAmount(depositsPublic[i].amount, leftTokens);
//             factPublicSold = factPublicSold.add(expectPublicAmount);
//             let change;
//             if(want > expectPublicAmount){
//                 change = expectPublicAmount.mul(params.publicTokenPrice).div(PCT_BASE)
//             }else {
//                 change = depositsPublic[i].amount
//             }
            
//             await expect(tx)
//             .to.emit(instance, 'DepositPublic')
//             .withArgs(depositsPublic[i].user.address, shift(expectPublicAmount));
//             await expect(() => tx)
//             .to.changeEtherBalance(depositsPublic[i].user, BN.from(`-${change.toString()}`))
//         }
//        }
//        const mustSum = factPublicSold.add(factSold);
//        //To Finished epoch
//        await time.increaseTo(params.publicEnd.toString());

//     //airdrop
//     const tx = await instance.takeAirdrop();
//     await expect(tx)
//     .to.emit(instance, 'TransferAirdrop')
//     .withArgs(shift(params.airdrop));
//     const balanceAirdrop = await defaultToken.balanceOf(airdropAccount.address);
//     expect(balanceAirdrop).to.be.equal(params.airdrop)
    
//     // take Leftovers
//     const totalSold = await instance.totalTokenSold.call();
//     const blocked = params.totalSupply.mul(params.escrowPercentage).div(BN.from('100'));

//     let returnToken = escrow(blocked, supply, totalSold);
//     const fee = blocked.sub(returnToken);
//     const earned = (factSold.mul(params.privateTokenPrice).add(factPublicSold.mul(params.publicTokenPrice))).div(PCT_BASE)
//     if(supply.gt(totalSold)){
//         returnToken = returnToken.add(supply.sub(sold));
//     }
//     const walletBefore = await defaultToken.balanceOf(owner.address);
//     const initialBefore = await defaultToken.balanceOf(initialAccount.address);
//     const balanceInitialBefore = await provider.getBalance(initialAccount.address);
//     await expect(await instance.takeLeftovers())
//     .to.emit(instance, 'TransferLeftovers')
//     .withArgs(shift(returnToken), shift(fee), earned);
//     const expectWallet = walletBefore.add(shift(fee))
//     const expectInitial = initialBefore.add(shift(returnToken));
//     const expectBalanceInitial = balanceInitialBefore.add(earned);
//     expect(await defaultToken.balanceOf(owner.address)).to.be.equal(expectWallet);
//     expect(await defaultToken.balanceOf(initialAccount.address)).to.be.equal(expectInitial);
//     expect(await provider.getBalance(initialAccount.address)).to.be.closeTo(expectBalanceInitial, BN.from('5'), '');

//     //take Locked
//     const tokenContract = await defaultToken.balanceOf(instance.address);
//     const balanceContract = await provider.getBalance(instance.address);
//     if(tokenContract.gt(BN.from('0')) || balanceContract.gt(BN.from('0'))){
//         //to Locked time
//         await time.increaseTo(params.publicEnd.add(BN.from(2592e3)).toString());
//         await instance.takeLocked();
//         expect(await provider.getBalance(instance.address)).to.be.equal(BN.from('0'));
//         expect(await defaultToken.balanceOf(instance.address)).to.be.equal(BN.from('0'));
//     }
//     })
// })