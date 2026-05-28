export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: {
    balance: number;
    gain: number;
  };
  ltcg: {
    balance: number;
    gain: number;
  };
}

export interface CapitalGainsCategory {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainsCategory;
  ltcg: CapitalGainsCategory;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}
