import type { Scenario } from './types';
import { STAGES } from './stages';

const STAGE = STAGES.find((s) => s.id === 'childhood')!;

/* CHILDHOOD - five scenarios (spec §5.3-§5.7 directive blocks). */
export const CHILDHOOD: Scenario[] = [
/* ------------------------------ CHILDHOOD ------------------------------ */
  {
    id: '1-canonical',
    title: 'The Playground',
    stageId: 'childhood',
    canonical: true,
    psychologyTags: ['possession', 'negotiation', 'group dynamics'],
    stageLanguage: STAGE.motionLanguage,
    cameraDirective:
      'Low, child\'s-eye-height tracking shot, quick whip-pans on moving objects, occasional hard cut on impulsive action.',
    lightDirective: 'Bright, high-contrast midday sun, hard shadows.',
    keyBeat:
      'Camera whips toward the disputed object, holds a beat of stillness on the pause, then eases (not cuts) into the outcome. The first scene to demonstrate the cut to ease grammar the rest of the site reuses.',
    context:
      'Two children are arguing over a skipping rope at the edge of the playground. The rope is on the ground between them. Both are looking at you.',
    choices: [
      {
        id: 'A',
        text: 'Pick the rope up first.',
        archetype: 'reactive',
        consequence:
          'Both of them turn on you at once. Moving first ended the argument, but it also ended the negotiation. Whoever wanted to talk now has to talk to you instead.',
      },
      {
        id: 'B',
        text: 'Look for a teacher.',
        archetype: 'avoidant',
        consequence:
          'You set off across the playground and the argument fades behind you. It probably still got decided. Just not by anyone who was in it, and not by you.',
      },
      {
        id: 'C',
        text: 'Ask what each of them wants.',
        archetype: 'clarifying',
        consequence:
          'Turns out one wants the rope now and the other wants it next. The second thing is the one you would have missed by picking a side.',
      },
      {
        id: 'D',
        text: 'Wait and watch a moment.',
        archetype: 'regulated',
        consequence:
          'One of them glances at you, then back at the other. An audience changes things. After a beat, the one holding the rope hands it over on their own.',
      },
    ],
  },
  {
    id: '1a',
    title: 'The Ball That Disappeared',
    stageId: 'childhood',
    canonical: false,
    psychologyTags: ['boundary-setting', 'ownership', 'escalation', 'clarification'],
    stageLanguage: STAGES[0].motionLanguage,
    cameraDirective:
      'Ground-level whip-pan follows the ball\'s roll; snap-zoom as the group\'s attention lands on it.',
    lightDirective: 'Flat, bright park light.',
    keyBeat:
      'Hard cut on a grab; an eased dolly-in for C/D, settling at a respectful mid-distance from the group afterward. Proximity as negotiated distance.',
    context:
      'Your ball rolled away from you and into the middle of three older kids playing their own game. One of them has picked it up and put it in their bag. They have seen you watching.',
    choices: [
      {
        id: 'A',
        text: 'Grab the bag.',
        archetype: 'reactive',
        consequence:
          'You have the ball back and they have a reason to remember you. Escalation won the object and lost the afternoon.',
      },
      {
        id: 'B',
        text: 'Walk away. It is only a ball.',
        archetype: 'avoidant',
        consequence:
          'You play without it. Later you keep glancing at the bag. Leaving ended nothing; it just moved the question somewhere quieter.',
      },
      {
        id: 'C',
        text: 'Tell them it rolled over by accident.',
        archetype: 'clarifying',
        consequence:
          'The one with the bag shrugs and checks with the others. The situation turns out to have a simple version. Not every take is a steal.',
      },
      {
        id: 'D',
        text: 'Ask for it back, plainly.',
        archetype: 'regulated',
        consequence:
          'You say the word yours, out loud, calmly. There is a pause, then the bag opens. A claim made without a lunge is harder to ignore.',
      },
    ],
  },
  {
    id: '1b',
    title: 'The Laugh',
    stageId: 'childhood',
    canonical: false,
    psychologyTags: ['attribution', 'ambiguity', 'personalization', 'attentional bias'],
    stageLanguage: STAGES[0].motionLanguage,
    cameraDirective:
      'Static wide two-shot on the laughing children; rack-focus to blur on the Observer during the freeze.',
    lightDirective: 'Even classroom light, no dramatic shift.',
    keyBeat:
      'Camera dollies out to reveal a second plausible cause of laughter off to the side. A wider frame changes an interpretation, enacted.',
    context:
      'You step into the classroom and two of your friends burst out laughing at the same moment. The whole room has gone quiet around the sound.',
    choices: [
      {
        id: 'A',
        text: 'Ask what is so funny, sharply.',
        archetype: 'reactive',
        consequence:
          'They explain it was a joke someone told before you came in. Now the joke is that you asked like that. The heat came from the question, not the laugh.',
      },
      {
        id: 'B',
        text: 'Sit down and decide they meant you.',
        archetype: 'avoidant',
        consequence:
          'You spend the lesson certain everyone is looking at you. Nobody is. The certainty still feels expensive.',
      },
      {
        id: 'C',
        text: 'Check what else happened in the room.',
        archetype: 'clarifying',
        consequence:
          'There is a drawing being passed around two desks over. It was never about you. The laugh still lands differently once you see the drawing.',
      },
      {
        id: 'D',
        text: 'Smile and take your seat.',
        archetype: 'regulated',
        consequence:
          'The room settles. Whatever the laugh was, you did not hand it a second act.',
      },
    ],
  },
  {
    id: '1c',
    title: 'The Invitation',
    stageId: 'childhood',
    canonical: false,
    psychologyTags: ['belonging', 'rejection sensitivity', 'direct communication', 'social uncertainty'],
    stageLanguage: STAGES[0].motionLanguage,
    cameraDirective:
      'Slow orbit around the closed circle from outside it, Observer kept at the frame\'s edge.',
    lightDirective: 'Soft overcast, neutral.',
    keyBeat:
      'On a direct request the orbit eases inward and the circle\'s spacing widens slightly. No snap-cut, no magical instant acceptance.',
    context:
      'Four kids are playing a game in a closed circle. You are standing near them, close enough to watch, far enough to not be in it. One of them keeps looking over.',
    choices: [
      {
        id: 'A',
        text: 'Barge into the middle of the circle.',
        archetype: 'reactive',
        consequence:
          'The game stops. You are in the circle now, in the sense that you are inside it. In every other sense you are not in it.',
      },
      {
        id: 'B',
        text: 'Drift off and pretend you were leaving.',
        archetype: 'avoidant',
        consequence:
          'You make leaving look intentional. Behind you, the circle closes again. You were not rejected; you just left before the question could be asked.',
      },
      {
        id: 'C',
        text: 'Ask what they are playing.',
        archetype: 'clarifying',
        consequence:
          'They explain the rules, and explaining the rules turns out to be an invitation. A question can be a door that does not look like one.',
      },
      {
        id: 'D',
        text: 'Ask if you can play.',
        archetype: 'regulated',
        consequence:
          'There is a small silence, then the circle shifts and makes room. It was not a perfect fit. It was a place that got slightly wider.',
      },
    ],
  },
  {
    id: '1d',
    title: "The Teacher's Question",
    stageId: 'childhood',
    canonical: false,
    psychologyTags: ['social inhibition', 'uncertainty', 'confidence', 'turn-taking'],
    stageLanguage: STAGES[0].motionLanguage,
    cameraDirective:
      'Locked wide shot of the room, then a slow push-in on the Observer as silence lengthens.',
    lightDirective:
      'Deep focus throughout until the hand rises, then a soft rim light picks the Observer out.',
    keyBeat:
      'Push-in speed is the tell. A fast push would read impulsive; this one is a deliberate crawl.',
    context:
      'The teacher has asked a question and the room has gone very still. You know the answer. You are almost certain you know the answer. The silence is getting longer.',
    choices: [
      {
        id: 'A',
        text: 'Blurt the answer out.',
        archetype: 'reactive',
        consequence:
          'It is right. The room unclenches. But the answer came out fast and loud, and you hear yourself replaying the loud part all afternoon.',
      },
      {
        id: 'B',
        text: 'Stare at your desk.',
        archetype: 'avoidant',
        consequence:
          'Someone else answers, wrong, and the teacher corrects them. You were right. The desk does not care, which is the problem with desks.',
      },
      {
        id: 'C',
        text: 'Raise your hand partway.',
        archetype: 'clarifying',
        consequence:
          'The teacher sees the half-raised hand and gives you the floor. Asking for the floor, it turns out, is allowed to be quiet.',
      },
      {
        id: 'D',
        text: 'Raise your hand and answer when called.',
        archetype: 'regulated',
        consequence:
          'You wait your turn, you speak, you are right. The silence ends because someone chose to enter it carefully.',
      },
    ],
  }
];
