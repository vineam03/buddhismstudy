/* The Trail, world 2: "Why Does It Hurt?"
   Lesson content for js/trail.js. Shape and rules: docs/GAME_CONTRACT.md section 6.
   Design (objectives, hooks, sources): docs/game-spec.json, world "w2".
   Check with: node tools/validate.js trail w2 */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w2",
  order: 2,
  title: "Why Does It Hurt?",
  tagline: "The second question. See how the mind builds its own trouble, and where it can stop building.",
  stage: 2,
  goal: "By the end you can name the pull that adds the hurt. You can say why getting does not end wanting. And you can find the small gap where the hurt can stop building.",
  icon: "img/worlds/w2.svg",
  intro: "The last world asked what hurts. Now comes the doctor's second question: why does it hurt? You will watch how the mind builds extra hurt, one small step at a time. And you will find the spot where it can stop building.",

  lessons: [

    /* ------------------------------------------------------------ w2-l1 */
    {
      id: "w2-l1",
      title: "The Gotta-Have-It Pull",
      minutes: 4,
      icon: "img/icons/water-drop.svg",
      objective: "After this lesson you can name the “I must have it” or “I must get rid of it” pull as what shoots the second arrow.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "What shoots the second arrow?",
          text: "Remember the two arrows. The first arrow is pain that happens. The second arrow is the extra hurt we add ourselves.\n\nWhat shoots that second arrow? The Buddha gave his answer in his very first talk. The added hurt has a cause, he said. The cause is a strong pull in the mind.\n\nThe old word for this pull means “thirst”."
        },
        {
          type: "idea",
          text: "The added hurt comes from a pull in the mind. It says “I must have it” or “I must get rid of it”. Wanting to learn or to be kind is not this pull."
        },
        {
          type: "example",
          label: "Our example",
          title: "A toe and a phone",
          text: "You stub your toe. Ouch. That is the first arrow. Then comes the thought, “This must not be happening!” That “must” is the pull. It feels tight, and it pushes something away.\n\nHere it is again, smaller. Your phone buzzes while a friend is talking. You feel a tug to check it. That tug is the same pull. This time it reaches toward something."
        },
        {
          type: "try",
          text: "Catch one pull right now: to check your phone, to snack, to skip ahead. Do not obey it and do not fight it. Count 10 breaths, or feel your feet on the floor instead. Watch what the pull does. Does it grow, fade or change?",
          seconds: 60
        },
        {
          type: "word",
          term: "craving",
          say: "",
          old: "",
          means: "The “gotta have it” or “get it away from me” pull. The old word for it means “thirst”. Wanting to learn or to be kind is not craving."
        }
      ],
      quiz: [
        {
          q: "You wait in a slow line at a shop. A tight thought says, “This line must move now!” What adds the extra hurt?",
          options: [
            "The slow line, all by itself",
            "The “get it away from me” pull",
            "Not being a patient person"
          ],
          answer: 1,
          why: "The line is only slow, and the tight “must” in the mind is what adds the hurt.",
          again: "What happens is one thing, and the hurt on top comes from how tightly the mind says “must”."
        },
        {
          q: "You want to learn a few songs, so you sing a little each week. Is that craving?",
          options: [
            "No. There is no “I must” pull in it.",
            "Yes. All wanting is craving.",
            "Yes, if you enjoy the singing."
          ],
          answer: 0,
          why: "Craving is the tight “gotta have it” pull, and a wish to learn or to be kind is something else.",
          again: "Craving is only the tight “gotta have it” pull, so plenty of wishes are not craving."
        },
        {
          q: "Last week a neighbor thanked you warmly. This week the same neighbor grumbles at you. How does the weather picture help?",
          options: [
            "It shows the grumble is the truth about you",
            "It shows how to make everyone like you",
            "It shows praise and blame as winds that turn"
          ],
          answer: 2,
          why: "Praise and blame blow on everyone like weather, and neither one is a judgment on you.",
          again: "Ups and downs come and go for everyone, so one good or bad day is not the last word on you.",
          lookBack: "w1-l6"
        }
      ],
      canNow: "You can now name the pull that shoots the second arrow: craving.",
      deeper: [
        { label: "The Buddha's first talk, where he names the cause", href: "suttas.html#sn56.11" },
        { label: "The two arrows, in the Buddha's words", href: "suttas.html#sn36.6" }
      ]
    },

    /* ------------------------------------------------------------ w2-l2 */
    {
      id: "w2-l2",
      title: "The Moving Finish Line",
      minutes: 4,
      icon: "img/icons/moving-flag.svg",
      objective: "After this lesson you can explain why getting what we crave does not end craving: the mind gets used to it and asks for more.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The mind that changed its wish",
          text: "Long ago, a man named Talaputa led a famous group of actors. For years his mind begged him to leave it all and live in the mountains. So he left the actors and became a monk (someone who leaves home to train full time).\n\nNow he had the very life his mind had asked for. And then his mind changed its wish. It wanted the old life back.\n\nTalaputa spoke to it plainly. “For years you begged me for this life. Now I have it, and you want to go back.”"
        },
        {
          type: "idea",
          text: "Getting what you crave does not end craving. The mind gets used to the new thing and asks for more. The finish line keeps moving."
        },
        {
          type: "example",
          label: "Our example",
          title: "New shoes",
          text: "For weeks you want a new pair of shoes. You think, “Once I have them, I'll be happy.” You get them. For a few days they feel great. Then they are only your shoes. Your mind is already looking at the next thing. The shoes did not change. The finish line moved."
        },
        {
          type: "try",
          text: "Remember something you wanted a lot a year ago and now have. Big or small, anything counts. How much joy does it give you today, out of 10? Then think of the points you get for this lesson. Notice the little “yay”, the small glad feeling, and watch it fade.",
          quietText: "Remember something you wanted a lot a year ago and now have. Big or small, anything counts. How much joy does it give you today, out of 10? Then think of finishing this lesson. Notice the little “yay”, the small glad feeling, and watch it fade.",
          seconds: 45
        }
      ],
      quiz: [
        {
          q: "You move into the bigger room you always wanted. A month later it feels ordinary. What happened?",
          options: [
            "The room was a poor choice",
            "Your mind got used to it",
            "You are not a thankful person"
          ],
          answer: 1,
          why: "The mind gets used to what it has, so the thrill fades and it asks for more.",
          again: "Getting what we crave feels good for a while, and then that good thing becomes normal."
        },
        {
          q: "A friend says, “When I own that jacket, I will be happy forever.” What does this lesson suggest?",
          options: [
            "The joy will last as long as the jacket",
            "There will be no joy at all",
            "The joy will come, and then it will fade"
          ],
          answer: 2,
          why: "The joy is real, but it fades as the mind gets used to it and picks a new finish line.",
          again: "Getting a wanted thing does feel good, but the good feeling does not stay, and wanting starts again."
        },
        {
          q: "You smell fresh bread and enjoy it. Then a tight thought comes: “I have to have some now.” Which part is craving?",
          options: [
            "The tight “I have to” thought",
            "Smelling the bread",
            "Enjoying the smell"
          ],
          answer: 0,
          why: "Smelling and enjoying are fine, and craving is the tight pull that says “I have to”.",
          again: "Craving is not the nice thing itself, but the “gotta have it” pull that can follow it.",
          lookBack: "w2-l1"
        }
      ],
      canNow: "You can now explain why getting what you crave does not end the craving.",
      deeper: [
        { label: "A monk argues with his own mind", href: "suttas.html#thag19.1" },
        { label: "Two kinds of search: the Buddha tells his own story", href: "suttas.html#mn26" }
      ]
    },

    /* ------------------------------------------------------------ w2-l3 */
    {
      id: "w2-l3",
      title: "Nice, Nasty or Neutral",
      minutes: 4,
      icon: "img/icons/three-marks.svg",
      objective: "After this lesson you can notice that every experience arrives with an instant tag (nice, nasty or neutral) before any wanting starts.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "Before you turn around",
          text: "Someone calls your name from behind you. You know the voice. Before you turn around, something in you has already reacted. It goes “ooh” or “ugh” or “meh”.\n\nThat is an instant tag: nice, nasty or neutral. Neutral means neither one. You did not choose the tag. It comes first, every time, before any pull starts.\n\nMost days we never see it happen. The Buddha's training asks you to catch the tag as it arrives."
        },
        {
          type: "idea",
          text: "Everything you see, hear, feel or think comes with an instant tag: nice, nasty or neutral. The tag comes first, before any pull starts. You can learn to notice it."
        },
        {
          type: "example",
          label: "Our example",
          title: "3 sounds",
          text: "You sit and listen for a moment. A bird sings outside: nice. A drill starts next door: nasty. A clock ticks: neutral. You may not have noticed that one at all.\n\nEach sound got its tag in an instant, with no thinking. The tag is small and quick. It is not a big emotion like sad or angry."
        },
        {
          type: "try",
          text: "For 30 seconds, tag whatever you notice: a sound, an itch, a thought. Say “nice”, “nasty” or “neutral”, out loud or in your head. Only tag. Do nothing else. Then notice which tag came up most.",
          seconds: 30
        },
        {
          type: "word",
          term: "feeling-tone",
          say: "",
          old: "",
          means: "The instant “nice”, “nasty” or “neutral” tag on every experience. It is not an emotion like sad or angry. It is not the same as dukkha, the not-quite-right side of life."
        }
      ],
      quiz: [
        {
          q: "You step outside and warm sun touches your face. What comes first?",
          options: [
            "A plan to stay outside longer",
            "A thought about the weather",
            "An instant “nice” tag"
          ],
          answer: 2,
          why: "The quick “nice” lands before any plan, thought or wanting begins.",
          again: "Before any thinking or wanting, each experience gets a quick tag of nice, nasty or neutral."
        },
        {
          q: "A door slams and you get an instant “nasty” tag. What does this lesson say about that tag?",
          options: [
            "It arrives by itself. You only notice it.",
            "It shows you are an angry person.",
            "You could have blocked it by trying harder."
          ],
          answer: 0,
          why: "The tag is not chosen and it is not an emotion, so there is nothing to blame.",
          again: "Feeling-tone is the quick first tag, which comes without being chosen, before any emotion or pull."
        },
        {
          q: "You wanted a new game for months. Two weeks after you get it, you want a different one. What does that show?",
          options: [
            "The first game was not good enough",
            "Getting it did not end the wanting",
            "You did not want it enough"
          ],
          answer: 1,
          why: "Getting what we crave does not end craving, because the mind soon treats it as normal.",
          again: "What we crave feels great at first, then becomes ordinary, and the finish line moves.",
          lookBack: "w2-l2"
        }
      ],
      canNow: "You can now catch the instant tag on an experience: nice, nasty or neutral.",
      deeper: [
        { label: "The Buddha's full guide to noticing, the long version", href: "suttas.html#dn22" },
        { label: "The same guide, the short version", href: "suttas.html#mn10" }
      ]
    },

    /* ------------------------------------------------------------ w2-l4 */
    {
      id: "w2-l4",
      title: "Five Dominoes",
      minutes: 5,
      icon: "img/icons/dominoes.svg",
      objective: "After this lesson you can follow the five dominoes (something happens, a tag appears, the pull starts, we hold on, it hurts) and point to the gap after the tag, where one domino can be lifted out.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "One email, five dominoes",
          text: "A rude email arrives. Watch what happens next. It goes like dominoes: small blocks standing in a row, where each one knocks down the next.\n\n1. Something happens: the email arrives.\n\n2. A tag appears: your stomach tightens. Nasty.\n\n3. The pull starts: “I must send an angry reply right now.”\n\n4. You hold on tight: “I am right.”\n\n5. It hurts: by evening you are in a fight, and you feel worse.\n\nIt feels like one fast blur. Slowed down, it is 5 small steps. The Buddha taught that hurt builds this way, each step tipping the next."
        },
        {
          type: "idea",
          text: "You cannot stop the email, and you cannot stop the tag. But after the tag, before the “I must”, there is a small gap. In that gap you can pause, and that lifts one domino out."
        },
        {
          type: "example",
          label: "An old story",
          title: "Each tag leans one way",
          text: "A nun (a woman who leaves home to train full time) named Dhammadinna explained the quick tags. Each tag tips you one way, she taught. With nice, you lean toward more. With nasty, you push away. With neutral, your mind drifts off. The Buddha said he would have explained it exactly as she did.\n\nIn our domino picture, a lean is not yet a fall. The gap comes in between."
        },
        {
          type: "try",
          text: "Remember one small annoying moment from today. Answer 2 things only. What was the tag: nice, nasty or neutral? What did the pull say? (“I must...”) The gap between those two is where a domino can come out. Notice the gap. That is all.",
          seconds: 45
        }
      ],
      quiz: [
        {
          q: "Someone bumps into you in a crowd. “Ugh.” Then: “I must say something angry.” Where is the gap?",
          options: [
            "Before the bump happens",
            "After the “ugh”, before the “I must”",
            "After the angry words are out"
          ],
          answer: 1,
          why: "The bump and the tag come by themselves, and the gap is the moment before the pull takes over.",
          again: "You cannot stop what happens or its tag, but a small space opens right after the tag."
        },
        {
          q: "You taste something sweet: nice. You notice the lean toward “more” and pause for one breath. What have you done?",
          options: [
            "Stopped all enjoyment of the sweet",
            "Made the “nice” tag go away",
            "Lifted one domino out of the row"
          ],
          answer: 2,
          why: "The nice tag still came, and your pause in the gap kept the next domino standing.",
          again: "The tag comes anyway and that is fine, and the pause right after it is where the dominoes can stop falling."
        },
        {
          q: "A dog barks. Something in you goes “ugh”. A minute later you feel angry at its owner. Which one is the feeling-tone?",
          options: [
            "The “ugh”",
            "Feeling angry at the owner",
            "The sound of the bark"
          ],
          answer: 0,
          why: "Feeling-tone is only the quick first tag, and anger is an emotion that grows later.",
          again: "Feeling-tone means the instant nice, nasty or neutral tag, which comes before any emotion builds.",
          lookBack: "w2-l3"
        }
      ],
      canNow: "You can now follow the five dominoes and point to the gap after the tag.",
      deeper: [
        { label: "Every step, one by one, in the Buddha's words", href: "suttas.html#sn12.2" },
        { label: "The nun whose answers the Buddha praised", href: "suttas.html#mn44" },
        { label: "How the same dominoes lead to quarrels", href: "suttas.html#dn15" }
      ]
    },

    /* ------------------------------------------------------------ w2-l5 */
    {
      id: "w2-l5",
      title: "The Story Machine",
      minutes: 4,
      icon: "img/icons/spiral.svg",
      objective: "After this lesson you can catch the mind turning one small event into a big story, and come back to what actually happened.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "A very short teaching",
          text: "A man named Bahiya traveled a long way to find the Buddha. The Buddha was out walking to collect his daily food. Bahiya stopped him and begged for a teaching. He asked 3 times.\n\nSo the Buddha gave him a very short one. “In the seen, only the seen. In the heard, only the heard.”\n\nIn plain words: see what is there. Hear what was said. Notice where the plain event ends and your own story begins."
        },
        {
          type: "idea",
          text: "The mind takes one small event and quickly builds a big story on it. Often the story hurts more than the event. You can catch it and come back to what actually happened."
        },
        {
          type: "example",
          label: "Our example",
          title: "No reply yet",
          text: "You text a friend. Hours pass and there is no reply. Very quickly, your mind writes a whole movie. “She is angry. I said something bad. Nobody really likes me.”\n\nNow look at what you actually have: no reply yet. That is all. The story machine made the rest."
        },
        {
          type: "try",
          text: "Pick one small worry. Split it in 2. First: what actually happened? Say it in one short sentence, out loud or in your head. Second: what story did you add? Notice which part is heavier. You do not need to fix either one.",
          seconds: 45
        }
      ],
      quiz: [
        {
          q: "A neighbor walks past without saying hello. Your mind says, “She is upset with me.” What actually happened?",
          options: [
            "She walked past without saying hello",
            "She is upset with you",
            "You did something to upset her"
          ],
          answer: 0,
          why: "That is the only part you saw, and the rest is a story the mind added.",
          again: "Come back to the plain event, the part you could see or hear, before any story was added."
        },
        {
          q: "You arrive 5 minutes late and think, “I always let everyone down.” What is the mind doing here?",
          options: [
            "Telling you a plain fact about yourself",
            "Keeping you safe from more mistakes",
            "Turning one small event into a big story"
          ],
          answer: 2,
          why: "Being 5 minutes late is the event, and “always” and “everyone” are the story built on top.",
          again: "The mind can take one small thing and build a much bigger story than what happened."
        },
        {
          q: "Rain cancels your picnic. “Ugh.” That is a nasty tag. Where can you do something?",
          options: [
            "At the “ugh”: stop it from coming",
            "In the gap right after the “ugh”",
            "Nowhere. The bad mood has to follow."
          ],
          answer: 1,
          why: "The rain and the tag arrive by themselves, but the gap after the tag is yours to use.",
          again: "What happens and its tag cannot be stopped, yet right after the tag there is a small space.",
          lookBack: "w2-l4"
        }
      ],
      canNow: "You can now tell what actually happened apart from the story your mind added.",
      deeper: [
        { label: "How the mind spins a small thing into a big story", href: "suttas.html#mn18" },
        { label: "“In the seen, only the seen”: the very short teaching", href: "suttas.html#ud1.10" }
      ]
    },

    /* ------------------------------------------------------------ w2-l6 */
    {
      id: "w2-l6",
      title: "Three Fires",
      minutes: 4,
      icon: "img/icons/three-flames.svg",
      objective: "After this lesson you can name the three fires that keep the hurt going (wanting, pushing away and fog) and spot which one is burning in a tense moment.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "“All is burning”",
          text: "The Buddha once spoke to 1,000 people who had worshiped fire. Fire was the thing they knew best. So he used their own picture.\n\n“All is burning,” he said. The eye is burning. The ear is burning. The mind is burning. He did not mean real flames.\n\nBurning with what? With three fires in the mind, he said: wanting, pushing away and fog. They keep the hurt going. Later on the Trail you will see how a fire can go out."
        },
        {
          type: "idea",
          text: "The “I must” pull toward a thing is the wanting fire. The pull away is the pushing-away fire, from mild annoyance up to hate. The third fire is fog: not seeing clearly what is going on."
        },
        {
          type: "example",
          label: "Our example",
          title: "Spot the fire",
          text: "You see a friend's new bike and feel a tight “I need one too.” Wanting is burning.\n\nSomeone chews loudly near you, and you tense up. Pushing away is burning.\n\nYou are tired and have not noticed. The whole day seems to go badly, and you cannot see why. Fog is burning."
        },
        {
          type: "try",
          text: "Think of the last time you were a little upset. Which fire was it: wanting, pushing away or fog? Name it, out loud or in your head: “Pushing away is burning.” That is all. You do not need to put it out.",
          seconds: 30
        },
        {
          type: "word",
          term: "three fires",
          say: "",
          old: "",
          means: "Wanting, pushing away (from annoyance up to hate) and fog (not seeing clearly). The library calls them greed, hatred and delusion."
        }
      ],
      quiz: [
        {
          q: "You see an ad and feel a tight “I need that now.” Which fire is burning?",
          options: [
            "Wanting",
            "Pushing away",
            "Fog"
          ],
          answer: 0,
          why: "The pull toward a thing, the “gotta have it”, is the wanting fire.",
          again: "One fire pulls toward a thing, one pushes a thing away, and one hides what is going on."
        },
        {
          q: "A neighbor's radio is a little too loud, and it annoys you a little. It is much smaller than hate. Which fire is that?",
          options: [
            "None. Only hate counts as a fire.",
            "Pushing away, burning low.",
            "None. The radio is the only problem."
          ],
          answer: 1,
          why: "The pushing-away fire runs from mild annoyance all the way up to hate.",
          again: "The second fire covers every size of “get it away from me”, from very small to very large."
        },
        {
          q: "A friend cancels a plan. Your mind says, “Nobody wants to see me.” What actually happened?",
          options: [
            "Nobody wants to see you",
            "You are no fun to be with",
            "One friend canceled one plan"
          ],
          answer: 2,
          why: "One canceled plan is the event, and “nobody” is the story added on top.",
          again: "Come back to the plain event you could see or hear, and set the added story to one side.",
          lookBack: "w2-l5"
        }
      ],
      canNow: "You can now name the three fires and spot which one is burning.",
      deeper: [
        { label: "The fire talk: “All is burning”", href: "suttas.html#sn35.28" },
        { label: "Checking which fire is behind an action before you act", href: "suttas.html#mn9" }
      ]
    }
  ],

  /* ---------------------------------------------------------------- check */
  boss: {
    title: "The Domino Check",
    intro: "5 short questions about why it hurts. There is no score. If an answer misses, you see the idea again and pick again.",
    questions: [
      {
        q: "Your shoulder aches as you get dressed. Then you think, “This must not be happening to me!” and feel worse. What added the extra hurt?",
        options: [
          "The ache in the shoulder",
          "Being a person who complains",
          "The “get it away from me” pull"
        ],
        answer: 2,
        why: "The ache is the pain that happens, and the “must not” pull adds the extra hurt on top.",
        again: "Pain is one thing, and the tight “must” in the mind is what adds more hurt on top of it.",
        lesson: "w2-l1"
      },
      {
        q: "You collect every star in a game. The thrill lasts one day. Then you want a new game. What does this show?",
        options: [
          "The mind gets used to a win",
          "The game was badly made",
          "You have not won enough yet"
        ],
        answer: 0,
        why: "Getting what we badly want feels good, then the mind gets used to it and moves the finish line.",
        again: "Reaching a goal brings a short thrill, and then the wanting starts again somewhere new.",
        lesson: "w2-l2"
      },
      {
        q: "You wait for a pot of water to boil. Nothing much is going on. Is there a tag?",
        options: [
          "No. Tags only come with strong moments.",
          "Yes. “Neutral” is a tag too.",
          "Yes. Waiting is always “nasty”."
        ],
        answer: 1,
        why: "Every experience gets a tag, and neutral is the one we notice least.",
        again: "Each moment arrives with nice, nasty or neutral, even the plain moments that seem like nothing.",
        lesson: "w2-l3"
      },
      {
        q: "A friend teases you. “Ugh.” You notice the “ugh” and take one breath before you speak. What did you do?",
        options: [
          "Pushed the “ugh” down until it was gone",
          "Stopped the teasing from stinging at all",
          "Used the gap after the tag"
        ],
        answer: 2,
        why: "The sting and the tag still came, and noticing them in the gap kept the next dominoes standing.",
        again: "You cannot stop the event or its tag, but in the small space after the tag one domino can come out.",
        lesson: "w2-l4"
      },
      {
        q: "All morning you are in a bad mood and cannot say why. You have not stopped to look. Which fire keeps the reason hidden?",
        options: [
          "Wanting: the “gotta have it” pull",
          "Fog: not seeing clearly what is going on",
          "Pushing away: from annoyance up to hate"
        ],
        answer: 1,
        why: "Fog is the fire of not seeing clearly, and it hides what is really going on.",
        again: "Of the three fires, one pulls toward, one pushes away, and one keeps you from seeing what is happening.",
        lesson: "w2-l6"
      }
    ]
  }
});
