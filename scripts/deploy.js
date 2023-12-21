const { ethers, upgrades } = require("hardhat");

async function main() {
  
  const PaymentProcessor = await ethers.getContractFactory("PaymentProcessor");

  // Deploying upgradeable proxy contract
  const proxy = await upgrades.deployProxy(PaymentProcessor, [], { initializer: 'initialize' });
  await proxy.waitForDeployment();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(await proxy.getAddress());

  console.log('Proxy contract address:', await proxy.getAddress());
  console.log('Implementation contract address:', implementationAddress);

  // Additional logic using wallet or provider can be added here if needed
}

main();
