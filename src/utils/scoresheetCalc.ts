import {
  ScoresheetState,
  ScoresheetCalculatedTotals,
  ScoresheetOffense,
  OffenseSeverityLevel,
  DownwardDepartureItem
} from '../types';

// Florida Criminal Punishment Code Offense Severity Level Points Table
// (Fla. Stat. § 921.0024 & Fla. R. Crim. P. 3.992)
export const PRIMARY_OFFENSE_POINTS: Record<OffenseSeverityLevel, number> = {
  1: 4,
  2: 10,
  3: 16,
  4: 22,
  5: 28,
  6: 36,
  7: 56,
  8: 74,
  9: 92,
  10: 116,
};

export const ADDITIONAL_OFFENSE_POINTS: Record<OffenseSeverityLevel, number> = {
  1: 0.2,
  2: 1.2,
  3: 2.4,
  4: 3.6,
  5: 5.4,
  6: 18.0,
  7: 28.0,
  8: 37.0,
  9: 46.0,
  10: 58.0,
};

export const PRIOR_RECORD_POINTS: Record<OffenseSeverityLevel, number> = {
  1: 0.5,
  2: 0.8,
  3: 1.6,
  4: 2.4,
  5: 3.6,
  6: 9.0,
  7: 14.0,
  8: 19.0,
  9: 23.0,
  10: 29.0,
};

export const PRIOR_MISDEMEANOR_POINTS = 0.2;

// Victim Injury Points (Fla. Stat. § 921.0024(1)(a))
export const VICTIM_INJURY_POINTS = {
  secondDegreeMurder: 240,
  death: 120,
  severe: 40,
  moderate: 18,
  slight: 4,
  sexPenetration: 80,
  sexContact: 40,
};

// Florida Common Offense Catalog
export interface CommonFloridaOffense {
  statute: string;
  description: string;
  level: OffenseSeverityLevel;
  degree: '1st_degree' | '2nd_degree' | '3rd_degree' | '1st_degree_life' | 'life' | 'capital';
  category: string;
}

export const COMMON_FLORIDA_OFFENSES: CommonFloridaOffense[] = [
  { statute: '§ 893.13(6)(a)', description: 'Possession of Controlled Substance (Cocaine/Opiates)', level: 3, degree: '3rd_degree', category: 'Narcotics' },
  { statute: '§ 893.13(1)(a)', description: 'Sale/Delivery of Controlled Substance (Cocaine/Schedule II)', level: 5, degree: '2nd_degree', category: 'Narcotics' },
  { statute: '§ 893.135(1)(b)', description: 'Trafficking in Cocaine (28g - 200g)', level: 7, degree: '1st_degree', category: 'Narcotics' },
  { statute: '§ 812.014(2)(c)', description: 'Grand Theft ($750 - $5,000 / Motor Vehicle)', level: 2, degree: '3rd_degree', category: 'Property' },
  { statute: '§ 812.014(2)(b)', description: 'Grand Theft 2nd Degree ($20k - $100k)', level: 5, degree: '2nd_degree', category: 'Property' },
  { statute: '§ 812.014(2)(a)', description: 'Grand Theft 1st Degree ($100k or more)', level: 7, degree: '1st_degree', category: 'Property' },
  { statute: '§ 810.02(4)', description: 'Burglary of Unoccupied Structure / Conveyance', level: 4, degree: '3rd_degree', category: 'Burglary' },
  { statute: '§ 810.02(3)', description: 'Burglary of Unoccupied Dwelling', level: 6, degree: '2nd_degree', category: 'Burglary' },
  { statute: '§ 810.02(2)', description: 'Burglary of Occupied Dwelling / With Assault / Battery', level: 7, degree: '1st_degree_life', category: 'Burglary' },
  { statute: '§ 784.041', description: 'Domestic Battery by Strangulation', level: 6, degree: '3rd_degree', category: 'Crimes Against Person' },
  { statute: '§ 784.045', description: 'Aggravated Battery (Deadly Weapon / Great Bodily Harm)', level: 7, degree: '2nd_degree', category: 'Crimes Against Person' },
  { statute: '§ 784.07', description: 'Battery on Law Enforcement Officer (LEO)', level: 4, degree: '3rd_degree', category: 'Crimes Against Person' },
  { statute: '§ 812.13(2)(c)', description: 'Robbery (Sudden Snatching / No Weapon)', level: 6, degree: '2nd_degree', category: 'Robbery' },
  { statute: '§ 812.13(2)(a)', description: 'Armed Robbery with Firearm / Deadly Weapon', level: 9, degree: '1st_degree_life', category: 'Robbery' },
  { statute: '§ 790.23', description: 'Possession of Firearm by Convicted Felon', level: 5, degree: '2nd_degree', category: 'Weapons' },
  { statute: '§ 316.1935(3)', description: 'Fleeing and Eluding High Speed / Reckless', level: 5, degree: '2nd_degree', category: 'Traffic/Public Safety' },
  { statute: '§ 782.04(2)', description: 'Second-Degree Murder (Depraved Mind)', level: 10, degree: '1st_degree_life', category: 'Homicide' },
  { statute: '§ 782.04(1)', description: 'First-Degree Premeditated Murder', level: 10, degree: 'capital', category: 'Homicide' },
];

