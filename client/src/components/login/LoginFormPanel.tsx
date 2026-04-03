import type { SyntheticEvent } from 'react';
import { LoginCredentialsForm } from './LoginCredentialsForm';

export interface LoginFormPanelProps {
  name: string;
  passphrase: string;
  error: string;
  onNameChange: (value: string) => void;
  onPassphraseChange: (value: string) => void;
  onPassphraseHintClick: () => void;
  onSubmit: (e: SyntheticEvent) => void;
  className?: string;
}

export function LoginFormPanel({
  name,
  passphrase,
  error,
  onNameChange,
  onPassphraseChange,
  onPassphraseHintClick,
  onSubmit,
  className = '',
}: LoginFormPanelProps) {
  return (
    <div className={className}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Welcome back
        </h2>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Sign in with your name and company passphrase.
        </p>
      </div>

      <LoginCredentialsForm
        name={name}
        passphrase={passphrase}
        error={error}
        onNameChange={onNameChange}
        onPassphraseChange={onPassphraseChange}
        onPassphraseHintClick={onPassphraseHintClick}
        onSubmit={onSubmit}
      />
    </div>
  );
}
