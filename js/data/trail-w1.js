/* The Trail, World 1: What Hurts?
   Lesson content. Shape and rules: docs/GAME_CONTRACT.md section 6.
   Old stories come from the library cards named in docs/game-spec.json. */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w1",
  order: 1,
  title: "What Hurts?",
  tagline: "The first question. Look honestly, without gloom. Good news comes at question three.",
  stage: 1,
  goal: "You can name the not-quite-right side of your own day. You can tell pain from the hurt added on top. You can face change, loss, and ups and downs as things that visit everyone.",
  icon: "img/worlds/w1.svg",
  intro: "You have the map: the doctor’s 4 questions. This world takes the first one: what hurts? You look honestly at pain, change, loss, and ups and downs. None of it is meant to make you gloomy. Seeing clearly comes first. The good news comes at question 3.",

  lessons: [

    /* ---------------------------------------------------------- w1-l1 */
    {
      id: "w1-l1",
      title: "Not Quite Right",
      minutes: 4,
      icon: "img/icons/wobbly-table.svg",
      objective: "After this lesson you can spot the ‘not-quite-right’ side of everyday life, from big pain down to small restlessness. You also know this is not the same as saying life is all misery.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "3 small moments",
          text: "A toothache keeps you awake at night.\n\nA long line makes you wait when you are in a hurry.\n\nA quiet Sunday evening comes. Nothing is the matter, yet you feel restless.\n\nBig or small, something is not quite right.\n\nIt is like a table with one short leg. You can still eat a good meal at it. Some days it wobbles a little. Some days it wobbles a lot."
        },
        {
          type: "idea",
          text: "Life has a not-quite-right side, from big pain down to small restlessness. The Buddha’s first talk named this as the first thing to understand. He did not say life is all misery."
        },
        {
          type: "example",
          label: "The Buddha said",
          title: "Good things are real too",
          text: "In another talk the Buddha named kinds of happiness that are good to have.\n\nOne is enjoying what is honestly yours. The one he valued most is knowing you have acted well.\n\nSo the good parts of life are real. The not-quite-right side sits beside them."
        },
        {
          type: "try",
          text: "Look back over the last hour. Find one small ‘not-quite-right’ moment: a long line, a sore neck, a wish to be somewhere else. Name it quietly: ‘There it is.’ Then find one thing that was fine. Notice that both were there.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "dukkha",
          say: "DOOK-kah",
          old: "",
          means: "The ‘not-quite-right’ side of life, from big pain down to small restlessness. It does not mean ‘life is misery’."
        }
      ],
      quiz: [
        {
          q: "You are having a lovely day out. Still, you feel a little restless and keep checking the time. What is that feeling?",
          options: [
            "A small restless moment inside a good day",
            "Proof that the day was a bad one after all",
            "Nothing worth noticing, since nobody is hurt"
          ],
          answer: 0,
          why: "Even a good day can hold something small that is not quite right, and spotting it is the skill.",
          again: "The not-quite-right side runs from big pain down to small restlessness, even on a day that is going well."
        },
        {
          q: "You have a sore throat this morning. You also enjoyed your breakfast. What is the honest way to describe your morning?",
          options: [
            "All bad, because of the sore throat",
            "Part of it hurt and part of it was fine",
            "All fine, because small pains do not count"
          ],
          answer: 1,
          why: "Looking honestly means seeing the sore part and the fine part, both together.",
          again: "The not-quite-right side is real, even when it is small, and so are the good parts beside it."
        },
        {
          q: "A friend’s plant is drooping. You use the doctor’s 4 questions. What do you ask first?",
          options: [
            "Which plant food is best to buy?",
            "Can it be saved, or is it too late?",
            "What exactly is the matter with it?"
          ],
          answer: 2,
          why: "A good doctor starts by looking closely at what hurts, before the cause or the treatment.",
          again: "The 4 questions go in order: what hurts, why, can it stop, and what is the treatment.",
          lookBack: "w0-l4"
        }
      ],
      canNow: "You can now spot the not-quite-right side of an ordinary day, and the fine side next to it.",
      deeper: [
        { label: "The Buddha’s first talk", href: "suttas.html#sn56.11" },
        { label: "What hurts, listed from big to small", href: "suttas.html#mn141" },
        { label: "4 kinds of happiness that are good to have", href: "suttas.html#an4.62" }
      ]
    },

    /* ---------------------------------------------------------- w1-l2 */
    {
      id: "w1-l2",
      title: "Two Arrows",
      minutes: 4,
      icon: "img/icons/two-arrows.svg",
      objective: "After this lesson you can tell the first arrow (pain that happens) from the second arrow (the extra hurt we add ourselves).",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "One arrow, then another",
          text: "The Buddha said pain comes to everyone. It comes to people who have trained their minds. It comes to people who have not.\n\nWhat happens next is different.\n\nAn untrained person feels pain, then gets upset and worried about it. The Buddha said this is like being hit by one arrow, and then by a second.\n\nA trained person feels the first arrow fully. No second arrow follows. The talk says such a person feels ‘one feeling, not two’: the pain, and nothing added."
        },
        {
          type: "idea",
          text: "Pain that happens is the first arrow, and it lands on everyone. The extra hurt we add ourselves is the second arrow. The second arrow is the one we can learn to put down."
        },
        {
          type: "example",
          label: "Our example",
          title: "The stubbed toe",
          text: "You stub your toe. Ouch. That is arrow one.\n\nThen you think, ‘I am so clumsy. My whole day is ruined.’ That is arrow two, and you shot it yourself.\n\nYour toe hurts the same with or without that thought. The second arrow only adds to it."
        },
        {
          type: "try",
          text: "Remember one small annoying thing from today. Finish 2 sentences, out loud or in your head. ‘The first arrow was…’ ‘The second arrow I added was…’ No blame. If you added no second arrow, notice that. You are only spotting it.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You cannot find your keys and will be late. Which part is the first arrow?",
          options: [
            "Thinking ‘I can never do anything right’",
            "The keys being missing",
            "Staying angry at yourself all morning"
          ],
          answer: 1,
          why: "The first arrow is the plain event: the keys are missing, and you are late.",
          again: "The first arrow is the thing that happens; the second is the extra hurt the mind adds on top."
        },
        {
          q: "A friend forgets your birthday. It stings. Then you think, ‘Nobody cares about me at all.’ What is that thought?",
          options: [
            "The second arrow, added on top of the sting",
            "The first arrow, because it hurts the most",
            "A plain fact about your life"
          ],
          answer: 0,
          why: "The sting is arrow one, and the ‘nobody cares’ thought is extra hurt added afterwards.",
          again: "Pain that happens is the first arrow, and the hurt we pile on top of it is the second."
        },
        {
          q: "A friend asks, ‘Did the Buddha say life is all misery?’ What is a fair answer?",
          options: [
            "Yes, he said nothing in life is ever any good",
            "No, he said all pain is only in your head",
            "No, he named one side of life, and good things too"
          ],
          answer: 2,
          why: "He asked people to look honestly at what hurts, and he also listed kinds of happiness that are good to have.",
          again: "The not-quite-right side is one side of life, and the good parts beside it are real too.",
          lookBack: "w1-l1"
        }
      ],
      canNow: "You can now tell the first arrow from the second.",
      deeper: [
        { label: "The two arrows, in the Buddha’s words", href: "suttas.html#sn36.6" },
        { label: "Modern Life topic: pain, health and the body", href: "themes.html#health" }
      ]
    },

    /* ---------------------------------------------------------- w1-l3 */
    {
      id: "w1-l3",
      title: "Everything Changes",
      minutes: 4,
      icon: "img/icons/falling-leaf.svg",
      objective: "After this lesson you can explain that everything we experience keeps changing, and that expecting it to hold still is what adds hurt.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The old cart",
          text: "The Buddha lived to be 80. On his last journey he was old and sick, and he did not hide it.\n\nHe said his body was like ‘an old cart held together with straps’.\n\nFor years he had taught that everything changes. He did not leave himself out. Growing old came to him just as it comes to everyone.\n\nHis last words made the same point: all things change."
        },
        {
          type: "idea",
          text: "Everything you experience keeps changing: bodies, moods, things, people. When things change, nothing has gone wrong. The added hurt comes when we expect things to hold still."
        },
        {
          type: "example",
          label: "Our example",
          title: "A photo from 10 years ago",
          text: "Think of a photo of yourself from 10 years ago. The hair, the clothes, the people next to you: almost all of it has changed.\n\nNothing has gone wrong. This is what things do.\n\nIt hurts more when part of us says, ‘It was supposed to stay like that.’"
        },
        {
          type: "try",
          text: "Listen for one sound nearby and follow it until it fades. Or watch one thing that moves until it stops. Then notice one breath come and go, or press your feet into the floor and let go instead. 2 things came and went. That is change. You just noticed it happen.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "impermanence",
          say: "im-PUR-muh-nuns",
          old: "",
          means: "The library’s word for ‘everything changes’. Nothing we experience holds still."
        }
      ],
      quiz: [
        {
          q: "Your favorite shoes fit well and look good. 2 years later, they are worn through. What does this lesson say about that?",
          options: [
            "Something went badly, since good things ought to last",
            "This is how things go: everything keeps changing",
            "Better not to like your shoes in the first place"
          ],
          answer: 1,
          why: "Wearing out is ordinary change, and seeing it that way adds no extra hurt.",
          again: "Everything we experience keeps changing; that is ordinary, and it is no reason to stop enjoying things."
        },
        {
          q: "A close friend moves to another town. Which thought adds extra hurt on top?",
          options: [
            "‘I will miss our talks together.’",
            "‘Things between us will be different now.’",
            "‘It was supposed to stay the same forever.’"
          ],
          answer: 2,
          why: "Missing a friend is natural; demanding that nothing ever change is what adds hurt on top.",
          again: "The change comes anyway; expecting things to hold still is what adds the extra hurt."
        },
        {
          q: "You spill a drink on your shirt. Which one is the second arrow?",
          options: [
            "The cold, wet shirt",
            "Thinking ‘I ruin everything, every time’",
            "Having to change your clothes"
          ],
          answer: 1,
          why: "The spill is what happened; the ‘I ruin everything’ thought is the extra hurt added on top.",
          again: "The first arrow is what happens, and the second arrow is the hurt we add ourselves afterwards.",
          lookBack: "w1-l2"
        }
      ],
      canNow: "You can now explain that everything keeps changing, and that expecting it to hold still adds hurt.",
      deeper: [
        { label: "The Buddha’s last days, when he was old and sick", href: "suttas.html#dn16" },
        { label: "The reading plan, stage 1: what hurts and how things change", href: "curriculum.html#stage1" }
      ]
    },

    /* ---------------------------------------------------------- w1-l4 */
    {
      id: "w1-l4",
      title: "Five Honest Facts",
      minutes: 5,
      icon: "img/icons/sunrise.svg",
      objective: "After this lesson you can explain why calmly looking at 5 plain facts makes them less of a shock and makes today matter more. The facts are aging, sickness, death, parting, and today’s choices being yours.",
      headsUp: "A gentle note before you start: this lesson looks calmly at aging, sickness and death. You can set it aside and come back whenever you like.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "5 facts for every day",
          text: "The Buddha gave 5 plain facts to remember every day. He said they are for everyone.\n\nThe first 4 are hard. We grow old. We get sick. We die. We are parted from what we love.\n\nThe fifth is different: ‘I am the owner of my actions.’ What you do is yours, and you live with what comes of it.\n\nWhy remember them? He said people forget. While they are young and well, they act as if it will last. That makes them careless."
        },
        {
          type: "idea",
          text: "Looking calmly at hard facts does not bring them closer. It makes them less of a shock. The fifth fact is the hopeful one: what you choose today is yours."
        },
        {
          type: "example",
          label: "Our example",
          title: "The weather forecast",
          text: "A weather forecast does not make it rain. It helps you pack an umbrella.\n\nThe 5 facts work the same way. They are not there to scare you. They are there so that each one is less of a shock.\n\nAnd when you know a day will not come again, you take more care with it."
        },
        {
          type: "try",
          text: "Read these slowly, once: ‘I will get older. I will get sick sometimes. I will die one day. I will be parted from things I love. What I choose to do today stays mine.’ Take one breath, or feel your feet instead. Then choose one small kind thing you could do today. Notice how it feels to choose.",
          seconds: 60,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "Someone says, ‘Thinking about getting old is gloomy. Why do it?’ What would this lesson answer?",
          options: [
            "A calm look now makes it less of a shock later",
            "Thinking about it often enough stops it happening",
            "You are right, it is better never to think of it"
          ],
          answer: 0,
          why: "Like a forecast, a calm look ahead helps you be ready when the change comes.",
          again: "The 5 facts work like a weather forecast: they do not bring the rain, they help you get ready."
        },
        {
          q: "You remember that your time with a dear friend will not last forever. What does this lesson suggest you do with that thought?",
          options: [
            "Keep your distance, so parting hurts less",
            "Push the thought away and keep busy",
            "Let it make today’s visit matter more"
          ],
          answer: 2,
          why: "Knowing a thing will not last is a reason to give it your care today.",
          again: "The hard facts are not there for gloom; they turn your care toward today, which is yours to choose."
        },
        {
          q: "You have a headache. Then you think, ‘This always happens. My whole week is ruined.’ What can you learn to put down?",
          options: [
            "The headache itself",
            "Both the headache and the thought",
            "The ‘week is ruined’ thought on top"
          ],
          answer: 2,
          why: "The headache is the first arrow and still lands; the thought on top is the second, and that one can be put down.",
          again: "The pain itself still lands for everyone; it is the hurt we add on top that can be put down.",
          lookBack: "w1-l2"
        }
      ],
      canNow: "You can now explain how a calm look at 5 plain facts makes today matter more.",
      deeper: [
        { label: "The 5 facts to remember every day", href: "suttas.html#an5.57" }
      ]
    },

    /* ---------------------------------------------------------- w1-l5 */
    {
      id: "w1-l5",
      title: "The Mustard Seed",
      minutes: 5,
      icon: "img/icons/open-door.svg",
      objective: "After this lesson you can explain that loss visits every home, and that knowing this can turn ‘why me?’ into ‘so this is what everyone carries’.",
      headsUp: "A gentle note before you start: this lesson tells an old story about a mother whose baby dies. You can set it aside for now.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The mustard seed",
          text: "A mother named Kisa Gotami lost her baby son. Wild with grief, she went from door to door asking for medicine. Someone sent her to the Buddha.\n\nHe said gently, ‘Bring me a mustard seed from a house where no one has died.’\n\nShe went from door to door again. Every house had mustard seed. But in every house, someone had died.\n\nSomewhere on that walk, something changed. She saw that she was not alone."
        },
        {
          type: "idea",
          text: "Loss visits every home. Knowing this does not make the pain smaller. It can change the lonely thought ‘why me’ into ‘so this is what everyone carries’."
        },
        {
          type: "example",
          label: "Our example",
          title: "A neighbor’s words",
          text: "After a loss, it can feel as if every other home is fine and only yours is not.\n\nThen a neighbor says quietly, ‘I lost my sister 2 years ago.’\n\nThe loss is the same size as before. But now you are not alone with it."
        },
        {
          type: "try",
          text: "Think of one person you know who has lost someone. Silently wish them well: ‘May you be at ease.’ If no one comes to mind, wish it for anyone at all. Then notice how it feels to wish that for someone.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "After a loss, a person keeps asking, ‘Why did this happen only to me?’ Which thought fits this lesson?",
          options: [
            "‘Other people have carried this too. I am not the only one.’",
            "‘Others have it worse, so I have no right to grieve.’",
            "‘Nobody else could ever understand this.’"
          ],
          answer: 0,
          why: "Seeing that everyone carries loss does not make the pain smaller, but it can ease the lonely thought ‘why me?’",
          again: "Loss comes to every home, and each person’s grief is real; it is not about who has it worse."
        },
        {
          q: "A neighbor is grieving. Which response fits this lesson best?",
          options: [
            "Explain that everything ends, so there is no need to cry",
            "Stay near, be gentle, and listen",
            "Tell them to cheer up and think of something else"
          ],
          answer: 1,
          why: "The Buddha did not argue with the mother’s pain or hurry her; he was gentle and let her see she was not alone.",
          again: "Grief is not something to argue away; it can ease a little when a person sees they are not carrying it alone."
        },
        {
          q: "You wake up in a low, heavy mood. What does ‘everything changes’ say about it?",
          options: [
            "It is who you are now, and it will stay",
            "Good moods can be made to stay forever",
            "This mood is changing too, like everything else"
          ],
          answer: 2,
          why: "Moods are part of ‘everything’, so this one keeps changing as well.",
          again: "Everything we experience keeps changing, and that includes the mood you are in right now.",
          lookBack: "w1-l3"
        }
      ],
      canNow: "You can now explain that loss visits every home, and how knowing this can soften ‘why me?’",
      deeper: [
        { label: "The mother and the mustard seed, told in full", href: "suttas.html#thig10.1" },
        { label: "Why loving someone means we can grieve for them", href: "suttas.html#mn87" },
        { label: "A talk about tears and many lifetimes. You can leave that question open.", href: "suttas.html#sn15.3" }
      ]
    },

    /* ---------------------------------------------------------- w1-l6 */
    {
      id: "w1-l6",
      title: "Ups and Downs Are Weather",
      minutes: 4,
      icon: "img/icons/wind.svg",
      objective: "After this lesson you can explain that ups and downs blow on everyone like weather and are not a judgment on you.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "Praise and blame",
          text: "One day the Buddha overheard a teacher and a student arguing about him. One spoke badly of him. The other praised him.\n\nHe told his own students not to feel big because of the praise or small because of the blame. Both, he said, make it harder to think clearly.\n\nIn another talk he spoke of winds that blow through the world. They come in pairs, such as gain and loss, or praise and blame. They visit everyone. A trained person knows each one will pass, and stays upright as the winds turn."
        },
        {
          type: "idea",
          text: "Ups and downs blow on everyone, like weather. A good day does not prove you are great. A bad day does not prove you are no good."
        },
        {
          type: "example",
          label: "Our example",
          title: "Monday and Thursday",
          text: "On Monday someone tells you, ‘You did that so well.’ On Thursday the same person says, ‘You got it all mixed up.’\n\nYou are the same person on both days. Only the wind changed.\n\nGood weather is not a prize. Bad weather is not a punishment. It is weather, and it turns."
        },
        {
          type: "try",
          text: "Which wind blew on you today: a win, a loss, some praise, some blame? Pick one. Name it, out loud or in your head: ‘This is a wind. It will turn.’ Then notice how it feels to call it weather.",
          seconds: 40,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You cook a meal and everyone loves it. Next week the same dish gets complaints. What does this lesson say?",
          options: [
            "You were a great cook, and now you are a poor one",
            "Praise and blame are winds, and winds turn",
            "People’s words mean nothing, so ignore them all"
          ],
          answer: 1,
          why: "You are the same cook both weeks; the praise and the blame are passing weather.",
          again: "Praise and blame blow on everyone like weather, and neither one is the final word on you."
        },
        {
          q: "You win a small prize. How does this lesson suggest you treat the win?",
          options: [
            "Enjoy it, and know this wind will turn too",
            "Refuse to enjoy it, because it will not last",
            "Take it as proof that you are better than others"
          ],
          answer: 0,
          why: "A win is good weather: you can enjoy it, and it does not make you better than anyone.",
          again: "Ups are weather just as downs are, so they can be enjoyed without being treated as a judgment on you."
        },
        {
          q: "A day went badly and you cannot change it. What is still yours?",
          options: [
            "Nothing; the day decides everything",
            "Only the blame for how it went",
            "What you choose to do next"
          ],
          answer: 2,
          why: "The day is over, but what you choose to do is yours; that is the hopeful fact.",
          again: "One fact is hopeful: your own actions belong to you, whatever kind of day it was.",
          lookBack: "w1-l4"
        }
      ],
      canNow: "You can now name an up or a down as passing weather, not a judgment on you.",
      deeper: [
        { label: "All 4 pairs of winds, in the Buddha’s words", href: "suttas.html#an8.6" },
        { label: "The day the Buddha heard himself praised and blamed", href: "suttas.html#dn1" },
        { label: "Modern Life topic: success, praise and blame", href: "themes.html#status" }
      ]
    }
  ],

  boss: {
    title: "The Weather Check",
    intro: "A few short questions about this world. Nothing is scored. If you miss one, you see the idea again and can pick again.",
    questions: [
      {
        q: "You are at a party with people you like. Still, your feet ache and you wish you were home. What is this?",
        options: [
          "A small wobble in an ordinary day, nothing more",
          "A sign that your life is going badly",
          "A sign that you do not really like your friends"
        ],
        answer: 0,
        why: "Small aches and wishes to be elsewhere are the everyday end of the not-quite-right side.",
        again: "The not-quite-right side runs from big pain down to small restlessness, and it shows up on fine days too.",
        lesson: "w1-l1"
      },
      {
        q: "Someone with a well-trained mind hits their thumb with a hammer. What happens next?",
        options: [
          "They feel no pain at all",
          "It hurts, and they add nothing more to it",
          "They hide the pain and act as if all is fine"
        ],
        answer: 1,
        why: "The first arrow lands on everyone, trained or not; the training is in not shooting the second.",
        again: "Pain still comes to everyone; what can be put down is the extra hurt added on top.",
        lesson: "w1-l2"
      },
      {
        q: "A child you know has grown, and no longer wants the bedtime story you used to read. What adds extra hurt here?",
        options: [
          "Noticing that the child has grown",
          "Feeling a little sad about it",
          "Insisting that things stay as they were"
        ],
        answer: 2,
        why: "Children grow and change; the extra hurt comes from demanding that it all hold still.",
        again: "Everything keeps changing, and it is expecting things to stay the same that adds the hurt.",
        lesson: "w1-l3"
      },
      {
        q: "A friend says, ‘If I think about getting sick one day, I will make it happen.’ What does this world say?",
        options: [
          "A calm look ahead only helps you be ready",
          "True, so it is safer never to think of it",
          "Thinking about it every hour will keep you well"
        ],
        answer: 0,
        why: "Like a forecast, looking calmly ahead changes how ready you are, not what the weather does.",
        again: "Remembering the plain facts does not make them come sooner; it makes them less of a shock.",
        lesson: "w1-l4"
      },
      {
        q: "You are picked last for a team game. The next week you are picked first. What does that say about you?",
        options: [
          "Your worth went down, then up",
          "Not much; only the wind changed",
          "Your luck will stay good from now on"
        ],
        answer: 1,
        why: "Being picked last or first is passing weather, not a judgment on you.",
        again: "Ups and downs blow on everyone and keep turning; they are not the final word on who you are.",
        lesson: "w1-l6"
      }
    ]
  }
});
