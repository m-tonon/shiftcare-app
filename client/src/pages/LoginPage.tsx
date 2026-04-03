import { useLoginPage } from '../hooks/useLoginPage';
import { useIsMdUp } from '../hooks/useMinWidth';
import { LoginBrandBar } from '../components/login/LoginBrandBar';
import { LoginDesktopPanel } from '../components/login/LoginDesktopPanel';
import { LoginHeroBackdrop } from '../components/login/LoginHeroBackdrop';
import { LoginHero } from '../components/login/LoginHero';
import { LoginSheet } from '../components/login/LoginSheet';
import { LoginSwipeCue } from '../components/login/LoginSwipeCue';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const isDesktop = useIsMdUp();
  const login = useLoginPage(onLogin, isDesktop);

  return (
    <div className="relative flex h-svh w-full flex-col overflow-hidden overscroll-y-contain md:flex-row">
      {/* Hero: full-screen overlay on mobile; left column on desktop */}
      <div
        ref={login.heroRef}
        className="absolute inset-0 z-0 touch-pan-y select-none md:static md:inset-auto md:relative md:flex-1 md:min-h-0 md:min-w-0 md:select-text"
      >
        <LoginHeroBackdrop />
        <LoginBrandBar />
        <LoginHero
          formVisible={login.formVisible}
          variant={isDesktop ? 'desktop' : 'mobile'}
        />
        {!isDesktop && !login.formVisible && <LoginSwipeCue />}
      </div>

      {!isDesktop && (
        <LoginSheet
          formRef={login.formRef}
          visible={login.formVisible}
          name={login.name}
          passphrase={login.passphrase}
          error={login.error}
          onNameChange={login.onNameChange}
          onPassphraseChange={login.onPassphraseChange}
          onPassphraseHintClick={login.applyPassphraseHint}
          onSubmit={login.handleSubmit}
        />
      )}

      {isDesktop && (
        <LoginDesktopPanel
          formRef={login.formRef}
          name={login.name}
          passphrase={login.passphrase}
          error={login.error}
          onNameChange={login.onNameChange}
          onPassphraseChange={login.onPassphraseChange}
          onPassphraseHintClick={login.applyPassphraseHint}
          onSubmit={login.handleSubmit}
        />
      )}
    </div>
  );
}
