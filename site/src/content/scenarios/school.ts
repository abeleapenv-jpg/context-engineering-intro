import type { Scenario } from './types';
import { STAGES } from './stages';

const STAGE = STAGES.find((s) => s.id === 'school')!;

/* SCHOOL - five scenarios (spec §5.3-§5.7 directive blocks). */
export const SCHOOL: Scenario[] = [
/* ------------------------------- SCHOOL ------------------------------- */
  {
    id: '2-canonical',
    title: 'The Classroom',
    stageId: 'school',
    canonical: true,
    psychologyTags: ['groupthink', 'conformity'],
    stageLanguage: STAGE.motionLanguage,
    cameraDirective:
      'Symmetrical, slightly elevated panoramic view exposing synchronized behavior at a glance.',
    lightDirective: 'Even deep focus across all desks. Conformity has no visual hierarchy.',
    keyBeat:
      'One desk\'s framing breaks alignment with subtle independent parallax when independent judgment occurs.',
    context:
      'The class is voting on something by show of hands. The first wave of hands goes up together, like one animal. You have not decided. Every face is turned toward you.',
    choices: [
      {
        id: 'A',
        text: 'Raise your hand with the wave.',
        archetype: 'reactive',
        consequence:
          'Your hand is up before you finish deciding. The wave was warm and easy to join. You spend the rest of the lesson unsure what you actually voted for.',
      },
      {
        id: 'B',
        text: 'Keep your hands under the desk.',
        archetype: 'avoidant',
        consequence:
          'The vote passes anyway. Nobody records who did not vote. Only you know the moment you sat out.',
      },
      {
        id: 'C',
        text: 'Ask what the options actually mean.',
        archetype: 'clarifying',
        consequence:
          'The teacher restates the question and three hands come down. The wave was not agreement. It was momentum, and momentum does not survive a clear question.',
      },
      {
        id: 'D',
        text: 'Vote after you have decided, even alone.',
        archetype: 'regulated',
        consequence:
          'Your hand goes up late, by itself. The room notices the late hand more than it ever noticed the wave.',
      },
    ],
  },
  {
    id: '2a',
    title: 'The Group Chat',
    stageId: 'school',
    canonical: false,
    psychologyTags: ['conformity', 'online disinhibition', 'social proof', 'attribution error'],
    stageLanguage: STAGES[1].motionLanguage,
    cameraDirective:
      'Fast vertical push toward a floating stack of message-cards multiplying and layering in depth as criticism escalates.',
    lightDirective: 'Cold blue screen-glow.',
    keyBeat:
      'The Observer\'s own card enters late, on a different depth plane; a clarifying question decelerates and thins the stack.',
    context:
      'The class chat has turned on someone. Message after message is piling up about a video they posted. Your phone is warm in your hand. The typing indicator is blinking.',
    choices: [
      {
        id: 'A',
        text: 'Add your own joke to the thread.',
        archetype: 'reactive',
        consequence:
          'It gets three laughing reactions immediately. The reaction feels like warmth. You know exactly what kind of warmth it is.',
      },
      {
        id: 'B',
        text: 'Mute the chat and close the app.',
        archetype: 'avoidant',
        consequence:
          'The thread continues without you. At school the next day, the target of the thread says hello to you like nothing happened. Something did happen.',
      },
      {
        id: 'C',
        text: 'Ask why the video is a problem.',
        archetype: 'clarifying',
        consequence:
          'The thread hesitates. Nobody can quite say what rule the video broke. The pause is small, but it is real, and the pile stops growing.',
      },
      {
        id: 'D',
        text: 'Message the person privately.',
        archetype: 'regulated',
        consequence:
          'You write one sentence to the person the thread is about. It does not stop the thread. It changes what the thread feels like from inside it.',
      },
    ],
  },
  {
    id: '2b',
    title: 'The Popular Answer',
    stageId: 'school',
    canonical: false,
    psychologyTags: ['normative influence', 'informational influence', 'independent judgment'],
    stageLanguage: STAGES[1].motionLanguage,
    cameraDirective:
      'Repeated, near-identical dolly-ins on each raised hand, edited to feel like an echo or loop.',
    lightDirective: 'Even, undifferentiated.',
    keyBeat:
      'The echo breaks. One hand-raise gets a distinct orbit instead of the repeated dolly when independent reasoning or an evidence-question is chosen.',
    context:
      'The math problem on the board has two candidate answers. Most of the class, including the popular kids, is confidently saying one of them. Your own scratch work keeps landing on the other one.',
    choices: [
      {
        id: 'A',
        text: 'Change your answer to match the class.',
        archetype: 'reactive',
        consequence:
          'The teacher reveals the answer. Your original scratch work had it right. The class was loud and wrong, and you knew it before you erased.',
      },
      {
        id: 'B',
        text: 'Erase everything and say nothing.',
        archetype: 'avoidant',
        consequence:
          'You remove the evidence rather than test it. The board goes on being wrong for everyone, including you, because nobody has to look at your paper.',
      },
      {
        id: 'C',
        text: 'Ask the class to show their work.',
        archetype: 'clarifying',
        consequence:
          'Three people walk through their steps and one of them stops mid-sentence. The error surfaces on its own. You never had to say anyone was wrong.',
      },
      {
        id: 'D',
        text: 'Show your own work, calmly.',
        archetype: 'regulated',
        consequence:
          'You write your steps on the board, line by line. The room goes quiet, then the confidence shifts. Independent judgment reads differently when it is shown instead of declared.',
      },
    ],
  },
  {
    id: '2c',
    title: 'The Friend Who Overshares',
    stageId: 'school',
    canonical: false,
    psychologyTags: ['confidentiality', 'social boundaries', 'gossip', 'trust'],
    stageLanguage: STAGES[1].motionLanguage,
    cameraDirective:
      'A whisper tracking shot follows a soft glowing particle-trail from the friend toward the Observer, sharp against a soft background.',
    lightDirective: 'Intimate, low-key.',
    keyBeat:
      'The trail shrinks and stops at the Observer rather than continuing outward. Depth-based containment rather than a cut or a lecture.',
    context:
      'Your friend has just told you something about another student. It is the kind of thing that was clearly not meant to travel. They said it casually, and now they are watching to see what you do with it.',
    choices: [
      {
        id: 'A',
        text: 'Repeat it to the group later.',
        archetype: 'reactive',
        consequence:
          'It makes a good moment. By the end of the week, the person it was about knows, and the person who told you knows you were the bridge.',
      },
      {
        id: 'B',
        text: 'Change the subject fast.',
        archetype: 'avoidant',
        consequence:
          'You dodge it so quickly that your friend looks confused. The information is still out. It just does not know what you think of it.',
      },
      {
        id: 'C',
        text: 'Ask if the other person knows they shared it.',
        archetype: 'clarifying',
        consequence:
          'Your friend stops, then admits they probably do not. The question was enough. The secret turns back into what it was before it became currency.',
      },
      {
        id: 'D',
        text: 'Say you will keep it between you.',
        archetype: 'regulated',
        consequence:
          'And you do. It is a small, quiet act. Nothing visible changes, except that your friend now tells you things they tell no one else.',
      },
    ],
  },
  {
    id: '2d',
    title: 'The Public Mistake',
    stageId: 'school',
    canonical: false,
    psychologyTags: ['social threat', 'embarrassment', 'empathy', 'bystander behavior'],
    stageLanguage: STAGES[1].motionLanguage,
    cameraDirective:
      'Quick multi-angle cuts across the laughing classmates, handheld energy.',
    lightDirective: 'The mistaken student compresses toward the background of the frame.',
    keyBeat:
      'Cuts settle into one calm, steady mid-shot on the Observer, then a slow pan redirects toward the teacher or board. Redirection, not lingering.',
    context:
      'A kid at the front of the class just answered a question so badly that the whole room laughed, including the teacher by accident. The kid is red-faced and frozen. The laughter is already dying down.',
    choices: [
      {
        id: 'A',
        text: 'Laugh along with everyone.',
        archetype: 'reactive',
        consequence:
          'You join the wave late, when it is already ebbing. The kid looks at you for a second. You were one of the last faces they saw laughing.',
      },
      {
        id: 'B',
        text: 'Look away and say nothing.',
        archetype: 'avoidant',
        consequence:
          'The moment passes without you in it. The kid sits down. You tell yourself it was not your problem, and mostly believe it.',
      },
      {
        id: 'C',
        text: 'Catch their eye and give a small nod.',
        archetype: 'clarifying',
        consequence:
          'The kid meets your eye and looks away, then looks back. The room moves on. That one nod is the only part of the minute that stays with them.',
      },
      {
        id: 'D',
        text: 'Say the question was actually tricky.',
        archetype: 'regulated',
        consequence:
          'You say it to the teacher, not the room. The laughter has somewhere to go now. The kid exhales. The board gets its turn again.',
      },
    ],
  }
];
