import { DEMO_SCENARIOS } from '../data/demoScenarios';
import type { DemoScenario, WorkflowStep, Language } from '../types';
import { UI_STRINGS } from '../utils/translations';

export interface AnalysisResult {
  matched: boolean;
  scenario?: DemoScenario;
  query: string;
  rejectionMessage?: string;
  suggestedQueries?: {
    id: string;
    label: string;
    query: string;
  }[];
}

export interface WorkflowProgressCallback {
  (currentStepIndex: number, currentStep: WorkflowStep, allSteps: WorkflowStep[]): void;
}

/**
 * Checks if a string contains Hindi / Devanagari characters
 */
export function isHindiText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Normalizes query string for robust deterministic matching, preserving Devanagari characters
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Hindi canonical and alias queries for each scenario
const HINDI_SCENARIO_ALIASES = {
  scenario1: [
    'क्या कल सुबह पारादीप के पास मछली पकड़ना सुरक्षित है',
    'क्या कल सुबह पारादीप के पास मछली पकड़ना सुरक्षित है?',
    'पारादीप मछली पकड़ना',
    'पारादीप मछली',
    'पारादीप मत्स्य',
    'पारादीप'
  ],
  scenario2: [
    'कल कोच्चि से समुद्र की ओर जाने वाले जहाज़ के लिए कौन सा मार्ग अधिक सुरक्षित रहेगा',
    'कल कोच्चि से समुद्र की ओर जाने वाले जहाज़ के लिए कौन सा मार्ग अधिक सुरक्षित रहेगा?',
    'कल कोच्चि से समुद्र की ओर जाने वाले जहाज के लिए कौन सा मार्ग अधिक सुरक्षित रहेगा',
    'कोच्चि जहाज़ मार्ग',
    'कोच्चि जहाज मार्ग',
    'कोच्चि मार्ग',
    'कोच्चि'
  ],
  scenario3: [
    'क्या कल विशाखापत्तनम के पास कोई महत्वपूर्ण समुद्री खतरा रहने की संभावना है',
    'क्या कल विशाखापत्तनम के पास कोई महत्वपूर्ण समुद्री खतरा रहने की संभावना है?',
    'विशाखापत्तनम समुद्री खतरा',
    'विशाखापत्तनम चक्रवात',
    'विशाखापत्तनम खतरा',
    'विशाखापत्तनम',
    'विज़ाग'
  ]
};

/**
 * Matches a natural language query to one of the three deterministic demonstration scenarios.
 * Returns null if the query does not correspond to any supported demo scenario.
 */
