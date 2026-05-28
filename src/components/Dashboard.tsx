import React from 'react';
import { useTaxHarvesting } from '../context/TaxHarvestingContext';
import { GainsCard } from './GainsCard';
import { HoldingsTable } from './HoldingsTable';
import { PortfolioChart } from './PortfolioChart';
import { calculateRealisedGains } from '../utils/calculations';
import { Zap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { initialGains, postHarvestingGains, isLoading, error, autoHarvestLosses, selectedCoins } = useTaxHarvesting();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBlue"></div>
      </div>
    );
  }

  if (error || !initialGains || !postHarvestingGains) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-errorRed">
        <p>{error || "Failed to load data."}</p>
      </div>
    );
  }

  const preGains = calculateRealisedGains(initialGains);
  const postGains = calculateRealisedGains(postHarvestingGains);
  const savings = preGains - postGains;
  
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans selection:bg-primaryBlue/30 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-textPrimary tracking-tight mb-2">Tax Loss Harvesting</h1>
            <p className="text-textSecondary">Offset your capital gains with losses to reduce your tax burden.</p>
          </div>
          <button 
            onClick={autoHarvestLosses}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primaryBlue to-purple-600 hover:from-primaryBlueHover hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primaryBlue/20 focus:outline-none focus:ring-2 focus:ring-primaryBlue/50"
          >
            <Zap size={18} className={selectedCoins.size === 0 ? "animate-pulse" : ""} />
            Auto-Harvest Losses
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 flex flex-col md:flex-row gap-6">
            <GainsCard 
              title="Pre-Harvesting" 
              gains={initialGains} 
            />
            <GainsCard 
              title="After Harvesting" 
              isPostHarvesting={true}
              gains={postHarvestingGains}
              savings={savings > 0 ? savings : 0}
            />
          </div>
          <div className="xl:col-span-1">
            <PortfolioChart initialGains={initialGains} postHarvestingGains={postHarvestingGains} />
          </div>
        </div>

        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-bold text-textPrimary mb-1">Your Holdings</h2>
          <p className="text-sm text-textSecondary">Select holdings manually to simulate custom tax loss harvesting scenarios.</p>
        </div>

        <HoldingsTable />
      </div>
    </div>
  );
};
