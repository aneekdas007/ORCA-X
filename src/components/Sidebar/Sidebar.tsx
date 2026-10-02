import React from 'react';
import { 
  PlusCircle, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Compass,
  CheckCircle2,
  X
} from 'lucide-react';
import type { SessionConversation, Language } from '../../types';
import { getUIText } from '../../utils/translations';

interface SidebarProps {
  onNewQuery: () => void;
  isProcessing: boolean;
  onOpenAbout: () => void;
  conversations: SessionConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  language: Language;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewQuery,
  isProcessing,
  onOpenAbout,
  conversations,
  activeConversationId,
  onSelectConversation,
  language,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const ui = getUIText(language);

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 overflow-hidden text-[#18303F]">
      <div className="space-y-4 flex flex-col flex-1 min-h-0">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D9E2E8] lg:hidden">
          <span className="text-xs font-bold text-[#12304A]">
            {ui.recentInquiries}
          </span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md bg-[#F0F4F7] text-[#61717D] hover:text-[#18303F] cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Marine Query Action */}
        <button
          onClick={() => {
            onNewQuery();
            if (onCloseMobile) onCloseMobile();
          }}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs text-white bg-[#21618C] hover:bg-[#1B5074] border border-[#21618C] transition-colors cursor-pointer disabled:opacity-50 shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#DCEAF2] shrink-0" />
          <span className="truncate">{ui.newMarineQuery}</span>
        </button>

        {/* Session Conversation History Header */}
        <div className="flex flex-col flex-1 min-h-0 pt-1">
          <div className="flex items-center justify-between px-1 mb-2.5 shrink-0">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#61717D] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#21618C] shrink-0" />
              <span>{ui.recentInquiries}</span>
            </span>
            {conversations.length > 0 && (
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0">
                {conversations.length}
              </span>
            )}
          </div>

          {/* Conversation History Scroll Area */}
          <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
            {conversations.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] text-center space-y-1.5">
                <Compass className="w-6 h-6 text-[#7A93A6] mx-auto opacity-70" />
                <p className="text-xs text-[#61717D] font-medium leading-relaxed">
                  {ui.noPastInquiries}
                </p>
                <p className="text-[11px] text-[#7A93A6]">
                  {language === 'hi' 
                    ? 'पूछताछ शुरू करने के लिए मुख्य स्क्रीन पर प्रश्न लिखें।'
                    : 'Submit a query on the main screen to begin.'}
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                const displayTitle = language === 'hi' ? (conv.titleHi || conv.title) : conv.title;
                const timeString = new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer group flex items-start justify-between gap-2 min-w-0 ${
                      isActive
                        ? 'bg-[#EBF3F7] border-[#21618C] shadow-xs'
                        : 'bg-[#FFFFFF] hover:bg-[#F7F9FA] border-[#E5EDF2] hover:border-[#D9E2E8]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#21618C]' : 'text-[#7A93A6] group-hover:text-[#21618C]'}`} />
                        <span className={`text-xs font-semibold truncate ${isActive ? 'text-[#12304A]' : 'text-[#18303F]'}`}>
                          {displayTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#61717D] min-w-0">
                        <span className="shrink-0">{timeString}</span>
                        {conv.scenario && (
                          <>
                            <span className="shrink-0">•</span>
                            <span className="flex items-center gap-1 text-[#1E824C] font-medium truncate">
                              <CheckCircle2 className="w-3 h-3 text-[#1E824C] shrink-0" />
                              <span className="truncate">{conv.scenario.riskLevel}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform ${
                      isActive ? 'text-[#21618C] translate-x-0.5' : 'text-[#7A93A6] opacity-0 group-hover:opacity-100'
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-3 border-t border-[#D9E2E8] shrink-0">
        <div className="p-3 rounded-lg bg-[#F0F4F7] border border-[#D9E2E8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#12304A] truncate">{ui.teamName}</span>
            <span className="text-[10px] font-semibold text-[#21618C] px-1.5 py-0.5 rounded bg-[#DCEAF2] shrink-0">
              SIH26176
            </span>
          </div>
          <p className="text-[11px] text-[#61717D] mt-1 line-clamp-2">
            {ui.teamSub}
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#D9E2E8]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#61717D]">{ui.archDetails}</span>
            <button
              onClick={() => {
                onOpenAbout();
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[#21618C] hover:text-[#12304A] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>{ui.view}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 2xl:w-72 bg-[#FFFFFF] border-r border-[#D9E2E8] flex-col shrink-0 h-full overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Slide-over */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
