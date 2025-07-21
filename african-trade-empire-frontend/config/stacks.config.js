// config/stacks.config.js

// Define app information
const appConfig = {
  name: 'African Trade Empire',
  icon: '/appIcon.jpg',
}

// Direct network configuration approach
const network = {
  coreApiUrl: process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? 'https://stacks-node-api.mainnet.stacks.co'
    : 'https://stacks-node-api.testnet.stacks.co'
};

// Contract addresses for deployed contracts
const contractAddresses = {
  testnet: {
    tradingContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.african-trade',
    nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.merchant-nft',
  },
  mainnet: {
    tradingContract: '',  // To be filled once deployed to mainnet
    nftContract: '',      // To be filled once deployed to mainnet
  }
};

// Export configuration
export default {
  appConfig,
  network,
  contractAddresses: process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
    ? contractAddresses.mainnet 
    : contractAddresses.testnet
};