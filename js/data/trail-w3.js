/* The Trail, World 3: Can It Stop?
   Lesson content. Shape and rules: docs/GAME_CONTRACT.md section 6.
   Check with: node tools/validate.js trail w3 */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w3",
  order: 3,
  title: "Can It Stop?",
  tagline: "The third question. Loosen the grip on ‘me’ and ‘mine’, and the fire has less to burn.",
  stage: 2,
  goal: "By the end you can treat a mood or a label as a passing thing. You can say that what you do on purpose is yours. You can say how the added hurt can stop.",
  icon: "img/worlds/w3.svg",
  intro: "You have seen what hurts and why. The three fires keep the hurt going: wanting, pushing away and fog. Now the doctor’s third question: can the added hurt stop? First you learn to hold moods, labels and ‘me’ with a lighter grip. That gives the fires less to burn. Then comes the answer. It is good news.",
  lessons: [

    /* ---------- w3-l1 ---------- */
    {
      id: "w3-l1",
      title: "The Monkey Mind",
      minutes: 4,
      icon: "img/icons/monkey.svg",
      objective: "After this lesson you can describe how the mind jumps from thing to thing all day. A mood is a passing visitor, not the final truth.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "The monkey in the forest",
          text: "The Buddha once spoke about how fast the mind changes. The body changes slowly, he said. Anyone can watch it age over many years. The mind is much quicker.\n\nHe gave a picture. A monkey swings through the forest. It grabs one branch, lets it go, and grabs the next.\n\nThe mind is like that, he said. It is one thing now and another thing a moment later, all day and all night."
        },
        {
          type: "idea",
          text: "Your mind jumps from thing to thing all day, like the monkey. So a mood is a passing visitor. It is not the final truth about you or your life."
        },
        {
          type: "example",
          label: "Our example",
          title: "The 11 o’clock mind",
          text: "It is 11 at night. You are tired, and everything feels ruined. At 8 in the morning you have slept and eaten. The same things look fine. It is the same life, seen by a different mind. The night mood felt like the truth. It was one branch."
        },
        {
          type: "try",
          text: "Put a time on your mood right now. Say, out loud or in your head: ‘This is the 3 o’clock mind.’ Use whatever time it is now. Then remember a different mood from earlier today. Same you, different branch. Notice that.",
          seconds: 40,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "At lunch a plan is canceled. For an hour you feel sure nothing ever works out. What does the monkey picture suggest?",
          options: [
            "Wait, and look at the day again later this afternoon",
            "A strong feeling shows how things really are, so trust this one",
            "Push the mood out at once, by force, before lunch ends"
          ],
          answer: 0,
          why: "A mood is a passing visitor, so it helps to wait a while before you trust what it tells you.",
          again: "The mind swings from mood to mood, so one mood is not the final truth about a day or a life."
        },
        {
          q: "You wake up cheerful and feel sure you will never be grumpy again. What would this lesson say?",
          options: [
            "Good moods are the real you. Bad moods are not.",
            "This mood is a visitor too. It will move on.",
            "A happy mood stays with you if you hold it tightly."
          ],
          answer: 1,
          why: "Pleasant moods are branches as well, and the mind lets go of them in its own time.",
          again: "Every mood, pleasant or not, is a visitor that comes and goes."
        },
        {
          q: "A fly keeps buzzing around your head, and it annoys you. Your whole body goes tight. Which of the three fires is burning?",
          options: [
            "Wanting: the ‘gotta have it’ pull toward a thing",
            "Fog: not seeing clearly what is going on",
            "Pushing away: the ‘get it away from me’ fire"
          ],
          answer: 2,
          why: "Annoyance is the pushing-away fire, which runs from mild annoyance all the way up to hate.",
          again: "There are three fires: the pull toward a thing, the push away from it, and the fog that hides both.",
          lookBack: "w2-l6"
        }
      ],
      canNow: "You can now put a time on a mood and treat it as a passing visitor.",
      deeper: [
        { label: "The monkey in the forest, in the Buddha’s words", href: "suttas.html#sn12.61" }
      ]
    },

    /* ---------- w3-l2 ---------- */
    {
      id: "w3-l2",
      title: "Who's the Boss?",
      minutes: 5,
      icon: "img/icons/tilted-crown.svg",
      objective: "After this lesson you can use the ‘boss test’. Body, moods and thoughts do not follow orders. So you look after them.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The second talk",
          text: "A few days after his first talk, the Buddha spoke to his first 5 students again. He gave them a test.\n\nIf your body were truly yours to command, he said, it would obey you. You could say, ‘Body, be like this. Do not be like that.’ But it does not obey. Feelings and thoughts do not obey either. They keep changing.\n\nSo is it wise, he asked, to hold them tightly and say, ‘This is me. This is mine’?\n\nThe 5 students saw his point. They let go of the tight grip, and they were free."
        },
        {
          type: "idea",
          text: "Your body, moods and thoughts do not follow your orders. So they are things to look after, not a ‘me’ that has to stay the same. This does not mean you do not exist."
        },
        {
          type: "example",
          label: "Our example",
          title: "3 orders nobody obeys",
          text: "Tell your hair to stop going gray. Tell your worry to switch off. Tell yourself at 2 in the morning, ‘Sleep now!’ None of them obey. If you were the boss, they would. That is the boss test. A gardener cannot order the rain. A good gardener looks after the plants. You can do that for your body and moods."
        },
        {
          type: "try",
          text: "Try new words for a feeling. Instead of ‘I am worried’, say ‘Worry is here’. Now name what you feel and add ‘is here’. Say it out loud or in your head. Notice if the feeling seems a little less tight. If nothing changes, that is fine. If this feels strange, stop and feel your feet on the floor.",
          seconds: 40,
          quietText: ""
        },
        {
          type: "word",
          term: "not-self",
          say: "",
          old: "",
          means: "‘This is not me, not mine to command.’ It is a way to hold things loosely. It does not mean ‘you don’t exist’."
        }
      ],
      quiz: [
        {
          q: "Your hands shake before you speak to a group. You order them to stop. They keep shaking. What does the boss test suggest?",
          options: [
            "You did not give the order firmly enough. Try it again, louder.",
            "Hands do not take orders. Be kind to them and carry on.",
            "The hands are not you, so nothing about them matters at all."
          ],
          answer: 1,
          why: "The body never followed orders, so looking after it works better than commanding it.",
          again: "Body, moods and thoughts do not obey commands, so they are things to look after."
        },
        {
          q: "A friend hears about this lesson and asks, ‘So the Buddha said I am not real?’ What is a fair reply?",
          options: [
            "Yes. He said nobody is really here at all.",
            "No. He said only your thoughts are the real you.",
            "No. He said to hold body and mind more loosely."
          ],
          answer: 2,
          why: "The teaching is about holding body and mind loosely, not about anyone being unreal.",
          again: "The Buddha did not say people are unreal, but pointed at the tight grip on things that never took orders."
        },
        {
          q: "In the afternoon you feel sad and think, ‘My whole life is boring.’ What helps, from the monkey lesson?",
          options: [
            "Put a time on the mood, then wait a while.",
            "Believe it. A sad mood is the one that sees clearly.",
            "Argue with the mood until you make it go away."
          ],
          answer: 0,
          why: "Putting a time on a mood reminds you that it is a visitor passing through.",
          again: "The mind jumps like a monkey, so one mood is a passing visitor and not the final truth.",
          lookBack: "w3-l1"
        }
      ],
      canNow: "You can now use the boss test: body, moods and thoughts do not take orders, so you look after them.",
      deeper: [
        { label: "The Buddha’s second talk, to his first 5 students", href: "suttas.html#sn22.59" }
      ]
    },

    /* ---------- w3-l3 ---------- */
    {
      id: "w3-l3",
      title: "The Chariot",
      minutes: 4,
      icon: "img/icons/chariot.svg",
      objective: "After this lesson you can explain that ‘me’ is a useful name for many changing parts working together. ‘Chariot’ is a name like that, for wheels, pole and frame.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The king and the chariot",
          text: "This story comes from a later book. A king came to question a monk (someone who leaves home to train full time).\n\nThe monk said, ‘My name is only a name. You will not find one unchanging person here.’ The king was puzzled. ‘Then who is talking to me?’\n\nThe monk asked about the king’s chariot, the cart that had carried him there. ‘Are the wheels the chariot? Is the pole? Is the frame?’ ‘No,’ said the king.\n\nThen he saw it. ‘Chariot’ is a name for the parts working together. ‘So it is with me,’ said the monk."
        },
        {
          type: "idea",
          text: "‘Me’ is a useful name for many changing parts working together. The chariot is real, and so are you. What you will not find is one unchanging thing hiding inside the parts."
        },
        {
          type: "example",
          label: "Our example",
          title: "Parts can be repaired",
          text: "One evening you think, ‘I am a mess.’ Look closer. Your body is tired. Your stomach is empty. One worry keeps coming back. Those are parts, and parts can be repaired. You can rest. You can eat. You can take the worry one step at a time. ‘A mess’ was a name for a few parts having a hard day."
        },
        {
          type: "try",
          text: "Name 5 parts of you today: a body feeling, a mood, a memory, a plan and a role. A role is something like helper, worker or friend. Count them as you go. Notice that each one can change. You are not stuck.",
          seconds: 60,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "After a bad morning, a friend says, ‘I am hopeless.’ How would the chariot idea look at it?",
          options: [
            "‘Hopeless’ is a name, so see which parts need care",
            "One bad morning is enough to show the real person",
            "Nobody is really there at all, so none of it matters"
          ],
          answer: 0,
          why: "A person is many changing parts, so one rough part is something to care for, not the whole truth.",
          again: "‘Me’ is a name for many changing parts working together, and each part can be looked after."
        },
        {
          q: "A team wins a game. Using the chariot idea, what is ‘the team’?",
          options: [
            "A hidden extra thing, apart from the players.",
            "Nothing at all. Only single players exist.",
            "A name for the players working together."
          ],
          answer: 2,
          why: "Like ‘chariot’, ‘team’ is a real and useful name for parts working together.",
          again: "The king found no chariot apart from its parts, and yet the chariot had carried him there."
        },
        {
          q: "You feel nervous before meeting someone new and tell yourself, ‘Calm down!’ You stay nervous. What does the boss test suggest?",
          options: [
            "Nervousness does not take orders, so look after it kindly",
            "Give the order again, louder, until the feeling obeys",
            "A mind that will not obey is a broken mind"
          ],
          answer: 0,
          why: "Moods never followed orders, so looking after them works better than commanding them.",
          again: "Body, moods and thoughts do not obey commands, which is why care works better than force.",
          lookBack: "w3-l2"
        }
      ],
      canNow: "You can now explain that ‘me’ is a useful name for many changing parts working together.",
      deeper: [
        { label: "The king, the monk and the chariot", href: "suttas.html#milinda" }
      ]
    },

    /* ---------- w3-l4 ---------- */
    {
      id: "w3-l4",
      title: "Bigger Than Your Labels",
      minutes: 4,
      icon: "img/icons/name-tag.svg",
      objective: "After this lesson you can see a label such as ‘too old’ as a name-tag. It is not the truth about what you can do.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "Soma and the mocking voice",
          text: "A nun (a woman who leaves home to train full time) named Soma sat down to train her mind.\n\nA mocking voice came to her. It said only the wisest people could fully train the mind. A woman never could.\n\nSoma was not shaken. ‘What does being a woman matter,’ she said, ‘when the mind is steady and sees clearly?’\n\nThe voice had nothing left to say. It vanished."
        },
        {
          type: "idea",
          text: "A label like ‘too old’ or ‘not good at this’ is a name-tag. It is not the truth about what you can do. The voice only has power when you believe the name-tag is you."
        },
        {
          type: "example",
          label: "Our example",
          title: "‘Not a reader’",
          text: "At school, someone told Dee she was ‘not a reader’. She wore that name-tag for 30 years. Then she tried one page a night. Some nights were slow. After some months she finished her first book. The name-tag never said what she could do. It only said what someone once called her."
        },
        {
          type: "try",
          text: "Think of one small label you carry, like ‘shy’ or ‘bad with numbers’. Say, out loud or in your head: ‘That is a name-tag. It is not all of me.’ Notice how that feels.",
          seconds: 30,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "At 60, a neighbor wants to learn to swim. Then he thinks, ‘I am too old for this.’ What would this lesson say?",
          options: [
            "Age labels are facts, so stopping is the wise choice",
            "He has to become the best swimmer to prove the label untrue",
            "‘Too old’ is a name-tag, so he can try one lesson"
          ],
          answer: 2,
          why: "A label is a name-tag, and what he can do shows up only when he tries.",
          again: "A label is a name-tag stuck on from outside, not the truth about what a person can do."
        },
        {
          q: "A friend says, ‘You are the strong one. You never need help.’ How does this lesson see that label?",
          options: [
            "Kind labels are always true. Only the unkind ones are name-tags.",
            "It is a name-tag too. You may still ask for help.",
            "Friends know you best, so you cannot ask for help now."
          ],
          answer: 1,
          why: "Pleasant labels are name-tags as well, so they do not decide what you can do or what you need.",
          again: "Every label, kind or unkind, is a name-tag and not the whole of a person."
        },
        {
          q: "Your neighbor speaks sharply to you, and you decide, ‘He is a rude man.’ What does the chariot idea say?",
          options: [
            "He is many changing parts. One part is having a hard day.",
            "One short moment is enough to show who he really is inside.",
            "He is not real. So his sharp words do not count."
          ],
          answer: 0,
          why: "‘He’ is a name for many changing parts, so one sharp moment is not the whole man.",
          again: "A person is a useful name for many changing parts working together, not one unchanging thing.",
          lookBack: "w3-l3"
        }
      ],
      canNow: "You can now spot a label as a name-tag, not the truth about what you can do.",
      deeper: [
        { label: "A nun answers the voice that says ‘you can’t’", href: "suttas.html#sn5.2" },
        { label: "Self and labels in everyday life", href: "themes.html#identity" }
      ]
    },

    /* ---------- w3-l5 ---------- */
    {
      id: "w3-l5",
      title: "Actions Are Seeds",
      minutes: 5,
      icon: "img/icons/seed.svg",
      objective: "After this lesson you can explain that what you do on purpose shapes who you become. Seeds grow into plants the same way. It is not fate, and nobody hands out a punishment.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "Owners of their actions",
          text: "A young man named Subha asked the Buddha why people’s lives turn out so different. The Buddha answered, ‘Beings are the owners of their actions.’ Beings means all living things.\n\nIn an old verse he gave a picture. Act with a clear mind, and ease follows like a shadow that never leaves.\n\nThe old texts say these results can ripen over many lifetimes. You can leave that question open. One part you can see for yourself today: how habits grow."
        },
        {
          type: "idea",
          text: "What you do on purpose is a seed, and it shapes who you become. Each angry act makes the next one easier, and each kind act makes kindness easier. This is not fate, and nobody is handing out a punishment."
        },
        {
          type: "example",
          label: "Our example",
          title: "Plant chilies, get chilies",
          text: "Plant chilies, get chilies. Plant mangoes, get mangoes. You cannot order a mood to leave. But what you do on purpose is yours. Speak sharply every morning, and sharp words get easier. Say one kind thing every morning, and kindness gets easier. Nobody hands you the result. It grows, the way plants do. Hard things still come to everyone. They are not a punishment."
        },
        {
          type: "try",
          text: "Name one thing you did on purpose today. It can be very small. Ask yourself: if I planted this seed every day for a year, what would grow? Notice your answer. There is nothing to fix.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "karma",
          say: "KAR-mah",
          old: "",
          means: "Something you do on purpose, and what grows from it. It is not fate. Some books spell it kamma."
        }
      ],
      quiz: [
        {
          q: "Every evening a friend spends an hour complaining about the day. If this is a seed, what is likely to grow?",
          options: [
            "Nothing. Words do not change anything.",
            "Complaining gets easier and feels more normal.",
            "A punishment comes later to make things fair."
          ],
          answer: 1,
          why: "What you do on purpose again and again becomes a habit, the way a seed becomes a plant.",
          again: "Actions done on purpose are seeds: repeat one, and it grows into a habit."
        },
        {
          q: "A friend’s bag is stolen. He says, ‘This is my punishment. It was always going to happen.’ What would this lesson say?",
          options: [
            "Yes. Someone is counting, and that someone punishes people.",
            "It is not a punishment, but it was all decided long ago.",
            "Nobody punishes, and nothing was decided. His next choice is his own."
          ],
          answer: 2,
          why: "Actions are seeds that nobody is counting, and what he does next is still his to choose.",
          again: "What you do on purpose is a seed that grows by itself, and the next seed is always yours to choose."
        },
        {
          q: "People call you ‘the quiet one’, and you start to believe you cannot speak up. What would the label lesson say?",
          options: [
            "Other people see you best, so the label must be true.",
            "Labels only matter when they are unkind, and this one is not.",
            "‘The quiet one’ is a name-tag. You can still speak up."
          ],
          answer: 2,
          why: "A label is stuck on from outside, and it does not decide what you can do.",
          again: "Labels such as ‘shy’ or ‘too old’ are name-tags, not the truth about a person.",
          lookBack: "w3-l4"
        }
      ],
      canNow: "You can now explain that what you do on purpose is a seed, not fate and not a punishment.",
      deeper: [
        { label: "Why people’s lives differ: the Buddha’s answer to a young man", href: "suttas.html#mn135" },
        { label: "Short verses on the mind and what follows it", href: "suttas.html#dhp" }
      ]
    },

    /* ---------- w3-l6 ---------- */
    {
      id: "w3-l6",
      title: "A Fire Can Go Out",
      minutes: 5,
      icon: "img/icons/smoke-wisp.svg",
      objective: "After this lesson you can answer the third question. The added hurt has a fuel. When the three fires are no longer fed, they cool and can end.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "The good news in the fire talk",
          text: "You have heard the start of this talk. The Buddha told 1,000 people who had worshiped fire, ‘All is burning.’ It burns with three fires: wanting, pushing away and fog.\n\nThen came the good news. A person who sees the burning clearly, he said, no longer wants to keep it burning. The fires cool, and that person becomes free.\n\nIn his first talk he had said it another way. The added hurt has a cause, and the cause can be let go.\n\nSo his answer to the third question, ‘Can it stop?’, is yes."
        },
        {
          type: "idea",
          text: "The added hurt needs fuel, the way a fire needs wood. When the three fires (wanting, pushing away and fog) are no longer fed, they cool and can go out. Pain still comes, even for the Buddha, but the hurt added on top can end."
        },
        {
          type: "example",
          label: "Our example",
          title: "The campfire",
          text: "Think of a campfire. Nobody needs to fight it. Stop adding wood, and it burns down by itself. The air turns cool. You have not vanished, and you have not gone anywhere. You are still sitting there, and now it is cool. The added hurt works like this. Each time you obey an ‘I must’ pull, you add wood. When you do not, the fire gets none."
        },
        {
          type: "try",
          text: "Remember one small pull that you did not obey. It passed by itself. Maybe it was a second helping, a thing in a shop, or an angry reply you never sent. How did you feel a little later? Notice that. It was a small taste of a fire going out.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "nirvana",
          say: "nir-VAH-nah",
          old: "",
          means: "The cool peace when wanting, pushing away and fog stop burning. The old word means ‘going out’, like a flame. It is not a heaven somewhere else and not becoming nothing. Some books spell it nibbana."
        }
      ],
      quiz: [
        {
          q: "You feel a strong pull to interrupt someone who is talking. You wait. After a minute the pull has gone. What does that show?",
          options: [
            "A pull you do not obey can fade by itself",
            "You beat the pull by fighting it as hard as you could",
            "The pull is gone forever and will never come back again"
          ],
          answer: 0,
          why: "The pull was not fed, so it burned down without a fight.",
          again: "The added hurt has a fuel, and a fire that gets no new fuel cools down."
        },
        {
          q: "A friend asks, ‘If all three fires went out, would a cut finger still hurt?’ What is the honest answer?",
          options: [
            "No. With the fires out, all pain would be gone forever.",
            "Yes. The finger hurts, but the worry about it can stop.",
            "Yes, and so putting the fires out would change nothing."
          ],
          answer: 1,
          why: "Pain is the first arrow and still lands, and what can stop is the burning added on top.",
          again: "Pain, aging and loss still come to everyone, and it is the hurt added on top that can end."
        },
        {
          q: "You want to become more patient. What does the seed idea suggest?",
          options: [
            "Wait and hope. Patience is given at birth, or it is not.",
            "Feel bad about each impatient moment until it stops.",
            "Do one patient thing on purpose today, and again tomorrow."
          ],
          answer: 2,
          why: "Each patient act done on purpose makes the next one a little easier.",
          again: "What you do on purpose is a seed, and repeating it is how a habit grows.",
          lookBack: "w3-l5"
        }
      ],
      canNow: "You can now answer the third question: the added hurt has a fuel, and a fire that is not fed can go out.",
      deeper: [
        { label: "The fire talk: ‘All is burning’", href: "suttas.html#sn35.28" },
        { label: "The Buddha’s first talk, where he gives all 4 answers", href: "suttas.html#sn56.11" }
      ]
    }
  ],

  boss: {
    title: "The Light-Grip Check",
    intro: "5 short questions on this world. There is no score. If you miss one, you see the idea again and pick again.",
    questions: [
      {
        q: "On Monday you love your new hobby. On Tuesday it seems pointless. What does the monkey picture say about the Tuesday mood?",
        options: [
          "It is one branch, so wait and see what comes next",
          "The newest mood is always the true one, so trust Tuesday",
          "Changing moods mean something is the matter with you"
        ],
        answer: 0,
        why: "The mind swings from branch to branch all day, so one mood is a visitor and not the final truth.",
        again: "Moods come and go like a monkey moving through branches, so no single mood is the final truth.",
        lesson: "w3-l1"
      },
      {
        q: "Your face turns red when you feel shy. You tell it to stop, and it gets redder. Which reply fits the boss test?",
        options: [
          "If you try hard enough, the face will obey in the end",
          "A red face does not take orders, so let it be",
          "A body that will not obey you is your enemy"
        ],
        answer: 1,
        why: "The body was never under your command, so there is nothing to fight.",
        again: "Body, moods and thoughts do not follow orders, so they are things to look after.",
        lesson: "w3-l2"
      },
      {
        q: "You look at a photo of yourself as a small child and wonder what stayed the same. What does the chariot idea say?",
        options: [
          "A hidden core inside you has never changed at all",
          "The child was never real, and neither are you",
          "‘Me’ is a name for parts that have kept changing"
        ],
        answer: 2,
        why: "The name ‘me’ stays the same while body, moods, memories and plans keep changing.",
        again: "‘Me’ works like ‘chariot’: a useful name for many parts working together, and each part can change.",
        lesson: "w3-l3"
      },
      {
        q: "Two people hear the same rude words every day. One practices a calm reply. One practices a sharp reply. After a year, what has each grown?",
        options: [
          "Nothing. A reply is gone once it is said.",
          "Each has grown the habit they planted.",
          "Whatever was decided for them at birth."
        ],
        answer: 1,
        why: "What you do on purpose, again and again, grows into who you become.",
        again: "Actions done on purpose are seeds, and the same seed planted daily grows into a habit.",
        lesson: "w3-l5"
      },
      {
        q: "A friend asks what happens when the three fires go out. Which answer fits what you learned here?",
        options: [
          "The person goes to a heaven somewhere far away",
          "The person turns into nothing at all and is gone",
          "The person is still here, cool, without the added hurt"
        ],
        answer: 2,
        why: "When wanting, pushing away and fog are no longer fed, the burning stops, and what follows is coolness.",
        again: "When a fire is not fed it goes out, and the one who sat beside it is still there, in cooler air.",
        lesson: "w3-l6"
      }
    ]
  }
});
