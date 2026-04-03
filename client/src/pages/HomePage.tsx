import { useSchedule } from '../hooks/useSchedule';
import { useWorkers } from '../hooks/useWorkers';
import { useChat } from '../hooks/useChat';
import { ScheduleGrid } from '../components/schedule/ScheduleGrid';
import { WorkerRoster } from '../components/workers/WorkerRoster';
import { ChatBox } from '../components/chat/ChatBox';

export default function HomePage() {
  const { schedule, loading: scheduleLoading, refresh } = useSchedule();
  const { workers, loading: workersLoading } = useWorkers();
  const { messages, loading: chatLoading, send } = useChat(refresh);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">
              Riverside Medical Clinic
            </h1>
            <p className="text-xs text-gray-500">ShiftCare — Staff Scheduler</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Schedule */}
        <main className="flex-1 overflow-auto p-6">
          {scheduleLoading && (
            <p className="text-gray-400 text-sm">Loading schedule...</p>
          )}
          {schedule && <ScheduleGrid schedule={schedule} />}
        </main>

        {/* Workers */}
        {!workersLoading && <WorkerRoster workers={workers} />}

        {/* Chat */}
        <ChatBox messages={messages} loading={chatLoading} onSend={send} />
      </div>
    </div>
  );
}
