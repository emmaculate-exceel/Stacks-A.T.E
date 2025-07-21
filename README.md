# African Trade Empire - Stacks Integration

This README outlines how the African Trade Empire application has been enhanced with Bitcoin ecosystem cryptocurrencies (BTC, STX, and sBTC) through integration with the Stacks blockchain.

## Overview

African Trade Empire is a blockchain-based trading simulation game that now incorporates Stacks wallet connectivity and a crypto trading minigame. The application simulates trading routes across Africa while leveraging Bitcoin ecosystem tokens.

## Features

### Wallet Integration
- Connect with Stacks wallets (Leather and Xverse)
- Authenticate users through their Bitcoin or Stacks credentials
- View wallet balances and history
- Withdraw earned tokens directly to connected wallets

### Crypto Caravan Game
- Trade Bitcoin ecosystem assets (BTC, STX, sBTC) across global crypto hubs
- Strategic trading simulation with market price differences
- Earn real crypto rewards through gameplay
- Withdraw earned assets to your personal wallet

### Technical Implementations
- Stacks Connect integration for wallet authentication
- React-based game interfaces
- Responsive design for all devices
- Framer Motion animations for smooth user experience

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/africa-trade-empire.git
cd africa-trade-empire
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Add required Stacks dependencies:
```bash
npm install @stacks/connect @stacks/transactions
```

4. Create `.env.local` file with configuration:
```
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
├── components/
│   ├── layout/
│   │   └── Navbar.js           # Navigation with wallet connection
│   ├── games/
│   │   ├── NFTTradingGame.js   # Original card-based game
│   │   └── CaravanRoutesGame.js # Crypto trading simulation
│   └── ui/                     # Reusable UI components
├── context/
│   └── AuthContext.js          # Authentication with Stacks wallet
├── config/
│   ├── flow.config.js          # Flow blockchain configuration
│   └── stacks.config.js        # Stacks blockchain configuration 
├── pages/
│   ├── _app.js                 # Application entry
│   ├── index.js                # Landing page
│   ├── dashboard/              # User dashboard
│   └── play/                   # Games interface
└── public/                     # Static assets
```

## Stacks Wallet Integration

The application uses Stacks Connect for wallet authentication:

```javascript
import { showConnect } from '@stacks/connect';

const connectStacksWallet = async () => {
  showConnect({
    appDetails: {
      name: 'African Trade Empire',
      icon: window.location.origin + '/appIcon.jpg',
    },
    redirectTo: '/',
    onFinish: (data) => {
      setStacksUser(data.userSession.loadUserData());
    },
    network: 'testnet'
  });
};
```

## Crypto Trading Game

The Crypto Caravan game allows players to trade BTC, STX, and sBTC between global markets with different price multipliers. Players can:

1. Choose a trader (representing a caravan in the original game)
2. Select a destination city 
3. Choose which cryptocurrency to trade
4. Complete trades to earn profit based on market differences
5. After 10 turns, withdraw earnings to their connected wallet

## Development Roadmap

- **Phase 1**: ✅ Stacks wallet integration
- **Phase 2**: ✅ Crypto-themed trading game 
- **Phase 3**: 🔄 Real token rewards system
- **Phase 4**: 🔄 NFT merchant marketplace
- **Phase 5**: 🔄 Cross-chain compatibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Bitcoin and Stacks communities
- [Stacks Connect](https://github.com/hirosystems/connect) for wallet integration
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for animations

---

For more information, contact: support@africantrade.empire