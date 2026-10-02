/* The Trail, World 5: The Steady Mind. Lesson content and the world check.
   Shape and rules: docs/GAME_CONTRACT.md section 6. Design: docs/game-spec.json. */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w5",
  order: 5,
  title: "The Steady Mind",
  tagline: "The treatment, part 2. Train your attention gently, like tuning a string.",
  stage: 3,
  goal: "You can run a short daily training for your mind. You tune your effort and choose which thoughts to feed. You remember to notice, rest on the breath, and name what gets in the way.",
  icon: "img/worlds/w5.svg",
  intro: "The treatment is a training with 3 jobs. World 4 was the first job: living kindly. This world is the second job: steadying the mind. You train your attention the way a musician tunes a string. Gently, and a little at a time.",
  lessons: [
    {
      id: "w5-l1",
      title: "Not Too Tight, Not Too Loose",
      minutes: 4,
      icon: "img/icons/lute.svg",
      objective: "After this lesson you can find the right amount of effort, like a string that is not too tight and not too loose.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "Sona and the lute",
          text: "Sona was a monk (someone who trains full time). Before that, he played the lute (an old stringed instrument, like a guitar).\n\nSona trained by walking up and down. He walked for so long that his feet bled. He thought about giving up.\n\nThe Buddha asked him, “When your strings were too tight, was your lute in tune?” “No.” “And when they were too loose?” “No.”\n\nThe Buddha told him to tune his effort the same way. Too much effort makes you restless, he said. Too little makes you drift. Sona tuned his effort and kept training."
        },
        {
          type: "idea",
          text: "Good effort is like a tuned string: not too tight, not too loose. Too much effort tires you out, and too little lets you drift. This is the middle way (not too soft, not too hard), used every day."
        },
        {
          type: "example",
          label: "Our example",
          title: "10 minutes a day",
          text: "You want to learn a new language. On Monday you study for 3 hours and end up worn out. You skip the rest of the week. That string was too tight, and then too loose. Next week you try 10 minutes a day. It feels small. But a month later you are still going."
        },
        {
          type: "try",
          text: "Check your effort on this Trail right now. Too tight feels like rushing or tension. Too loose feels like drifting. Make one small change toward the middle: slow down, or sit up a little. If you are tired, stopping here for today is the right tuning. A tired day is normal. Notice how the change feels.",
          seconds: 30,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You start learning to sew. On day 1 you try to make a whole coat, tangle the thread, and want to give up. What would tuning your effort look like?",
          options: ["Try even harder tomorrow", "Sew one small seam a day", "Stop, because sewing is not for you"],
          answer: 1,
          why: "A small, steady amount is the tuned string: you can keep it up.",
          again: "Good effort is not too tight and not too loose: look for an amount you can keep up."
        },
        {
          q: "You keep a book by the bed, to read ‘when I feel like it’. That feeling never comes. What would tune your effort?",
          options: ["Read for 3 hours tonight to catch up", "Wait for a stronger mood", "Read for 5 minutes at a set time"],
          answer: 2,
          why: "This string was too loose, and a small steady turn brings it into tune.",
          again: "A string can be too tight or too loose, and the fix is a small turn toward the middle."
        },
        {
          q: "Your friend asks if you see a problem with her plan. You do. Which reply passes all 4 gates for words?",
          options: ["Tell her kindly, at a calm moment, what you see", "Say it is perfect, so she stays happy", "Tell her harshly in front of everyone"],
          answer: 0,
          why: "It is true, helpful, said with care and well timed, even though it is hard to hear.",
          again: "The 4 gates ask: is it true, helpful, said with care, and is this the right time?",
          lookBack: "w4-l5"
        }
      ],
      canNow: "You can now check your effort and make one small change toward the middle.",
      deeper: [
        { label: "Sona and the lute strings, the full story", href: "suttas.html#an6.55" },
        { label: "The middle way, in the Buddha’s first talk", href: "suttas.html#sn56.11" }
      ]
    },
    {
      id: "w5-l2",
      title: "What You Feed Grows",
      minutes: 4,
      icon: "img/icons/seed.svg",
      objective: "After this lesson you can explain that whatever the mind thinks about again and again becomes its habit. You can sort a thought as ‘helps’ or ‘harms’.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "2 piles of thoughts",
          text: "The Buddha once told how he trained his mind in his years of searching, before he woke up.\n\nHe watched his own thoughts and sorted them into 2 piles. One pile held greedy thoughts, angry thoughts and cruel thoughts. The other pile held thoughts with no greed, anger or cruelty in them.\n\nThen he watched what each pile did. The first kind hurt him, hurt others, and made it hard to see clearly. The second kind harmed no one.\n\nHe said that whatever you think about again and again becomes the way your mind leans."
        },
        {
          type: "idea",
          text: "What you think about again and again becomes your mind’s habit. Thoughts do not follow orders, so you cannot make one leave. But you can choose which ones you feed by coming back to them."
        },
        {
          type: "example",
          label: "Our example",
          title: "2 plants on a windowsill",
          text: "Two plants sit on a windowsill. You water one every day and forget the other. In a month you know which is bigger. Thoughts grow the same way. Replay a grumble (a small complaint) and you water it. Replay a kind plan and you water that. Everyone waters both. The skill is seeing which one you are watering."
        },
        {
          type: "try",
          text: "Catch the next 3 thoughts that come. Put each one in a pile: ‘helps’ or ‘harms’. Not sure? Let that one go and take the next. No need to change them or to judge yourself. Sorting is the whole exercise. At the end, notice which pile got more.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "Each morning you spend a minute thinking of one thing you are thankful for. If you keep doing this, what is likely to happen?",
          options: ["The thankful feeling gets used up and runs out", "Feeling thankful becomes more of a habit", "Nothing changes; thoughts leave no mark"],
          answer: 1,
          why: "A thought you come back to again and again grows stronger, like the plant that gets watered.",
          again: "Whatever the mind goes back to again and again becomes its habit, the way a watered plant grows."
        },
        {
          q: "You catch an unkind thought about a neighbor. What does this lesson suggest you do first?",
          options: ["Sort it: this one goes in the ‘harms’ pile", "Blame yourself for having it", "Order it to leave at once"],
          answer: 0,
          why: "Sorting is the skill: you see which pile it belongs in, and you choose not to feed it.",
          again: "Thoughts do not follow orders and blame does not help, but you can see what kind of thought it is."
        },
        {
          q: "A friend is offered extra pay to sell something that makes people sick. Which question did the honest work lesson teach?",
          options: ["Will this make me money fast?", "Will anyone find out?", "Does this harm anyone?"],
          answer: 2,
          why: "Honest work is tested by one question: does it harm anyone?",
          again: "The honest work question looks at what the work does to other people.",
          lookBack: "w4-l6"
        }
      ],
      canNow: "You can now sort a thought as ‘helps’ or ‘harms’ and choose which kind to feed.",
      deeper: [
        { label: "How the Buddha sorted his own thoughts into 2 kinds", href: "suttas.html#mn19" }
      ]
    },
    {
      id: "w5-l3",
      title: "Swap the Thought",
      minutes: 4,
      icon: "img/icons/peg.svg",
      objective: "After this lesson you can swap a sticky unhelpful thought for a helpful one, instead of wrestling with it.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The carpenter’s peg",
          text: "A carpenter has a rough peg (a short wooden pin) stuck in a hole. He takes a smaller, smoother peg and taps it in. That knocks the rough peg out.\n\nThe Buddha said to do the same with a thought that will not leave. Put its opposite in its place.\n\nThis was the first of 5 tools he gave. Pushing the thought out by force came last, for when nothing else works."
        },
        {
          type: "idea",
          text: "When an unhelpful thought sticks, do not wrestle with it. Swap in a helpful one. You are not ordering the old thought out; you are giving your mind something better to hold."
        },
        {
          type: "example",
          label: "Our example",
          title: "The careless joke",
          text: "A friend made a careless joke about you yesterday. All morning one thought keeps coming back: ‘They never think before they speak.’ You push it away, and it returns at once. So you swap. You bring up one true, kind fact: ‘They sat with me for hours when I was sad.’ The grumble gets a little weaker."
        },
        {
          type: "try",
          text: "Pick one small thought that keeps coming back. Choose its opposite. For a grumble, pick one thing you are thankful for. For a worry, pick one thing that is fine right now. Hold the new thought for 3 slow breaths, or a slow count of 10. Then notice what the old thought is doing.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "Before a visit to the dentist, one thought keeps circling in your mind: ‘It will be awful.’ What would the swap be?",
          options: ["Shout ‘stop!’ at the thought", "Go over the worry until it is solved", "Think of one thing that is fine right now"],
          answer: 2,
          why: "A helpful thought goes in the place of the sticky one, like the smoother peg.",
          again: "The carpenter does not fight the rough peg; he taps a smoother one into its place."
        },
        {
          q: "You try the swap. A minute later the old grumble is back. What fits this lesson?",
          options: ["That is normal; you can swap again, gently", "The swap does not work for you", "You need to fight the thought harder"],
          answer: 0,
          why: "Thoughts do not follow orders, so the swap is a gentle move you can repeat.",
          again: "A thought may come back many times, and that is expected; the gentle move still comes first."
        },
        {
          q: "You study for 2 hours without a break, get a headache, and want to give up completely. What does the lute story suggest?",
          options: ["Push on for a third hour", "Change to a small, steady amount", "Quit, because this is not for you"],
          answer: 1,
          why: "Effort works best in the middle: not so tight it snaps, not so loose it drifts.",
          again: "A string plays well when it is not too tight and not too loose, and effort is tuned the same way.",
          lookBack: "w5-l1"
        }
      ],
      canNow: "You can now swap a sticky thought for a helpful one instead of wrestling with it.",
      deeper: [
        { label: "The Buddha’s 5 tools for a thought that will not leave", href: "suttas.html#mn20" }
      ]
    },
    {
      id: "w5-l4",
      title: "Remember to Notice",
      minutes: 4,
      icon: "img/icons/bell.svg",
      objective: "After this lesson you can explain mindfulness: remembering to notice what is happening right now, in the body, in the quick tag and in the mood.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "Where did the sandwich go?",
          text: "You ride home. You arrive and cannot remember the last 10 minutes. You eat a whole sandwich and never taste it.\n\nThe body was there. The noticing was not.\n\nThis happens to everyone, many times a day. The Buddha’s training brings the noticing back with one small move: remember to notice. You do it now. Later you drift, and you do it again."
        },
        {
          type: "idea",
          text: "The skill is remembering to notice what is happening right now. Here are 3 places to look: your body, the quick tag (nice, nasty or neutral) and your mood. You only look; nothing needs fixing."
        },
        {
          type: "example",
          label: "The Buddha said",
          title: "Where to look",
          text: "The Buddha taught his students where to look. Body: feel the breath, or the way you are sitting. Tag: is this nice, nasty or neutral? Mood: is the mind tight or scattered? In each place, you see what is here right now."
        },
        {
          type: "try",
          text: "Do a 3-step check-in, about 10 seconds a step. Body: what is one thing you feel, such as your feet or hands? Tag: is it nice, nasty or neutral? Mood: is the weather in your mind calm, stormy or dull? You do not need to change anything. Noticing is the exercise.",
          seconds: 30,
          quietText: ""
        },
        {
          type: "word",
          term: "mindfulness",
          say: "",
          old: "",
          means: "Remembering to notice what is happening right now. It is something you do, again and again. It is not a special state."
        }
      ],
      quiz: [
        {
          q: "Halfway through washing the dishes, you see that you have been replaying an old argument. What is happening in the moment you see it?",
          options: ["A sign you are bad at this", "The noticing coming back", "Proof the argument still matters"],
          answer: 1,
          why: "The moment you see where your mind went, you have remembered to notice.",
          again: "The skill is remembering to notice what is happening right now, and every time you remember counts."
        },
        {
          q: "You feel grumpy and do not know why. What would this lesson have you do?",
          options: ["Work out whose fault it is", "Act cheerful until it passes", "Notice it: ‘a grumpy mood is here’"],
          answer: 2,
          why: "Seeing the mood as it is right now is noticing; you do not have to fix or explain it.",
          again: "Noticing means seeing what is here right now, in body, tag or mood, with nothing to fix."
        },
        {
          q: "Every morning a friend spends an hour reading angry comments online. What is likely to grow?",
          options: ["A mind that leans toward anger", "Nothing; reading is not doing", "Calm, because the anger gets used up"],
          answer: 0,
          why: "Whatever the mind goes back to again and again becomes its habit.",
          again: "What you think about again and again gets stronger, like the plant that is watered every day.",
          lookBack: "w5-l2"
        }
      ],
      canNow: "You can now do a 3-step check-in: body, tag and mood.",
      deeper: [
        { label: "The Buddha’s guide to noticing, the short version", href: "suttas.html#mn10" },
        { label: "The poem about living in today", href: "suttas.html#mn131" },
        { label: "Modern Life topic: phones, scrolling and attention", href: "themes.html#digital" }
      ]
    },
    {
      id: "w5-l5",
      title: "One Breath at a Time",
      minutes: 5,
      icon: "img/icons/breath-wave.svg",
      objective: "After this lesson you can do one minute of breath practice: knowing ‘breathing in’ and ‘breathing out’, and gently coming back when the mind wanders.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "The puppy on a leash",
          text: "A puppy on a leash runs off every few seconds. You do not shout at it. You gently bring it back, again and again.\n\nTraining your attention on the breath works like that. The mind runs off. You bring it back.\n\nThe Buddha’s own instructions start very plainly. Breathing in, know you are breathing in. When the breath is long, know it is long. When it is short, know it is short. You do not have to control it."
        },
        {
          type: "idea",
          text: "Rest your attention on the breath and know ‘in’ and ‘out’. Your mind will wander, and that is normal. Each gentle coming back is the exercise."
        },
        {
          type: "example",
          label: "Our example",
          title: "One lift at a time",
          text: "A person who lifts a weight again and again gets a stronger arm. Each lift counts. In breath practice, one lift is this: you notice you drifted, and you come back. So a minute with 10 drifts is not a bad minute. It is 10 lifts."
        },
        {
          type: "try",
          text: "Sit comfortably. For about 10 breaths, say ‘in’ and ‘out’ in your head. When you drift, say ‘back’ in your head and carry on. Drifting is normal. If watching the breath feels bad, feel your feet on the floor instead. Both count the same. At the end, notice how you feel.",
          seconds: 60,
          quietText: ""
        },
        {
          type: "word",
          term: "meditation",
          say: "",
          old: "",
          means: "Exercise for your attention, done on purpose, a little at a time. It does not mean emptying your mind."
        }
      ],
      quiz: [
        {
          q: "You try 10 breaths. By breath 3 you are planning dinner. Then you notice. What now?",
          options: ["Go back to 1 and try harder not to think", "Finish planning dinner first, then start again", "Say ‘back’ and return to the breath"],
          answer: 2,
          why: "Noticing the drift and gently returning is the practice itself.",
          again: "Like the puppy on the leash, the mind runs off and is brought back gently, with no force."
        },
        {
          q: "A friend says, ‘My mind kept thinking, so my minute did not count.’ What would this lesson say?",
          options: ["True, a good minute has no thoughts", "Thoughts are expected; coming back is the exercise", "The friend needs to sit for much longer"],
          answer: 1,
          why: "The exercise is the coming back, so a minute with many returns is a full minute of training.",
          again: "The mind is expected to wander, and each gentle return is one more lift for your attention."
        },
        {
          q: "A grumble about the rainy weather keeps circling in your head. What did the carpenter’s peg teach?",
          options: ["Bring to mind one thing you are thankful for", "Clench your teeth and force it out", "Keep grumbling until it wears out"],
          answer: 0,
          why: "A helpful thought tapped in takes the place of the sticky one.",
          again: "With a thought that will not leave, the first tool is to put its opposite in its place.",
          lookBack: "w5-l3"
        }
      ],
      canNow: "You can now rest your attention on your breath or your feet and gently come back when you drift.",
      deeper: [
        { label: "The Buddha’s breath training, step by step", href: "suttas.html#mn118" }
      ]
    },
    {
      id: "w5-l6",
      title: "Five Things That Get in the Way",
      minutes: 4,
      icon: "img/icons/wind.svg",
      objective: "After this lesson you can treat the 5 things that get in the way of a steady mind as normal visitors: wanting, annoyance, sleepiness, fidgeting and doubt. You name the one that is here and carry on.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "5 visitors",
          text: "You sit down for 10 breaths. Within a minute you want a snack. Or a noise annoys you. Or you feel sleepy, or fidgety (you cannot keep still). Or you think, ‘Is this even working?’\n\nThis is all normal. The Buddha’s training expects these 5 and asks you to know them well.\n\nThey are like the ups and downs you met in World 1. They blow through everyone, like weather. Name the one that is here, and carry on."
        },
        {
          type: "idea",
          text: "Wanting, annoyance, sleepiness, fidgeting and doubt are normal visitors. They do not mean you are doing it badly. Name the one that is here, and carry on."
        },
        {
          type: "example",
          label: "Our example",
          title: "A visitor at the door",
          text: "You are on breath 4. Your leg wants to move. Your hand wants to scratch an itch. Before, you might have thought, ‘I am no good at this.’ Now you say, ‘Fidgety. A visitor.’ You do not chase it out or follow it. You take the next breath. Some days all 5 come by. That is an ordinary day."
        },
        {
          type: "try",
          text: "Take 5 breaths, or feel your feet for a slow count of 20. When something gets in the way, name it: wanting, annoyed, sleepy, fidgety or doubting. Say ‘a visitor’. Then go back to the breath or to your feet. At the end, notice who came by. If no one came, that is fine too.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "Halfway through a quiet minute, you think, ‘Am I even doing this right? Is it pointless?’ How does this lesson see that thought?",
          options: ["Doubt, one of the usual visitors", "A question you have to answer before going on", "A sign the practice is not working"],
          answer: 0,
          why: "Doubt is one of the 5 the training expects, so you can name it and carry on.",
          again: "The training expects thoughts like this one, so it is normal when one comes."
        },
        {
          q: "A dog barks during your 10 breaths and you feel annoyed. What fits this lesson?",
          options: ["Wait until you find a silent place", "Name it, ‘annoyed, a visitor’, and return", "Count the minute as wasted"],
          answer: 1,
          why: "Naming the visitor lets you carry on without fighting it or following it.",
          again: "What gets in the way is a normal visitor: name the one that is here, then return."
        },
        {
          q: "While waiting for a friend, you see you have been lost in worry for 5 minutes. What is the next helpful move?",
          options: ["Blame yourself for drifting off", "Go back over the worry more carefully", "Check in: body, tag, mood, right now"],
          answer: 2,
          why: "Seeing that you drifted is the noticing coming back, and a check-in keeps it here.",
          again: "Mindfulness means remembering to notice what is happening right now, with no blame for having drifted.",
          lookBack: "w5-l4"
        }
      ],
      canNow: "You can now name what gets in the way as a visitor and carry on.",
      deeper: [
        { label: "The Buddha’s full guide to noticing, which asks you to know these 5", href: "suttas.html#dn22" },
        { label: "The accountant who asked for a step-by-step training", href: "suttas.html#mn107" }
      ]
    }
  ],
  boss: {
    title: "The Tuning Check",
    intro: "5 short questions on this world. There is no score and nothing to lose. If an answer misses, you see the idea again and pick once more.",
    questions: [
      {
        q: "You planned 10 minutes of practice a day. Today you are worn out and do none. What does the lute story say about tomorrow?",
        options: ["Do double to make up for it", "Start again with a small, steady amount", "The plan is ruined, so drop it"],
        answer: 1,
        why: "A day with no practice is normal, and a small turn back toward the middle is how a string is tuned.",
        again: "Effort works best in the middle, and a day with no practice only means you tune again.",
        lesson: "w5-l1"
      },
      {
        q: "A friend says, ‘What I think about all day changes nothing. Thoughts are private.’ What did the Buddha notice?",
        options: ["Thoughts you repeat become the mind’s habit", "Thoughts only matter once you say them", "Thoughts are too quick to sort"],
        answer: 0,
        why: "He saw that whatever he thought about again and again grew stronger and shaped his mind.",
        again: "What you think about again and again is like a plant you water: it grows.",
        lesson: "w5-l2"
      },
      {
        q: "You sip a hot drink and, this time, really feel its warmth and taste. What just happened?",
        options: ["You emptied your mind", "You reached a special state", "You remembered to notice what is here"],
        answer: 2,
        why: "Mindfulness is remembering to notice what is happening right now, and you did.",
        again: "Mindfulness is an ordinary move, something you do, and you can make it at any moment.",
        lesson: "w5-l4"
      },
      {
        q: "On a crowded train you want one steady minute. Which is the breath practice from this world?",
        options: ["Know ‘in’ and ‘out’, and come back when you drift", "Take deep breaths and hold each one", "Try hard to think of nothing"],
        answer: 0,
        why: "You only know the breath as it is and gently return; there is nothing to control.",
        again: "The practice rests attention on the breath as it is, and each drift is followed by a gentle return.",
        lesson: "w5-l5"
      },
      {
        q: "You sit down for your quiet minute and feel very sleepy. What fits the lesson on the 5 things that get in the way?",
        options: ["Fight the sleepiness with all your force", "Name it, ‘sleepy, a visitor’, and carry on", "Decide the minute is spoiled and give up"],
        answer: 1,
        why: "Sleepiness is one of the 5 the training expects, so you can name it and carry on.",
        again: "These 5 visit everyone, and the move is to name the one that is here.",
        lesson: "w5-l6"
      }
    ]
  }
});
