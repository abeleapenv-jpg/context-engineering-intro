import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/*
 * Hush context (UX task 1): while a scenario is being decided, the nav and
 * breadcrumbs drop to opacity-30. They restore on hover/focus (CSS, in Nav
 * and ScenarioPage) and permanently the moment the scenario resolves.
 */
const HushContext = createContext({ hushed: false, setHushed: () => {} });

export function HushProvider({ children }) {
  const [hushed, setHushed] = useState(false);
  const value = useMemo(() => ({ hushed, setHushed }), [hushed]);
  return <HushContext.Provider value={value}>{children}</HushContext.Provider>;
}

export function useHush() {
  const ctx = useContext(HushContext);
  const setHushed = useCallback((v) => ctx.setHushed(v), [ctx]);
  return { hushed: ctx.hushed, setHushed };
}
