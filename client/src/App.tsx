import { useState, useCallback } from 'react';
import { useChat } from './hooks/useChat';
import { BottomNav } from './components/layout/BottomNav';
import { SideNav } from './components/layout/SideNav';
import { ChatFAB } from './components/layout/ChatFAB';
import { ChatDrawer } from './components/layout/ChatDrawer';
import SchedulePage from './pages/SchedulePage';
import AddSchedulePage from './pages/AddSchedulePage';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import type { Page } from './components/layout/BottomNav';
import {
  ScheduleViewProvider,
  useScheduleView,
} from './contexts/ScheduleViewContext';

function AppShell() {
  const { weekOffset } = useScheduleView();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>('schedule');
  const [chatOpen, setChatOpen] = useState(false);

  // A refresh callback — SchedulePage manages its own weekOffset,
  // so we expose a global schedule refresh trigger via a key bump.
  const [scheduleKey, setScheduleKey] = useState(0);
  const handleScheduleUpdate = useCallback(() => {
    setScheduleKey((k) => k + 1);
  }, []);

  const {
    messages,
    loading: chatLoading,
    send,
  } = useChat(handleScheduleUpdate, weekOffset);

  const hasUnread = !chatOpen && messages.length > 1;

  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);

  if (!currentUser) {
    return <LoginPage onLogin={(name) => setCurrentUser(name)} />;
  }

  return (
    <div className="flex h-svh bg-surface font-sans overflow-hidden">
      {/* Desktop sidebar */}
      <SideNav activePage={activePage} onNavigate={setActivePage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex-shrink-0 flex items-center px-4 h-13 bg-background border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-foreground">
              ShiftCare
            </span>
          </div>
          <span className="ml-auto text-[12px] text-subtle">{currentUser}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden bg-background">
          {activePage === 'schedule' && <SchedulePage key={scheduleKey} />}
          {activePage === 'add-schedule' && <AddSchedulePage />}
          {activePage === 'team' && <TeamPage />}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />

      {/* Floating AI button */}
      <ChatFAB onClick={openChat} hasUnread={hasUnread} />

      {/* Chat drawer */}
      <ChatDrawer
        open={chatOpen}
        onClose={closeChat}
        messages={messages}
        loading={chatLoading}
        onSend={send}
      />
    </div>
  );
}

export default function App() {
  return (
    <ScheduleViewProvider>
      <AppShell />
    </ScheduleViewProvider>
  );
}
