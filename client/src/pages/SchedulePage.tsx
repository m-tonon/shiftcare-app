import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  RefreshCw,
} from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import { ScheduleGrid } from '../components/schedule/ScheduleGrid';
import { scheduleDayElementId } from '../components/schedule/ScheduleCell';
import { getLocalDateString } from '../utils/date.utils';

function getWeekLabel(weekOffset: number): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [pendingScrollToToday, setPendingScrollToToday] = useState(false);
  const { schedule, loading, error, refresh } = useSchedule(weekOffset);

  const isCurrentWeek = weekOffset === 0;

  const scrollTodayIntoView = useCallback(() => {
    const el = document.getElementById(
      scheduleDayElementId(getLocalDateString()),
    );
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const jumpToThisWeek = useCallback(() => {
    setWeekOffset(0);
  }, []);

  const jumpToToday = useCallback(() => {
    if (weekOffset !== 0) {
      setPendingScrollToToday(true);
      setWeekOffset(0);
      return;
    }
    scrollTodayIntoView();
  }, [weekOffset, scrollTodayIntoView]);

  useEffect(() => {
    if (!pendingScrollToToday || loading || !schedule) return;
    setPendingScrollToToday(false);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollTodayIntoView();
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [pendingScrollToToday, schedule, loading, scrollTodayIntoView]);

  return (
    <div className="flex flex-col h-full bg-[var(--schedule-canvas)]">
      <header className="flex-shrink-0 sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 sm:py-3.5 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            aria-label="Previous week"
            className="h-11 w-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98] transition-all"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 text-center lg:items-start lg:text-left">
            <div className="flex items-center justify-center gap-2 flex-wrap lg:justify-start">
              <CalendarDays
                size={16}
                className="text-muted-foreground flex-shrink-0"
                aria-hidden
              />
              <span className="text-[15px] sm:text-base font-bold text-foreground tabular-nums">
                {getWeekLabel(weekOffset)}
              </span>
              {isCurrentWeek && (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  This week
                </span>
              )}
            </div>
            <p className="text-[12px] text-muted-foreground font-medium hidden sm:block">
              Your roster by day
            </p>
          </div>

          <div className="flex items-center gap-1 flex-wrap justify-end sm:gap-1.5">
            {!isCurrentWeek && (
              <button
                type="button"
                onClick={jumpToThisWeek}
                className="hidden sm:inline-flex text-[12px] font-semibold text-foreground px-3 py-2 rounded-xl border border-border bg-background hover:bg-surface transition-colors"
              >
                This week
              </button>
            )}
            {schedule && (
              <button
                type="button"
                onClick={jumpToToday}
                className="hidden sm:inline-flex text-[12px] font-semibold text-primary px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
              >
                Jump to today
              </button>
            )}
            <button
              type="button"
              onClick={refresh}
              aria-label="Refresh schedule"
              disabled={loading}
              className="h-11 w-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-foreground disabled:opacity-60 transition-all"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o + 1)}
              aria-label="Next week"
              className="h-11 w-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98] transition-all"
            >
              <ChevronRight size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {schedule && (
          <div className="px-4 pb-3 sm:px-5 sm:hidden lg:px-6 border-t border-border/60 bg-background/80">
            {!isCurrentWeek ? (
              <div className="grid grid-cols-2 gap-2 pt-3">
                <button
                  type="button"
                  onClick={jumpToThisWeek}
                  className="text-[13px] font-semibold text-foreground py-2.5 rounded-xl border border-border bg-background hover:bg-surface transition-colors"
                >
                  This week
                </button>
                <button
                  type="button"
                  onClick={jumpToToday}
                  className="text-[13px] font-semibold text-primary py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
                >
                  Jump to today
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={jumpToToday}
                className="w-full mt-3 text-[13px] font-semibold text-primary py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
              >
                Jump to today
              </button>
            )}
          </div>
        )}
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-5 sm:py-8 pb-28 sm:pb-10 lg:max-w-none lg:mx-0 lg:px-8 lg:py-8 xl:max-w-[1920px] xl:mx-auto xl:px-10 2xl:max-w-[2200px] 2xl:px-12">
          {error && (
            <div
              className="mb-5 rounded-2xl border border-danger-border bg-danger-bg px-4 py-3 text-[14px] text-danger font-medium"
              role="alert"
            >
              {error}
            </div>
          )}

          {loading && !schedule && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-muted-foreground">
              <span
                className="w-9 h-9 rounded-full border-2 border-border border-t-primary animate-spin inline-block"
                aria-hidden
              />
              <p className="text-[15px] font-medium">Loading schedule…</p>
            </div>
          )}

          {schedule && <ScheduleGrid schedule={schedule} />}

          {!loading && !schedule && !error && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-6 rounded-2xl border border-dashed border-border bg-background py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-subtle">
                <CalendarDays size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-2 max-w-sm">
                <p className="text-[17px] font-bold text-foreground">
                  No schedule for this week
                </p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Use the assistant to plan shifts, or pick another week above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
