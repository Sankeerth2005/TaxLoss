import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Holding, CapitalGains } from '../types';
import { getHoldings, getCapitalGains } from '../api/services';
import { calculatePostHarvestingGains } from '../utils/calculations';

interface TaxHarvestingContextType {
  holdings: Holding[];
  initialGains: CapitalGains | null;
  postHarvestingGains: CapitalGains | null;
  selectedCoins: Set<string>;
  isLoading: boolean;
  error: string | null;
  toggleCoinSelection: (coin: string) => void;
  selectAllCoins: (selectAll: boolean) => void;
  autoHarvestLosses: () => void;
}

const TaxHarvestingContext = createContext<TaxHarvestingContextType | undefined>(undefined);

export const TaxHarvestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [initialGains, setInitialGains] = useState<CapitalGains | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [holdingsData, gainsData] = await Promise.all([
          getHoldings(),
          getCapitalGains()
        ]);
        setHoldings(holdingsData);
        setInitialGains(gainsData.capitalGains);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load tax harvesting data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCoinSelection = useCallback((coin: string) => {
    setSelectedCoins((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(coin)) {
        newSet.delete(coin);
      } else {
        newSet.add(coin);
      }
      return newSet;
    });
  }, []);

  const selectAllCoins = useCallback((selectAll: boolean) => {
    if (selectAll) {
      setSelectedCoins(new Set(holdings.map(h => h.coin)));
    } else {
      setSelectedCoins(new Set());
    }
  }, [holdings]);

  const autoHarvestLosses = useCallback(() => {
    const optimalCoins = holdings
      .filter(h => h.stcg.gain < 0 || h.ltcg.gain < 0)
      .map(h => h.coin);
    setSelectedCoins(new Set(optimalCoins));
  }, [holdings]);

  const postHarvestingGains = useMemo(() => {
    if (!initialGains) return null;
    if (selectedCoins.size === 0) return initialGains;

    const selectedHoldings = holdings.filter(h => selectedCoins.has(h.coin));
    return calculatePostHarvestingGains(initialGains, selectedHoldings);
  }, [initialGains, holdings, selectedCoins]);

  const value = {
    holdings,
    initialGains,
    postHarvestingGains,
    selectedCoins,
    isLoading,
    error,
    toggleCoinSelection,
    selectAllCoins,
    autoHarvestLosses
  };

  return (
    <TaxHarvestingContext.Provider value={value}>
      {children}
    </TaxHarvestingContext.Provider>
  );
};

export const useTaxHarvesting = (): TaxHarvestingContextType => {
  const context = useContext(TaxHarvestingContext);
  if (context === undefined) {
    throw new Error('useTaxHarvesting must be used within a TaxHarvestingProvider');
  }
  return context;
};
