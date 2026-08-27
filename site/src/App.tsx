/*
 * QUIETFIELD APP ROUTES
 *
 * The entry sequence is the first thing a visitor sees (spec §4), once per
 * session. Everything else is the narrative path: stages and scenarios.
 */
import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

import { EntrySequence } from './components/EntrySequence';
import { hasEnteredThisSession } from './lib/entrySession';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { StageIndexPage } from './pages/StageIndexPage';
import { useReducedMotion } from './pages/useReducedMotion';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Root() {
  const reducedMotion = useReducedMotion();
  const [entered, setEntered] = useState<boolean>(() => hasEnteredThisSession());

  if (!entered) {
    return (
      <EntrySequence
        reducedMotion={reducedMotion}
        onComplete={() => setEntered(true)}
      />
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stages/:stageId" element={<StageIndexPage />} />
        <Route path="/scenario/:scenarioId" element={<ScenarioPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Root />
    </HashRouter>
  );
}
