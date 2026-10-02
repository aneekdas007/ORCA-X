// ORCA-X Marine Intelligence Platform Types

export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface ConfidenceFactor {
  name: string;
  score: number; // 0 - 100
  weight: string;
  description: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  status: 'pending' | 'in_progress' | 'completed';
  timestamp?: string;
  detail: string;
  agentRole: 'orchestrator' | 'weather' | 'ocean' | 'geospatial' | 'risk' | 'synthesizer';
}

export interface ExtractedContext {
  intent: string;
  location: string;
  coordinates: string;
  timeWindow: string;
  activity: string;
  scope: string[];
}

export interface ChartDataPoint {
  time: string;
  waveHeight?: number; // meters
  windSpeed?: number;  // knots
  gustSpeed?: number;  // knots
  riskScore?: number;  // 0-100
  currentSpeed?: number; // knots
  [key: string]: string | number | undefined;
}

export interface RouteComparisonData {
  routeId: string;
  routeName: string;
  distanceNm: number;
  etaHours: number;
  overallRisk: 'LOW' | 'MODERATE' | 'ELEVATED';
  riskScore: number; // 0-100
  avgWaveHeight: number;
  maxWaveHeight: number;
  avgWindSpeed: number;
  maxWindGust: number;
  crossSeaRisk: 'Low' | 'Moderate' | 'High';
  recommendation: 'RECOMMENDED' | 'CAUTION_ADVISED' | 'AVOID';
  summary: string;
  coordinates: [number, number][]; // [lat, lng]
}

export interface HazardAlert {
  id: string;
  type: string;
  severity: 'Advisory' | 'Watch' | 'Warning';
  status: string;
  location: string;
  details: string;
  icon: string;
}

export interface EvidenceSource {
  id: string;
  sourceName: string;
  institution: string;
  dataType: string;
  sensor: string;
  timestamp: string;
  status: 'Synchronized' | 'Verified' | 'Simulated Feed';
  relevance: number; // 0-100
  reliability: number; // 0-100
  resolution: string;
  parameters: string[];
  snippet: string;
}

export interface AgentMessage {
  id: string;
  sender: 'Orchestrator' | 'Weather Agent' | 'Ocean Agent' | 'Geospatial Agent' | 'Risk Engine' | 'Response Synthesizer';
  recipient: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'processing' | 'verified';
}

export interface DemoScenario {
  id: string;
  title: string;
  chipLabel: string;
  canonicalQuery: string;
  queryAliases: string[];
  context: ExtractedContext;
  riskLevel: RiskLevel;
  riskScore: number;
  riskSummary: string;
  confidence: number;
  confidenceFactors: ConfidenceFactor[];
  headline: string;
  executiveSummary: string;
  recommendation: string;
  keyFindings: string[];
  workflowSteps: WorkflowStep[];
  agentDialogue?: AgentMessage[];
  evidence: EvidenceSource[];
  chartData: ChartDataPoint[];
  chartType: 'wave_wind_time' | 'route_comparison' | 'hazard_timeline';
  routeData?: RouteComparisonData[];
  hazards?: HazardAlert[];
  mapCenter: [number, number]; // [lat, lng]
  mapZoom: number;
}

export type Language = 'en' | 'hi';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isUnknownQuery?: boolean;
  scenarioId?: string;
}

export interface SessionConversation {
  id: string;
  title: string;
  titleHi: string;
  query: string;
  scenarioId?: string;
  scenario?: DemoScenario | null;
  messages: ChatMessageItem[];
  createdAt: number;
}

