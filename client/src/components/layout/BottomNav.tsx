import { CalendarDays, Plus, Users } from 'lucide-react';

export type Page = 'schedule' | 'add-schedule' | 'team';

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const TABS: { page: Page; label: string; Icon: typeof CalendarDays }[] = [
  { page: 'schedule', label: 'Schedule', Icon: CalendarDays },
  { page: 'add-schedule', label: 'Add Shifts', Icon: Plus },
  { page: 'team', label: 'Team', Icon: Users },
];

export function BottomNav({ activePage, onNavigate }: Props) {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ page, label, Icon }) => {
        const active = activePage === page;
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 pt-2.5 pb-2 transition-colors ${
              active
                ? 'text-primary'
                : 'text-subtle hover:text-muted-foreground'
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span
              className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : 'text-subtle'}`}
            >
              {label}
            </span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
