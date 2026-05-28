import React from 'react';
import type { CapitalGains } from '../types';
import { calculateNetGains, calculateRealisedGains } from '../utils/calculations';

interface GainsCardProps {
  title: string;
  isPostHarvesting?: boolean;
  gains: CapitalGains;
  savings?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const GainsCard: React.FC<GainsCardProps> = ({ title, isPostHarvesting = false, gains, savings }) => {
  const netStcg = calculateNetGains(gains.stcg);
  const netLtcg = calculateNetGains(gains.ltcg);
  const realisedGains = calculateRealisedGains(gains);

  const baseClasses = "flex flex-col p-6 rounded-2xl w-full lg:w-1/2 transition-all duration-300";
  const bgClasses = isPostHarvesting 
    ? "bg-gradient-to-br from-primaryBlue to-[#0038B8] text-white shadow-[0_8px_32px_rgba(0,82,255,0.25)] relative overflow-hidden" 
    : "bg-cardBg text-textPrimary border border-gray-800 shadow-xl";

  return (
    <div className={`${baseClasses} ${bgClasses}`}>
      {isPostHarvesting && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold tracking-wide">{title}</h3>
      </div>
      
      <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
        <div>
          <p className={`text-sm mb-1 ${isPostHarvesting ? 'text-blue-200' : 'text-textSecondary'}`}>Realised Capital Gains</p>
          <p className="text-3xl font-bold">{formatCurrency(realisedGains)}</p>
        </div>
      </div>

      <div className="flex gap-6 mb-2">
        <div className="flex-1">
          <p className={`text-sm mb-2 ${isPostHarvesting ? 'text-blue-200' : 'text-textSecondary'}`}>Short Term</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs opacity-80">Profits</span>
              <span className="text-xs font-medium text-green-400">{formatCurrency(gains.stcg.profits)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs opacity-80">Losses</span>
              <span className="text-xs font-medium text-red-400">-{formatCurrency(gains.stcg.losses)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/10 mt-1">
              <span className="text-xs font-medium">Net</span>
              <span className={`text-xs font-medium ${netStcg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(netStcg)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-px bg-white/10"></div>

        <div className="flex-1">
          <p className={`text-sm mb-2 ${isPostHarvesting ? 'text-blue-200' : 'text-textSecondary'}`}>Long Term</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs opacity-80">Profits</span>
              <span className="text-xs font-medium text-green-400">{formatCurrency(gains.ltcg.profits)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs opacity-80">Losses</span>
              <span className="text-xs font-medium text-red-400">-{formatCurrency(gains.ltcg.losses)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/10 mt-1">
              <span className="text-xs font-medium">Net</span>
              <span className={`text-xs font-medium ${netLtcg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(netLtcg)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isPostHarvesting && savings !== undefined && savings > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white/10 rounded-lg p-3 flex items-center justify-center border border-white/20">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              🎉 You're going to save {formatCurrency(savings)} on taxes!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
