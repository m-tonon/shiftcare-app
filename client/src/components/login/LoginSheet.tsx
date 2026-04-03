import type { SyntheticEvent, RefObject } from 'react';
import { LoginFormPanel } from './LoginFormPanel';

interface LoginSheetProps {
  formRef: RefObject<HTMLDivElement | null>;
  visible: boolean;
  name: string;
  passphrase: string;
  error: string;
  onNameChange: (value: string) => void;
  onPassphraseChange: (value: string) => void;
  onPassphraseHintClick: () => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export function LoginSheet({
  formRef,
  visible,
  name,
  passphrase,
  error,
  onNameChange,
  onPassphraseChange,
  onPassphraseHintClick,
  onSubmit,
}: LoginSheetProps) {
  return (
    <div
      ref={formRef}
      className={`absolute left-0 right-0 bottom-0 z-10 flex flex-col transition-transform duration-500 ease-out ${
        visible ? 'pointer-events-auto touch-pan-y' : 'pointer-events-none'
      }`}
      style={{
        height: '75svh',
        maxHeight: '75svh',
        borderRadius: '20px 20px 0 0',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
      }}
    >
      <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
        <div
          className="w-9 h-1 rounded-full"
          style={{ background: '#d0d5dd' }}
        />
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
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
        />
      </div>
    </div>
  );
}
