/* The Trail, World 7: Carrying It Home.
   Shape and rules: docs/GAME_CONTRACT.md section 6. Design: docs/game-spec.json (world "w7").
   Check with: node tools/validate.js trail w7 */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w7",
  order: 7,
  title: "Carrying It Home",
  tagline: "Put it all together, hold it lightly, and keep walking.",
  stage: 0,
  goal: "You can give the 4 answers in your own words. You can choose good company and begin again after a slip. You can hold the teaching and this game lightly, and pick your own next step.",
  icon: "img/worlds/w7.svg",
  intro: "You have now walked through all 4 of the doctor's questions. This last world puts the answers together in your own words. Then it shows how to carry them home. 4 things help: good company, kindness toward your own slips, a light grip, and a next step you choose.",
  lessons: [
    {
      id: "w7-l1",
      title: "Four Questions, Four Answers",
      minutes: 5,
      icon: "img/icons/medicine-bag.svg",
      objective: "After this lesson you can answer the doctor's 4 questions in your own words: what hurts, why, can it stop, and what is the treatment.",
      headsUp: "",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The first talk",
          text: "The Buddha gave his first talk in a deer park, to 5 old friends. That talk gave 4 answers about the hurt in a human life.\n\nRemember our doctor from World 0? A good doctor asks 4 things. What hurts? Why? Can it stop? What is the treatment? The Buddha's 4 answers fit those 4 questions.\n\nYou have now walked through all 4. Together they have a famous name. You will meet it at the end of this lesson. Before that, you get to say them in your own words."
        },
        {
          type: "idea",
          text: "The whole teaching fits in 4 answers. Something is not quite right, and a “gotta have it” pull adds hurt on top. That added hurt can stop, and there is a training for it."
        },
        {
          type: "example",
          label: "Our example",
          title: "One late bus, 4 answers",
          text: "Your bus is late and you feel anger rising. What hurts? Being late, and the anger on top. Why? A pull that says, “This must not happen!” Can it stop? The bus stays late, but the anger can cool. What is the treatment? Notice the pull, take a breath, and speak kindly."
        },
        {
          type: "try",
          text: "Pick one small annoyance from today. Finish 4 sentences about it, out loud or in your head.\n\n“What hurts is…”\n“It hurts because…”\n“The added hurt can stop when…”\n“The training is…”\n\nAny honest answer counts. Stuck? Go back one card and use the late bus instead. Notice which answer came quickest.",
          seconds: 60,
          quietText: ""
        },
        {
          type: "word",
          term: "Four Noble Truths",
          say: "",
          old: "",
          means: "The Buddha's 4 answers: the hurt, its cause, its end, and the path of training. This is the library's name for them."
        }
      ],
      quiz: [
        {
          q: "A friend asks, “What did the Buddha teach, in short?” Which reply fits best?",
          options: [
            "Life is all misery, so it is best to expect nothing good.",
            "Wanting is bad, so the goal is to want nothing at all.",
            "Hurt has a cause. The added hurt can stop. Training helps."
          ],
          answer: 2,
          why: "Those are the 4 answers: what hurts, why, that the added hurt can stop, and the training.",
          again: "The teaching does not call life or wanting bad: it names a hurt, a cause, good news and a training."
        },
        {
          q: "Your back aches most days. You hope this training will make the pain vanish. What do the 4 answers say can stop?",
          options: [
            "The hurt you add on top of pain",
            "All pain in the body, for good",
            "Nothing at all, so there is no use trying"
          ],
          answer: 0,
          why: "Pain still comes, even for the Buddha; what can end is the hurt added on top.",
          again: "Pain still lands on everyone, so the good news is about the extra hurt added on top."
        },
        {
          q: "A friend gives up a class that you think is good for them. What does a steady heart look like here?",
          options: [
            "Decide it is not your problem",
            "Stay friendly, and let them choose",
            "Push harder each day until they agree"
          ],
          answer: 1,
          why: "A steady heart still cares, and it knows that their choices are theirs.",
          again: "Steady does not mean cold: the heart stays warm, and it stops trying to control what belongs to someone else.",
          lookBack: "w6-l5"
        }
      ],
      canNow: "You can now give the Buddha's 4 answers in your own words.",
      deeper: [
        { label: "The Buddha's first talk, where the 4 answers begin", href: "suttas.html#sn56.11" },
        { label: "The 4 answers explained, one line at a time", href: "suttas.html#mn141" }
      ]
    },
    {
      id: "w7-l2",
      title: "Good Friends",
      minutes: 4,
      icon: "img/icons/two-friends.svg",
      objective: "After this lesson you can explain why the people and voices you spend time with shape you. You can name one person who makes you kinder or calmer.",
      headsUp: "",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "Half of the path?",
          text: "The Buddha had a helper named Ananda. One day Ananda came to him, pleased with a new thought. “Good friends are half of this path!” he said.\n\n“Not half, Ananda,” the Buddha replied. “Good friends are the whole of it.”\n\nWith good friends, he said, a person can grow in the whole training."
        },
        {
          type: "idea",
          text: "The people you spend your hours with shape who you become. So good company is not an extra. It shapes the whole training."
        },
        {
          type: "example",
          label: "Our example",
          title: "The voices on your phone",
          text: "Today, company includes the voices on your phone. One stream of posts and videos leaves you angry and wanting more. One friend leaves you calmer and a little kinder. Both are company. You can spend more hours with the one that makes you kinder."
        },
        {
          type: "try",
          text: "Name one person who makes you kinder or calmer. A relative, a neighbor or an old friend all count. No one comes to mind? A kind voice you read or hear counts the same. Plan one small contact this week. A message is enough, or a few minutes with that voice. Notice how it feels to think of them.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "Sangha",
          say: "SUNG-gah",
          old: "",
          means: "The Buddha's community: good friends for the training. First, the monks and nuns who train full time. More loosely, everyone who walks this path together."
        }
      ],
      quiz: [
        {
          q: "After time with one group you always feel meaner and more restless. What does this lesson suggest?",
          options: [
            "Stay, and trust that the group will not change you",
            "Spend more time with people who steady you",
            "Leave everyone and train completely alone"
          ],
          answer: 1,
          why: "We grow like our company, so choosing it with care shapes the whole training.",
          again: "People slowly become like those they spend their hours with, so the company you keep is worth choosing."
        },
        {
          q: "Each night you read posts on your phone that leave you angry. How does this lesson see those posts?",
          options: [
            "As company that shapes you, like a person",
            "As harmless, because it is only a screen",
            "As proof that something is the matter with you"
          ],
          answer: 0,
          why: "Voices on a screen fill your hours too, so they count as company.",
          again: "Whatever fills your hours shapes you, whether it is a person in the room or a voice on a screen."
        },
        {
          q: "Your favorite cup breaks. You keep thinking, “This must not be happening!” Which of the Buddha's 4 answers does that thought show?",
          options: [
            "The treatment: a training you can follow",
            "The end: the added hurt coming to a stop",
            "The cause: the pull that adds hurt"
          ],
          answer: 2,
          why: "“This must not be happening” is the pull, and the pull is what adds hurt on top of the broken cup.",
          again: "Look at the word “must” in that thought: one of the 4 answers says where added hurt comes from.",
          lookBack: "w7-l1"
        }
      ],
      canNow: "You can now explain why the people around you shape you, and name one person who makes you kinder.",
      deeper: [
        { label: "Why good friends are the whole path", href: "suttas.html#sn45.2" },
        { label: "How to tell a true friend from a false one", href: "suttas.html#dn31" },
        { label: "Friendship in modern life", href: "themes.html#friendship" }
      ]
    },
    {
      id: "w7-l3",
      title: "When You Slip",
      minutes: 4,
      icon: "img/icons/river.svg",
      objective: "After this lesson you can meet a mistake or an off day the way the teaching says. Own it, begin again, and add good around it, without scolding yourself.",
      headsUp: "",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "A lump of salt",
          text: "Drop a lump of salt into a cup of water. Now you cannot drink it. Drop the same lump into a great river. You cannot taste it at all.\n\nThe Buddha said a mistake is like the salt. The same small mistake weighs heavily on one person and barely touches another. The first person is like the cup. The second has grown in kindness and honesty, and is like the river. Every kind, honest act makes you more river and less cup."
        },
        {
          type: "idea",
          text: "Everyone slips, and everyone has off days. You cannot take a mistake back, but you can add good around it. Own it, begin again, and keep adding kind, honest acts."
        },
        {
          type: "example",
          label: "Our example",
          title: "A sharp word in the morning",
          text: "You speak sharply to someone in the morning. All day a voice in your head says, “I am a terrible person.” That is the cup: one mistake filling everything. Scolding yourself adds no water. Try the river. Say sorry. Do one kind thing today, and one more tomorrow. The sharp word still happened. It is now a small part of a bigger day."
        },
        {
          type: "try",
          text: "Bring to mind one small thing you regret. Keep it small. Say, out loud or in your head: “That happened. I own it.” Then name one good thing you will do today. That adds water to the river. Notice how the regret feels now. It may feel the same. That is fine.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You planned a short practice each morning, then skipped a whole week. What fits this lesson?",
          options: [
            "Begin again today, with no scolding",
            "Give up, because the habit is ruined",
            "Do extra for a week to pay it back"
          ],
          answer: 0,
          why: "Off days are normal, and beginning again is the skill being trained.",
          again: "Everyone has off days, and the teaching asks only that you own it and take the next small step."
        },
        {
          q: "You said something unkind last week and still feel bad. Which reply to yourself matches the river?",
          options: [
            "“I am a bad person and always will be.”",
            "“It was nothing. Forget it.”",
            "“I did that. I will say sorry and do better.”"
          ],
          answer: 2,
          why: "Owning it and adding kind acts makes you more river and less cup.",
          again: "The teaching asks for 2 things together: admit what happened, and keep adding kind, honest acts around it."
        },
        {
          q: "You want to speak more kindly this year. What is likely to help most?",
          options: [
            "Pushing yourself harder, all on your own",
            "Spending time with people who speak kindly",
            "Waiting until you feel ready to change"
          ],
          answer: 1,
          why: "We become like our company, so time with kind speakers helps kind speech grow.",
          again: "Think about who you spend your hours with, because people slowly become like their company.",
          lookBack: "w7-l2"
        }
      ],
      canNow: "You can now own a mistake and begin again, without scolding yourself.",
      deeper: [
        { label: "The lump of salt and the great river", href: "suttas.html#an3.99" },
        { label: "The mirror talk: what to do after a mistake", href: "suttas.html#mn61" }
      ]
    },
    {
      id: "w7-l4",
      title: "The Raft",
      minutes: 4,
      icon: "img/icons/raft.svg",
      objective: "After this lesson you can explain that teachings, and the rewards in this game, are tools to use, not trophies to show off or fight over.",
      headsUp: "",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The man and the raft",
          text: "A man comes to a wide river. He builds a raft, a simple flat boat, and gets safely across. On the far bank, the other side of the river, he looks at the raft. It was so useful! He decides to carry it on his head from now on.\n\nThe Buddha asked: is that sensible? Then he said his own teaching is like that raft. It is for crossing over. It is not for carrying on your head afterward."
        },
        {
          type: "idea",
          text: "A teaching is a tool, like the raft. It is for easing hurt, not for showing off or fighting over. You are still crossing, so keep using it."
        },
        {
          type: "example",
          label: "Our example",
          title: "A small raft of your own",
          text: "The points on this Trail were a small raft for a small crossing. They helped you take one step, then the next. They never measured how wise or kind you are. The Trail is nearly done, so leave the points on the bank. The skills go with you.",
          quietText: "The check marks on this Trail were a small raft for a small crossing. They helped you take one step, then the next. They never measured how wise or kind you are. The Trail is nearly done, so leave them on the bank. The skills go with you."
        },
        {
          type: "try",
          text: "Think of your points and badges. Say, out loud or in your head: “These were my raft for the Trail.” Then name one skill you will keep using. 2 arrows, for spotting added hurt? 4 gates, for careful words? 10 breaths, for a steady mind? That is what goes with you. Notice how light it is to carry.",
          seconds: 45,
          quietText: "Think of the steps you have ticked off. Say, out loud or in your head: “These were my raft for the Trail.” Then name one skill you will keep using. 2 arrows, for spotting added hurt? 4 gates, for careful words? 10 breaths, for a steady mind? That is what goes with you. Notice how light it is to carry."
        }
      ],
      quiz: [
        {
          q: "2 people argue for hours about who understands the Buddha's teaching best. How does the raft story see this?",
          options: [
            "The one who wins understands it best",
            "They are fighting over a tool meant for crossing",
            "Arguing is the best way to learn it"
          ],
          answer: 1,
          why: "A teaching is a raft for easing hurt, and fighting over it only adds more.",
          again: "A raft is for carrying someone across, and it helps only when it is used."
        },
        {
          q: "You have learned to spot the hurt you add on top of pain. What is the best use of that skill?",
          options: [
            "Use it the next time something small goes badly",
            "Tell people how much you now know",
            "Keep it in mind as a fact you once learned"
          ],
          answer: 0,
          why: "A teaching is a tool, and a tool helps when you use it in a real moment.",
          again: "A teaching works like a raft: its worth is in carrying you across, not in being owned or shown."
        },
        {
          q: "You broke a promise to a friend. Which response fits the salt and the river?",
          options: [
            "Hide it and hope it is forgotten",
            "Punish yourself until the debt feels paid",
            "Admit it, say sorry, and keep your next promise"
          ],
          answer: 2,
          why: "Owning a mistake and then adding good acts is like adding water around the salt.",
          again: "A mistake is like salt in water: you cannot take it out, but you can add more water.",
          lookBack: "w7-l3"
        }
      ],
      canNow: "You can now explain why a teaching is a tool to use, not a trophy to show.",
      deeper: [
        { label: "The raft, and the snake held by the tail", href: "suttas.html#mn22" },
        { label: "The elephant and the men who each touched one part", href: "suttas.html#ud6.4" },
        { label: "Some of the oldest poems: wise people do not fight over views", href: "suttas.html#snp4" }
      ]
    },
    {
      id: "w7-l5",
      title: "Keep Going, With Care",
      minutes: 4,
      icon: "img/icons/lamp.svg",
      objective: "After this lesson you can name your own next step: one practice to keep and one place in the library to explore.",
      headsUp: "A gentle note before you start: this lesson tells of the Buddha's last days and his death. You can set it aside and come back whenever you like.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The last words",
          text: "At 80, the Buddha was sick and close to death. He chose no one to lead his students after him. He said the teaching itself would be their teacher.\n\nHe asked his students 3 times if anyone still had a question. No one did. His last words were plain: all things change, so keep going, with care."
        },
        {
          type: "idea",
          text: "The Buddha left his students a teaching, not a new leader. So the next step is yours to choose. One small practice, kept with care, is enough to keep going."
        },
        {
          type: "example",
          label: "Our example",
          title: "A small plan you can keep",
          text: "One learner finishes this Trail and makes a small plan. She keeps one practice: one quiet minute each morning. She picks one place to explore: the library card about the 2 arrows. That is all. The plan is small on purpose, so she can keep it up."
        },
        {
          type: "try",
          text: "Choose 2 things. One practice from this Trail to keep. One part of the library to visit next. Not sure where to go? The last card of this lesson lists places to start. Say your 2 things, out loud or in your head: “Next, I will…” The choice is yours now. Notice how it feels to choose.",
          seconds: 45,
          quietText: ""
        },
        {
          type: "word",
          term: "Dhamma",
          say: "DUM-mah",
          old: "",
          means: "The Buddha's teaching; the way things really work. Also spelled Dharma. People who follow the Buddha lean on 3 things: the teacher (the Buddha), the teaching (the Dhamma) and the community (the Sangha). You have now met all 3."
        }
      ],
      quiz: [
        {
          q: "You finish the Trail and feel unsure what to do next. What fits this lesson?",
          options: [
            "Wait for someone to tell you the next step",
            "Pick one small practice and one place to read",
            "Take up every practice from the Trail at once"
          ],
          answer: 1,
          why: "The teaching is the guide now, and a small step you choose yourself is enough.",
          again: "The Buddha named no new leader, so each person chooses a next step and takes it with care."
        },
        {
          q: "You want to read the whole library in one week, late into every night. Which plan is closer to “keep going, with care”?",
          options: [
            "A little on most days, with rest days",
            "All of it this week, even with no sleep",
            "None of it, since you cannot do it all"
          ],
          answer: 0,
          why: "Small steady steps can be kept up, like a string tuned not too tight and not too loose.",
          again: "Keeping going with care means a pace you can hold: not a rush, and not giving up."
        },
        {
          q: "You learn a calming practice that helps you. Later you notice you mostly use it to impress people. What fits the raft story?",
          options: [
            "Impressing people is what learning is for",
            "Throw the practice away at once",
            "Go back to using it as a tool"
          ],
          answer: 2,
          why: "A teaching is a raft: it is for crossing, not for showing off.",
          again: "Remember the man with the raft on his head: a tool helps when it is used for its own job.",
          lookBack: "w7-l4"
        }
      ],
      canNow: "You can now name your own next step: one practice to keep and one place to explore.",
      deeper: [
        { label: "The Buddha's last days", href: "suttas.html#dn16" },
        { label: "Why only these four questions? The poisoned arrow story", href: "suttas.html#mn63" },
        { label: "Short verses to carry with you", href: "suttas.html#dhp" }
      ]
    }
  ],
  boss: {
    title: "The Homecoming Check",
    intro: "A few short questions about the lessons in this world. There is no score. If an answer is not quite right, you see the idea again and pick once more.",
    questions: [
      {
        q: "A worry keeps coming back. Following the doctor's 4 questions, where do you begin?",
        options: [
          "Look honestly at what hurts",
          "Jump straight to a fix",
          "Decide it can never get better"
        ],
        answer: 0,
        why: "The 4 answers begin with a clear look at what hurts, before any fixing.",
        again: "A good doctor asks what hurts and why before choosing a treatment, and the 4 answers keep that order.",
        lesson: "w7-l1"
      },
      {
        q: "You can join one of 2 groups. One often speaks unkindly about people. One is kind and honest. Why does the choice matter?",
        options: [
          "You stay the same wherever you go",
          "You slowly become like your company",
          "Kind people will do the training for you"
        ],
        answer: 1,
        why: "People grow like those they spend their hours with, so the group shapes you.",
        again: "Good friends are the whole path because the people around you shape what grows in you.",
        lesson: "w7-l2"
      },
      {
        q: "A friend breaks a promise and says, “I ruin everything.” Which reply fits the salt and the river?",
        options: [
          "“You are right. A mistake like that stays forever.”",
          "“It was nothing. Stop thinking about it.”",
          "“It happened. What kind thing can you do next?”"
        ],
        answer: 2,
        why: "It admits the mistake and then adds a kind act, like more water around the salt.",
        again: "A mistake is real, and it is also only one lump of salt, and you can keep adding water.",
        lesson: "w7-l3"
      },
      {
        q: "You notice you feel proud of how many lessons you have finished. What would the raft story suggest?",
        options: [
          "Enjoy it, and keep using the skills",
          "Feel ashamed for being proud",
          "Finish more lessons so the pride lasts"
        ],
        answer: 0,
        why: "Feeling glad is fine; the count was a raft for this Trail, and the skills are what you carry on.",
        again: "A raft is for crossing, so what matters afterward is the use you make of what you learned.",
        lesson: "w7-l4"
      },
      {
        q: "The lessons are finished and nobody is telling you what comes next. What did the last lesson suggest?",
        options: [
          "Stop here, because the lessons have ended",
          "Choose one small next step yourself",
          "Find someone who will decide for you"
        ],
        answer: 1,
        why: "The teaching is the guide now, and the next step is yours to choose.",
        again: "The Buddha named no new leader: he said the teaching itself would be the teacher.",
        lesson: "w7-l5"
      }
    ]
  }
});
