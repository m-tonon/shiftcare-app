import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type SyntheticEvent,
} from 'react';
import { DEMO_PASSPHRASE } from '../constants/auth.constants';

export function useLoginPage(
  onLogin: (name: string) => void,
  isDesktop: boolean,
) {
  const [name, setName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(isDesktop);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const scrollStarted = useRef(false);
  const revealLockRef = useRef(false);

  const revealForm = useCallback(() => {
    setFormVisible((visible) => {
      if (visible || revealLockRef.current) return visible;
      revealLockRef.current = true;
      window.setTimeout(() => {
        revealLockRef.current = false;
      }, 600);
      return true;
    });
  }, []);

  // 👇 mirror of revealForm — same lock, opposite direction
  const hideForm = useCallback(() => {
    setFormVisible((visible) => {
      if (!visible || revealLockRef.current) return visible;
      revealLockRef.current = true;
      window.setTimeout(() => {
        revealLockRef.current = false;
      }, 600);
      return false;
    });
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setFormVisible(true);
      return;
    }

    const hero = heroRef.current;
    const form = formRef.current;
    if (!hero) return;

    const handleWheel = (e: WheelEvent) => {
      if (!formVisible && e.deltaY > 0) {
        // swipe up  → show
        e.preventDefault();
        revealForm();
      }
      if (formVisible && e.deltaY < 0) {
        // swipe down → hide
        // only dismiss if the form sheet itself is scrolled to the top
        const scrollTop = form?.scrollTop ?? 0;
        if (scrollTop === 0) {
          e.preventDefault();
          hideForm();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      scrollStarted.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = (touchStartY.current ?? 0) - e.touches[0].clientY;

      if (!formVisible && deltaY > 30 && !scrollStarted.current) {
        // up → show
        scrollStarted.current = true;
        revealForm();
      }

      if (formVisible && deltaY < -30 && !scrollStarted.current) {
        // down → hide
        const scrollTop = form?.scrollTop ?? 0;
        if (scrollTop === 0) {
          scrollStarted.current = true;
          hideForm();
        }
      }
    };

    hero.addEventListener('wheel', handleWheel, { passive: false });
    hero.addEventListener('touchstart', handleTouchStart, { passive: true });
    hero.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      hero.removeEventListener('wheel', handleWheel);
      hero.removeEventListener('touchstart', handleTouchStart);
      hero.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDesktop, formVisible, revealForm, hideForm]);

  const onNameChange = useCallback((value: string) => {
    setName(value);
    setError('');
  }, []);

  const onPassphraseChange = useCallback((value: string) => {
    setPassphrase(value);
    setError('');
  }, []);

  const applyPassphraseHint = useCallback(() => {
    setPassphrase(DEMO_PASSPHRASE);
    setError('');
  }, []);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (passphrase !== DEMO_PASSPHRASE) {
        setError(`Incorrect passphrase. Try ${DEMO_PASSPHRASE}.`);
        return;
      }
      setError('');
      onLogin(name.trim());
    },
    [name, passphrase, onLogin],
  );

  return {
    heroRef,
    formRef,
    formVisible,
    name,
    passphrase,
    error,
    onNameChange,
    onPassphraseChange,
    applyPassphraseHint,
    handleSubmit,
  };
}