export const INITIAL_DOWNWARD_DEPARTURES: DownwardDepartureItem[] = [
  {
    id: 'dep-a',
    statute: 'Fla. Stat. § 921.0026(2)(a)',
    title: 'Legitimate Uncoerced Plea Bargain',
    description: 'The departure results from a legitimate, uncoerced plea bargain between defense and state.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-b',
    statute: 'Fla. Stat. § 921.0026(2)(b)',
    title: 'Minor Participant / Accomplice',
    description: 'The defendant was an accomplice to the offense and was a relatively minor participant in the criminal conduct.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-c',
    statute: 'Fla. Stat. § 921.0026(2)(c)',
    title: 'Impaired Capacity to Appreciate Conduct',
    description: 'The capacity of the defendant to appreciate the criminal nature of the conduct or to conform conduct to the requirements of law was substantially impaired.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-d',
    statute: 'Fla. Stat. § 921.0026(2)(d)',
    title: 'Specialized Treatment Required & Amenable',
    description: 'The defendant requires specialized treatment for a physical or mental disorder or addiction, and the defendant is amenable to treatment.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-e',
    statute: 'Fla. Stat. § 921.0026(2)(e)',
    title: 'Victim Was Initiator, Willing Participant or Provoker',
    description: 'The victim was an initiator, willing participant, aggressor, or provoker of the incident.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-f',
    statute: 'Fla. Stat. § 921.0026(2)(f)',
    title: 'Duress or Domination of Another',
    description: 'The defendant acted under extreme duress or under the domination of another person.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-g',
    statute: 'Fla. Stat. § 921.0026(2)(g)',
    title: 'Pre-Trial Restitution / Compensation Made',
    description: 'Before the identity of the defendant was at issue, the defendant compensated or made restitution to the victim.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-h',
    statute: 'Fla. Stat. § 921.0026(2)(h)',
    title: 'Substantial Cooperation with Law Enforcement',
    description: 'The defendant cooperated with the State to resolve the current offense or any other offense.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-j',
    statute: 'Fla. Stat. § 921.0026(2)(j)',
    title: 'Isolated Incident with Unsophisticated Manner & Remorse',
    description: 'The offense was committed in an unsophisticated manner and was an isolated incident for which the defendant has shown remorse.',
    checked: false,
    notes: '',
  },
  {
    id: 'dep-k',
    statute: 'Fla. Stat. § 921.0026(2)(k)',
    title: 'Youthful Age at Time of Offense',
    description: 'At the time of the offense the defendant was too young to appreciate the consequences of the offense.',
    checked: false,
    notes: '',
  },
];

