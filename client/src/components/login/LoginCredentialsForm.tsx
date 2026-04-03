import { ArrowRight } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import { DEMO_PASSPHRASE } from '../../constants/auth.constants';

interface LoginCredentialsFormProps {
  name: string;
  passphrase: string;
  error: string;
  onNameChange: (value: string) => void;
  onPassphraseChange: (value: string) => void;
  onPassphraseHintClick: () => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export function LoginCredentialsForm({
  name,
  passphrase,
  error,
  onNameChange,
  onPassphraseChange,
  onPassphraseHintClick,
  onSubmit,
}: LoginCredentialsFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[13px] font-medium text-foreground"
          htmlFor="name"
        >
          Your name
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Maria Santos"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          autoComplete="name"
          className="w-full rounded-xl px-4 py-3.5 text-[15px] text-foreground outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="text-[13px] font-medium text-foreground"
          htmlFor="passphrase"
        >
          Company passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          placeholder="Enter passphrase"
          value={passphrase}
          onChange={(e) => onPassphraseChange(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-xl px-4 py-3.5 text-[15px] text-foreground outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {error && (
        <p
          className="text-[13px] font-medium"
          style={{ color: 'var(--danger)' }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
        style={{ background: 'var(--primary)' }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            'var(--primary-hover)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            'var(--primary)')
        }
      >
        Sign in
        <ArrowRight size={17} />
      </button>

      <p
        className="text-center text-[12px]"
        style={{ color: 'var(--subtle-foreground)' }}
      >
        Hint: passphrase is{' '}
        <span
          className="underline cursor-pointer"
          style={{ color: 'var(--muted-foreground)' }}
          onClick={onPassphraseHintClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPassphraseHintClick();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {DEMO_PASSPHRASE}
        </span>
      </p>
    </form>
  );
}
