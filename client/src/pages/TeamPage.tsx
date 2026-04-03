import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useWorkers } from '../hooks/useWorkers';
import { WorkerCard } from '../components/workers/WorkerCard';
import { ROLE_LABELS, ROLE_STYLES } from '../constants/roles.constants';
import { Role } from '@shared/types';

const ROLE_ORDER: Role[] = [
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'TECHNICIAN',
  'PHARMACIST',
  'CLEANING',
];

const AVAILABILITY_FILTER = ['ALL', 'AVAILABLE', 'SICK', 'VACATION'] as const;
type AvailFilter = (typeof AVAILABILITY_FILTER)[number];

export default function TeamPage() {
  const { workers, loading } = useWorkers();
  const [query, setQuery] = useState('');
  const [availFilter, setAvailFilter] = useState<AvailFilter>('ALL');

  const filtered = workers.filter((w) => {
    const matchesSearch =
      query === '' ||
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      ROLE_LABELS[w.role].toLowerCase().includes(query.toLowerCase());
    const matchesAvail =
      availFilter === 'ALL' || w.availability === availFilter;
    return matchesSearch && matchesAvail;
  });

  const available = workers.filter(
    (w) => w.availability === 'AVAILABLE',
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-border bg-background">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-muted-foreground" />
          <h1 className="text-[15px] font-semibold text-foreground">Team</h1>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {available}/{workers.length} available
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search by name or role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-[13px] bg-surface border border-border rounded-lg text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
          />
        </div>

        {/* Availability filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {AVAILABILITY_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => setAvailFilter(f)}
              className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                availFilter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto pb-24 md:pb-4">
        {loading && (
          <div className="flex items-center justify-center h-32 gap-2 text-muted-foreground text-sm">
            <span className="w-4 h-4 rounded-full border-2 border-border border-t-primary animate-spin inline-block" />
            Loading team...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-6">
            <Users size={28} className="text-subtle" />
            <p className="text-[13px] text-muted-foreground">
              No team members match your search.
            </p>
          </div>
        )}

        {!loading &&
          ROLE_ORDER.map((role) => {
            const group = filtered.filter((w) => w.role === role);
            if (!group.length) return null;
            const styles = ROLE_STYLES[role];

            return (
              <div key={role} className="mb-1">
                <div className="flex items-center gap-2 px-4 py-2 sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border-subtle">
                  <span className={`w-2 h-2 rounded-full ${styles.avatarBg}`} />
                  <span className="text-[10px] font-semibold text-subtle uppercase tracking-wider">
                    {ROLE_LABELS[role]}
                  </span>
                  <span className="text-[10px] text-subtle ml-auto">
                    {group.length}
                  </span>
                </div>
                <div className="px-2 py-1">
                  {group.map((w) => (
                    <WorkerCard key={w.id} worker={w} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