export function matchQueryToScenario(query: string): DemoScenario | null {
  const normalized = normalizeQuery(query);

  if (!normalized) return null;

  // Check Hindi exact or partial alias matches first
  if (HINDI_SCENARIO_ALIASES.scenario1.some(alias => normalized.includes(normalizeQuery(alias)))) {
    return DEMO_SCENARIOS.scenario1;
  }
  if (HINDI_SCENARIO_ALIASES.scenario2.some(alias => normalized.includes(normalizeQuery(alias)))) {
    return DEMO_SCENARIOS.scenario2;
  }
  if (HINDI_SCENARIO_ALIASES.scenario3.some(alias => normalized.includes(normalizeQuery(alias)))) {
    return DEMO_SCENARIOS.scenario3;
  }

  // Scenario 1: Fishing Safety — Paradip, Odisha
  const isScenario1 =
    normalized.includes('paradip') ||
    normalized.includes('पारादीप') ||
    normalized.includes('fish') ||
    normalized.includes('fishing') ||
    normalized.includes('angler') ||
    normalized.includes('catch') ||
    normalized.includes('मछली') ||
    normalized.includes('मत्स्य') ||
    DEMO_SCENARIOS.scenario1.queryAliases.some(alias => normalized.includes(normalizeQuery(alias)));

  if (
    isScenario1 &&
    !normalized.includes('kochi') &&
    !normalized.includes('कोच्चि') &&
    !normalized.includes('visakhapatnam') &&
    !normalized.includes('विशाखापत्तनम') &&
    !normalized.includes('vizag') &&
    !normalized.includes('विज़ाग')
  ) {
    return DEMO_SCENARIOS.scenario1;
  }

  // Scenario 2: Vessel Route Comparison — Kochi, Kerala
  const isScenario2 =
    normalized.includes('kochi') ||
    normalized.includes('कोच्चि') ||
    normalized.includes('cochin') ||
    normalized.includes('कोचीन') ||
    normalized.includes('kerala') ||
    normalized.includes('केरल') ||
    normalized.includes('route') ||
    normalized.includes('मार्ग') ||
    normalized.includes('vessel') ||
    normalized.includes('जहाज़') ||
    normalized.includes('जहाज') ||
    normalized.includes('corridor') ||
    normalized.includes('path') ||
    normalized.includes('transit') ||
    normalized.includes('travelling offshore') ||
    normalized.includes('traveling offshore') ||
    normalized.includes('navigation') ||
    normalized.includes('नौपरिवहन') ||
    DEMO_SCENARIOS.scenario2.queryAliases.some(alias => normalized.includes(normalizeQuery(alias)));

  if (
    isScenario2 &&
    !normalized.includes('paradip') &&
    !normalized.includes('पारादीप') &&
    !normalized.includes('visakhapatnam') &&
    !normalized.includes('विशाखापत्तनम') &&
    !normalized.includes('vizag') &&
    !normalized.includes('विज़ाग')
  ) {
    return DEMO_SCENARIOS.scenario2;
  }

  // Scenario 3: Marine Hazards — Visakhapatnam, Andhra Pradesh
  const isScenario3 =
    normalized.includes('visakhapatnam') ||
    normalized.includes('विशाखापत्तनम') ||
    normalized.includes('vizag') ||
    normalized.includes('विज़ाग') ||
    normalized.includes('hazard') ||
    normalized.includes('खतरा') ||
    normalized.includes('खतरे') ||
    normalized.includes('danger') ||
    normalized.includes('cyclone') ||
    normalized.includes('चक्रवात') ||
    normalized.includes('storm') ||
    normalized.includes('तूफान') ||
    normalized.includes('warning') ||
    normalized.includes('चेतावनी') ||
    normalized.includes('surge') ||
    DEMO_SCENARIOS.scenario3.queryAliases.some(alias => normalized.includes(normalizeQuery(alias)));

  if (
    isScenario3 &&
    !normalized.includes('paradip') &&
    !normalized.includes('पारादीप') &&
    !normalized.includes('kochi') &&
    !normalized.includes('कोच्चि') &&
    !normalized.includes('cochin') &&
    !normalized.includes('कोचीन')
  ) {
    return DEMO_SCENARIOS.scenario3;
  }

  // Fallback if specific city was named:
  if (normalized.includes('paradip') || normalized.includes('पारादीप')) return DEMO_SCENARIOS.scenario1;
  if (normalized.includes('kochi') || normalized.includes('cochin') || normalized.includes('कोच्चि') || normalized.includes('कोचीन')) return DEMO_SCENARIOS.scenario2;
  if (normalized.includes('visakhapatnam') || normalized.includes('vizag') || normalized.includes('विशाखापत्तनम') || normalized.includes('विज़ाग')) return DEMO_SCENARIOS.scenario3;

  return null;
}

export const SUGGESTED_DEMO_QUERIES = [
  {
    id: 'scenario1',
    label: 'Fishing safety',
    query: 'Is it safe to fish near Paradip tomorrow morning?'
  },
  {
    id: 'scenario2',
    label: 'Vessel route',
    query: 'Which route looks safer for a vessel travelling offshore from Kochi tomorrow?'
  },
  {
    id: 'scenario3',
    label: 'Marine hazards',
    query: 'Are there any significant marine hazards expected near Visakhapatnam tomorrow?'
  }
];

/**
 * Executes simulated agent analysis with animated workflow stages.
 */
export async function runMockAnalysis(
  query: string,
  onStepProgress?: WorkflowProgressCallback,
  language: Language = 'en'
): Promise<AnalysisResult> {
  const scenario = matchQueryToScenario(query);

  if (!scenario) {
    const isHindi = language === 'hi' || isHindiText(query);
    const rejectionMsg = isHindi ? UI_STRINGS.hi.rejectionMsg : UI_STRINGS.en.rejectionMsg;

    return {
      matched: false,
      query,
      rejectionMessage: rejectionMsg
    };
  }

  // Explicitly typed as WorkflowStep array so status mutations to 'in_progress' and 'completed' are allowed
  const steps: WorkflowStep[] = scenario.workflowSteps.map(s => ({ ...s, status: 'pending' }));
  const stepDelayMs = 280;

  for (let i = 0; i < steps.length; i++) {
    steps[i].status = 'in_progress';
    if (onStepProgress) {
      onStepProgress(i, steps[i], [...steps]);
    }

    await new Promise(resolve => setTimeout(resolve, stepDelayMs));

    steps[i].status = 'completed';
    if (onStepProgress) {
      onStepProgress(i, steps[i], [...steps]);
    }
  }

  return {
    matched: true,
    scenario,
    query
  };
}
