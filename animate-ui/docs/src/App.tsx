/*
 * Animate UI docs - routes and shell.
 *
 * App is the browser entry (BrowserRouter); AppShell holds the routes so
 * tests can mount it inside MemoryRouter.
 */
import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { Footer } from './components/site/Footer';
import { Header } from './components/site/Header';
import { ComponentsIndexPage } from './pages/ComponentsIndexPage';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { ContributingPage } from './pages/ContributingPage';
import { HomePage } from './pages/HomePage';
import { LicensePage } from './pages/LicensePage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/components" element={<ComponentsIndexPage />} />
          <Route path="/components/:slug" element={<ComponentDetailPage />} />
          <Route path="/license" element={<LicensePage />} />
          <Route path="/contributing" element={<ContributingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Respect the visitor's reduced-motion preference across every
          preview on the site (Motion quality control). */}
      <MotionConfig reducedMotion="user">
        <AppShell />
      </MotionConfig>
    </BrowserRouter>
  );
}
