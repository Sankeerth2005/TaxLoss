import { mockHoldings, mockCapitalGains } from './mockData';
import type { Holding, CapitalGainsResponse } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getHoldings = async (): Promise<Holding[]> => {
  await delay(800); // 800ms delay to simulate API load
  return mockHoldings;
};

export const getCapitalGains = async (): Promise<CapitalGainsResponse> => {
  await delay(600); // 600ms delay
  return mockCapitalGains;
};
