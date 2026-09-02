import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Nav from './components/Nav';
import ScrollToTop from './components/ScrollToTop';
import Auth from './components/Auth';
import { HushProvider } from './lib/hush';
import { loadField, recordDecision } from './lib/progress';
import { supabase, SUPABASE_CONFIGURED } from './lib/supabaseClient';
import { CLOSING_LINE } from './lib/scenarios';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LifeStageIndexPage from './pages/LifeStageIndexPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import ScenarioPage from './pages/ScenarioPage';
import ThankYouPage from './pages/ThankYouPage';

const EMPTY_FIELD = { completed: [], choices: {}, counts: { reactive: 0, avoidant: 0, clarifying: 0, regulated: 0 } };

function Shell() {
  const [session, setSession] = useState(null);
  const [field, setField] = useState(EMPTY_FIELD);
  const [ready, setReady] = useState(false);

  // Session bootstrap: local mode has no auth; Supabase mode restores the
  // session and subscribes to changes (master plan section 7, task 4).
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load the field for whoever is walking: Supabase rows when signed in,
  // this browser's localStorage otherwise.
  useEffect(() => {
    let alive = true;
    loadField(session)
      .then((next) => {
        if (alive) setField(next);
      })
      .catch(() => {
        /* keep the empty field; the walk still works, it just won't persist */
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [session]);

  const refreshField = useCallback(async () => {
    try {
      setField(await loadField(session));
    } catch {
      /* offline or schema gap: keep last known state */
    }
  }, [session]);

  // One decision = one write (choices_made + progress), then a re-read.
  const handleDecide = useCallback(
    async (scenarioId, choiceKey) => {
      try {
        await recordDecision(session, scenarioId, choiceKey);
        await refreshField();
      } catch {
        /* the choice still renders; persistence retries on the next decision */
      }
    },
    [refreshField, session],
  );

  const shared = useMemo(
    () => ({ field, onDecide: handleDecide, refreshField }),
    [field, handleDecide, refreshField],
  );

  return (
    <div className="flex min-h-screen flex-col bg-qf-ink">
      <ScrollToTop />
      <Nav session={session} />
      {ready ? (
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage field={field} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/auth"
              element={session ? <Navigate to="/" replace /> : <Auth />}
            />

            {/* Supabase mode gates the walk behind a real session; local
                mode stays open (progress persists in this browser). */}
            <Route
              path="/stage/:stageId"
              element={
                SUPABASE_CONFIGURED && !session ? (
                  <Gate />
                ) : (
                  <LifeStageIndexPage field={field} />
                )
              }
            />
            <Route
              path="/scenario/:id"
              element={
                SUPABASE_CONFIGURED && !session ? (
                  <Gate />
                ) : (
                  <ScenarioPage
                    field={field}
                    onDecide={handleDecide}
                    refreshField={refreshField}
                  />
                )
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage session={session} field={field} refreshField={refreshField} />
              }
            />
            <Route path="/done" element={<ThankYouPage field={field} />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      ) : (
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-24 sm:px-10 lg:px-14">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
            LOADING // THE FIELD
          </p>
        </main>
      )}

      <footer className="border-t border-[#848177]/20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-baseline lg:justify-between lg:px-14">
          <p className="max-w-xl font-body text-lg italic leading-relaxed text-qf-cream">
            {CLOSING_LINE}
          </p>
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
            Quietfield · A Musterfield Labs project
          </p>
        </div>
      </footer>
    </div>
  );
}

/** Auth gate: sends visitors to /auth remembering where they were going. */
function Gate() {
  const location = useLocation();
  return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
}

export default function App() {
  return (
    <HashRouter>
      <HushProvider>
        <Shell />
      </HushProvider>
    </HashRouter>
  );
}
