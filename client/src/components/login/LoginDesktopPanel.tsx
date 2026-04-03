import type { SyntheticEvent, RefObject } from 'react';
import { LoginFormPanel } from './LoginFormPanel';

interface LoginDesktopPanelProps {
  formRef: RefObject<HTMLDivElement | null>;
  name: string;
  passphrase: string;
  error: string;
  onNameChange: (value: string) => void;
  onPassphraseChange: (value: string) => void;
  onPassphraseHintClick: () => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export function LoginDesktopPanel({
  formRef,
  name,
  passphrase,
  error,
  onNameChange,
  onPassphraseChange,
  onPassphraseHintClick,
  onSubmit,
}: LoginDesktopPanelProps) {
  return (
    <div
      ref={formRef}
      className="relative z-10 flex h-full w-full max-w-[440px] flex-shrink-0 flex-col border-l border-border bg-background/98 backdrop-blur-md"
    >
      <div
        className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-y-contain px-10 py-12"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <LoginFormPanel
          name={name}
          passphrase={passphrase}
          error={error}
          onNameChange={onNameChange}
          onPassphraseChange={onPassphraseChange}
          onPassphraseHintClick={onPassphraseHintClick}
          onSubmit={onSubmit}
          className="w-full max-w-sm mx-auto"
        />
      </div>
    </div>
  );
}
