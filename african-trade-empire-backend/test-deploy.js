console.log('Starting deployment test...');

try {
  console.log('Testing imports...');
  const { makeContractDeploy } = await import('@stacks/transactions');
  const { STACKS_TESTNET } = await import('@stacks/network');
  console.log('Imports successful!');
  console.log('Network:', STACKS_TESTNET);
} catch (error) {
  console.error('Import error:', error);
}
