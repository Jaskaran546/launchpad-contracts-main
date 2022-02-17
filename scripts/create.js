const { ethers } = require('hardhat');

/* eslint-disable no-undef */
const BN = require('ethers').BigNumber;

async function main() {

  const [deployer] = await ethers.getSigners();
  const {chainId} = await ethers.provider.getNetwork()
  console.log(chainId)

	console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
    
    let masterContract;
    let adminContract;
    let stakingContract;
    let lpToken;
    let defaultParams; 
    let oracle = '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526';
    let backend = '0x141509b940c24f86aa05c1daf5f706133a9a2150';

    async function createPool({privateStart, privateEnd, publicStart, publicEnd, claimTime}, num){
      const { deploy } = deployments;


      let token;

      await deploy('LPToken', {
        from: deployer.address,
        args: ['DefaultToken', 'def'],
        log: true,
      });

      token = await ethers.getContract("LPToken"); 
      await token.mint(deployer.address, BN.from('1000000').mul(BN.from('10').pow('18')));
      await token.approve(adminContract.address, BN.from('1000000').mul(BN.from('10').pow('18')));

      defaultParams.token = token.address;
      defaultParams.privateStart = privateStart;
      defaultParams.privateEnd = privateEnd;
      defaultParams.publicStart = publicStart;
      defaultParams.publicEnd = publicEnd;
      defaultParams.claimTime = claimTime;

      const tx = await adminContract.createPool(defaultParams, {gasLimit: 2000000});
      let receipt = await tx.wait();
      const event = receipt.events?.filter((x) => {return x.event == "CreateTokenSale"});
      console.log(`Pool ${num}: ${event[0].args.instanceAddress}`)
      console.log(`PoolToken ${num}: ${token.address}`)


    } 

      accounts = await ethers.getNamedSigners();
      const { deploy } = deployments;

        await deploy('Admin', {
            from: deployer.address,
            args: [],
            log: true,
        });
        adminContract = await ethers.getContract("Admin"); 

        await deploy('TokenSale', {
          from: deployer.address,
          args: [],
          log: true,
        });
        masterContract = await ethers.getContract("TokenSale"); ; 


        await deploy('LPToken', {
          from: deployer.address,
          args: ['LPToken', 'lp'],
          log: true,
        });
        lpToken = await ethers.getContract("LPToken");

        await deploy('Staking', {
          from: deployer.address,
          args: [lpToken.address, adminContract.address],
          log: true,
        });
        stakingContract = await ethers.getContract("Staking");
        
          await adminContract.addOperator(deployer.address)
          //backend address
          await adminContract.addOperator(backend)
          await adminContract.setMasterContract(masterContract.address);
          await adminContract.setOracleContract(oracle);
          await adminContract.setStakingContract(stakingContract.address)
    
          defaultParams = {
              initial: deployer.address,
              totalSupply: BN.from('100000').mul(BN.from('10').pow('18')),
              privateTokenPrice: BN.from('10').mul(BN.from('10').pow('16')), 
              publicTokenPrice: BN.from('20').mul(BN.from('10').pow('16')),
              publicBuyLimit: BN.from('100').mul(BN.from('10').pow('18')), 
              escrowPercentage: 60,
              tierPrices: [
                  BN.from('200').mul(BN.from('10').pow('18')), 
                  BN.from('500').mul(BN.from('10').pow('18')), 
                  BN.from('1000').mul(BN.from('10').pow('18')), 
                  BN.from('2500').mul(BN.from('10').pow('18'))],
              escrowReturnMilestones: [],
              thresholdPublicAmount: BN.from('0')
          }

        console.log(`Master: ${masterContract.address}`)
        console.log(`LPtoken: ${lpToken.address}`)
        console.log(`Admin: ${adminContract.address}`)
        console.log(`Staking: ${stakingContract.address}`)
        await hre.run("verify:verify", {
          address: masterContract.address,
          constructorArguments: [],
        });
      //  await createPool({privateStart: '1631095519', privateEnd: '1631106318', publicStart: '1631106378', publicEnd: '1631127978', claimTime: '1631106818'}, 1);
      //  await createPool({privateStart: '1631095634', privateEnd: '1631117234', publicStart: '1631117235', publicEnd: '1631145554', claimTime: '1631117334'}, 2);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });