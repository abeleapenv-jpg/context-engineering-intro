import type { Scenario } from './types';
import { STAGES } from './stages';

const STAGE = STAGES.find((s) => s.id === 'office')!;

/* OFFICE - five scenarios (spec §5.3-§5.7 directive blocks). */
export const OFFICE: Scenario[] = [
/* ------------------------------- OFFICE ------------------------------- */
  {
    id: '4-canonical',
    title: 'The Meeting Room',
    stageId: 'office',
    canonical: true,
    psychologyTags: ['credit', 'recognition', 'status'],
    stageLanguage: STAGE.motionLanguage,
    cameraDirective:
      'Multiple competing focal planes early (restless rack-focus across several sharp subjects), resolving into one clean rack-focus on whoever\'s contribution is finally credited.',
    lightDirective: 'Even, then a single clarifying highlight.',
    keyBeat:
      'Resolution is a focus-pull, not a cut. Clarity arrives; it is not announced.',
    context:
      'The meeting is wrapping up. The proposal on the table came out of a discussion where you made the key point, but in the summary everyone is nodding at your colleague, who said it louder.',
    choices: [
      {
        id: 'A',
        text: 'Interrupt to correct the record.',
        archetype: 'reactive',
        consequence:
          'You get the credit and the room gets a moment of tension. People remember the interruption longer than the contribution.',
      },
      {
        id: 'B',
        text: 'Let it go. It is not worth it.',
        archetype: 'avoidant',
        consequence:
          'The meeting ends. The credit lands with your colleague, and something small and tired settles into your chest on the way back to your desk.',
      },
      {
        id: 'C',
        text: 'Restate the point with the specifics.',
        archetype: 'clarifying',
        consequence:
          'You walk the room through the reasoning, step by step, including your colleague\'s part in it. The specifics carry the credit without anyone having to be accused.',
      },
      {
        id: 'D',
        text: 'Note the point was yours, then move on.',
        archetype: 'regulated',
        consequence:
          'One clean sentence, no heat in it, then back to the agenda. The record corrects itself. You look calmer than you feel, which is half of the skill.',
      },
    ],
  },
  {
    id: '4a',
    title: 'The Interrupter',
    stageId: 'office',
    canonical: false,
    psychologyTags: ['conversational dominance', 'turn-taking', 'assertiveness', 'status'],
    stageLanguage: STAGES[3].motionLanguage,
    cameraDirective:
      'Two speech-volumes visually overlap and collide in the mid-ground; camera holds still, does not dodge.',
    lightDirective: 'Neutral.',
    keyBeat:
      'On the deliberate response the volumes separate onto distinct depth planes and a locked, unwavering camera axis represents steady eye contact.',
    context:
      'You are mid-sentence in the weekly meeting and your colleague starts talking over you. Again. It is the third time this month. The room is watching how you handle it.',
    choices: [
      {
        id: 'A',
        text: 'Talk louder to win the floor.',
        archetype: 'reactive',
        consequence:
          'Two people talking over each other, both getting louder. The room checks phones. Nobody won the floor; the floor just got noisy.',
      },
      {
        id: 'B',
        text: 'Stop talking and let them have it.',
        archetype: 'avoidant',
        consequence:
          'You cede the floor. It feels like keeping the peace. The peace is theirs, and your point never gets finished.',
      },
      {
        id: 'C',
        text: 'Wait, then say you were not finished.',
        archetype: 'clarifying',
        consequence:
          'You let them finish their interruption. Then, evenly: "I was not finished." The room looks up. You finish your point and it lands whole.',
      },
      {
        id: 'D',
        text: 'Hold your pause and keep eye contact.',
        archetype: 'regulated',
        consequence:
          'You do not raise your voice. You just stop, and look at them, and wait. The interruption runs out of fuel. They gesture for you to continue.',
      },
    ],
  },
  {
    id: '4b',
    title: 'The Email That Sounds Cold',
    stageId: 'office',
    canonical: false,
    psychologyTags: ['ambiguity', 'threat perception', 'catastrophizing', 'uncertainty'],
    stageLanguage: STAGES[3].motionLanguage,
    cameraDirective:
      'Environment edges compress inward (subtle vignette tightening) as anxiety builds.',
    lightDirective: 'Cooling, narrowing.',
    keyBeat:
      'The regulated response releases the vignette and pulls the camera back to normal field of view. The camera literally expanding as alternative explanations appear.',
    context:
      'Your manager sent: "Can you send me the numbers when you get a chance." No greeting. No please. Full stop. You have read it eleven times.',
    choices: [
      {
        id: 'A',
        text: 'Reply with an apology.',
        archetype: 'reactive',
        consequence:
          'You apologize for nothing in particular and attach the numbers at 11pm. The next morning your manager replies: "Thanks! Perfect." The email was fine. The 11pm was you.',
      },
      {
        id: 'B',
        text: 'Do not reply and avoid them all day.',
        archetype: 'avoidant',
        consequence:
          'You take the long route to the kitchen. By four o\'clock they have asked in person. It turns out they just needed the numbers.',
      },
      {
        id: 'C',
        text: 'Check the tone against past emails.',
        archetype: 'clarifying',
        consequence:
          'You scroll back. Every email from them is like this. Short, no greeting, full stop. The pattern was there the whole time; the threat was the interpretation, not the text.',
      },
      {
        id: 'D',
        text: 'Send the numbers and ask one question.',
        archetype: 'regulated',
        consequence:
          'You attach the file and write: "Here you go. Should I add the Q3 breakdown?" They reply in minutes, warmly. The email had no temperature until you gave it one.',
      },
    ],
  },
  {
    id: '4c',
    title: 'The Disagreement',
    stageId: 'office',
    canonical: false,
    psychologyTags: ['confirmation bias', 'motivated reasoning', 'conflict', 'epistemic humility'],
    stageLanguage: STAGES[3].motionLanguage,
    cameraDirective:
      'Two proposal-objects face off across the frame on a collision trajectory, slow-motion micro-collision on contact.',
    lightDirective: 'Neutral, then individually lit components as they separate.',
    keyBeat:
      'A clarifying question splits each proposal into separate, individually lit components floating apart. Analysis replacing conflict.',
    context:
      'You and a colleague disagree about the approach for the next quarter. You both have data. You both have conviction. The meeting has fifteen minutes left.',
    choices: [
      {
        id: 'A',
        text: 'Double down on your data.',
        archetype: 'reactive',
        consequence:
          'You present harder. They present harder back. The meeting ends with both datasets intact and no decision made. Conviction is not a plan.',
      },
      {
        id: 'B',
        text: 'Agree to revisit it later.',
        archetype: 'avoidant',
        consequence:
          'Later becomes next week. The decision gets made without you, in a smaller meeting, by whoever happened to be in the room.',
      },
      {
        id: 'C',
        text: 'Ask which assumptions differ.',
        archetype: 'clarifying',
        consequence:
          'Ten minutes of questions and the disagreement turns out to be one assumption each of you made silently. Now there are two assumptions on the table instead of two egos.',
      },
      {
        id: 'D',
        text: 'State your view once, then ask for theirs.',
        archetype: 'regulated',
        consequence:
          'You give your position cleanly and then genuinely ask for theirs. Being heard makes them able to hear you. The meeting ends with a hybrid on the table.',
      },
    ],
  },
  {
    id: '4d',
    title: 'The Meeting Goes Silent',
    stageId: 'office',
    canonical: false,
    psychologyTags: ['pluralistic ignorance', 'social inhibition', 'uncertainty', 'psychological safety'],
    stageLanguage: STAGES[3].motionLanguage,
    cameraDirective:
      'Locked static wide on the table; ambient particles (dust, a clock hand) keep drifting so stillness does not read as a frozen frame.',
    lightDirective: 'Neutral, steady.',
    keyBeat:
      'The Observer\'s gaze becomes the only camera motion (a slow pan) until one specific concern is raised, then a controlled, gentle push-in settles on the group\'s attention.',
    context:
      'The lead has just presented a plan that will not work, and everyone in the room seems to know it. Nobody is saying anything. Everyone is looking at their notes, or the wall, or each other.',
    choices: [
      {
        id: 'A',
        text: 'Say the plan is a problem, bluntly.',
        archetype: 'reactive',
        consequence:
          'The silence breaks into defensiveness. The lead asks you to elaborate with a tone that means they would rather you did not. The room picks sides instead of picking apart the plan.',
      },
      {
        id: 'B',
        text: 'Stay silent with everyone else.',
        archetype: 'avoidant',
        consequence:
          'The meeting closes with nods. You all leave knowing. Nobody says it out loud. Next week it will be everyone\'s problem, still.',
      },
      {
        id: 'C',
        text: 'Raise the one specific risk you see.',
        archetype: 'clarifying',
        consequence:
          'One concrete risk, named. Not "this will not work" but "this part has no owner." Two other people nod. The silence cracks around the specifics.',
      },
      {
        id: 'D',
        text: 'Ask the quietest person what they think.',
        archetype: 'regulated',
        consequence:
          'The quietest person in the room says exactly what everyone was holding. Giving the floor away bought the truth. The plan gets revised before it ever ships.',
      },
    ],
  }
];
