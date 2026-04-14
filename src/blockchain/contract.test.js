import {
  calculateBlockchainAmountEth,
  toUnixTimestamp,
  CONTRACT_ADDRESS,
} from "./contract";

describe("calculateBlockchainAmountEth", () => {
  it("converts GBP price to ETH by dividing by 10000", () => {
    expect(calculateBlockchainAmountEth(100)).toBe("0.0100");
  });

  it("returns minimum 0.001 ETH for very small prices", () => {
    expect(calculateBlockchainAmountEth(1)).toBe("0.0010");
  });

  it("returns minimum 0.001 ETH for zero price", () => {
    expect(calculateBlockchainAmountEth(0)).toBe("0.0010");
  });

  it("returns minimum 0.001 ETH for null input", () => {
    expect(calculateBlockchainAmountEth(null)).toBe("0.0010");
  });

  it("handles large GBP amounts correctly", () => {
    expect(calculateBlockchainAmountEth(5000)).toBe("0.5000");
  });

  it("returns a string with 4 decimal places", () => {
    const result = calculateBlockchainAmountEth(250);
    expect(result).toMatch(/^\d+\.\d{4}$/);
  });
});

describe("toUnixTimestamp", () => {
  it("converts a date string to a unix timestamp", () => {
    const result = toUnixTimestamp("2025-01-01");
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);
  });

  it("returns an integer (no decimals)", () => {
    const result = toUnixTimestamp("2025-06-15");
    expect(Number.isInteger(result)).toBe(true);
  });

  it("returns a larger timestamp for a later date", () => {
    const earlier = toUnixTimestamp("2025-01-01");
    const later = toUnixTimestamp("2025-12-31");
    expect(later).toBeGreaterThan(earlier);
  });

  it("converts a Date object correctly", () => {
    const date = new Date("2025-03-01");
    const result = toUnixTimestamp(date);
    expect(result).toBe(Math.floor(date.getTime() / 1000));
  });
});

describe("CONTRACT_ADDRESS", () => {
  it("is a valid Ethereum address format", () => {
    expect(CONTRACT_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it("is the Sepolia deployed address", () => {
    expect(CONTRACT_ADDRESS).toBe("0xCC0e15A5d1aF7F150BBD0BD9e999C952bDBb20b7");
  });
});
