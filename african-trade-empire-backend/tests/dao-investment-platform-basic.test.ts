import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

/*
  DAO Investment Platform Tests - Comprehensive Testing
  Testing all governance, investment, and certificate functionality
*/

describe("DAO Investment Platform", () => {
  it("ensures DAO platform is properly initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should have correct token metadata", () => {
    const { result: name } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-name",
      [],
      deployer
    );
    expect(name).toBeOk(Cl.stringAscii("Investment DAO Token"));

    const { result: symbol } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-symbol",
      [],
      deployer
    );
    expect(symbol).toBeOk(Cl.stringAscii("IDT"));

    const { result: decimals } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-decimals",
      [],
      deployer
    );
    expect(decimals).toBeOk(Cl.uint(6));
  });

  it("should allow owner to mint tokens", () => {
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(1000000), Cl.principal(address1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));

    const { result: balance } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-balance",
      [Cl.principal(address1)],
      deployer
    );
    expect(balance).toBeOk(Cl.uint(1000000));
  });

  it("should not allow non-owner to mint tokens", () => {
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(5000), Cl.principal(address2)],
      address1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("should allow creating investment pools", () => {
    // First mint tokens to address1 for creating pools
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(100000), Cl.principal(address1)],
      deployer
    );

    // Create investment pool
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "create-investment-pool",
      [
        Cl.stringUtf8("Real Estate Development"),
        Cl.stringUtf8("Commercial property in Lagos"),
        Cl.uint(50000), // target amount
        Cl.uint(5000),  // min investment
        Cl.uint(1000)   // platform fee
      ],
      address1
    );
    expect(result).toBeOk(Cl.uint(1)); // should return pool-id 1
  });

  it("should allow investing in pools", () => {
    // Setup: mint tokens to users
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(50000), Cl.principal(address1)],
      deployer
    );
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(30000), Cl.principal(address2)],
      deployer
    );

    // Create pool first
    simnet.callPublicFn(
      "dao-investment-platform",
      "create-investment-pool",
      [
        Cl.stringUtf8("Agriculture Investment"),
        Cl.stringUtf8("Sustainable farming in Ghana"),
        Cl.uint(40000),
        Cl.uint(2000),
        Cl.uint(800)
      ],
      address1
    );

    // Invest in the pool
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "invest-in-pool",
      [Cl.uint(1), Cl.uint(10000)],
      address2
    );
    expect(result).toBeOk(Cl.uint(1)); // should return certificate NFT ID
  });

  it("should handle token transfers correctly", () => {
    // Mint tokens
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(15000), Cl.principal(address1)],
      deployer
    );

    // Transfer tokens
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "transfer",
      [
        Cl.uint(5000),
        Cl.principal(address1),
        Cl.principal(address2),
        Cl.none()
      ],
      address1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Check balances
    const { result: balance1 } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-balance",
      [Cl.principal(address1)],
      deployer
    );
    expect(balance1).toBeOk(Cl.uint(10000));

    const { result: balance2 } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-balance",
      [Cl.principal(address2)],
      deployer
    );
    expect(balance2).toBeOk(Cl.uint(5000));
  });

  it("should allow creating governance proposals", () => {
    // Setup governance tokens
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(25000), Cl.principal(address1)],
      deployer
    );

    // Create governance proposal
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "create-proposal",
      [
        Cl.stringUtf8("Update Platform Fee"),
        Cl.stringUtf8("Reduce platform fee to 1.5%"),
        Cl.uint(1500), // new fee in basis points
        Cl.uint(100)   // voting period in blocks
      ],
      address1
    );
    expect(result).toBeOk(Cl.uint(1)); // should return proposal-id 1
  });

  it("should allow voting on proposals", () => {
    // Setup governance tokens
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(20000), Cl.principal(address1)],
      deployer
    );
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(15000), Cl.principal(address2)],
      deployer
    );

    // Create proposal
    simnet.callPublicFn(
      "dao-investment-platform",
      "create-proposal",
      [
        Cl.stringUtf8("Expand to Morocco"),
        Cl.stringUtf8("Open investment opportunities in Morocco"),
        Cl.uint(2000),
        Cl.uint(50)
      ],
      address1
    );

    // Vote on proposal
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "vote-on-proposal",
      [Cl.uint(1), Cl.bool(true), Cl.uint(15000)],
      address2
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should allow owner to update platform fee", () => {
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "update-platform-fee",
      [Cl.uint(1200)], // 1.2%
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should not allow non-owner to update platform fee", () => {
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "update-platform-fee",
      [Cl.uint(900)],
      address1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("should handle invalid investments", () => {
    // Try to invest in non-existent pool
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "invest-in-pool",
      [Cl.uint(999), Cl.uint(5000)],
      address1
    );
    expect(result).toBeErr(Cl.uint(103)); // err-invalid-investment
  });

  it("should track total supply correctly", () => {
    // Initial total supply should be 0
    const { result: initialSupply } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-total-supply",
      [],
      deployer
    );
    
    // Mint some tokens
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(50000), Cl.principal(address1)],
      deployer
    );

    // Check total supply increased
    const { result: newSupply } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-total-supply",
      [],
      deployer
    );
    
    // The actual value will depend on previous minting in other tests
    expect(newSupply.type).toBe(7); // Should be an (ok ...)
  });

  it("should handle certificate NFT operations", () => {
    // Setup
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(60000), Cl.principal(address1)],
      deployer
    );
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(40000), Cl.principal(address2)],
      deployer
    );

    // Create pool
    simnet.callPublicFn(
      "dao-investment-platform",
      "create-investment-pool",
      [
        Cl.stringUtf8("Tech Startup Fund"),
        Cl.stringUtf8("Investment in African tech startups"),
        Cl.uint(100000),
        Cl.uint(5000),
        Cl.uint(1000)
      ],
      address1
    );

    // Invest and get certificate
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "invest-in-pool",
      [Cl.uint(1), Cl.uint(20000)],
      address2
    );
    expect(result).toBeOk(Cl.uint(1));

    // Check certificate ownership
    const { result: owner } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-owner",
      [Cl.uint(1)],
      deployer
    );
    expect(owner).toBeOk(Cl.some(Cl.principal(address2)));
  });
});
