import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

export interface ScheduleViewContextValue {
  weekOffset: number;
  setWeekOffset: Dispatch<SetStateAction<number>>;
  selectedDayIndex: number;
  setSelectedDayIndex: Dispatch<SetStateAction<number>>;
  selectDayByDate: (date: string, weekDays: string[]) => void;
}

const ScheduleViewContext = createContext<ScheduleViewContextValue | null>(
  null,
);

function getTodayDayIndex(): number {
  const dayOfWeek = new Date().getDay();
  return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
}

export function ScheduleViewProvider({ children }: { children: ReactNode }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayDayIndex);

  const selectDayByDate = useCallback((date: string, weekDays: string[]) => {
    const index = weekDays.indexOf(date);
    if (index !== -1) {
      setSelectedDayIndex(index);
    }
  }, []);

  return (
    <ScheduleViewContext.Provider
      value={{
        weekOffset,
        setWeekOffset,
        selectedDayIndex,
        setSelectedDayIndex,
        selectDayByDate,
      }}
    >
      {children}
    </ScheduleViewContext.Provider>
  );
}

export function useScheduleView(): ScheduleViewContextValue {
  const ctx = useContext(ScheduleViewContext);
  if (!ctx) {
    throw new Error('useScheduleView must be used within ScheduleViewProvider');
  }
  return ctx;
}
