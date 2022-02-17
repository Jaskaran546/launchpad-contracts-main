const BN = require('ethers').BigNumber;
const { ethers } = require('hardhat');

async function main() {
  const { deploy } = deployments;
	const [deployer] = await ethers.getSigners();
    let token;
    const adminAddress = '0x604fAf555720c6D06f6f9e91455AbF7be4dfff74'

    await deploy('LPToken', {
      from: deployer.address,
      args: ['Default', 'Def'],
      log: true,
  });
    token = await ethers.getContract("LPToken");
    await token.mint(deployer.address, BN.from('100000').mul(BN.from('10').pow('18')));
    const tx = await token.approve(adminAddress, BN.from('100000').mul(BN.from('10').pow('18')));
    console.log(await tx.wait())
    console.log(token.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });