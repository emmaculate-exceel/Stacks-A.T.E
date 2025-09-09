
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

/*
  African Trade Empire Contract Tests
  Testing core NFT card and marketplace functionality
*/

describe("African Trade Empire Contract", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should initialize with correct default values", () => {
    const { result } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-last-token-id",
      [],
      deployer
    );
    expect(result).toBeOk(Cl.uint(0));

    const { result: totalSupply } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-total-supply",
      [],
      deployer
    );
    expect(totalSupply).toBeOk(Cl.uint(0));
  });

  it("should have correct token metadata", () => {
    const { result: name } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-name",
      [],
      deployer
    );
    expect(name).toBeOk(Cl.stringAscii("Trade Empire Token"));

    const { result: symbol } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-symbol",
      [],
      deployer
    );
    expect(symbol).toBeOk(Cl.stringAscii("TET"));

    const { result: decimals } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-decimals",
      [],
      deployer
    );
    expect(decimals).toBeOk(Cl.uint(6));
  });

  it("should allow owner to mint tokens", () => {
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "mint-tokens",
      [Cl.uint(100000), Cl.principal(address1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));

    const { result: balance } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-balance",
      [Cl.principal(address1)],
      deployer
    );
    expect(balance).toBeOk(Cl.uint(100000));
  });

  it("should not allow non-owner to mint tokens", () => {
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "mint-tokens",
      [Cl.uint(1000), Cl.principal(address2)],
      address1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("should allow owner to mint cards", () => {
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "mint-card",
      [
        Cl.principal(address1),
        Cl.stringAscii("merchant"),
        Cl.stringAscii("caravan-leader"),
        Cl.uint(2),
        Cl.uint(75),
        Cl.stringAscii("Sahara"),
        Cl.some(Cl.stringUtf8("ipfs://card1"))
      ],
      deployer
    );
    expect(result).toBeOk(Cl.uint(1));

    const { result: owner } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-owner",
      [Cl.uint(1)],
      deployer
    );
    expect(owner).toBeOk(Cl.principal(address1));
  });

  it("should not allow non-owner to mint cards", () => {
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "mint-card",
      [
        Cl.principal(address1),
        Cl.stringAscii("resource"),
        Cl.stringAscii("gold"),
        Cl.uint(3),
        Cl.uint(100),
        Cl.stringAscii("West Africa"),
        Cl.none()
      ],
      address1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("should allow card transfers between users", () => {
    // First mint a card
    simnet.callPublicFn(
      "african-trade-empire",
      "mint-card",
      [
        Cl.principal(address1),
        Cl.stringAscii("merchant"),
        Cl.stringAscii("trader"),
        Cl.uint(1),
        Cl.uint(50),
        Cl.stringAscii("North Africa"),
        Cl.none()
      ],
      deployer
    );

    // Transfer the card
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "transfer-card",
      [Cl.uint(1), Cl.principal(address1), Cl.principal(address2)],
      address1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Verify new owner
    const { result: newOwner } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-owner",
      [Cl.uint(1)],
      deployer
    );
    expect(newOwner).toBeOk(Cl.principal(address2));
  });

  it("should not allow unauthorized card transfers", () => {
    // Mint a card for address1
    simnet.callPublicFn(
      "african-trade-empire",
      "mint-card",
      [
        Cl.principal(address1),
        Cl.stringAscii("resource"),
        Cl.stringAscii("spices"),
        Cl.uint(2),
        Cl.uint(60),
        Cl.stringAscii("East Africa"),
        Cl.none()
      ],
      deployer
    );

    // Try to transfer from address2 (unauthorized)
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "transfer-card",
      [Cl.uint(1), Cl.principal(address1), Cl.principal(address2)],
      address2
    );
    expect(result).toBeErr(Cl.uint(101)); // err-not-token-owner
  });

  it("should allow listing cards for sale", () => {
    // Mint tokens for marketplace transactions
    simnet.callPublicFn(
      "african-trade-empire",
      "mint-tokens",
      [Cl.uint(50000), Cl.principal(address2)],
      deployer
    );

    // Mint a card for address1
    simnet.callPublicFn(
      "african-trade-empire",
      "mint-card",
      [
        Cl.principal(address1),
        Cl.stringAscii("merchant"),
        Cl.stringAscii("sea-captain"),
        Cl.uint(3),
        Cl.uint(90),
        Cl.stringAscii("Coastal"),
        Cl.none()
      ],
      deployer
    );

    // List the card
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "list-card",
      [Cl.uint(1), Cl.uint(1000)],
      address1
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should handle token transfers correctly", () => {
    // Mint tokens
    simnet.callPublicFn(
      "african-trade-empire",
      "mint-tokens",
      [Cl.uint(10000), Cl.principal(address1)],
      deployer
    );

    // Transfer tokens
    const { result } = simnet.callPublicFn(
      "african-trade-empire",
      "transfer",
      [
        Cl.uint(2000),
        Cl.principal(address1),
        Cl.principal(address2),
        Cl.none()
      ],
      address1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Check balances
    const { result: balance1 } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-balance",
      [Cl.principal(address1)],
      deployer
    );
    expect(balance1).toBeOk(Cl.uint(8000));

    const { result: balance2 } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-balance",
      [Cl.principal(address2)],
      deployer
    );
    expect(balance2).toBeOk(Cl.uint(2000));
  });

  it("should handle non-existent card queries correctly", () => {
    const { result } = simnet.callReadOnlyFn(
      "african-trade-empire",
      "get-owner",
      [Cl.uint(999)],
      deployer
    );
    // The constant err-card-not-found is (err u104), so (err err-card-not-found) becomes (err (err u104))
    expect(result).toStrictEqual({ 
      type: 8, 
      value: { 
        type: 8, 
        value: { 
          type: 1, 
          value: 104n 
        } 
      } 
    });
  });
});