export function calculateScoresheet(state: ScoresheetState): ScoresheetCalculatedTotals {
  // 1. Primary Offense Points
  const primaryBase = PRIMARY_OFFENSE_POINTS[state.primaryOffense.level] || 0;
  const primaryPoints = primaryBase * (state.primaryOffense.counts || 1);

  // 2. Additional Offenses Points
  const additionalPoints = state.additionalOffenses.reduce((acc, off) => {
    const pts = (ADDITIONAL_OFFENSE_POINTS[off.level] || 0) * (off.counts || 1);
    return acc + pts;
  }, 0);

  // 3. Victim Injury Points
  const vi = state.victimInjury;
  const victimInjuryPoints = 
    (vi.secondDegreeMurder * VICTIM_INJURY_POINTS.secondDegreeMurder) +
    (vi.death * VICTIM_INJURY_POINTS.death) +
    (vi.severe * VICTIM_INJURY_POINTS.severe) +
    (vi.moderate * VICTIM_INJURY_POINTS.moderate) +
    (vi.slight * VICTIM_INJURY_POINTS.slight) +
    (vi.sexPenetration * VICTIM_INJURY_POINTS.sexPenetration) +
    (vi.sexContact * VICTIM_INJURY_POINTS.sexContact);

  // 4. Prior Record Points
  const pr = state.priorRecord;
  const priorRecordPoints =
    (pr.level1 * PRIOR_RECORD_POINTS[1]) +
    (pr.level2 * PRIOR_RECORD_POINTS[2]) +
    (pr.level3 * PRIOR_RECORD_POINTS[3]) +
    (pr.level4 * PRIOR_RECORD_POINTS[4]) +
    (pr.level5 * PRIOR_RECORD_POINTS[5]) +
    (pr.level6 * PRIOR_RECORD_POINTS[6]) +
    (pr.level7 * PRIOR_RECORD_POINTS[7]) +
    (pr.level8 * PRIOR_RECORD_POINTS[8]) +
    (pr.level9 * PRIOR_RECORD_POINTS[9]) +
    (pr.level10 * PRIOR_RECORD_POINTS[10]) +
    (pr.misdemeanors * PRIOR_MISDEMEANOR_POINTS);

  // 5. Legal Status Violation Points (4 points)
  const legalStatusPoints = state.legalStatus.active ? 4 : 0;

  // 6. Community Sanction Violation Points
  const cs = state.communitySanctions;
  const communitySanctionPoints =
    (cs.technicalCount * 6) +
    (cs.newMisdemeanorCount * 12) +
    (cs.newFelonyCount * 24);

  // 7. Sentencing Enhancements
  const enh = state.enhancements;
  let enhancementPoints = 0;
  if (enh.firearm) enhancementPoints += 18;
  if (enh.semiautomaticOrMachineGun) enhancementPoints += 25;
  if (enh.priorSeriousFelony) enhancementPoints += 30;

  // Subtotal
  let subtotalPoints = 
    primaryPoints + 
    additionalPoints + 
    victimInjuryPoints + 
    priorRecordPoints + 
    legalStatusPoints + 
    communitySanctionPoints + 
    enhancementPoints;

  // Multipliers
  let totalPoints = subtotalPoints;
  if (enh.drugTraffickingMultiplier) {
    totalPoints *= 1.5;
  }
  if (enh.lawEnforcementVictimMultiplier) {
    totalPoints *= 2.0;
  }

  // Round to nearest tenth
  totalPoints = Math.round(totalPoints * 10) / 10;

  // Florida Statutory Sentence Formula:
  // If Total Points <= 44: Non-State Prison Sanction Eligible
  // If Total Points > 44: Prison Months = (Total Points - 28) * 0.75
  const isPrisonPermissible = totalPoints > 44;
  let lowestPermissibleSentenceMonths = 0;
  let lowestPermissibleSentenceYears = "0.0 Years (Non-Prison Sanction Eligible)";

  if (isPrisonPermissible) {
    const rawMonths = (totalPoints - 28) * 0.75;
    lowestPermissibleSentenceMonths = Math.round(rawMonths * 10) / 10;
    const years = (lowestPermissibleSentenceMonths / 12).toFixed(1);
    lowestPermissibleSentenceYears = `${years} Years (${lowestPermissibleSentenceMonths} Months)`;
  }

  // Statutory Maximums
  const maxYearsMap: Record<string, number> = {
    '3rd_degree': 5,
    '2nd_degree': 15,
    '1st_degree': 30,
    '1st_degree_life': 30, // Or life
    'life': 999, // Life
    'capital': 999, // Capital
    '1st_deg_misd': 1,
  };

  const primaryMax = maxYearsMap[state.primaryOffense.degree] || 5;
  let statutoryMaxYears = primaryMax;
  
  // Additional offenses max (if consecutive)
  state.additionalOffenses.forEach(off => {
    statutoryMaxYears += (maxYearsMap[off.degree] || 5) * (off.counts || 1);
  });

  const statutoryMaxMonths = statutoryMaxYears * 12;
  const maxSentenceSummary = statutoryMaxYears >= 999 
    ? "Life Incarceration / Capital" 
    : `${statutoryMaxYears} Years (${statutoryMaxMonths} Months Max Statutory Exposure)`;

  return {
    primaryPoints: Math.round(primaryPoints * 10) / 10,
    additionalPoints: Math.round(additionalPoints * 10) / 10,
    victimInjuryPoints: Math.round(victimInjuryPoints * 10) / 10,
    priorRecordPoints: Math.round(priorRecordPoints * 10) / 10,
    legalStatusPoints,
    communitySanctionPoints,
    enhancementPoints,
    subtotalPoints: Math.round(subtotalPoints * 10) / 10,
    totalPoints,
    isPrisonPermissible,
    lowestPermissibleSentenceMonths,
    lowestPermissibleSentenceYears,
    statutoryMaxYears,
    statutoryMaxMonths,
    maxSentenceSummary,
  };
}

