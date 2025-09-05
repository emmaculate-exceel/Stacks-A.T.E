#!/bin/bash

# African Trade Empire - Testnet Deployment Script
# This script helps deploy contracts to Stacks testnet

echo "🚀 African Trade Empire - Testnet Deployment"
echo "============================================"

# Testnet deployer address
DEPLOYER_ADDRESS="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

echo "📍 Deployer Address: $DEPLOYER_ADDRESS"
echo

# Function to check balance
check_balance() {
    echo "💰 Checking testnet STX balance..."
    curl -s "https://api.testnet.hiro.so/extended/v1/address/$DEPLOYER_ADDRESS/balances" | jq -r '
        if .stx.balance then
            "STX Balance: " + (.stx.balance | tonumber / 1000000 | tostring) + " STX"
        else
            "❌ Unable to fetch balance or account not found"
        end
    '
    echo
}

# Function to deploy contracts
deploy_contracts() {
    echo "🔧 Deploying contracts to testnet..."
    echo "This will deploy:"
    echo "  ✓ african-trade-empire.clar"
    echo "  ✓ dao-investment-platform.clar"
    echo
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting deployment..."
        clarinet publish --testnet
        
        if [ $? -eq 0 ]; then
            echo "✅ Deployment completed successfully!"
            echo "🔍 View your contracts on Stacks Explorer:"
            echo "   https://explorer.hiro.so/?chain=testnet&api=https://api.testnet.hiro.so"
        else
            echo "❌ Deployment failed. Check the error messages above."
        fi
    else
        echo "❌ Deployment cancelled."
    fi
}

# Function to get testnet STX
get_testnet_stx() {
    echo "💧 Get testnet STX from the faucet:"
    echo "🌐 https://explorer.hiro.so/sandbox/faucet?chain=testnet"
    echo "📍 Use address: $DEPLOYER_ADDRESS"
    echo
    echo "After funding, wait a few minutes then run this script again."
}

# Main menu
while true; do
    echo "Please select an option:"
    echo "1) Check STX balance"
    echo "2) Get testnet STX (faucet)"
    echo "3) Deploy contracts"
    echo "4) Exit"
    echo
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            check_balance
            ;;
        2)
            get_testnet_stx
            ;;
        3)
            deploy_contracts
            ;;
        4)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            ;;
    esac
    echo "---"
done
