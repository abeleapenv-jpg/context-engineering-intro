import type { Scenario } from './types';
import { STAGES } from './stages';

const STAGE = STAGES.find((s) => s.id === 'college')!;

/* COLLEGE - five scenarios (spec §5.3-§5.7 directive blocks). */
export const COLLEGE: Scenario[] = [
/* ------------------------------ COLLEGE ------------------------------ */
  {
    id: '3-canonical',
    title: 'The Café',
    stageId: 'college',
    canonical: true,
    psychologyTags: ['self-disclosure', 'reciprocity', 'trust'],
    stageLanguage: STAGE.motionLanguage,
    cameraDirective:
      'Classic shot/reverse-shot rhythm, each reverse slightly wider as trust builds.',
    lightDirective: 'Warm, intimate café light.',
    keyBeat:
      'Camera distance is the pacing meter. It only widens at the rate disclosure is reciprocated.',
    context:
      'You are across a small café table from someone new. The conversation is easy so far, but it is hovering at the surface. You both know there is a depth knob and neither of you has touched it yet.',
    choices: [
      {
        id: 'A',
        text: 'Tell a long story about yourself.',
        archetype: 'reactive',
        consequence:
          'You fill the table with your story and the other person\'s cup gets very interesting to them. One-sided depth is just a monologue with a witness.',
      },
      {
        id: 'B',
        text: 'Keep the talk light and brief.',
        archetype: 'avoidant',
        consequence:
          'The conversation stays safe and ends early. Safe is comfortable. It is also the reason you know nothing more about them than when you sat down.',
      },
      {
        id: 'C',
        text: 'Share one small real thing.',
        archetype: 'clarifying',
        consequence:
          'One honest sentence about your week. They look at you properly for the first time. Then they offer one of their own. The table has a new temperature.',
      },
      {
        id: 'D',
        text: 'Ask a real question and listen.',
        archetype: 'regulated',
        consequence:
          'They talk for a while. You listen. When they ask about you, you notice you are more willing to answer. Reciprocity works when it is allowed to arrive.',
      },
    ],
  },
  {
    id: '3a',
    title: 'The First Conversation',
    stageId: 'college',
    canonical: false,
    psychologyTags: ['self-disclosure', 'reciprocity', 'impression formation'],
    stageLanguage: STAGES[2].motionLanguage,
    cameraDirective:
      'Opens on a tight, closed two-shot; each reciprocal exchange eases the camera a few degrees further apart.',
    lightDirective: 'Warm café light, gently brightening as the exchange balances.',
    keyBeat:
      'A monologue-style answer plays as one uninterrupted long take with no reverse shot. Visually there is no room for the other person. The reciprocal answer restores the rhythm.',
    context:
      'It is the first conversation that might become a friendship. You have each asked the usual questions and now there is a lull. The other person asks: "So what are you actually like?"',
    choices: [
      {
        id: 'A',
        text: 'Narrate your whole life story.',
        archetype: 'reactive',
        consequence:
          'You perform. They nod along. At the end they know a lot about you and you know nothing new about them. A first conversation that is all solo is just an audition.',
      },
      {
        id: 'B',
        text: 'Deflect with a joke.',
        archetype: 'avoidant',
        consequence:
          'The joke lands and the question disappears under it. You have kept yourself unread, and the moment to be read has passed for today.',
      },
      {
        id: 'C',
        text: 'Answer briefly, then ask it back.',
        archetype: 'clarifying',
        consequence:
          'You give them three honest sentences and return the question. The rhythm appears. One reveals, the other reveals. The room gets bigger around the table.',
      },
      {
        id: 'D',
        text: 'Say what you are hoping to find here.',
        archetype: 'regulated',
        consequence:
          'You tell the truth about why you came. It costs you a little and buys the whole conversation. They answer in kind. This is how the depth knob actually works.',
      },
    ],
  },
  {
    id: '3b',
    title: 'The Unanswered Message',
    stageId: 'college',
    canonical: false,
    psychologyTags: ['uncertainty', 'rejection sensitivity', 'attribution', 'rumination'],
    stageLanguage: STAGES[2].motionLanguage,
    cameraDirective:
      'Static shot on a foregrounded phone screen while background light shifts through a day/night cycle; Observer stays soft-focus behind it.',
    lightDirective: 'Time-lapse shift, cool to warm.',
    keyBeat:
      'Anxious follow-ups snap the camera back to the phone each cycle; the regulated response lets the phone recede out of focus as the Observer\'s own life sharpens instead.',
    context:
      'You sent a message at noon. It is now evening. The ticks say read. The reply has not come. Your phone has become the center of the room.',
    choices: [
      {
        id: 'A',
        text: 'Send two more messages.',
        archetype: 'reactive',
        consequence:
          'The second one is a question, the third is a joke about the silence. None of them bring the reply closer. Each one makes the silence heavier.',
      },
      {
        id: 'B',
        text: 'Silence notifications and spiral quietly.',
        archetype: 'avoidant',
        consequence:
          'The phone goes dark and your head takes over. You build a whole case against yourself. The case has no evidence but it has a lot of pages.',
      },
      {
        id: 'C',
        text: 'Check what you actually know.',
        archetype: 'clarifying',
        consequence:
          'What you know: they read it. What you do not know: everything else. The list is short. The phone gets smaller the moment you write it down.',
      },
      {
        id: 'D',
        text: 'Put the phone down and go do something.',
        archetype: 'regulated',
        consequence:
          'You cook dinner. The reply comes while your hands are full. It says they were in class all day. The phone looks ordinary again, because it always was.',
      },
    ],
  },
  {
    id: '3c',
    title: 'The Personal Question',
    stageId: 'college',
    canonical: false,
    psychologyTags: ['boundaries', 'self-disclosure', 'trust', 'vulnerability'],
    stageLanguage: STAGES[2].motionLanguage,
    cameraDirective:
      'Slow push-in matched to a translucent disclosure volume expanding between the two characters.',
    lightDirective: 'Soft, with a visible glowing boundary plane at partial expansion.',
    keyBeat:
      'Full immediate disclosure blows the volume open with a fast dolly; a held boundary keeps the push-in gentle and incomplete.',
    context:
      'Someone you have known for two weeks just asked you a question about your family that you would not ask a stranger. Their tone is light. The question is not.',
    choices: [
      {
        id: 'A',
        text: 'Answer everything, right now.',
        archetype: 'reactive',
        consequence:
          'You lay it all out. It is a relief, for about ten seconds. Then you realize you have just handed two weeks of acquaintance the keys to the whole house.',
      },
      {
        id: 'B',
        text: 'Change the subject.',
        archetype: 'avoidant',
        consequence:
          'They follow your lead and the moment passes. You are safe. You are also alone with the part of you that wanted to answer.',
      },
      {
        id: 'C',
        text: 'Say that is a bigger question than they know.',
        archetype: 'clarifying',
        consequence:
          'They pause. For the first time they look like they are measuring the question, not just asking it. A boundary stated honestly gives the other person somewhere real to stand.',
      },
      {
        id: 'D',
        text: 'Share the shape of it, not all of it.',
        archetype: 'regulated',
        consequence:
          'You say one true sentence and let it sit. They do not push. The boundary holds because you set it at the size you could stand by.',
      },
    ],
  },
  {
    id: '3d',
    title: 'The Party Crowd',
    stageId: 'college',
    canonical: false,
    psychologyTags: ['conformity', 'self-presentation', 'belonging', 'autonomy'],
    stageLanguage: STAGES[2].motionLanguage,
    cameraDirective:
      'Begins embedded in a tightly synchronized, jostling crowd; glides out as the Observer disengages, settling on a calmer wide shot of a smaller secondary group.',
    lightDirective: 'Crowd is saturated and strobing; secondary group is warm and steady.',
    keyBeat:
      'One continuous glide, no judgment cut between groups. Leaving reads as redirection, not rejection.',
    context:
      'The party is loud and everyone is moving the same way. You are in the middle of it. Across the room, two people are talking quietly by the window. You know both rooms are real; you are only in one of them.',
    choices: [
      {
        id: 'A',
        text: 'Go louder than the room.',
        archetype: 'reactive',
        consequence:
          'You match the crowd and then overshoot it. For an hour it feels like belonging. By the end of the night you cannot remember a single conversation you had.',
      },
      {
        id: 'B',
        text: 'Stay in the crowd and keep up.',
        archetype: 'avoidant',
        consequence:
          'You stay where it is warm and familiar. The window group waves at you once. You wave back and stay put. The moment passes and you wonder about it on the way home.',
      },
      {
        id: 'C',
        text: 'Step out for air and see who is outside.',
        archetype: 'clarifying',
        consequence:
          'You leave the center of the room, not the party. Outside, someone else is also taking a break. The quiet conversation is better than the loud one was.',
      },
      {
        id: 'D',
        text: 'Walk over to the two by the window.',
        archetype: 'regulated',
        consequence:
          'You cross the room without making a scene about it. The crowd keeps moving behind you. The window group makes space. Both rooms were real; now you are in the one you chose.',
      },
    ],
  }
];
