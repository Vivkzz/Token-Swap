import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBalance(balance: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const quotient = balance / divisor;
  const remainder = balance % divisor;
  
  if (remainder === 0n) {
    return quotient.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  if (trimmedRemainder === '') {
    return quotient.toString();
  }
  
  return `${quotient}.${trimmedRemainder}`;
}

export function parseUnits(value: string, decimals: number = 18): bigint {
  const [whole, fraction = ''] = value.split('.');
  const wholeBigInt = BigInt(whole || '0');
  const fractionBigInt = BigInt(fraction.padEnd(decimals, '0').slice(0, decimals));
  
  return wholeBigInt * BigInt(10 ** decimals) + fractionBigInt;
}
