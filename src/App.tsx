import { useState } from 'react';
import { Navbar } from './components/Header/Navbar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatPanel } from './components/Chat/ChatPanel';
import type { ChatMessageItem } from './components/Chat/ChatPanel';
import { WorkflowVisualizer } from './components/Workflow/WorkflowVisualizer';
import { ContextExtractionCard } from './components/Analysis/ContextExtractionCard';
import { RiskCard } from './components/Analysis/RiskCard';
import { ConfidenceCard } from './components/Analysis/ConfidenceCard';
import { FinalSummaryCard } from './components/Analysis/FinalSummaryCard';
import { MarineMap } from './components/Map/MarineMap';
import { MarineCharts } from './components/Charts/MarineCharts';
import { EvidencePanel } from './components/Evidence/EvidencePanel';
import { AboutModal } from './components/Modals/AboutModal';
import { AgentDialogueModal } from './components/Workflow/AgentDialogueModal';
import { ExportAdvisoryModal } from './components/Modals/ExportAdvisoryModal';
import { DEMO_SCENARIOS } from './data/demoScenarios';
import type { DemoScenario, WorkflowStep } from './types';
import { runMockAnalysis } from './services/mockAnalysisService';
import { soundFX } from './utils/audio';
import { 
  Compass, 
  Map as MapIcon, 
  BarChart3, 
  Database, 
  Sparkles, 
  LayoutDashboard, 
  ArrowLeft,
  Printer,
  FileCode2
} from 'lucide-react';