export const DEFAULT_SCORESHEET_STATE: ScoresheetState = {
  defendantName: "Pending / Defendant",
  courtCaseNumber: "05-2025-CF-028419-AXXX-XX",
  county: "Brevard (Titusville/Viera) - 18th Circuit",
  judgeName: "Hon. Charles G. Crawford",
  attorneyName: "Defense Counsel of Record",
  primaryOffense: {
    id: "off-prim-1",
    statute: "§ 810.02(3)",
    description: "Burglary of Unoccupied Dwelling",
    degree: "2nd_degree",
    level: 6,
    counts: 1,
  },
  additionalOffenses: [
    {
      id: "off-add-1",
      statute: "§ 812.014(2)(c)",
      description: "Grand Theft ($750 - $5,000)",
      degree: "3rd_degree",
      level: 2,
      counts: 1,
    }
  ],
  victimInjury: {
    secondDegreeMurder: 0,
    death: 0,
    severe: 0,
    moderate: 0,
    slight: 0,
    sexPenetration: 0,
    sexContact: 0,
  },
  priorRecord: {
    level1: 0,
    level2: 1,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0,
    level10: 0,
    misdemeanors: 2,
  },
  legalStatus: {
    active: false,
    description: "",
  },
  communitySanctions: {
    technicalCount: 0,
    newMisdemeanorCount: 0,
    newFelonyCount: 0,
  },
  enhancements: {
    firearm: false,
    semiautomaticOrMachineGun: false,
    priorSeriousFelony: false,
    drugTraffickingMultiplier: false,
    lawEnforcementVictimMultiplier: false,
  },
  departures: INITIAL_DOWNWARD_DEPARTURES,
};

