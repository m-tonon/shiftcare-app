import { ChevronUp } from 'lucide-react';

export function LoginSwipeCue() {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 animate-bounce">
      <ChevronUp size={22} className="text-white/60" />
      <span
        className="text-[11px] font-medium"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        Swipe up to sign in
      </span>
    </div>
  );
}
