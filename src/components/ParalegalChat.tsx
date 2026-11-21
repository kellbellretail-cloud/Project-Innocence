import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Scale, User, Sparkles, AlertCircle, RefreshCw, Copy, 
  Check, Trash2, Shield, BookOpen, AlertTriangle, ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, EvidenceItem, OpposingClaimItem, LawLibraryItem, CaseOverview } from '../types';

interface ParalegalChatProps {
  chatMessages: ChatMessage[];
  onSendMessage: (userText: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  evidenceList: EvidenceItem[];
  opposingList: OpposingClaimItem[];
  lawLibrary: LawLibraryItem[];
  caseOverview: CaseOverview;
}

export const ParalegalChat: React.FC<ParalegalChatProps> = ({
  chatMessages,
  onSendMessage,
  onClearChat,
  isLoading,
  evidenceList,
  opposingList,
  lawLibrary,
  caseOverview,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const handleAttachEvidence = (item: EvidenceItem) => {
    setInputText(prev => `${prev ? prev + ' ' : ''}[Regarding Exhibit: "${item.title}" - ${item.description}] `);
    setShowAttachMenu(false);
  };

  const handleAttachOpposing = (item: OpposingClaimItem) => {
    setInputText(prev => `${prev ? prev + ' ' : ''}[Regarding Opposing Claim: "${item.title}" - ${item.allegationDetails}] `);
    setShowAttachMenu(false);
  };

  const handleAttachLaw = (law: LawLibraryItem) => {
    setInputText(prev => `${prev ? prev + ' ' : ''}[Applying Rule: ${law.title} (${law.citation})] `);
    setShowAttachMenu(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] min-h-[550px]">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-serif">Paralegal AI Assistant</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                CASE-GROUNDED
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Active Context: {evidenceList.length} Defense Exhibits &bull; {opposingList.length} Opposing Claims &bull; {lawLibrary.length} Authorities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Ethical Legal Disclaimer Banner */}
      <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2 text-[11px] text-amber-900 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span className="leading-tight">
          <strong>Paralegal Notice:</strong> This assistant organizes evidence, identifies exculpatory angles, and drafts strategic outlines for your defense. It does not replace licensed legal representation.
        </span>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40">
        {chatMessages.map((msg) => {
          const isAssistant = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  isAssistant
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-100'
                }`}
              >
                {isAssistant ? <Scale className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div
                  className={`rounded-2xl p-4 text-sm shadow-xs ${
                    isAssistant
                      ? 'bg-white text-slate-800 border border-slate-200/90'
                      : 'bg-slate-900 text-white ml-auto'
                  }`}
                >
                  {isAssistant ? (
                    <div className="prose prose-sm prose-slate max-w-none space-y-2 leading-relaxed font-sans [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-2 [&>h3]:mb-1 [&>h4]:text-sm [&>h4]:font-bold [&>h4]:text-slate-800 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-500 [&>blockquote]:pl-3 [&>blockquote]:italic">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  )}

                  {/* Copy button */}
                  {isAssistant && (
                    <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-slate-100 text-xs text-slate-400">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors p-1"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy Response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips (if assistant) */}
                {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(action)}
                        className="text-xs bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 px-2.5 py-1 rounded-full shadow-2xs transition-all flex items-center gap-1 font-medium"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Scale className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Paralegal is analyzing case exhibits & legal authorities...</span>
              </div>
              <div className="space-y-1.5 w-64">
                <div className="h-2 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="h-2 bg-slate-200 rounded animate-pulse w-full"></div>
                <div className="h-2 bg-slate-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Context Attachment Area */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white rounded-b-xl space-y-2">
        {/* Context Attachment Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Reference Case Exhibit or Authority</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Ask how to dismantle claims, draft discovery demands, or build timeline proofs.
            </span>
          </div>

          {/* Attachment Popup Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-30 max-h-72 overflow-y-auto space-y-3">
              <div>
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  My Defense Evidence ({evidenceList.length})
                </h5>
                <div className="space-y-1">
                  {evidenceList.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleAttachEvidence(item)}
                      className="w-full text-left text-xs p-1.5 rounded hover:bg-emerald-50 text-slate-800 truncate block transition-colors"
                    >
                      &bull; {item.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-2">
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Opposing & Conjured Claims ({opposingList.length})
                </h5>
                <div className="space-y-1">
                  {opposingList.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleAttachOpposing(item)}
                      className="w-full text-left text-xs p-1.5 rounded hover:bg-rose-50 text-slate-800 truncate block transition-colors"
                    >
                      &bull; {item.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-2">
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-blue-600" />
                  Key Legal Authorities ({lawLibrary.length})
                </h5>
                <div className="space-y-1">
                  {lawLibrary.slice(0, 5).map(law => (
                    <button
                      key={law.id}
                      onClick={() => handleAttachLaw(law)}
                      className="w-full text-left text-xs p-1.5 rounded hover:bg-blue-50 text-slate-800 truncate block transition-colors"
                    >
                      &bull; {law.title} ({law.citation})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            id="paralegal-chat-input"
            type="text"
            placeholder="Ask your paralegal (e.g. 'How do I prove the opposing witness is fabricating their timeline?')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 transition-all"
          />
          <button
            id="btn-send-paralegal-message"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center shadow-xs"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
