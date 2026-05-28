import type { CapitalGains, CapitalGainsCategory, Holding } from '../types';

export const calculateNetGains = (gains: CapitalGainsCategory): number => {
  return gains.profits - gains.losses;
};

export const calculateRealisedGains = (gains: CapitalGains): number => {
  const netStcg = calculateNetGains(gains.stcg);
  const netLtcg = calculateNetGains(gains.ltcg);
  return netStcg + netLtcg;
};

export const calculatePostHarvestingGains = (
  initialGains: CapitalGains,
  selectedHoldings: Holding[]
): CapitalGains => {
  // We deep copy the initial gains to avoid mutating state directly
  const postGains: CapitalGains = {
    stcg: { ...initialGains.stcg },
    ltcg: { ...initialGains.ltcg },
  };

  selectedHoldings.forEach((holding) => {
    // Process STCG
    if (holding.stcg.gain > 0) {
      postGains.stcg.profits += holding.stcg.gain;
    } else if (holding.stcg.gain < 0) {
      postGains.stcg.losses += Math.abs(holding.stcg.gain);
    }

    // Process LTCG
    if (holding.ltcg.gain > 0) {
      postGains.ltcg.profits += holding.ltcg.gain;
    } else if (holding.ltcg.gain < 0) {
      postGains.ltcg.losses += Math.abs(holding.ltcg.gain);
    }
  });

  return postGains;
};