export function App() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-a');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'summary' | 'map' | 'charts' | 'evidence'>('all');

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Welcome to ORCA-X, the Marine Intelligence Platform developed for SIH Problem Statement SIH26176 (supported by ISRO).\n\nAsk questions about coastal sea conditions, fishing safety, vessel navigation corridors, or marine hazards in natural language. ORCA-X dynamically extracts location, time horizon, and operational intent to orchestrate specialist agents.',
      timestamp: 'Just now'
    }
  ]);

  const handleSendMessage = async (queryText: string) => {
    if (isProcessing || !queryText.trim()) return;

    soundFX.playClick();
    // Add user message to chat
    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    // Initial workflow placeholder
    const initialSteps = DEMO_SCENARIOS.scenario1.workflowSteps.map(s => ({
      ...s,
      status: 'pending' as const
    }));
    setWorkflowSteps(initialSteps);
    setActiveStepIndex(0);

    try {
      const result = await runMockAnalysis(queryText, (stepIdx, _currentStep, allSteps) => {
        setActiveStepIndex(stepIdx);
        setWorkflowSteps(allSteps);
        soundFX.playSonarPing();
      });

      if (result.matched && result.scenario) {
        setActiveScenario(result.scenario);
        setSelectedRouteId('route-a');
        soundFX.playCompletionChime();

        const assistantMsg: ChatMessageItem = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `[${result.scenario.headline}]\n\n${result.scenario.executiveSummary}\n\nRecommendation: ${result.scenario.recommendation}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          scenarioId: result.scenario.id
        };

        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Unknown query fallback
        const rejectionMsg: ChatMessageItem = {
          id: `reject-${Date.now()}`,
          sender: 'assistant',
          text: result.rejectionMessage || 'ORCA-X could not correlate this query with sufficient confidence in the requested coastal sector. Please specify a coastal area, time window, and marine operation (e.g. fishing safety, vessel routing, or hazard screening).',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUnknownQuery: true
        };

        setMessages(prev => [...prev, rejectionMsg]);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    soundFX.playClick();
    setActiveScenario(null);
    setIsProcessing(false);
    setActiveStepIndex(0);
    setWorkflowSteps([]);
    setSelectedRouteId('route-a');
    setActiveTab('all');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Session reset. Ready for a marine intelligence query. Inquire about coastal sea states, navigational routing, or marine hazards.',
        timestamp: 'Just now'
      }
    ]);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.isMuted = nextMuted;
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#18303F] flex flex-col font-sans selection:bg-[#DCEAF2]">
      {/* Top Navbar */}
      <Navbar
        onReset={handleReset}
        onOpenAbout={() => setIsAboutOpen(true)}
        isProcessing={isProcessing}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        hasActiveScenario={!!activeScenario}
        activeSectorLabel={activeScenario ? (activeScenario.id === 'scenario1' ? 'Paradip' : activeScenario.id === 'scenario2' ? 'Kochi' : 'Visakhapatnam') : undefined}
        onOpenAdvisory={() => setIsAdvisoryOpen(true)}
        onOpenDialogue={() => setIsDialogueOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1720px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          onReset={handleReset}
          isProcessing={isProcessing}
          onOpenAbout={() => setIsAboutOpen(true)}
          activeScenario={activeScenario}
        />

        {/* Central & Right Workspaces */}
        <main className="flex-1 flex flex-col xl:flex-row overflow-y-auto lg:overflow-hidden min-w-0 bg-[#F7F9FA]">
          {/* Left Column in Main: Chat Interface */}
          <div className="w-full xl:w-[460px] 2xl:w-[500px] shrink-0 p-4 border-r border-[#D9E2E8] flex flex-col h-auto xl:h-[calc(100vh-62px)]">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Column in Main: Intelligence & GIS Dashboard */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 h-auto xl:h-[calc(100vh-62px)]">
            {/* When No Scenario is active yet — Clean, Confident Product Home Screen */}
            {!activeScenario && !isProcessing && (
              <div className="h-full min-h-[480px] flex flex-col items-center justify-center p-8 text-center space-y-6 rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] shadow-xs">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#EBF3F7] border border-[#DCEAF2] text-[#21618C] shadow-xs">
                  <Compass className="w-7 h-7" />
                </div>

                <div className="max-w-xl space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
                    ORCA-X
                  </h1>
                  <div className="text-sm font-semibold text-[#21618C]">
                    Marine Intelligence Platform
                  </div>
                  <p className="text-xs text-[#61717D] leading-relaxed max-w-lg mx-auto pt-1">
                    Autonomous marine analysis and deterministic risk assessment for coastal operations, port navigation, and fisheries.
                  </p>
                </div>

                {/* Surveillance Standby Status Card */}
                <div className="w-full max-w-md p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E2E8] text-left space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E5EDF2]">
                    <span className="font-semibold text-[#18303F] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1E824C] animate-pulse"></span>
                      Surveillance Active • Standby Mode
                    </span>
                    <span className="font-mono text-[10px] text-[#61717D]">Zone: Indian Coastal Waters</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-white border border-[#D9E2E8]">
                      <div className="text-[#61717D] text-[10px]">Observation Layer</div>
                      <div className="font-semibold text-[#18303F]">ISRO Satellites / Radar Grid</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#D9E2E8]">
                      <div className="text-[#61717D] text-[10px]">Numerical Wave Model</div>
                      <div className="font-semibold text-[#18303F]">INCOIS SWAN 0.05°</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#21618C] p-2.5 rounded-lg bg-[#EBF3F7] border border-[#DCEAF2] font-medium">
                    <ArrowLeft className="w-4 h-4 shrink-0 text-[#21618C]" />
                    <span>Enter your query in the Intelligence Assistant to initiate analysis.</span>
                  </div>
                </div>

                {/* Subdued Sector Information Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#61717D]">
                  <span className="px-2.5 py-1 rounded bg-[#F7F9FA] border border-[#E5EDF2]">
                    Surveillance: Coastal Maritime Zones & EEZ
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#F7F9FA] border border-[#E5EDF2]">
                    ISRO Oceansat-3 Stream Synced
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#F7F9FA] border border-[#E5EDF2]">
                    INCOIS SWAN Wave Model Active
                  </span>
                </div>
              </div>
            )}

            {/* Workflow Visualizer during processing or when scenario is active */}
            {(isProcessing || activeScenario) && (
              <WorkflowVisualizer
                steps={workflowSteps.length > 0 ? workflowSteps : (activeScenario?.workflowSteps || [])}
                isProcessing={isProcessing}
                activeStepIndex={activeStepIndex}
              />
            )}

            {/* Populated Scenario Results */}
            {activeScenario && !isProcessing && (
              <div className="space-y-4 animate-fade-in">
                {/* Dashboard Tabs Selector */}
                <div className="flex items-center justify-between pb-2 border-b border-[#D9E2E8]">
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'all'
                          ? 'bg-[#21618C] text-white shadow-xs'
                          : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Full Dashboard</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'summary'
                          ? 'bg-[#21618C] text-white shadow-xs'
                          : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Intelligence Synthesis</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('map')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'map'
                          ? 'bg-[#21618C] text-white shadow-xs'
                          : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Hydrographic Map</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('charts')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'charts'
                          ? 'bg-[#21618C] text-white shadow-xs'
                          : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Marine Analytics</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('evidence')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'evidence'
                          ? 'bg-[#21618C] text-white shadow-xs'
                          : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Observation Feeds</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDialogueOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EBF3F7] hover:bg-[#DCEAF2] text-[#12304A] border border-[#B5D2E2] text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      <FileCode2 className="w-3 h-3 text-[#21618C]" />
                      <span className="hidden md:inline">Agent Trace</span>
                    </button>
                    <button
                      onClick={() => setIsAdvisoryOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#21618C] hover:bg-[#1B5074] text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      <Printer className="w-3 h-3 text-[#DCEAF2]" />
                      <span className="hidden md:inline">Print Advisory</span>
                    </button>
                  </div>
                </div>

                {/* TAB CONTENT: Summary */}
                {(activeTab === 'all' || activeTab === 'summary') && (
                  <div className="space-y-4">
                    {/* Natural Language Extracted Context */}
                    <ContextExtractionCard context={activeScenario.context} />

                    {/* Executive Final Briefing */}
                    <FinalSummaryCard
                      headline={activeScenario.headline}
                      executiveSummary={activeScenario.executiveSummary}
                      recommendation={activeScenario.recommendation}
                      keyFindings={activeScenario.keyFindings}
                      riskLevel={activeScenario.riskLevel}
                    />

                    {/* Risk & Confidence Dual Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <RiskCard
                        riskLevel={activeScenario.riskLevel}
                        riskScore={activeScenario.riskScore}
                        riskSummary={activeScenario.riskSummary}
                        scenarioId={activeScenario.id}
                        routeData={activeScenario.routeData}
                        selectedRouteId={selectedRouteId}
                        onSelectRoute={(id) => setSelectedRouteId(id)}
                      />

                      <ConfidenceCard
                        confidence={activeScenario.confidence}
                        factors={activeScenario.confidenceFactors}
                      />
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Map */}
                {(activeTab === 'all' || activeTab === 'map') && (
                  <MarineMap
                    scenarioId={activeScenario.id}
                    routeData={activeScenario.routeData}
                    selectedRouteId={selectedRouteId}
                    onSelectRoute={(id) => setSelectedRouteId(id)}
                  />
                )}

                {/* TAB CONTENT: Charts */}
                {(activeTab === 'all' || activeTab === 'charts') && (
                  <MarineCharts scenario={activeScenario} />
                )}

                {/* TAB CONTENT: Evidence */}
                {(activeTab === 'all' || activeTab === 'evidence') && (
                  <EvidencePanel sources={activeScenario.evidence} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* About ORCA-X Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Agent Dialogue Trace Modal */}
      {activeScenario && (
        <AgentDialogueModal
          isOpen={isDialogueOpen}
          onClose={() => setIsDialogueOpen(false)}
          dialogue={activeScenario.agentDialogue}
          scenarioTitle={activeScenario.title}
        />
      )}

      {/* Export Official Marine Advisory Modal */}
      {activeScenario && (
        <ExportAdvisoryModal
          isOpen={isAdvisoryOpen}
          onClose={() => setIsAdvisoryOpen(false)}
          scenario={activeScenario}
        />
      )}
    </div>
  );
}

export default App;
