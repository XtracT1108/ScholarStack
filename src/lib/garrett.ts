/**
 * Garrett Ranking Algorithm Implementation
 * 
 * Formula: Percentage Position = 100 * (Rij - 0.5) / Nj
 * where:
 * Rij = Rank given for the ith factor by the jth respondent
 * Nj = Number of factors ranked by the jth respondent
 */

// Garrett Value Lookup Table (Simplified version or approximation)
// In a real academic tool, this would be a complete table from 0 to 100
// We'll use a linear interpolation or a pre-defined map for common values
const GARRETT_TABLE: Record<number, number> = {
  1: 86, 2: 81, 3: 78, 4: 75, 5: 73, 6: 71, 7: 70, 8: 68, 9: 67, 10: 66,
  15: 61, 20: 58, 25: 55, 30: 52, 35: 50, 40: 48, 45: 45, 50: 43,
  55: 41, 60: 38, 65: 36, 70: 34, 75: 31, 80: 28, 85: 25, 90: 21,
  95: 16, 99: 10
};

export function getGarrettValue(percentPosition: number): number {
  const rounded = Math.round(percentPosition);
  if (GARRETT_TABLE[rounded] !== undefined) return GARRETT_TABLE[rounded];
  
  // Simple linear interpolation for missing values
  const keys = Object.keys(GARRETT_TABLE).map(Number).sort((a, b) => a - b);
  let lower = keys[0];
  let upper = keys[keys.length - 1];
  
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] <= rounded) lower = keys[i];
    if (keys[i] >= rounded) {
      upper = keys[i];
      break;
    }
  }
  
  if (lower === upper) return GARRETT_TABLE[lower];
  
  const lowerVal = GARRETT_TABLE[lower];
  const upperVal = GARRETT_TABLE[upper];
  
  return lowerVal + (upperVal - lowerVal) * (rounded - lower) / (upper - lower);
}

export interface RespondentData {
  id: string;
  rankings: Record<string, number>; // factorId -> rank (1, 2, 3...)
}

export interface GarrettAuditStep {
  respondentId: string;
  factor: string;
  rank: number;
  percentPosition: number;
  garrettValue: number;
}

export interface GarrettResult {
  factor: string;
  totalScore: number;
  meanScore: number;
  rank: number;
  audit: GarrettAuditStep[];
}

export function calculateGarrettRanking(factors: string[], respondents: RespondentData[]): GarrettResult[] {
  const numFactors = factors.length;
  const factorScores: Record<string, number> = {};
  const factorAudits: Record<string, GarrettAuditStep[]> = {};
  
  factors.forEach(f => {
    factorScores[f] = 0;
    factorAudits[f] = [];
  });
  
  respondents.forEach(resp => {
    factors.forEach(factor => {
      const rank = resp.rankings[factor];
      if (rank) {
        const percentPosition = (100 * (rank - 0.5)) / numFactors;
        const garrettValue = getGarrettValue(percentPosition);
        factorScores[factor] += garrettValue;
        factorAudits[factor].push({
          respondentId: resp.id,
          factor,
          rank,
          percentPosition,
          garrettValue
        });
      }
    });
  });
  
  const results: GarrettResult[] = factors.map(factor => ({
    factor,
    totalScore: factorScores[factor],
    meanScore: factorScores[factor] / respondents.length,
    rank: 0, // Placeholder
    audit: factorAudits[factor]
  }));
  
  // Sort by mean score descending and assign ranks
  return results
    .sort((a, b) => b.meanScore - a.meanScore)
    .map((res, index) => ({ ...res, rank: index + 1 }));
}
