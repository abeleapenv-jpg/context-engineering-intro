/*
 * Content integrity for the 25 scenarios: the data model of spec §3.7.3
 * and the voice rules of §3.6.1 (#9 em dashes, #15 banned construction).
 */
import { describe, expect, it } from 'vitest';

import { SCENARIOS, STAGES } from './scenarios';

const CHOICE_IDS = ['A', 'B', 'C', 'D'];
const ARCHETYPES = ['reactive', 'avoidant', 'clarifying', 'regulated'];

describe('scenario data model (spec §3.7.3)', () => {
  it('contains all 25 scenarios, five per life stage', () => {
    expect(SCENARIOS).toHaveLength(25);
    for (const stage of STAGES) {
      const count = SCENARIOS.filter((s) => s.stageId === stage.id).length;
      expect(count).toBe(5);
    }
  });

  it('has exactly one canonical scenario per stage', () => {
    for (const stage of STAGES) {
      const canon = SCENARIOS.filter(
        (s) => s.stageId === stage.id && s.canonical,
      );
      expect(canon).toHaveLength(1);
    }
  });

  it('every scenario has four choices A-D with valid archetypes', () => {
    for (const s of SCENARIOS) {
      expect(s.choices.map((c) => c.id)).toEqual(CHOICE_IDS);
      for (const c of s.choices) {
        expect(ARCHETYPES).toContain(c.archetype);
        expect(c.consequence.trim().length).toBeGreaterThan(40);
      }
    }
  });

  it('every scenario carries the §3.7.3 fields and §5 directives', () => {
    for (const s of SCENARIOS) {
      expect(typeof s.id).toBe('string');
      expect(typeof s.stageId).toBe('string');
      expect(typeof s.title).toBe('string');
      expect(typeof s.canonical).toBe('boolean');
      expect(s.context.trim().length).toBeGreaterThan(40);
      expect(s.psychologyTags.length).toBeGreaterThan(0);
      expect(s.stageLanguage.trim().length).toBeGreaterThan(10);
      expect(s.cameraDirective.trim().length).toBeGreaterThan(10);
      // Some spec directives are terse ("Neutral."); anything non-empty
      // and meaningful passes.
      expect(s.lightDirective.trim().length).toBeGreaterThan(5);
      expect(s.keyBeat.trim().length).toBeGreaterThan(10);
      expect(s.choices).toHaveLength(4);
    }
  });

  it('has unique ids and titles', () => {
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(25);
    expect(new Set(SCENARIOS.map((s) => s.title)).size).toBe(25);
  });

  it('the general archetype pattern holds: A is reactive, C/D regulate', () => {
    for (const s of SCENARIOS) {
      expect(s.choices[0].archetype).toBe('reactive');
      const later = s.choices.slice(2).map((c) => c.archetype);
      expect(later).toContain('regulated');
    }
  });
});

describe('voice rules (spec §3.6.1)', () => {
  const allCopy: string[] = SCENARIOS.flatMap((s) => [
    s.context,
    s.stageLanguage,
    ...s.choices.flatMap((c) => [c.text, c.consequence]),
  ]);

  it('contains no em dashes', () => {
    for (const text of allCopy) {
      expect(text, text).not.toMatch(/—|--/);
    }
  });

  it('contains no "it\'s not X, it\'s Y" constructions', () => {
    for (const text of allCopy) {
      expect(text.toLowerCase(), text).not.toMatch(
        /it'?s not .{1,60}it'?s /,
      );
    }
  });

  it('contains no emoji', () => {
    for (const text of allCopy) {
      expect(text, text).not.toMatch(
        /\p{Extended_Pictographic}/u,
      );
    }
  });
});
