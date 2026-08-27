/*
 * QUIETFIELD SCENARIO PAGE (2D WALKING SKELETON + 3D LAYER)
 *
 * The interactive core: a stage (3D when WebGL is available, the 2D/SVG
 * scene otherwise), a shared camera contract speaking the §2 grammar,
 * four choices with §3.7.1 archetypes, and a per-choice consequence beat.
 * Completion and choice log persist across refresh (spec §1.1 step 1).
 *
 * Hover previews show where a choice takes the frame (§3.6.1 #28); in 3D
 * the focus figure also turns its head toward the hovered response
 * (power2.out). The real resolution uses the archetype's own easing, so
 * the cut-vs-ease distinction stays meaningful (§2): hard cut = impulse,
 * power3.inOut = deliberation (Amendment A).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Breadcrumbs, CompletedMark } from '../components/Controls';
import { ARCHETYPE_WORDS } from '../lib/archetypes';
import { SceneViewport } from '../components/SceneViewport';
import { SceneFrame } from '../components/SceneFrame';
import {
  CafeStage,
  ClassroomStage,
  DinnerTableStage,
  MeetingRoomStage,
  PlaygroundStage,
} from '../components/scenes';
import {
  SCENARIOS,
  STAGES,
  pageTitleFor,
} from '../content/scenarios';
import type { Archetype, CameraDirective } from '../lib/camera';
import { ARCHETYPE_BEHAVIOR } from '../lib/camera';
import {
  dollyOut,
  easeSettle,
  homeState,
  snapCut,
} from '../lib/semantic';
import { getProgress, notify, recordChoice } from '../lib/store';
import { useSceneCamera } from '../lib/useSceneCamera';
import { useReducedMotion } from './useReducedMotion';

const STAGE_COMPONENTS: Record<string, () => React.ReactElement> = {
  childhood: PlaygroundStage,
  school: ClassroomStage,
  college: CafeStage,
  office: MeetingRoomStage,
  'middle-age': DinnerTableStage,
};

/**
 * The scripted intro per stage motion language (§5.2). It runs once on
 * mount; the visitor can choose at any time, which overrides it.
 */
function introDirectives(stageId: string, home: ReturnType<typeof homeState>): CameraDirective[] {
  switch (stageId) {
    case 'childhood':
      // Fast, bouncy, abrupt: a whip toward the focal point, a held beat
      // of stillness, then the first eased move - the pause made visible.
      return [snapCut(home, { zoom: 1.4, depth: 0.7 }), easeSettle(home, { durationMs: 2200 })];
    case 'school':
      // Synchronization: echo cuts across the room, then settle.
      return [
        snapCut(home, { x: -4, zoom: 1.25, depth: 0.6 }),
        snapCut(home, { x: 4, zoom: 1.25, depth: 0.6 }),
        easeSettle(home, { durationMs: 2400 }),
      ];
    case 'college':
      // Reciprocity: open from a tight two-shot, one slow exchange.
      return [
        snapCut(home, { zoom: 1.4, depth: 0.8 }),
        dollyOut(home, { zoom: 1, depth: 0, durationMs: 3200 }),
      ];
    case 'office':
      // Competing focal planes that resolve into one clean settle.
      return [
        snapCut(home, { x: -5, zoom: 1.3, depth: 0.8 }),
        snapCut(home, { x: 5, zoom: 1.3, depth: 0.8 }),
        easeSettle(home, { durationMs: 2600 }),
      ];
    default:
      // Middle age: the camera declines to perform (§5.7). Near-stillness.
      return [easeSettle(home, { durationMs: 3000 })];
  }
}

