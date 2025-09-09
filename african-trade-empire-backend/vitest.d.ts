import type { ClarityValue } from "@stacks/transactions";

declare module "vitest" {
  interface Assertion<T = any> {
    toBeOk: (expected: ClarityValue) => void;
    toBeErr: (expected: ClarityValue) => void;
    toBeBool: (expected: boolean) => void;
    toBeInt: (expected: number | bigint) => void;
    toBeUint: (expected: number | bigint) => void;
    toBeAscii: (expected: string) => void;
    toBeUtf8: (expected: string) => void;
    toBeSome: (expected: ClarityValue) => void;
    toBeNone: () => void;
    toBePrincipal: (expected: string) => void;
    toBeBuff: (expected: Uint8Array) => void;
    toBeList: (expected: ClarityValue[]) => void;
    toBeTuple: (expected: Record<string, ClarityValue>) => void;
  }
}
