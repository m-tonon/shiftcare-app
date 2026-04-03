interface LoginHeroCopyProps {
  formVisible: boolean;
  /** Mobile: copy moves when the bottom sheet opens. Desktop: vertically centered in the hero column. */
  variant: 'mobile' | 'desktop';
}

export function LoginHero({ formVisible, variant }: LoginHeroCopyProps) {
  if (variant === 'desktop') {
    return (
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-10 md:px-12 flex flex-col gap-4 max-w-xl">
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Staff Scheduling
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight text-balance text-white"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
        >
          Care starts with great scheduling.
        </h1>
        <p
          className="text-base leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.70)' }}
        >
          Coordinate your entire care team — powered by AI.
        </p>
      </div>
    );
  }

  return (
    <div
      className="absolute left-0 right-0 px-6 flex flex-col gap-3 transition-all duration-500"
      style={{
        bottom: formVisible ? 'calc(75svh + 16px)' : '120px',
      }}
    >
      <p
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        Staff Scheduling
      </p>
      <h1
        className="text-4xl font-bold leading-tight text-balance text-white"
        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
      >
        Care starts with great scheduling.
      </h1>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.70)' }}
      >
        Coordinate your entire care team — powered by AI.
      </p>
    </div>
  );
}
