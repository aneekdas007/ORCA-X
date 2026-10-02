import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Header/Navbar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatPanel } from './components/Chat/ChatPanel';
import { BrandLogo } from './components/Common/BrandLogo';
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
import type { DemoScenario, WorkflowStep, Language, ChatMessageItem, SessionConversation } from './types';
import { runMockAnalysis, isHindiText } from './services/mockAnalysisService';
import { soundFX } from './utils/audio';
import { getUIText, SCENARIO_TRANSLATIONS } from './utils/translations';
import { 
  Send,
  Map as MapIcon, 
  BarChart3, 
  Database, 
  Sparkles, 
  LayoutDashboard, 
  Printer,
  FileCode2
} from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-a');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'summary' | 'map' | 'charts' | 'evidence'>('all');
  const [startupInput, setStartupInput] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Session-only conversation history
  const [conversations, setConversations] = useState<SessionConversation[]>(() => {
    try {
      const stored = sessionStorage.getItem('orcax_session_conversations');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Graceful fallback
    }
    return [];
  });

  // Current active conversation messages (starts completely empty)
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);

  // Sync conversations to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('orcax_session_conversations', JSON.stringify(conversations));
    } catch {
      // Ignore
    }
  }, [conversations]);

  const ui = getUIText(language);

  // Determine whether we are in State A (Clean Conversational Startup) or State B (Active Analysis)
  const isStateA = !activeScenario && !isProcessing && messages.length === 0;

  const handleSendMessage = async (queryText: string) => {
    if (isProcessing || !queryText.trim()) return;

    soundFX.playClick();

    // Check if query is in Hindi
    const isHindiQuery = language === 'hi' || isHindiText(queryText);

    // Add user message to chat
    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsProcessing(true);

    // Initial workflow placeholder
    const initialSteps = DEMO_SCENARIOS.scenario1.workflowSteps.map(s => ({
      ...s,
      status: 'pending' as const
    }));
    setWorkflowSteps(initialSteps);
    setActiveStepIndex(0);

    try {
      const result = await runMockAnalysis(
        queryText, 
        (stepIdx, _currentStep, allSteps) => {
          setActiveStepIndex(stepIdx);
          setWorkflowSteps(allSteps);
          soundFX.playSonarPing();
        },
        language
      );

      if (result.matched && result.scenario) {
        const scenario = result.scenario;
        setActiveScenario(scenario);
        setSelectedRouteId('route-a');
        soundFX.playCompletionChime();

        // Localized responses
        const localized = SCENARIO_TRANSLATIONS[scenario.id];
        const headline = isHindiQuery && localized ? localized.headlineHi : scenario.headline;
        const summary = isHindiQuery && localized ? localized.executiveSummaryHi : scenario.executiveSummary;
        const recommendation = isHindiQuery && localized ? localized.recommendationHi : scenario.recommendation;

        const assistantMsg: ChatMessageItem = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `[${headline}]\n\n${summary}\n\n${isHindiQuery ? 'परामर्श' : 'Recommendation'}: ${recommendation}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          scenarioId: scenario.id
        };

        const updatedMessages = [...newMessages, assistantMsg];
        setMessages(updatedMessages);

        // Derive titles
        const titleEn = localized?.titleEn || scenario.title;
        const titleHi = localized?.titleHi || scenario.title;

        // Save or update conversation in session history
        const convId = activeConversationId || `conv-${Date.now()}`;
        const newConversation: SessionConversation = {
          id: convId,
          title: titleEn,
          titleHi: titleHi,
          query: queryText,
          scenarioId: scenario.id,
          scenario: scenario,
          messages: updatedMessages,
          createdAt: Date.now()
        };

        setActiveConversationId(convId);
        setConversations(prev => {
          const filtered = prev.filter(c => c.id !== convId);
          return [newConversation, ...filtered];
        });
      } else {
        // Unknown query fallback
        const rejectionMsg: ChatMessageItem = {
          id: `reject-${Date.now()}`,
          sender: 'assistant',
          text: result.rejectionMessage || ui.rejectionMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUnknownQuery: true
        };

        const updatedMessages = [...newMessages, rejectionMsg];
        setMessages(updatedMessages);

        const convId = activeConversationId || `conv-${Date.now()}`;
        const fallbackConv: SessionConversation = {
          id: convId,
          title: ui.fallbackQueryTitle,
          titleHi: 'समुद्री परामर्श प्रश्न',
          query: queryText,
          scenarioId: undefined,
          scenario: null,
          messages: updatedMessages,
          createdAt: Date.now()
        };

        setActiveConversationId(convId);
        setConversations(prev => {
          const filtered = prev.filter(c => c.id !== convId);
          return [fallbackConv, ...filtered];
        });
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupInput.trim() || isProcessing) return;
    const q = startupInput.trim();
    setStartupInput('');
    handleSendMessage(q);
  };

  // "+ New Marine Query" Action: Returns to State A while preserving session history
  const handleNewMarineQuery = () => {
    soundFX.playClick();
    setActiveScenario(null);
    setActiveConversationId(null);
    setMessages([]);
    setIsProcessing(false);
    setActiveStepIndex(0);
    setWorkflowSteps([]);
    setSelectedRouteId('route-a');
    setActiveTab('all');
    setStartupInput('');
    setIsMobileSidebarOpen(false);
  };

  // Restore past conversation from history without re-running animations
  const handleSelectConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    soundFX.playClick();
    setActiveConversationId(conv.id);
    setMessages(conv.messages);
    setActiveScenario(conv.scenario || null);
    setWorkflowSteps(conv.scenario ? conv.scenario.workflowSteps : []);
    setActiveStepIndex(conv.scenario ? conv.scenario.workflowSteps.length - 1 : 0);
    setIsProcessing(false);
    setSelectedRouteId('route-a');
    setActiveTab('all');
    setIsMobileSidebarOpen(false);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.isMuted = nextMuted;
  };

  const getActiveSectorName = () => {
    if (!activeScenario) return undefined;
    if (activeScenario.id === 'scenario1') return language === 'hi' ? 'पारादीप' : 'Paradip';
    if (activeScenario.id === 'scenario2') return language === 'hi' ? 'कोच्चि' : 'Kochi';
    if (activeScenario.id === 'scenario3') return language === 'hi' ? 'विशाखापत्तनम' : 'Visakhapatnam';
    return undefined;
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#18303F] flex flex-col font-sans selection:bg-[#DCEAF2] overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenAbout={() => setIsAboutOpen(true)}
        isProcessing={isProcessing}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        hasActiveScenario={!!activeScenario}
        activeSectorLabel={getActiveSectorName()}
        onOpenAdvisory={() => setIsAdvisoryOpen(true)}
        onOpenDialogue={() => setIsDialogueOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1720px] w-full mx-auto min-w-0">
        {/* Left Sidebar: Session Conversation History */}
        <Sidebar
          onNewQuery={handleNewMarineQuery}
          isProcessing={isProcessing}
          onOpenAbout={() => setIsAboutOpen(true)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          language={language}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Central & Right Workspaces */}
        {isStateA ? (
          /* ========================================================
             STATE A: INITIAL STARTUP / EMPTY CONVERSATIONAL STATE
             ======================================================== */
          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto bg-[#F7F9FA] min-w-0">
            <div className="max-w-2xl w-full text-center space-y-6 animate-fade-in my-auto py-8 px-2">
              {/* Brand Mark */}
              <div className="flex justify-center">
                <BrandLogo size="xl" />
              </div>

              {/* Conversational Headline & Prompt */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#12304A] tracking-tight break-words">
                  {ui.emptyHeadline}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-[#61717D] leading-relaxed max-w-lg mx-auto break-words">
                  {ui.emptySubtitle}
                </p>
              </div>

              {/* Prominent Conversational Input Box */}
              <form onSubmit={handleStartupSubmit} className="w-full relative pt-2">
                <div className="relative flex items-center shadow-xs rounded-xl border border-[#D9E2E8] bg-white focus-within:border-[#21618C] focus-within:ring-2 focus-within:ring-[#21618C]/20 transition-all min-w-0">
                  <input
                    type="text"
                    value={startupInput}
                    onChange={(e) => setStartupInput(e.target.value)}
                    disabled={isProcessing}
                    placeholder={ui.inputPlaceholder}
                    autoFocus
                    className="w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-3.5 sm:py-4 rounded-xl bg-transparent text-xs sm:text-sm text-[#18303F] placeholder-[#7A93A6] outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={!startupInput.trim() || isProcessing}
                    className="absolute right-2 p-2 sm:p-2.5 rounded-lg bg-[#21618C] hover:bg-[#1B5074] text-white disabled:opacity-40 transition-colors cursor-pointer shadow-xs shrink-0"
                    title="Send query"
                    aria-label="Send marine query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Subdued Product Identity Note */}
              <p className="text-[11px] sm:text-xs text-[#7A93A6] pt-2">
                {ui.emptyDisclaimer}
              </p>
            </div>
          </main>
        ) : (
          /* ========================================================
             STATE B: POST-QUERY / ACTIVE ANALYSIS DASHBOARD
             ======================================================== */
          <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-w-0 bg-[#F7F9FA]">
            {/* Left Column in Main: Chat Interface */}
            <div className="w-full lg:w-[320px] xl:w-[360px] 2xl:w-[400px] shrink-0 p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-[#D9E2E8] flex flex-col h-[460px] lg:h-[calc(100vh-62px)] min-w-0">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                language={language}
              />
            </div>

            {/* Right Column in Main: Intelligence & GIS Dashboard */}
            <div className="@container flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 min-w-0 h-auto lg:h-[calc(100vh-62px)]">
              {/* Workflow Visualizer during processing or when scenario is active */}
              {(isProcessing || activeScenario) && (
                <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl">
                  <WorkflowVisualizer
                    steps={workflowSteps.length > 0 ? workflowSteps : (activeScenario?.workflowSteps || [])}
                    isProcessing={isProcessing}
                    activeStepIndex={activeStepIndex}
                  />
                </div>
              )}

              {/* Populated Scenario Results */}
              {activeScenario && !isProcessing && (
                <div className="space-y-4 animate-fade-in min-w-0">
                  {/* Dashboard Tabs Selector */}
                  <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#D9E2E8] gap-2 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs max-w-full pb-1 sm:pb-0 min-w-0">
                      <button
                        onClick={() => setActiveTab('all')}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === 'all'
                            ? 'bg-[#21618C] text-white shadow-xs'
                            : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>{ui.fullDashboard}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('summary')}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === 'summary'
                            ? 'bg-[#21618C] text-white shadow-xs'
                            : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{ui.intelSynthesis}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('map')}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === 'map'
                            ? 'bg-[#21618C] text-white shadow-xs'
                            : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                        }`}
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span>{ui.hydroMap}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('charts')}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === 'charts'
                            ? 'bg-[#21618C] text-white shadow-xs'
                            : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{ui.marineAnalytics}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('evidence')}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeTab === 'evidence'
                            ? 'bg-[#21618C] text-white shadow-xs'
                            : 'bg-[#FFFFFF] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{ui.observationFeeds}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        onClick={() => setIsDialogueOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EBF3F7] hover:bg-[#DCEAF2] text-[#12304A] border border-[#B5D2E2] text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        <FileCode2 className="w-3 h-3 text-[#21618C] shrink-0" />
                        <span className="hidden sm:inline">{ui.agentTrace}</span>
                      </button>
                      <button
                        onClick={() => setIsAdvisoryOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#21618C] hover:bg-[#1B5074] text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                      >
                        <Printer className="w-3 h-3 text-[#DCEAF2] shrink-0" />
                        <span className="hidden sm:inline">{ui.printAdvisory}</span>
                      </button>
                    </div>
                  </div>

                  {/* TAB CONTENT: Summary */}
                  {(activeTab === 'all' || activeTab === 'summary') && (
                    <div className="space-y-4 min-w-0">
                      {/* Natural Language Extracted Context */}
                      <ContextExtractionCard context={activeScenario.context} />

                      {/* Executive Final Briefing */}
                      <FinalSummaryCard
                        headline={language === 'hi' && SCENARIO_TRANSLATIONS[activeScenario.id] ? SCENARIO_TRANSLATIONS[activeScenario.id].headlineHi : activeScenario.headline}
                        executiveSummary={language === 'hi' && SCENARIO_TRANSLATIONS[activeScenario.id] ? SCENARIO_TRANSLATIONS[activeScenario.id].executiveSummaryHi : activeScenario.executiveSummary}
                        recommendation={language === 'hi' && SCENARIO_TRANSLATIONS[activeScenario.id] ? SCENARIO_TRANSLATIONS[activeScenario.id].recommendationHi : activeScenario.recommendation}
                        keyFindings={activeScenario.keyFindings}
                        riskLevel={activeScenario.riskLevel}
                      />

                      {/* Risk & Confidence Dual Grid */}
                      <div className="grid grid-cols-1 @min-[960px]:grid-cols-2 gap-4 min-w-0">
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
        )}
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
