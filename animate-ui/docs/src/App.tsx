/*
 * Animate UI docs - routes and shell.
 *
 * App is the browser entry (BrowserRouter); AppShell holds the routes so
 * tests can mount it inside MemoryRouter. Owns the Cmd+K command palette
 * and the mobile drawer.
 */
import { MotionConfig } from 'motion/react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { CommandPalette } from './components/site/CommandPalette';
import { Footer } from './components/site/Footer';
import { Header } from './components/site/Header';
import { MobileDrawer } from './components/site/MobileDrawer';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K: the fuzzy search palette.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header
        onMenuOpen={() => setDrawerOpen(true)}
        onSearchOpen={() => setPaletteOpen(true)}
      />
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
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
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
