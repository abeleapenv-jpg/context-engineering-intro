import type { Scenario } from './types';
import { STAGES } from './stages';

const STAGE = STAGES.find((s) => s.id === 'middle-age')!;

/* MIDDLE_AGE - five scenarios (spec §5.3-§5.7 directive blocks). */
export const MIDDLE_AGE: Scenario[] = [
/* ----------------------------- MIDDLE AGE ----------------------------- */
  {
    id: '5-canonical',
    title: 'The Dinner Table',
    stageId: 'middle-age',
    canonical: true,
    psychologyTags: ['advice-giving', 'listening', 'presence'],
    stageLanguage: STAGE.motionLanguage,
    cameraDirective:
      'Almost entirely locked-off, wide, patient; any movement is a nearly imperceptible drift.',
    lightDirective: 'Warm, low, natural. Practicals (lamps, candles) rather than a rig look.',
    keyBeat:
      'Presence is expressed by the camera\'s refusal to perform. Stillness itself is the answer.',
    context:
      'Dinner is over and the conversation has slowed to that low, honest register it only reaches after the plates are cleared. Someone has just said something difficult, and now everyone is looking at you.',
    choices: [
      {
        id: 'A',
        text: 'Offer a solution immediately.',
        archetype: 'reactive',
        consequence:
          'You fill the pause with advice. It is good advice. It is also the fastest way to end a conversation that was not asking to be ended. The table moves on to lighter things.',
      },
      {
        id: 'B',
        text: 'Clear the plates quietly.',
        archetype: 'avoidant',
        consequence:
          'You step into the kitchen and the moment steps with you, or maybe it closes without you. When you return, the subject has changed.',
      },
      {
        id: 'C',
        text: 'Ask what that has been like.',
        archetype: 'clarifying',
        consequence:
          'They talk for another ten minutes, longer than anyone expected. The difficult thing gets examined instead of solved. It turns out that was the ask.',
      },
      {
        id: 'D',
        text: 'Say you are glad they told you.',
        archetype: 'regulated',
        consequence:
          'You do not fix anything. You receive it. The room stays quiet and warm, and the person across from you looks lighter than they have all evening.',
      },
    ],
  },
  {
    id: '5a',
    title: 'The Family Argument',
    stageId: 'middle-age',
    canonical: false,
    psychologyTags: ['triangulation', 'perspective-taking', 'conflict', 'active listening'],
    stageLanguage: STAGES[4].motionLanguage,
    cameraDirective:
      'Two conversational streams (soft light trails) pull toward opposite frame edges with the Observer locked centered between them.',
    lightDirective: 'Warm, low.',
    keyBeat:
      'The streams slow their pull-rate, not stop abruptly, as each person is heard in turn.',
    context:
      'Your sister and your partner are arguing across the table, and they both keep turning to you to confirm their version. You are being recruited into an argument you did not start.',
    choices: [
      {
        id: 'A',
        text: 'Side with the person you agree with.',
        archetype: 'reactive',
        consequence:
          'The argument resolves in your favor and one of them goes quiet. Later, the quiet one says they felt outnumbered. The argument won; the evening lost.',
      },
      {
        id: 'B',
        text: 'Excuse yourself from the table.',
        archetype: 'avoidant',
        consequence:
          'You leave them to it. The argument continues without you and ends in a draw that satisfies nobody. The table is colder when you come back.',
      },
      {
        id: 'C',
        text: 'Ask each of them what they actually want.',
        archetype: 'clarifying',
        consequence:
          'It turns out they want the same thing and are arguing about the calendar, not the value. Naming the want deflates the fight. They are almost sheepish.',
      },
      {
        id: 'D',
        text: 'Refuse the referee role, kindly.',
        archetype: 'regulated',
        consequence:
          'You say you love them both and you are not the judge of this one. The argument wobbles, then becomes theirs to finish. It finishes better for not having a third side.',
      },
    ],
  },
  {
    id: '5b',
    title: 'The Old Story',
    stageId: 'middle-age',
    canonical: false,
    psychologyTags: ['identity', 'self-consciousness', 'social memory', 'boundaries'],
    stageLanguage: STAGES[4].motionLanguage,
    cameraDirective:
      'Stays anchored on the present-day Observer throughout.',
    lightDirective:
      'A soft, translucent, slightly desaturated memory-overlay appears near the Observer and dissolves.',
    keyBeat:
      'The overlay drifts through frame; the camera never chases it. The present stays grounded.',
    context:
      'At a family gathering, your mother starts telling the story again. The one about you, age eight, that everyone knows. The person in the story does not feel like you anymore, and the story is not kind.',
    choices: [
      {
        id: 'A',
        text: 'Cut her off.',
        archetype: 'reactive',
        consequence:
          'The story stops mid-sentence. The table goes quiet. You have won a silence, which is not the same as winning an argument.',
      },
      {
        id: 'B',
        text: 'Smile through it again.',
        archetype: 'avoidant',
        consequence:
          'You perform the laugh you have performed for years. It costs less each time. That is what worries you.',
      },
      {
        id: 'C',
        text: 'Ask what she likes about that story.',
        archetype: 'clarifying',
        consequence:
          'She pauses, then says it reminds her of when you were small. The story was never about the embarrassing part. It was about her missing the smallness. It lands differently now.',
      },
      {
        id: 'D',
        text: 'Later, tell her how the story lands.',
        archetype: 'regulated',
        consequence:
          'Not at the table. The next day, quietly: "I know you love that story, but I flinch at it." She is quiet for a long moment, then says she had not thought of it that way. She never tells it again.',
      },
    ],
  },
  {
    id: '5c',
    title: 'The Unsolicited Advice',
    stageId: 'middle-age',
    canonical: false,
    psychologyTags: ['active listening', 'advice-giving', 'autonomy', 'support'],
    stageLanguage: STAGES[4].motionLanguage,
    cameraDirective:
      'Three small solution-objects hover near the Observer at eye level.',
    lightDirective: 'Warm, even.',
    keyBeat:
      'As the objects lower, focus and framing shift to widen around the speaker instead. Attention visibly relocates, not just a cut.',
    context:
      'Your friend is telling you about a problem at work, and it is taking everything you have not to interrupt. You have three solutions ready. They have not finished describing the problem.',
    choices: [
      {
        id: 'A',
        text: 'Offer all three solutions at once.',
        archetype: 'reactive',
        consequence:
          'You list them, rapid fire. Your friend nods and stops talking. The problem is now a project you have assigned them. The connection in their voice is gone.',
      },
      {
        id: 'B',
        text: 'Wait for them to ask, then stay vague.',
        archetype: 'avoidant',
        consequence:
          'They never ask. You leave the conversation feeling like you failed to help. They leave feeling heard, which was the actual assignment.',
      },
      {
        id: 'C',
        text: 'Ask what they have already tried.',
        archetype: 'clarifying',
        consequence:
          'They list three things. One of them is your best solution, already attempted. The advice you were holding was evidence you had not been listening.',
      },
      {
        id: 'D',
        text: 'Listen fully, then ask what would help.',
        archetype: 'regulated',
        consequence:
          'You let the problem finish. Then: "Do you want ideas or an ear?" They want an ear, mostly, and one idea. Your advice lands because it was invited.',
      },
    ],
  },
  {
    id: '5d',
    title: 'The Success Question',
    stageId: 'middle-age',
    canonical: false,
    psychologyTags: ['social comparison', 'identity', 'meaning', 'self-evaluation', 'perspective-taking'],
    stageLanguage: STAGES[4].motionLanguage,
    cameraDirective:
      'Environment\'s motion slows to near-stillness.',
    lightDirective: 'Faint comparison-imagery flickers briefly at the frame\'s edges and fades.',
    keyBeat:
      'A slow, exhale-paced push-in on the Observer\'s posture relaxing, camera settling at the same height and distance held in the canonical Dinner Table scene. Closing the loop on the full life-stage arc.',
    context:
      'An old friend just told you about their new house, their promotion, their children\'s achievements. You are happy for them. You are also doing the math on your own life, and the math is not settling.',
    choices: [
      {
        id: 'A',
        text: 'Mentally list where you fall short.',
        archetype: 'reactive',
        consequence:
          'The comparison runs its full course, page by page. By the end of the evening you have a complete inventory of your deficits and a cold feeling in your chest.',
      },
      {
        id: 'B',
        text: 'Change the subject to something safe.',
        archetype: 'avoidant',
        consequence:
          'You steer to weather, then leave early. The question follows you home. Unasked questions do not get smaller for being avoided; they just get better at hiding.',
      },
      {
        id: 'C',
        text: 'Ask what they gave up to get here.',
        archetype: 'clarifying',
        consequence:
          'They laugh, then talk about the years they missed, the health scare, the thing they let go. The house gets a cost. Their life was never the brochure.',
      },
      {
        id: 'D',
        text: 'Notice your own path, without ranking.',
        archetype: 'regulated',
        consequence:
          'You let both lives sit side by side, unranked. The evening ends warm. On the drive home, the math stops running, and the road is just the road.',
      },
    ],
  }
];