export function ScenarioPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const reducedMotion = useReducedMotion();

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId),
    [scenarioId],
  );

  const home = useMemo(() => homeState(), []);
  const camera = useSceneCamera(home, reducedMotion);
  const { target, ease, durationMs } = camera;

  // The current directive drives BOTH renderers (§3.7.2): the 2D camera
  // applies the 2D state, the 3D rig maps meaning + ease to poses.
  const [directive, setDirective] = useState<CameraDirective | null>(null);
  const settleRef = useRef<(() => void) | null>(null);

  /** Index of the hovered/focused choice (0..3) or null: the 3D focus
   *  figure turns toward it (power2.out). */
  const [focus, setFocus] = useState<number | null>(null);

  const [chosen, setChosen] = useState<{
    choiceId: string;
    archetype: Archetype;
    consequence: string;
  } | null>(null);
  const [revealed, setRevealed] = useState(false);

  const applyDirective = (dir: CameraDirective | null, onSettled?: () => void) => {
    settleRef.current = onSettled ?? null;
    setDirective(dir);
    camera.apply(dir, onSettled);
  };

  // Distinct page title per scenario (§7.5 #9).
  useEffect(() => {
    if (scenario) document.title = pageTitleFor(scenario);
    return () => {
      document.title = 'Quietfield';
    };
  }, [scenario]);

  // The scripted intro, per stage motion language. Interrupted by any
  // choice. Skipped entirely under reduced motion (§3).
  useEffect(() => {
    if (!scenario || reducedMotion) return;
    const directives = introDirectives(scenario.stageId, home);
    const timers: number[] = [];
    directives.forEach((dir, i) => {
      timers.push(
        window.setTimeout(() => applyDirective(dir), i === 0 ? 350 : 350 + i * 450),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id, reducedMotion]);

  if (!scenario) {
    return <ScenarioMissing />;
  }

  const stage = STAGES.find((s) => s.id === scenario.stageId)!;
  const stageScenarios = SCENARIOS.filter((s) => s.stageId === stage.id);
  const stageIndex = stageScenarios.findIndex((s) => s.id === scenario.id);
  const nextScenario = stageScenarios[stageIndex + 1];

  const StageComponent = STAGE_COMPONENTS[stage.id] ?? PlaygroundStage;

  /** Hover preview: show where this choice takes the frame, gently
   *  (eased, short). The real resolution uses the archetype's easing. */
  const preview = (archetype: Archetype) => {
    if (reducedMotion || revealed) return;
    const behavior = ARCHETYPE_BEHAVIOR[archetype](home);
    applyDirective({ to: behavior.to, ease: 'ease', meaning: behavior.meaning, durationMs: 900 });
  };

  const restore = () => {
    if (reducedMotion || revealed) return;
    applyDirective({ to: home, ease: 'ease', meaning: 'settling', durationMs: 1100 });
  };

  /** Choose: the archetype's directive carries the meaning (§3.7.1).
   *  The settle callback reveals the consequence beat. */
  const choose = (choiceId: string, archetype: Archetype, consequence: string, text: string) => {
    setChosen({ choiceId, archetype, consequence });
    setRevealed(false);
    setFocus(null);
    applyDirective(ARCHETYPE_BEHAVIOR[archetype](home), () => {
      setRevealed(true);
      recordChoice({ scenarioId: scenario.id, choiceId, archetype, text });
      notify();
    });
  };

  const restart = () => {
    setChosen(null);
    setRevealed(false);
    applyDirective({ to: home, ease: 'ease', meaning: 'settling', durationMs: 1200 });
  };

  const progress = getProgress();
  const alreadyDone = progress.completedScenarioIds.includes(scenario.id);
  const chosenWord = chosen ? ARCHETYPE_WORDS[chosen.archetype] : null;

  const fallback2d = (
    <SceneFrame
      stage={<StageComponent />}
      camera={target}
      easeClass={ease}
      durationMs={durationMs}
      reducedMotion={reducedMotion}
    />
  );

  return (
    <main className="qf-wrap qf-scenario-page" data-testid="scenario-page">
      <Breadcrumbs
        trail={[
          { label: 'QUIETFIELD', to: '/' },
          { label: stage.name.toUpperCase(), to: `/stages/${stage.id}` },
          { label: scenario.title.toUpperCase(), to: `/scenario/${scenario.id}` },
        ]}
      />

      <header className="qf-scenario-header">
        <div className="qf-scenario-title-row">
          <h1 className="qf-display qf-scenario-title">{scenario.title}</h1>
          {scenario.canonical ? (
            <span className="qf-label qf-canonical-tag">CANONICAL</span>
          ) : null}
          {alreadyDone ? (
            <span className="qf-done-inline">
              <CompletedMark done />{' '}
              <span className="qf-label">SEEN</span>
            </span>
          ) : null}
        </div>
        <p className="qf-tagline qf-stage-language">{stage.motionLanguage}</p>
        <p className="qf-label qf-psych-tags">
          {scenario.psychologyTags.map((tag) => tag.toUpperCase()).join(' · ')}
        </p>
      </header>

      <section aria-label="Scene">
        <SceneViewport
          stageId={stage.id}
          fallback2d={fallback2d}
          directive={directive}
          depth={target.depth}
          reducedMotion={reducedMotion}
          onSettled={() => settleRef.current?.()}
          focus={focus}
        />
      </section>

      <section className="qf-context" aria-label="Context">
        <p className="qf-body">{scenario.context}</p>
      </section>

      <section className="qf-choices" aria-label="Choices">
        <h2 className="qf-label qf-choices-label">WHAT DO YOU DO?</h2>
        <div className="qf-choice-grid">
          {scenario.choices.map((choice, index) => {
            const isChosen = chosen?.choiceId === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                className={`qf-choice ${isChosen ? 'qf-choice-chosen' : ''}`}
                onClick={() =>
                  choose(choice.id, choice.archetype, choice.consequence, choice.text)
                }
                onMouseEnter={() => {
                  setFocus(index);
                  preview(choice.archetype);
                }}
                onMouseLeave={() => {
                  setFocus(null);
                  restore();
                }}
                onFocus={() => {
                  setFocus(index);
                  preview(choice.archetype);
                }}
                onBlur={() => {
                  setFocus(null);
                  restore();
                }}
                disabled={revealed}
                aria-label={`Choice ${choice.id}: ${choice.text}`}
              >
                <span className="qf-choice-letter qf-label">{choice.id}</span>
                <span className="qf-choice-text qf-body">{choice.text}</span>
                <span className="qf-choice-archetype qf-label" aria-hidden="true">
                  {ARCHETYPE_WORDS[choice.archetype]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className={`qf-consequence qf-fade-in ${revealed ? 'qf-fade-show' : ''}`}
        aria-live="polite"
        data-testid="consequence"
      >
        {revealed && chosen ? (
          <>
            <p className="qf-label">WHAT CHANGED</p>
            <p className="qf-consequence-arch qf-label">
              {chosen.choiceId} · {chosenWord}
            </p>
            <p className="qf-body qf-consequence-text">{chosen.consequence}</p>
            <p className="qf-label qf-consequence-note">
              NO SINGLE CORRECT READING. THE FRAME IS ALWAYS WIDER THAN IT FIRST LOOKS.
            </p>
            <div className="qf-consequence-actions">
              <button type="button" className="qf-btn-quiet" onClick={restart}>
                TRY ANOTHER CHOICE
              </button>
              {nextScenario ? (
                <Link className="qf-btn" to={`/scenario/${nextScenario.id}`}>
                  NEXT IN {stage.name.toUpperCase()}
                </Link>
              ) : (
                <Link className="qf-btn" to={`/stages/${stage.id}`}>
                  BACK TO {stage.name.toUpperCase()}
                </Link>
              )}
            </div>
          </>
        ) : null}
      </section>

      <nav className="qf-scenario-nav qf-label" aria-label="Stage navigation">
        {stageScenarios.map((s, i) => (
          <Link
            key={s.id}
            to={`/scenario/${s.id}`}
            className={`${s.id === scenario.id ? 'qf-scenario-nav-current' : ''} ${
              s.canonical ? 'qf-scenario-nav-canonical' : ''
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </nav>
    </main>
  );
}

function ScenarioMissing() {
  return (
    <main className="qf-wrap">
      <h1 className="qf-display">SCENARIO NOT FOUND</h1>
      <p className="qf-body">That scenario is not in the field.</p>
      <Link className="qf-btn" to="/">
        BACK TO QUIETFIELD
      </Link>
    </main>
  );
}