export function generatePrintableScoresheetText(
  state: ScoresheetState, 
  totals: ScoresheetCalculatedTotals
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return `STATE OF FLORIDA - CRIMINAL PUNISHMENT CODE SCORESHEET
RULE 3.992(a), FLORIDA RULES OF CRIMINAL PROCEDURE & § 921.0024, FLA. STAT.
================================================================================
PREPARED FOR: ${state.defendantName.toUpperCase()}
CASE NUMBER: ${state.courtCaseNumber}
COUNTY / CIRCUIT: ${state.county.toUpperCase()}
PRESIDING JUDGE: ${state.judgeName}
DEFENSE COUNSEL: ${state.attorneyName}
DATE GENERATED: ${dateStr}
================================================================================

I. PRIMARY OFFENSE
--------------------------------------------------------------------------------
Statute: ${state.primaryOffense.statute}
Description: ${state.primaryOffense.description}
Felony Degree: ${state.primaryOffense.degree.replace('_', ' ').toUpperCase()}
Offense Severity Level: Level ${state.primaryOffense.level} (Base Points: ${PRIMARY_OFFENSE_POINTS[state.primaryOffense.level]})
Counts: ${state.primaryOffense.counts}
PRIMARY OFFENSE TOTAL POINTS: ${totals.primaryPoints.toFixed(1)}

II. ADDITIONAL OFFENSES
--------------------------------------------------------------------------------
${state.additionalOffenses.length === 0 ? "None logged." : state.additionalOffenses.map((o, idx) => 
  `(${idx + 1}) ${o.statute} - ${o.description} [Level ${o.level}, ${o.counts} count(s)] = ${(ADDITIONAL_OFFENSE_POINTS[o.level] * o.counts).toFixed(1)} pts`
).join('\n')}
ADDITIONAL OFFENSES TOTAL POINTS: ${totals.additionalPoints.toFixed(1)}

III. VICTIM INJURY POINTS
--------------------------------------------------------------------------------
- Second-Degree Murder (240 pts): ${state.victimInjury.secondDegreeMurder}
- Death (120 pts): ${state.victimInjury.death}
- Severe Injury (40 pts): ${state.victimInjury.severe}
- Moderate Injury (18 pts): ${state.victimInjury.moderate}
- Slight Injury (4 pts): ${state.victimInjury.slight}
- Sexual Penetration (80 pts): ${state.victimInjury.sexPenetration}
- Sexual Contact (40 pts): ${state.victimInjury.sexContact}
VICTIM INJURY TOTAL POINTS: ${totals.victimInjuryPoints.toFixed(1)}

IV. PRIOR RECORD POINTS
--------------------------------------------------------------------------------
- Felony Priors: Levels 1-10: [L1: ${state.priorRecord.level1}, L2: ${state.priorRecord.level2}, L3: ${state.priorRecord.level3}, L4: ${state.priorRecord.level4}, L5: ${state.priorRecord.level5}, L6: ${state.priorRecord.level6}, L7: ${state.priorRecord.level7}, L8: ${state.priorRecord.level8}, L9: ${state.priorRecord.level9}, L10: ${state.priorRecord.level10}]
- Prior Misdemeanors (0.2 pts ea): ${state.priorRecord.misdemeanors}
PRIOR RECORD TOTAL POINTS: ${totals.priorRecordPoints.toFixed(1)}

V. LEGAL STATUS VIOLATION POINTS
--------------------------------------------------------------------------------
Status Active (4 pts): ${state.legalStatus.active ? "YES (+4.0 Points)" : "NO (0.0 Points)"}
${state.legalStatus.description ? `Details: ${state.legalStatus.description}` : ""}

VI. COMMUNITY SANCTION VIOLATIONS
--------------------------------------------------------------------------------
- Technical Violations (6 pts ea): ${state.communitySanctions.technicalCount}
- New Misdemeanor Violations (12 pts ea): ${state.communitySanctions.newMisdemeanorCount}
- New Felony Violations (24 pts ea): ${state.communitySanctions.newFelonyCount}
COMMUNITY SANCTION TOTAL POINTS: ${totals.communitySanctionPoints.toFixed(1)}

VII. SENTENCING ENHANCEMENTS
--------------------------------------------------------------------------------
- Firearm (§ 775.087): ${state.enhancements.firearm ? "YES (+18.0 pts)" : "NO"}
- Semiautomatic / Machine Gun: ${state.enhancements.semiautomaticOrMachineGun ? "YES (+25.0 pts)" : "NO"}
- Prior Serious Felony (§ 921.0024(1)(b)): ${state.enhancements.priorSeriousFelony ? "YES (+30.0 pts)" : "NO"}
- Drug Trafficking Multiplier (1.5x): ${state.enhancements.drugTraffickingMultiplier ? "ACTIVE" : "NONE"}
- Law Enforcement Victim Multiplier (2.0x): ${state.enhancements.lawEnforcementVictimMultiplier ? "ACTIVE" : "NONE"}

================================================================================
SENTENCE CALCULATION SUMMARY (§ 921.0024(2), FLA. STAT.)
================================================================================
TOTAL SENTENCE POINTS: ${totals.totalPoints.toFixed(1)} POINTS

STATUTORY SENTENCE CLASSIFICATION:
${totals.isPrisonPermissible 
  ? `>>> MANDATORY STATE PRISON THRESHOLD MET (> 44.0 POINTS) <<<
Formula: (Total Points - 28) x 0.75
LOWEST PERMISSIBLE SENTENCE: ${totals.lowestPermissibleSentenceMonths} PRISON MONTHS (${totals.lowestPermissibleSentenceYears})
(The judge cannot sentence below this threshold absent a statutory downward departure).`
  : `>>> NON-STATE PRISON SANCTION ELIGIBLE (<= 44.0 POINTS) <<<
The court may legally impose any non-state prison sanction, including county jail 
(up to 364 days), probation, community control, or deferred prosecution.`}

MAXIMUM STATUTORY EXPOSURE:
${totals.maxSentenceSummary}

================================================================================
STATUTORY DOWNWARD DEPARTURE GROUNDS (FLA. STAT. § 921.0026)
================================================================================
${state.departures.filter(d => d.checked).length === 0 
  ? "No statutory departure grounds asserted on this draft." 
  : state.departures.filter(d => d.checked).map(d => 
      `[*] ${d.statute} - ${d.title}\n    ${d.description}${d.notes ? `\n    Defense factual basis: ${d.notes}` : ''}`
    ).join('\n\n')}

================================================================================
NOTICE: This scoresheet computation is prepared for defense case management and 
evidentiary review within Project Innocence. Official scoresheets must be signed 
by the Assistant State Attorney, Defense Counsel, and the Presiding Judge.
================================================================================`;
}
