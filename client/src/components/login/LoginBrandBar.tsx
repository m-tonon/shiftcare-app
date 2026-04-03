import { Calendar } from 'lucide-react';

export function LoginBrandBar() {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center gap-2.5 px-6 pt-12 pb-4">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(15,98,254,0.9)' }}
      >
        <Calendar size={16} className="text-white" />
      </div>
      <span className="text-white font-semibold text-base tracking-tight">
        ShiftCare
      </span>
    </div>
  );
}
