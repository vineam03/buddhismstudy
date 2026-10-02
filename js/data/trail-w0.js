/* The Trail, World 0: Start Here.
   Shape and rules: docs/GAME_CONTRACT.md section 6. Design: docs/game-spec.json (world "w0").
   Old stories follow the library cards mn26, mn36, sn56.11, an3.65, mn63 and mn107.
   Check with: node tools/validate.js trail w0 */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w0",
  order: 0,
  title: "Start Here",
  tagline: "Who the Buddha was, what this is, and how it works.",
  stage: 0,
  goal: "By the end you can say who the Buddha was and describe the balanced way he found. You can test any advice, list a doctor's 4 questions, and say how this Trail works.",
  icon: "img/worlds/w0.svg",
  intro: "This is the starting gate. You meet a man who went looking for an answer, and you hear what he found. You learn a way to test any advice, even his. Then you get the map: 4 questions that the rest of the Trail takes one at a time.",

  lessons: [

    /* ---------------------------------------------------------------- w0-l1 */
    {
      id: "w0-l1",
      title: "A Man Who Went Looking",
      minutes: 3,
      icon: "img/icons/seated-figure.svg",
      objective: "After this lesson you can say who the Buddha was. He was a human being in ancient India. He went looking for an end to human hurt, found one, and taught it.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The young man who left home",
          text: "About 2,500 years ago in India, a young man had a home and parents who loved him.\n\nThen he saw a plain fact. Everyone grows old, and every life ends. That was true for him too. He asked one thing. Is there an end to the hurt this brings?\n\nHis parents wept, but he left home to look. He learned from 2 teachers. It was not enough, so he went on.\n\nIn time he found an answer. He almost kept it to himself. He thought nobody would understand. Then he chose to teach it. The next lesson tells how."
        },
        {
          type: "idea",
          text: "This man was a human being, not a god. He went looking for an end to human hurt, found one, and taught it. People call him the Buddha."
        },
        {
          type: "example",
          label: "Our example",
          title: "The way out of the forest",
          text: "Picture someone who cannot find the way out of a huge forest. After a long search she finds it. Then she walks back in and puts up signs for everyone else.\n\nShe is not magic. She is a person who looked hard and shared what she found. The Buddha was like that. What one person found, other people can learn."
        },
        {
          type: "try",
          text: "Take 3 slow breaths, or feel your feet on the floor instead. Then finish this sentence, out loud or in your head: ‘One thing about life I would like to understand is…’ Any answer is fine. Notice what comes up.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "Buddha",
          say: "BOOD-dah",
          old: "",
          means: "It means ‘the one who woke up’. Waking up here means seeing clearly how hurt begins and how it ends. The Buddha was a human teacher. The word is a title, like ‘Doctor’, not the name of a god."
        }
      ],
      quiz: [
        {
          q: "A friend asks you, ‘Was the Buddha a god?’ What is a fair answer?",
          options: [
            "Yes, a god who answers people's prayers",
            "No, a human being who taught",
            "No, a hero from a made-up tale"
          ],
          answer: 1,
          why: "He was a real person who looked for an answer, found one, and taught it.",
          again: "The old story is about a human being who went looking, found an answer, and shared it."
        },
        {
          q: "Your neighbor asks what the Buddha was looking for when he left home. What can you say?",
          options: [
            "A way to get rich and lucky",
            "A way to never grow old",
            "A way out of human hurt"
          ],
          answer: 2,
          why: "He knew growing old comes to everyone, so he looked for an end to the hurt it brings.",
          again: "He saw that everyone grows old, and he went looking for an end to the hurt in a human life."
        },
        {
          q: "The Buddha was a human being, not a god. What does that mean for other people?",
          options: [
            "They can learn what he found",
            "His teaching is worth less",
            "Only he could ever find it"
          ],
          answer: 0,
          why: "He was a person who searched and then taught, so what he found is something people can learn.",
          again: "The Buddha was a human being who looked hard and then shared what he found with others."
        }
      ],
      canNow: "You can now say who the Buddha was: a person who looked for an end to hurt and taught it.",
      deeper: [
        { label: "The Buddha's own story of leaving home", href: "suttas.html#mn26" }
      ]
    },

    /* ---------------------------------------------------------------- w0-l2 */
    {
      id: "w0-l2",
      title: "Not Too Soft, Not Too Hard",
      minutes: 4,
      icon: "img/icons/balance-scale.svg",
      objective: "After this lesson you can explain the balanced way the Buddha found. Spoiling yourself does not work. Punishing yourself does not work either.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "6 hard years",
          text: "The young man from lesson 1 thought being hard on himself would bring his answer. He tried for 6 years. He ate almost nothing. No answer came.\n\nThen he remembered being calm and happy as a child. He asked himself, ‘Why am I afraid of a joy like that?’ So he ate and grew strong again.\n\nAfter that he saw clearly how hurt begins and how it ends. People call that waking up, and call him the Buddha.\n\nHe gave his first talk to 5 old friends. It named 2 ways that do not work: spoiling yourself and punishing yourself."
        },
        {
          type: "idea",
          text: "Being too soft on yourself does not work. Being too hard on yourself does not work either. The Buddha taught a balanced way between the two."
        },
        {
          type: "example",
          label: "Our example",
          title: "10 new words",
          text: "You want to learn 10 words of a new language.\n\nPlan A: study only when it feels fun. Stop for a treat at the first hard word. Weeks pass.\n\nPlan B: study for 5 hours and scold yourself at every slip. By day 2 you are worn out.\n\nPlan C: 10 minutes a day, with a kind word when you slip. That is the balanced way, and it lasts."
        },
        {
          type: "try",
          text: "Pick one thing: sleep, food, screen time or daily tasks. Ask, out loud or in your head: ‘Am I too soft on myself here, too hard, or about right?’ Only notice the answer. There is no fixing today.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "middle way",
          say: "",
          old: "",
          means: "The balanced way: not too soft on yourself, and not too hard. It is the Buddha's own name for the way he taught."
        }
      ],
      quiz: [
        {
          q: "You did not finish a task today. Which thought fits the middle way?",
          options: [
            "‘I am useless. No rest until it is done.’",
            "‘It does not matter. I will forget about it.’",
            "‘I will rest, then do a small part tomorrow.’"
          ],
          answer: 2,
          why: "It does not punish you and it does not drop the task, so it can last.",
          again: "The middle way is the balanced way: not too soft on yourself, and not too hard."
        },
        {
          q: "A friend says, ‘If it hurts more, it must be working.’ What did the Buddha find in his 6 hard years?",
          options: [
            "Being hard on himself did not work",
            "He needed to be even harder, for longer",
            "Comfort is all that anyone ever needs"
          ],
          answer: 0,
          why: "He was as hard on himself as a person can be, and it did not help.",
          again: "Being too hard on yourself does not work, and being too soft does not work either."
        },
        {
          q: "Someone says, ‘The Buddha was born knowing everything.’ What does the old story say?",
          options: [
            "He was a god, so he always knew",
            "He was a person who had to go looking",
            "He gave up and never found an answer"
          ],
          answer: 1,
          why: "He was a human being who left home, searched, and only then found an answer.",
          again: "The Buddha was a human being who went looking for an end to hurt, found one, and taught it.",
          lookBack: "w0-l1"
        }
      ],
      canNow: "You can now explain the middle way: not too soft on yourself, and not too hard.",
      deeper: [
        { label: "The Buddha's 6 hard years, in his own words", href: "suttas.html#mn36" },
        { label: "The Buddha's first talk", href: "suttas.html#sn56.11" }
      ]
    },

    /* ---------------------------------------------------------------- w0-l3 */
    {
      id: "w0-l3",
      title: "Try It and See",
      minutes: 4,
      icon: "img/icons/magnifier.svg",
      objective: "After this lesson you can use the Buddha's 2-part test for any advice. When people live by it, does it lead to harm or to good? What do wise, kind people say about it?",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "A town full of teachers",
          text: "The people of one town were confused. Many teachers passed through. Each one said his own teaching was best and the others were no good. So the people asked the Buddha who to believe.\n\nHe gave them a test. Do not accept a thing only because it is old, or written down, or said by your teacher. Look at what happens when people live by it. Ask what wise people say about it. If it leads to harm, drop it. If it leads to good, keep it."
        },
        {
          type: "idea",
          text: "Test advice in 2 ways. When people live by it, does it lead to harm or to good? And what do wise, kind people say about it?"
        },
        {
          type: "example",
          label: "Our example",
          title: "A tip on a screen",
          text: "A post online says, ‘Never say sorry. It makes you look weak.’ You run the test.\n\nPart 1: what happens when people live by it? Their friends feel hurt, and trust fades.\n\nPart 2: what do wise, kind people say? The kindest people you know say sorry often.\n\nIt leads to harm, so you let that advice go."
        },
        {
          type: "try",
          text: "Think of one small piece of advice you once followed, like a tip about cooking or sleep. Ask 2 things. Did it lead to good or to harm? What would a wise, kind person you trust say about it? Notice what you find. You can use this same test on everything here, this website included.",
          seconds: 60,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "A famous person online says, ‘Buy this and your worries will end.’ What does the Buddha's test look at?",
          options: [
            "How famous and well liked the person is",
            "What happens to people who follow it",
            "How many people liked the post"
          ],
          answer: 1,
          why: "The test looks at what advice does in real lives, not at who said it.",
          again: "The test asks what advice leads to when people live by it, and what wise, kind people say."
        },
        {
          q: "An old family saying tells you, ‘Never trust a stranger.’ What does the test tell you to do with it?",
          options: [
            "Keep it, because old sayings are always wise",
            "Drop it, because old sayings are too old to help",
            "See what it leads to, and ask someone wise"
          ],
          answer: 2,
          why: "The test asks what a saying leads to and what wise people say, not how old it is.",
          again: "The test looks at what a saying leads to and asks wise, kind people, whatever its age."
        },
        {
          q: "You are learning something new and you feel tired. Which plan fits the middle way?",
          options: [
            "Rest a little, then do a little more",
            "Push on all night with no break at all",
            "Give up, because it feels too hard"
          ],
          answer: 0,
          why: "A short rest and one small next step is neither too soft nor too hard.",
          again: "The middle way is the balanced way: not too soft on yourself, and not too hard.",
          lookBack: "w0-l2"
        }
      ],
      canNow: "You can now test any advice: what does it lead to, and what do wise, kind people say?",
      deeper: [
        { label: "The confused town, and the Buddha's test for any advice", href: "suttas.html#an3.65" },
        { label: "The elephant and the men who each touched one part", href: "suttas.html#ud6.4" }
      ]
    },

    /* ---------------------------------------------------------------- w0-l4 */
    {
      id: "w0-l4",
      title: "The Doctor's Four Questions",
      minutes: 4,
      icon: "img/icons/medicine-bag.svg",
      objective: "After this lesson you can list a good doctor's 4 questions. They are: what hurts, why, can it stop, and what is the treatment. You know they are the map of this whole Trail, with good news at question 3.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "At the doctor's",
          text: "Your knee hurts, so you see a doctor. A good doctor asks 4 things. What hurts? Why does it hurt? Can it get better? What is the treatment?\n\nThe Buddha's first talk took the same 4 steps. It was about the hurt in a human life, not about knees. Here are his short answers. Something hurts. There is a cause. The hurt we add on top of pain can stop. There is a training.\n\nThe worlds ahead take these one at a time."
        },
        {
          type: "idea",
          text: "The Buddha's teaching follows a doctor's 4 questions: what hurts, why, can it stop, and what is the treatment. They are the map of this Trail. The good news comes at question 3: the worry and upset we add on top of pain can stop."
        },
        {
          type: "example",
          label: "Our example",
          title: "A drooping plant",
          text: "A plant on your windowsill droops. What is wrong? Its leaves hang down. Why? The soil is dry. Can it get better? Yes. What is the treatment? A little water each day.\n\nNotice question 3. If you stopped at question 2, you would have only the bad news. The Buddha did not stop there."
        },
        {
          type: "try",
          text: "Think of one small ache you have today, like a sore back or a small worry. Ask the 4 questions about it. What hurts? Why? Can it get better? What would help? ‘I do not know’ is a fine answer. There is nothing to fix right now. Notice how it feels to ask.",
          seconds: 60,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "A friend says, ‘The Buddha only talked about how much life hurts.’ What do the 4 questions show?",
          options: [
            "He stopped at the bad news",
            "He said the hurt can stop, and how",
            "He said the hurt is not real at all"
          ],
          answer: 1,
          why: "Questions 3 and 4 bring the good news: the added hurt can stop, and there is a training.",
          again: "A good doctor does not stop at what hurts and why; questions 3 and 4 bring good news."
        },
        {
          q: "Someone asks, ‘If I follow this training, will my body stop aching?’ What is a fair answer?",
          options: [
            "Yes, all pain goes away forever",
            "No, the hurt always stays the same",
            "Pain still comes; the added hurt can stop"
          ],
          answer: 2,
          why: "Bodies still ache and grow old, and what can stop is the extra hurt we add on top.",
          again: "The good news at question 3 is about the hurt we add on top of pain, not about pain itself."
        },
        {
          q: "You like a piece of advice and want to follow it. What does the Buddha's test ask you to do before you follow it?",
          options: [
            "Ask what wise, kind people say about it",
            "Nothing, because liking it is enough",
            "Check that it is old enough"
          ],
          answer: 0,
          why: "The test has 2 parts: what the advice leads to, and what wise, kind people say.",
          again: "The test looks at what advice leads to in real lives, and it listens to wise, kind people too.",
          lookBack: "w0-l3"
        }
      ],
      canNow: "You can now list the doctor's 4 questions and say where the good news comes.",
      deeper: [
        { label: "The Buddha's first talk", href: "suttas.html#sn56.11" },
        { label: "Why only these four questions? The poisoned arrow story", href: "suttas.html#mn63" }
      ]
    },

    /* ---------------------------------------------------------------- w0-l5 */
    {
      id: "w0-l5",
      title: "One Step at a Time",
      minutes: 4,
      icon: "img/icons/stepping-stones.svg",
      objective: "After this lesson you can explain how the Trail works. The steps are small and come in a set order. Each one rests on the one before. A missed answer loses you nothing.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The accountant's question",
          text: "An accountant came to see the Buddha. An accountant's job is to keep count of money. He said, ‘My job is learned step by step. Is your training like that?’\n\n‘Yes,’ said the Buddha. He teaches one skill first. He gives the next one only when the first is steady. A horse trainer trains a fine horse the same way.\n\nThen the Buddha said he only shows the way. Each person does the walking."
        },
        {
          type: "idea",
          text: "This Trail works step by step. Each small lesson rests on the one before it. A missed answer costs you nothing: you see the idea again and pick again."
        },
        {
          type: "example",
          label: "Our example",
          title: "Learning to cook",
          text: "Think about learning to cook. First you boil an egg. Next you make a soup. Later you cook a whole meal. Nobody starts with the big meal.\n\nIf the soup burns, nothing is taken from you. You have learned something, and you make it again. This Trail is the same: small steps, in order, and a slip costs nothing."
        },
        {
          type: "try",
          text: "Picture a line of stepping stones. Look only at the next stone, not the whole line. Say, out loud or in your head: ‘One small step is enough for today.’ Then notice how that feels.",
          seconds: 30,
          quietText: ""
        },
        {
          type: "word",
          term: "sutta",
          say: "SOOT-tah",
          old: "",
          means: "One of the old talks, by the Buddha or his first students. Most of the old stories on this Trail come from suttas. So do most of the 67 cards in this site's library."
        }
      ],
      quiz: [
        {
          q: "You pick an answer in a quick check, and it is not the right one. What happens next?",
          options: [
            "The idea comes back, and you choose again",
            "You start the lesson over from card 1",
            "The next lesson stays closed to you"
          ],
          answer: 0,
          why: "A missed answer costs nothing here; it is one more look at the idea.",
          again: "On this Trail a missed answer takes nothing away, and you get one more look."
        },
        {
          q: "You want to learn to draw. What does the step-by-step way suggest?",
          options: [
            "Begin with the hardest picture you can find",
            "Wait until you have a whole free month",
            "Start with simple shapes and build on them"
          ],
          answer: 2,
          why: "Each small step gives the next one something to rest on.",
          again: "Skills grow in small steps, and each step rests on the one before it."
        },
        {
          q: "A friend keeps listing what hurts and why. Which of the doctor's questions brings the good news?",
          options: [
            "‘Whose fault is this?’",
            "‘Can it stop?’",
            "‘What else could go badly?’"
          ],
          answer: 1,
          why: "Question 3 asks whether the added hurt can stop, and the Buddha's short answer is yes.",
          again: "The doctor's questions do not end at what hurts and why; the third one turns toward good news.",
          lookBack: "w0-l4"
        }
      ],
      canNow: "You can now explain how the Trail works: small steps in order, and a missed answer costs nothing.",
      deeper: [
        { label: "The accountant who asked if the training goes step by step", href: "suttas.html#mn107" },
        { label: "The word list, in plain English", href: "glossary.html" }
      ]
    }
  ],

  boss: {
    title: "The Starting Gate Check",
    intro: "5 short questions, one from each lesson in this world. There is no score. If you miss one, you see the idea again and pick again.",
    questions: [
      {
        q: "You see a statue of the Buddha in a garden. In the old story, who was he?",
        options: [
          "A god who brings good luck to people who pray",
          "A human teacher who looked for an answer",
          "A king who ruled a land long ago"
        ],
        answer: 1,
        why: "The Buddha was a human being who searched, found an answer, and taught it.",
        again: "The old story tells of a human being who looked for an end to hurt and then taught it.",
        lesson: "w0-l1"
      },
      {
        q: "You want to tidy a very messy room. Which plan fits the middle way?",
        options: [
          "Clean all night without stopping to eat",
          "Leave it, because it is too much",
          "Do one corner today, then rest"
        ],
        answer: 2,
        why: "One corner and a rest is neither too hard on you nor too soft.",
        again: "The middle way is balanced: it does not punish you, and it does not drop the task.",
        lesson: "w0-l2"
      },
      {
        q: "Two friends argue. Each says, ‘My way is the only right one.’ How can you test what they say?",
        options: [
          "Trust the one who sounds most sure",
          "Stop listening to both of them",
          "Look at what each way leads to"
        ],
        answer: 2,
        why: "The test looks at what a teaching leads to, and at what wise, kind people say.",
        again: "The Buddha's test does not go by who is talking; it looks at what the advice leads to.",
        lesson: "w0-l3"
      },
      {
        q: "Your room feels cold. You find out why: a window is open. Which of the doctor's questions comes next?",
        options: [
          "‘Can this get better?’",
          "‘What hurts?’",
          "‘Whose fault is it?’"
        ],
        answer: 0,
        why: "After the cause, a good doctor asks if it can get better, and then what will help.",
        again: "The questions run in order: what hurts, why, can it stop, and what is the treatment.",
        lesson: "w0-l4"
      },
      {
        q: "A lesson feels hard today, and you miss 2 answers. What is true on this Trail?",
        options: [
          "You have fallen behind other people",
          "Nothing is taken away, and the lesson waits",
          "This is not for people like you"
        ],
        answer: 1,
        why: "A missed answer costs nothing here, and each small step waits until you are ready.",
        again: "This Trail is small steps with nobody to keep up with, and a missed answer brings the idea back.",
        lesson: "w0-l5"
      }
    ]
  }
});
