/* The Trail, world 6: The Open Heart.
   Shape and rules: docs/GAME_CONTRACT.md section 6. Design: docs/game-spec.json (world "w6").
   Check with: node tools/validate.js trail w6 */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w6",
  order: 6,
  title: "The Open Heart",
  tagline: "The treatment, part 3. Turn the training outward: kindness, care, gladness, steadiness.",
  stage: 4,
  goal: "By the end you have 4 ways to meet other people, even difficult ones: kindness, care, gladness and steadiness. You have one way to put a grudge down.",
  icon: "img/worlds/w6.svg",
  intro: "The treatment goes on. Worlds 4 and 5 trained how you live and how steady your mind is. This world turns both outward, toward other people. You practice kindness, care, gladness and steadiness. The last lesson is about anger, and how to put down a grudge: old anger you still carry.",
  lessons: [

    /* ---------- w6-l1 ---------- */
    {
      id: "w6-l1",
      title: "Everyone Holds Themselves Dear",
      minutes: 4,
      icon: "img/icons/heart.svg",
      objective: "After this lesson you can explain where kindness starts: everyone cares about their own life as much as you care about yours, so you do not harm them.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The king's question",
          text: "A king asked his queen a question. “Is there anyone you love more than yourself?” He was hoping she would name him.\n\nQueen Mallika answered honestly. “No. And you?” The king had to admit it. “No.”\n\nHe went and told the Buddha. The Buddha agreed with the queen. Search the whole world, he said. You will find no one you love more than yourself.\n\nEveryone else feels the same way. So anyone who loves themselves should harm no one."
        },
        {
          type: "idea",
          text: "Everyone holds their own life dear: they love it as much as you love yours. That is where kindness starts. You know how much your life matters to you, so you do not harm theirs."
        },
        {
          type: "example",
          label: "Our example",
          title: "The push in the doorway",
          text: "Someone pushes past you in a doorway. You feel a flash of annoyance. Then you try the queen's honest thought. This person holds their own life dear, the same as you. Maybe they are late. Maybe they are worried. You do not have to like the push. You just stop seeing this person as an enemy."
        },
        {
          type: "try",
          text: "Look at the next person you see, or picture one. Say, out loud or in your head: “You want to be happy, the same as me. You do not want to be in pain, the same as me.” Then notice how that person looks to you now.",
          seconds: 40
        }
      ],
      quiz: [
        {
          q: "A stranger speaks sharply to you in the street. Which thought uses this lesson?",
          options: [
            "Their life matters to them as much as mine matters to me",
            "People who are rude do not feel things the way I do",
            "A kind person stops caring about their own life"
          ],
          answer: 0,
          why: "Their life matters to them as much as yours matters to you, and kindness starts there.",
          again: "Think of the queen's honest answer: what is true for you is true for the stranger too."
        },
        {
          q: "You feel a little guilty for wanting your own life to go well. What did the Buddha say about that wish?",
          options: [
            "It is a fault, so keep it hidden",
            "Only selfish people have it",
            "Everyone has it, so harm no one"
          ],
          answer: 2,
          why: "He said everyone loves themselves, and that this is the very reason to harm no one.",
          again: "The Buddha did not blame this wish, because he saw it as the place where kindness starts."
        },
        {
          q: "You sit down for 10 quiet breaths and soon feel sleepy. What does the training suggest?",
          options: [
            "Stop, because the practice is not working",
            "Name the sleepiness as a visitor and carry on",
            "Fight the sleepiness until it is gone"
          ],
          answer: 1,
          why: "Sleepiness is one of 5 normal visitors, so you name it and carry on.",
          again: "Sleepiness, fidgeting and doubt visit everyone who trains; a visit is normal and nothing to fight.",
          lookBack: "w5-l6"
        }
      ],
      canNow: "You can now explain where kindness starts: everyone holds their own life dear, as you do.",
      deeper: [
        { label: "The king, the queen and the honest answer", href: "suttas.html#sn3.8" }
      ]
    },

    /* ---------- w6-l2 ---------- */
    {
      id: "w6-l2",
      title: "Wishing Well",
      minutes: 4,
      icon: "img/icons/heart-rays.svg",
      objective: "After this lesson you can practice goodwill (wishing someone well on purpose) as a skill you train, not a mood you wait for.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "A wish that leaves nobody out",
          text: "The Buddha's best-known poem holds one plain wish. May all living things be happy and safe. It leaves nobody out. Weak or strong, seen or unseen: may they all be happy.\n\nThen comes its famous picture. A mother guards her only child with her life. Guard this wish in the same way, the Buddha said. Keep it going while you stand, walk, sit or lie down.\n\nThis wish has a name: goodwill."
        },
        {
          type: "idea",
          text: "Goodwill means wishing someone well on purpose, the way a friend would. It is a skill you train, not a mood you wait for. You do not have to like someone to wish them well."
        },
        {
          type: "example",
          label: "Our example",
          title: "The bus driver",
          text: "You get on a bus. The driver looks tired and does not smile at you. You do not have to like him. You can still think, “May you have a safe day at work.” You want nothing back. He may never know. You have practiced the skill once. Do it often and it becomes a habit."
        },
        {
          type: "try",
          text: "Say slowly, out loud or in your head: “May I be well.” Picture yourself. “May you be well.” Picture someone you like. “May everyone be well.” Picture everyone on your street. Do this 3 times. Then notice how you feel. Any answer is fine.",
          seconds: 45
        },
        {
          type: "word",
          term: "goodwill",
          say: "MET-tah",
          old: "metta",
          means: "Wishing someone well, the way a friend would, with nothing wanted back."
        }
      ],
      quiz: [
        {
          q: "A neighbor never greets you, and you do not like him much. What does this lesson say about goodwill toward him?",
          options: [
            "It needs a warm feeling first",
            "It can wait until he is friendlier",
            "You can wish him well anyway"
          ],
          answer: 2,
          why: "Goodwill is a wish you make on purpose, so it does not depend on liking the person.",
          again: "Goodwill is a plain wish for someone to be well, and it does not wait for you to like them."
        },
        {
          q: "You wished people well all day and felt nothing special. What does this lesson say about that?",
          options: [
            "The practice still counts, because it is a skill",
            "It shows you are not a kind person",
            "It is better to wait until the mood comes"
          ],
          answer: 0,
          why: "Goodwill is trained like any skill, so each honest try counts, with or without a warm glow.",
          again: "Goodwill is something you build by doing it, not a feeling you have to wait for."
        },
        {
          q: "A shop worker is slow, and you are in a hurry. Which thought does kindness start from?",
          options: [
            "They are being slow on purpose, just to annoy me",
            "Their day matters to them, the same as mine",
            "My time matters much more than their time does"
          ],
          answer: 1,
          why: "Kindness starts from seeing that their life matters to them as much as yours does to you.",
          again: "Kindness starts here: every person cares about their own life, the same as you.",
          lookBack: "w6-l1"
        }
      ],
      canNow: "You can now wish someone well on purpose, whether or not you like them.",
      deeper: [
        { label: "The Buddha's poem on goodwill", href: "suttas.html#snp1.8" },
        { label: "What a habit of goodwill does for the one who keeps it", href: "suttas.html#an11.15" },
        { label: "Goodwill shines like the moon among the stars", href: "suttas.html#iti27" }
      ]
    },

    /* ---------- w6-l3 ---------- */
    {
      id: "w6-l3",
      title: "Caring Without Drowning",
      minutes: 4,
      icon: "img/icons/two-friends.svg",
      objective: "After this lesson you can care about someone's pain while keeping your own balance, because looking after yourself is part of looking after others.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "2 acrobats on a pole",
          text: "Two acrobats (people who do balancing tricks) work on a tall bamboo pole. One is the teacher. One is his apprentice, a learner.\n\n“You watch me and I will watch you,” says the teacher. “Then we will both be safe.”\n\n“No, teacher,” says the apprentice. “You watch your balance and I will watch mine. That is how we both stay safe.”\n\nThe Buddha said the apprentice was right. By looking after yourself, you look after others."
        },
        {
          type: "idea",
          text: "The wish to ease someone's pain is called compassion. To keep it going, you keep your own balance. Looking after yourself is part of looking after them."
        },
        {
          type: "example",
          label: "Our example",
          title: "Sitting with a sick friend",
          text: "You sit with a sick friend. You wish the pain would ease. After an hour you feel heavy and close to tears. So you step outside, breathe and drink some water. That is not selfish. It is how you can come back and care again tomorrow."
        },
        {
          type: "try",
          text: "Think of someone who is having a hard time. Wish them, out loud or in your head: “May your pain ease.” Then check your own balance. Take one slow breath, or feel your feet on the floor. Notice how steady or unsteady you feel right now. Either is fine.",
          seconds: 40
        },
        {
          type: "word",
          term: "compassion",
          say: "",
          old: "",
          means: "The wish to ease someone's pain, without drowning in it yourself."
        }
      ],
      quiz: [
        {
          q: "A friend calls every night with their troubles, and you are very tired. What fits this lesson?",
          options: [
            "Answer every call, because real care has no limits",
            "Keep caring, and rest so you can keep it up",
            "Stop caring, because their pain is not yours"
          ],
          answer: 1,
          why: "Care lasts when you keep your own balance, so resting is part of helping.",
          again: "Caring about someone's pain goes together with looking after your own balance."
        },
        {
          q: "You watch sad news and feel so upset that you cannot do anything all day. What would help your care last?",
          options: [
            "Keeping your own balance while you care",
            "Feeling even more upset, to show you care",
            "Deciding never to care about the news again"
          ],
          answer: 0,
          why: "Compassion is the wish to ease pain without drowning in it, so steadying yourself is part of it.",
          again: "Compassion wishes pain to ease, and it lasts only when you do not drown in the pain yourself."
        },
        {
          q: "You are about to visit someone you find difficult. What would practicing goodwill look like?",
          options: [
            "Waiting until you like them",
            "Acting as if they never upset you",
            "Wishing them well on purpose, in your mind"
          ],
          answer: 2,
          why: "Goodwill is a wish you make on purpose, so you can make it before any warm feeling comes.",
          again: "Goodwill is a skill: a plain wish for someone to be well, whatever your mood is today.",
          lookBack: "w6-l2"
        }
      ],
      canNow: "You can now care about someone's pain and keep your own balance.",
      deeper: [
        { label: "The two acrobats on the bamboo pole", href: "suttas.html#sn47.19" },
        { label: "How a kind heart is trained, wider and wider", href: "suttas.html#sn46.54" }
      ]
    },

    /* ---------- w6-l4 ---------- */
    {
      id: "w6-l4",
      title: "Glad for Them",
      minutes: 4,
      icon: "img/icons/heart-rays.svg",
      objective: "After this lesson you can turn envy around by being glad on purpose when someone else does well.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "A training in gladness",
          text: "Rahula was the Buddha's son. As a teenager, he sat down under a tree to train his mind. His father gave him several trainings for the heart. Each one helps with one hard feeling.\n\nOne hard feeling is a bitter mood, with no joy in it. The training for it is gladness: being glad when other people do well.\n\nIn this lesson we use it for envy. Envy is the sting you feel when someone else does well."
        },
        {
          type: "idea",
          text: "When someone else does well, you can be glad for them on purpose. The sting of envy is normal, and everyone gets it. Gladness is a skill, and with practice it can start to feel real."
        },
        {
          type: "example",
          label: "Our example",
          title: "Good news that stings",
          text: "Your friend has good news. Maybe it is a new home, or a trip. You say “Congratulations!” and feel a small sting inside. Everyone gets that sting. It does not make you a bad friend. You notice it. Then you add one thought on purpose: “Good for you. May it last.”"
        },
        {
          type: "try",
          text: "Think of someone who had good news lately. Say in your mind: “Good for you. May your good luck last.” Notice whether the sting softens even a little. If it does not, that is fine too.",
          seconds: 30
        }
      ],
      quiz: [
        {
          q: "A neighbor wins a prize you wanted, and you feel a sting. What does this lesson suggest?",
          options: [
            "Keep away from them until the sting is gone",
            "Blame yourself for feeling the sting",
            "Notice the sting, then be glad for them on purpose"
          ],
          answer: 2,
          why: "The sting is normal, and being glad on purpose is the training that turns it around.",
          again: "The sting of envy is normal; what the Buddha taught his son was to train gladness for the other person."
        },
        {
          q: "You think “Good for you” about a friend, but it does not feel real yet. What now?",
          options: [
            "Keep practicing. Gladness grows a little at a time.",
            "Stop. It only counts when it feels real.",
            "It means you do not truly like your friend."
          ],
          answer: 0,
          why: "Gladness is trained on purpose, so it is fine for it to feel thin when you begin.",
          again: "Gladness is a skill you build on purpose, and it does not have to feel real yet."
        },
        {
          q: "You have helped a neighbor through a hard week, and now you feel very tired. What keeps your care going?",
          options: [
            "Giving up your own rest for them",
            "Looking after your own balance too",
            "Feeling their pain as strongly as they do"
          ],
          answer: 1,
          why: "Like the two acrobats, each person keeping their own balance is what keeps both safe.",
          again: "Compassion wishes someone's pain to ease, and it lasts when you do not drown in that pain yourself.",
          lookBack: "w6-l3"
        }
      ],
      canNow: "You can now meet the sting of envy by being glad for someone on purpose.",
      deeper: [
        { label: "The Buddha's advice to his teenage son", href: "suttas.html#mn62" },
        { label: "4 kinds of warm heart, and how they are trained", href: "suttas.html#sn46.54" }
      ]
    },

    /* ---------- w6-l5 ---------- */
    {
      id: "w6-l5",
      title: "A Steady Heart",
      minutes: 4,
      icon: "img/icons/mountain.svg",
      objective: "After this lesson you can explain a steady heart: staying steady while still caring, because each person owns their own actions. It is not coldness.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "Be like the earth",
          text: "The Buddha gave his teenage son a picture to train with. Think of the earth, he said.\n\nPeople drop flowers on it. They drop trash on it too. The earth does not cheer at the flowers. It does not get upset at the trash. It takes in both and stays the earth.\n\nTrain your mind to be like the earth."
        },
        {
          type: "idea",
          text: "A steady heart keeps its balance, like the earth, and still cares. It does not try to control other people: their choices are theirs. Steady does not mean cold."
        },
        {
          type: "example",
          label: "Our example",
          title: "A friend's choice",
          text: "A friend keeps lending money to someone who never pays it back. It worries you. You have said so kindly, more than once. They still do it. A cold heart says, “Not my problem.” A drowning heart cannot sleep. A steady heart says, “I care. I will help where I can. The choice is yours.” Then it stays close."
        },
        {
          type: "try",
          text: "Think of someone you worry about. Say, out loud or in your head: “I care about you. I will help where I can. Your choices are yours.” Feel your weight on the chair, like the earth. Notice what it is like to care and stay steady.",
          seconds: 40
        },
        {
          type: "word",
          term: "steady heart",
          say: "",
          old: "",
          means: "A calm, balanced heart that still cares. It is not coldness. The library calls it “equanimity” (say: ee-kwuh-NIM-uh-tee)."
        }
      ],
      quiz: [
        {
          q: "Your friend ignores your advice, and things go badly for them. What does a steady heart do?",
          options: [
            "Says “I told you so” and walks away",
            "Keeps caring, and sees the choice was theirs",
            "Takes all the blame for not stopping them"
          ],
          answer: 1,
          why: "A steady heart stays close and caring while seeing that each person owns their own choices.",
          again: "A steady heart still cares, and it remembers that other people's choices belong to them."
        },
        {
          q: "A friend is crying about a bad day. What does a steady heart look like here?",
          options: [
            "Feeling nothing, so their tears cannot upset you",
            "Getting as upset as they are",
            "Staying calm and listening with care"
          ],
          answer: 2,
          why: "A steady heart stays calm and still cares, so it can listen without turning cold.",
          again: "A steady heart is balance together with care, so it is never a way of shutting people out."
        },
        {
          q: "A friend shares happy news, and you feel a small sting. What can you train here?",
          options: [
            "Being glad for them on purpose",
            "Staying away from people with good news",
            "Deciding that you are a jealous person"
          ],
          answer: 0,
          why: "The sting is normal, and gladness for the other person is a skill you can train.",
          again: "Everyone feels that sting sometimes, and the training is to turn toward the other person's good news warmly.",
          lookBack: "w6-l4"
        }
      ],
      canNow: "You can now explain a steady heart: balanced, still caring, and not cold.",
      deeper: [
        { label: "Be like the earth: the Buddha's advice to his son", href: "suttas.html#mn62" },
        { label: "5 honest facts about aging, loss and “my actions are mine”", href: "suttas.html#an5.57" }
      ]
    },

    /* ---------- w6-l6 ---------- */
    {
      id: "w6-l6",
      title: "Anger Burns the Holder",
      minutes: 5,
      icon: "img/icons/three-flames.svg",
      objective: "After this lesson you can explain how anger does an enemy's work for them by hurting the one who holds it.",
      steps: [
        {
          type: "story",
          label: "The Buddha said",
          title: "What an enemy would wish",
          text: "Think what an enemy would wish on you. “May you sleep badly. May you look ugly. May you lose your friends. May things go badly for you.”\n\nThe Buddha pointed out something strange. Anger does all of this to the angry person. The enemy does not have to do a thing.\n\nAnger, he said, makes you a tool of your enemy's wishes."
        },
        {
          type: "idea",
          text: "Remember the three fires: wanting, pushing away and fog. Anger is the pushing-away fire, from annoyance up to hate. It burns the one who holds it, so it does your enemy's work for them."
        },
        {
          type: "example",
          label: "Our example",
          title: "A night spent replaying",
          text: "Someone says something unkind about you. Feeling angry is normal. That night you lie awake and replay it. You plan sharp replies. In the morning you are tired, and you are rude to a friend. The other person slept well. Your anger cost you a night's sleep. It cost your friend a kind word. It cost the other person nothing."
        },
        {
          type: "try",
          text: "Pick one small grudge, an old annoyance you still carry. Here are 5 ways out. Choose one you can honestly do, and try it in your head.\n\n1. Wish them well.\n\n2. Wish their troubles would ease.\n\n3. Stay steady.\n\n4. Give it no more attention.\n\n5. Remember their actions are theirs, not yours.\n\nNotice how the grudge feels now.",
          seconds: 60
        }
      ],
      quiz: [
        {
          q: "You stay angry at someone for a week, and they never find out. Who does the anger hurt most?",
          options: [
            "Them. Anger is a way to punish people.",
            "You, the one holding it.",
            "Nobody, as long as you keep it inside."
          ],
          answer: 1,
          why: "Anger costs the holder sleep, calm and good choices, while the other person feels none of it.",
          again: "Think of anger as a fire, and ask who is standing closest to it."
        },
        {
          q: "Your anger feels completely fair. Which question fits this lesson best?",
          options: [
            "“What is this anger costing me?”",
            "“How can I make them feel this too?”",
            "“Why am I such an angry person?”"
          ],
          answer: 0,
          why: "Even fair anger still burns the holder, so asking what it costs you is the useful question.",
          again: "Fair or not, anger still does something to the person who holds it."
        },
        {
          q: "Someone praises you one day and blames you the next. What would a steady heart do?",
          options: [
            "Cheer at the praise and get upset at the blame",
            "Stop listening to anyone at all",
            "Take in both, stay balanced and keep caring"
          ],
          answer: 2,
          why: "Like the earth with flowers and trash, a steady heart takes in both and stays itself.",
          again: "A steady heart keeps its balance through pleasant and unpleasant things, and it does not turn cold.",
          lookBack: "w6-l5"
        }
      ],
      canNow: "You can now explain how anger hurts the one who holds it, and pick one way to put a grudge down.",
      deeper: [
        { label: "7 things an enemy would wish on you", href: "suttas.html#an7.64" },
        { label: "5 ways to put a grudge down", href: "suttas.html#an5.161" },
        { label: "Modern Life: conflict, anger and how we talk", href: "themes.html#conflict" }
      ]
    }
  ],

  boss: {
    title: "The Big-Heart Check",
    intro: "5 short questions about meeting other people with an open heart. There is no score. Take your time, and pick again whenever you like.",
    questions: [
      {
        q: "You are about to repeat an unkind joke about someone. Which thought does kindness start from?",
        options: [
          "They want to be happy, the same as me",
          "A joke like this cannot really hurt anyone",
          "They would say the same thing about me"
        ],
        answer: 0,
        why: "Their life is as dear to them as yours is to you, and that is where kindness begins.",
        again: "Kindness starts from one honest fact: every person cares about their own life as much as you care about yours.",
        lesson: "w6-l1"
      },
      {
        q: "You pass a stranger sweeping the street. What would goodwill be here?",
        options: [
          "Feeling sorry that they have to sweep the street",
          "Wishing them a good day, wanting nothing back",
          "Hoping they notice how polite you are being"
        ],
        answer: 1,
        why: "Goodwill is a friendly wish for someone to be well, with nothing wanted in return.",
        again: "Goodwill is a plain, friendly wish for someone's good, made on purpose and asking for nothing.",
        lesson: "w6-l2"
      },
      {
        q: "A friend is very sad, and you notice you are starting to sink too. What fits compassion?",
        options: [
          "Sink with them, to show how much you care",
          "Leave, so their sadness cannot reach you",
          "Wish their pain to ease, and steady yourself too"
        ],
        answer: 2,
        why: "Compassion wishes pain to ease and keeps its own balance, like the apprentice on the pole.",
        again: "Compassion is the wish to ease someone's pain, held in a way that does not pull you under too.",
        lesson: "w6-l3"
      },
      {
        q: "Someone close to you is having a hard time and says no to your help. Which reply comes from a steady heart?",
        options: [
          "“Then do not ask me again.”",
          "“I am here. The choice is yours.”",
          "“I will not rest until you do what I say.”"
        ],
        answer: 1,
        why: "A steady heart keeps caring and stays near, while seeing that the choice belongs to them.",
        again: "A steady heart is not cold and not controlling; it cares and remembers whose choice it is.",
        lesson: "w6-l5"
      },
      {
        q: "You are still angry at someone who moved away years ago. What does the anger lesson say about that anger?",
        options: [
          "It makes sure they are punished",
          "It shows that you were right",
          "It burns you, and they feel nothing"
        ],
        answer: 2,
        why: "Anger hurts the one who holds it, so the old grudge is costing you and nobody else.",
        again: "Think of anger as a fire you are holding, and ask who it is touching right now.",
        lesson: "w6-l6"
      }
    ]
  }
});
