import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

/*
  DAO Investment Platform Tests
  Testing the comprehensive investment and governance functionality
*/

describe("DAO Investment Platform", () => {
  it("ensures DAO platform is properly initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should allow owner to mint tokens", () => {
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(1000000), Cl.principal(address1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should check initial token balance", () => {
    // First mint tokens
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(10000), Cl.principal(address1)],
      deployer
    );
    
    // Check balance
    const { result } = simnet.callReadOnlyFn(
      "dao-investment-platform",
      "get-balance",
      [Cl.principal(address1)],
      deployer
    );
    expect(result).toBeOk(Cl.uint(10000));
  });

  it("should allow creating investment pools", () => {
    // First mint tokens to address1 for creating pools
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(50000), Cl.principal(address1)],
      deployer
    );

    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "create-investment-pool",
      [
        Cl.stringAscii("African Coffee Export"),
        Cl.stringAscii("Investment in coffee export from Kenya to Europe"),
        Cl.uint(100000), // target amount
        Cl.uint(1000),   // minimum investment
        Cl.uint(1500),   // 15% expected return
        Cl.uint(8640)    // investment period (6 days)
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

    // Create investment pool
    simnet.callPublicFn(
      "dao-investment-platform",
      "create-investment-pool",
      [
        Cl.stringAscii("Test Investment Pool"),
        Cl.stringAscii("Test pool for investment"),
        Cl.uint(20000), // target amount
        Cl.uint(1000),  // minimum investment
        Cl.uint(1200),  // 12% expected return
        Cl.uint(8640)   // investment period
      ],
      address1
    );

    // Invest in the pool
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "invest-in-pool",
      [Cl.uint(1), Cl.uint(5000)], // pool-id: 1, amount: 5000
      address2
    );
    expect(result).toBeOk(Cl.uint(1)); // should return certificate NFT ID
  });

  it("should allow creating governance proposals", () => {
    // Setup governance tokens
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(10000), Cl.principal(address1)],
      deployer
    );

    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "create-proposal",
      [
        Cl.stringAscii("Reduce Platform Fee"),
        Cl.stringAscii("Reduce platform fee from 2% to 1.5%"),
        Cl.stringAscii("fee-change"),
        Cl.none()
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
      [Cl.uint(10000), Cl.principal(address1)],
      deployer
    );
    simnet.callPublicFn(
      "dao-investment-platform",
      "mint-tokens",
      [Cl.uint(5000), Cl.principal(address2)],
      deployer
    );

    // Create proposal
    simnet.callPublicFn(
      "dao-investment-platform",
      "create-proposal",
      [
        Cl.stringAscii("Test Proposal"),
        Cl.stringAscii("Test proposal description"),
        Cl.stringAscii("platform-upgrade"),
        Cl.none()
      ],
      address1
    );

    // Vote on proposal
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "vote-on-proposal",
      [Cl.uint(1), Cl.bool(true)], // proposal-id: 1, vote-for: true
      address2
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should allow owner to update platform fee", () => {
    const { result } = simnet.callPublicFn(
      "dao-investment-platform",
      "update-platform-fee",
      [Cl.uint(150)], // 1.5% fee
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });
});
