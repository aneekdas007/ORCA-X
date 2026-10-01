import { DEMO_SCENARIOS } from '../data/demoScenarios';
import type { DemoScenario, WorkflowStep } from '../types';

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
 * Normalizes query string for robust deterministic matching
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Matches a natural language query to one of the three deterministic demonstration scenarios.
 * Returns null if the query does not correspond to any supported demo scenario.
 */
export function matchQueryToScenario(query: string): DemoScenario | null {
  const normalized = normalizeQuery(query);

  if (!normalized) return null;

  // Scenario 1: Fishing Safety — Paradip, Odisha
  const isScenario1 =
    normalized.includes('paradip') ||
    normalized.includes('fish') ||
    normalized.includes('fishing') ||
    normalized.includes('angler') ||
    normalized.includes('catch') ||
    DEMO_SCENARIOS.scenario1.queryAliases.some(alias => normalized.includes(normalizeQuery(alias)));

  if (isScenario1 && !normalized.includes('kochi') && !normalized.includes('visakhapatnam') && !normalized.includes('vizag')) {
    return DEMO_SCENARIOS.scenario1;
  }

  // Scenario 2: Vessel Route Comparison — Kochi, Kerala
  const isScenario2 =
    normalized.includes('kochi') ||
    normalized.includes('cochin') ||
    normalized.includes('kerala') ||
    normalized.includes('route') ||
    normalized.includes('vessel') ||
    normalized.includes('corridor') ||
    normalized.includes('path') ||
    normalized.includes('transit') ||
    normalized.includes('travelling offshore') ||
    normalized.includes('traveling offshore') ||
    normalized.includes('navigation') ||
    DEMO_SCENARIOS.scenario2.queryAliases.some(alias => normalized.includes(normalizeQuery(alias)));

  if (isScenario2 && !normalized.includes('paradip') && !normalized.includes('visakhapatnam') && !normalized.includes('vizag')) {
    return DEMO_SCENARIOS.scenario2;
  }

  // Scenario 3: Marine Hazards — Visakhapatnam, Andhra Pradesh
  const isScenario3 =
    normalized.includes('visakhapatnam') ||
    normalized.includes('vizag') ||
    normalized.includes('hazard') ||
    normalized.includes('danger') ||
    normalized.includes('cyclone') ||
    normalized.includes('storm') ||
    normalized.includes('warning') ||
    normalized.includes('surge') ||
    DEMO_SCENARIOS.scenario3.queryAliases.some(alias => normalized.includes(normalizeQuery(alias)));

  if (isScenario3 && !normalized.includes('paradip') && !normalized.includes('kochi') && !normalized.includes('cochin')) {
    return DEMO_SCENARIOS.scenario3;
  }

  // Fallback if specific city was named:
  if (normalized.includes('paradip')) return DEMO_SCENARIOS.scenario1;
  if (normalized.includes('kochi') || normalized.includes('cochin')) return DEMO_SCENARIOS.scenario2;
  if (normalized.includes('visakhapatnam') || normalized.includes('vizag')) return DEMO_SCENARIOS.scenario3;

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
  onStepProgress?: WorkflowProgressCallback
): Promise<AnalysisResult> {
  const scenario = matchQueryToScenario(query);

  if (!scenario) {
    return {
      matched: false,
      query,
      rejectionMessage:
        'ORCA-X could not correlate this query with sufficient confidence in the requested coastal sector. Please specify a coastal area, time window, and marine operation (e.g. fishing safety, vessel routing, or hazard screening).'
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
