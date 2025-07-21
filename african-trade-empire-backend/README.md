# African Trade Empire

## NFT Trading Card Game on Stacks Blockchain

African Trade Empire is a strategic NFT trading card game built on the Stacks blockchain that simulates historical trade networks across Africa. This README provides comprehensive documentation for the smart contract implementation.

## Smart contractn URL - https://explorer.hiro.so/txid/0x200943d87e580d77f039aa34de978368ad0ac877f57d407d7d87a2eedfd0326e?chain=testnet

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Contract Architecture](#contract-architecture)
- [Card System](#card-system)
- [Game Mechanics](#game-mechanics)
- [Token Economics](#token-economics)
- [How to Use](#how-to-use)
- [Development and Testing](#development-and-testing)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)

## Overview

African Trade Empire allows players to collect unique merchant cards, establish trade routes, and compete to build the most profitable trading empire. The game is implemented as a smart contract on the Stacks blockchain using the Clarity programming language.

## Features

- **NFT Cards**: Collect merchant and resource cards with unique attributes
- **Marketplace**: Buy, sell, and trade cards with other players
- **Game Mechanics**: Establish trade routes between regions using your cards
- **Economy**: Earn tokens through successful trading strategies
- **Full Ownership**: All game assets are owned by players as blockchain NFTs

## Contract Architecture

The smart contract implementation includes:

- **SIP-009 NFT Standard**: Compliance with Stacks' NFT standard
- **SIP-010 Token Standard**: Implementation of the game's currency
- **Marketplace Functions**: Card listing and trading mechanisms
- **Game Logic**: Route establishment and reward distribution

## Card System

### Card Types

1. **Merchant Cards**
   - Caravan Leader (Common): Specializes in land routes
   - Maritime Trader (Uncommon): Specializes in sea routes
   - Royal Merchant (Rare): Access to special territories

2. **Resource Cards**
   - Gold (Rare): High value, limited quantity
   - Spices (Uncommon): Medium value, moderate quantity
   - Textiles (Common): Low value, abundant quantity

### Card Attributes

- **ID**: Unique identifier for each card
- **Type**: "merchant" or "resource"
- **Subtype**: Specific category (e.g., "caravan-leader", "gold")
- **Rarity**: Rarity level (1=common, 2=uncommon, 3=rare)
- **Trade Power**: Trading capacity value
- **Region**: Home territory

## Game Mechanics

1. **Collect Cards**: Acquire merchant and resource cards
2. **Build Your Deck**: Assemble strategic combinations of cards
3. **Establish Routes**: Connect regions with your merchants and resources
4. **Earn Rewards**: Receive tokens based on successful trade routes
5. **Trade Cards**: Buy and sell cards on the marketplace

### Establishing Trade Routes

Trade routes are the core gameplay mechanic, allowing players to:
- Connect different regions of Africa
- Utilize merchant and resource cards in combination
- Earn tokens based on the value of the trade route

## Token Economics

The game's economy is powered by a fungible token (TET - Trade Empire Token) that serves multiple purposes:

- **Card Purchases**: Buy new cards or card packs
- **Marketplace Transactions**: Currency for trading cards
- **Gameplay Rewards**: Earned through establishing successful trade routes

## How to Use

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Hiro Wallet](https://wallet.hiro.so/) or [Xverse Wallet](https://www.xverse.app/) for mainnet usage

### Interacting with the Contract

#### Using Clarinet Console

First, locate your contract's address:

```bash
::list_contracts
```

Then interact with the contract using the following commands:

```bash
# Get contract information
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.african-trade-empire get-name)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.african-trade-empire get-symbol)

# Mint a new card (replace address with actual deployer address)
::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.african-trade-empire mint-card 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM "merchant" "caravan-leader" u1 u5 "North Africa" none)

# List a card for sale
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.african-trade-empire list-card u1 u100)

# Establish a trade route
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.african-trade-empire establish-route u1 u2 "North Africa" "West Africa")
```

## Development and Testing

### Setting Up Your Environment

1. Install Clarinet:
   ```bash
   curl -sL https://get.clarinet.run | sh
   ```

2. Create a new project:
   ```bash
   clarinet new african-trade-empire
   cd african-trade-empire
   ```

3. Add the contract to your project:
   ```bash
   # Replace the default contract with the African Trade Empire contract
   ```

### Testing

The contract includes comprehensive testing for all functions:

```bash
# Run all tests
clarinet test

# Run a specific test
clarinet test tests/african-trade-empire_test.ts
```

## Deployment

### Testnet Deployment

1. Configure your deployment settings in `Clarinet.toml`
2. Deploy to the Stacks testnet:
   ```bash
   clarinet deploy --testnet
   ```

### Mainnet Deployment

For production deployment:

1. Ensure thorough testing on testnet
2. Deploy to mainnet using Clarinet or the Stacks Explorer
3. Verify the contract on the Stacks Explorer

## Security Considerations

The contract implements various security measures:

- **Ownership Checks**: Verifies that only the owner can transfer or list cards
- **Status Validation**: Ensures listings are active before purchase
- **Error Handling**: Comprehensive error codes and checks

## Future Roadmap

Planned features for future releases:

1. **Tournament System**: Competitive gameplay with rewards
2. **Advanced Game Mechanics**: More complex trade networks and strategies
3. **Mobile Application**: Dedicated app for on-the-go gameplay
4. **Governance**: Community voting on game features and updates
5. **Social Features**: Player alliances and cooperative gameplay

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

