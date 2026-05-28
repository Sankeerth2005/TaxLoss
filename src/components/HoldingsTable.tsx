import React, { useState, useMemo } from 'react';
import { useTaxHarvesting } from '../context/TaxHarvestingContext';
import { CheckSquare, Square, Search, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 4,
  }).format(value);
};

type SortKey = 'coinName' | 'totalHolding' | 'currentPrice' | 'stcg' | 'ltcg';

export const HoldingsTable: React.FC = () => {
  const { holdings, selectedCoins, toggleCoinSelection } = useTaxHarvesting();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewAll, setIsViewAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const processedHoldings = useMemo(() => {
    // 1. Filter by search term
    let result = holdings.filter(h => 
      h.coin.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.coinName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        switch (sortConfig.key) {
          case 'coinName':
            valA = a.coinName;
            valB = b.coinName;
            break;
          case 'totalHolding':
            valA = a.totalHolding * a.currentPrice; // Sort by holding value
            valB = b.totalHolding * b.currentPrice;
            break;
          case 'currentPrice':
            valA = a.currentPrice;
            valB = b.currentPrice;
            break;
          case 'stcg':
            valA = a.stcg.gain;
            valB = b.stcg.gain;
            break;
          case 'ltcg':
            valA = a.ltcg.gain;
            valB = b.ltcg.gain;
            break;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [holdings, searchTerm, sortConfig]);

  const displayedHoldings = isViewAll ? processedHoldings : processedHoldings.slice(0, 5);
  const allSelected = displayedHoldings.length > 0 && displayedHoldings.every(h => selectedCoins.has(h.coin));

  const handleSelectAllFiltered = () => {
    if (allSelected) {
      // Deselect only the currently displayed ones
      const newSelected = new Set(selectedCoins);
      displayedHoldings.forEach(h => newSelected.delete(h.coin));
      // Re-trigger the context select with the new set? Wait, the context only has selectAllCoins(boolean).
      // Let's implement a custom toggle here.
      // But we can just use toggleCoinSelection in a loop, or it's inefficient.
      // For simplicity, we just toggle all of them individually.
      displayedHoldings.forEach(h => {
        if (selectedCoins.has(h.coin)) toggleCoinSelection(h.coin);
      });
    } else {
      displayedHoldings.forEach(h => {
        if (!selectedCoins.has(h.coin)) toggleCoinSelection(h.coin);
      });
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="opacity-40" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="w-full bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-xl mt-6">
      
      {/* Table Header Controls */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-textSecondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800/50 text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primaryBlue focus:border-primaryBlue sm:text-sm transition-colors"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-textSecondary">
          Showing {displayedHoldings.length} of {processedHoldings.length} results
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textSecondary">
          <thead className="text-xs text-textSecondary uppercase bg-gray-900/50 border-b border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-4 flex items-center gap-3">
                <button 
                  onClick={handleSelectAllFiltered}
                  className="text-primaryBlue hover:text-primaryBlueHover transition-colors focus:outline-none"
                  title={allSelected ? "Deselect all visible" : "Select all visible"}
                >
                  {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('coinName')}>
                  Asset {renderSortIcon('coinName')}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('totalHolding')}>
                <div className="flex items-center gap-1">Holdings {renderSortIcon('totalHolding')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('currentPrice')}>
                <div className="flex items-center gap-1">Current Price {renderSortIcon('currentPrice')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('stcg')}>
                <div className="flex items-center gap-1">Short-Term Gain {renderSortIcon('stcg')}</div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('ltcg')}>
                <div className="flex items-center gap-1">Long-Term Gain {renderSortIcon('ltcg')}</div>
              </th>
              <th scope="col" className="px-6 py-4">
                Amount to Sell
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedHoldings.length > 0 ? (
              displayedHoldings.map((holding) => {
                const isSelected = selectedCoins.has(holding.coin);
                
                return (
                  <tr 
                    key={holding.coin} 
                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer ${isSelected ? 'bg-primaryBlue/5' : ''}`}
                    onClick={() => toggleCoinSelection(holding.coin)}
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <button className="text-primaryBlue focus:outline-none flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleCoinSelection(holding.coin); }}>
                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                      <div className="flex items-center gap-3">
                        <img src={holding.logo} alt={holding.coinName} className="w-8 h-8 rounded-full object-contain bg-white/10 p-1" />
                        <div>
                          <div className="font-medium text-textPrimary truncate max-w-[150px] sm:max-w-[200px]" title={holding.coinName}>{holding.coinName}</div>
                          <div className="text-xs text-textSecondary">{holding.coin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-textPrimary">{holding.totalHolding.toFixed(6)}</div>
                      <div className="text-xs">{formatCurrency(holding.averageBuyPrice)} avg</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-textPrimary">
                      {formatCurrency(holding.currentPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${holding.stcg.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.stcg.gain > 0 ? '+' : ''}{formatCurrency(holding.stcg.gain)}
                      </div>
                      <div className="text-xs">{holding.stcg.balance.toFixed(6)} bal</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${holding.ltcg.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.ltcg.gain > 0 ? '+' : ''}{formatCurrency(holding.ltcg.gain)}
                      </div>
                      <div className="text-xs">{holding.ltcg.balance.toFixed(6)} bal</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-textPrimary">
                      {isSelected ? holding.totalHolding.toFixed(6) : '-'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-textSecondary">
                  No assets found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls (View All) */}
      {processedHoldings.length > 5 && (
        <div className="p-4 bg-gray-900/30 border-t border-gray-800 text-center">
          <button 
            onClick={() => setIsViewAll(!isViewAll)}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue/50"
          >
            {isViewAll ? 'View Less' : `View All Holdings (${processedHoldings.length})`}
          </button>
        </div>
      )}
    </div>
  );
};
