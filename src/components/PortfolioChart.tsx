import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CapitalGains } from '../types';
import { calculateNetGains } from '../utils/calculations';

interface PortfolioChartProps {
  initialGains: CapitalGains;
  postHarvestingGains: CapitalGains;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ initialGains, postHarvestingGains }) => {
  const data = [
    {
      name: 'STCG (Net)',
      PreHarvesting: calculateNetGains(initialGains.stcg),
      PostHarvesting: calculateNetGains(postHarvestingGains.stcg),
    },
    {
      name: 'LTCG (Net)',
      PreHarvesting: calculateNetGains(initialGains.ltcg),
      PostHarvesting: calculateNetGains(postHarvestingGains.ltcg),
    }
  ];

  return (
    <div className="w-full h-80 bg-cardBg border border-gray-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold mb-6">Tax Impact Comparison</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
          <XAxis dataKey="name" stroke="#A0A4A8" tick={{fill: '#A0A4A8'}} />
          <YAxis stroke="#A0A4A8" tick={{fill: '#A0A4A8'}} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
          <Tooltip 
            cursor={{fill: '#2D3748', opacity: 0.4}} 
            contentStyle={{ backgroundColor: '#151924', borderColor: '#4A5568', color: '#fff', borderRadius: '8px' }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, undefined]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <ReferenceLine y={0} stroke="#4A5568" />
          <Bar dataKey="PreHarvesting" name="Pre-Harvesting" fill="#3182CE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="PostHarvesting" name="After Harvesting" fill="#00C853" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
