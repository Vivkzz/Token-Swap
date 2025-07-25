import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseUnits as parseViemUnits, type Address } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toHex = (address: string | undefined): Address | undefined => {
  if (!address) return undefined;
  return address.toLowerCase().startsWith('0x')
    ? (address.toLowerCase() as Address)
    : (`0x${address}` as Address);
};

export const maxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

export function formatBalance(balance: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const quotient = balance / divisor;
  const remainder = balance % divisor;

  if (remainder === BigInt(0)) {
    return quotient.toString();
  }

  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');

  if (trimmedRemainder === '') {
    return quotient.toString();
  }

  return `${quotient}.${trimmedRemainder}`;
}

// Export viem's parseUnits as our default
export const parseUnits = parseViemUnits;
