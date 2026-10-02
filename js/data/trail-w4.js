/* The Trail, World 4: Living Well. Lesson content and the world check.
   Shape and rules: docs/GAME_CONTRACT.md section 6. Check with: node tools/validate.js trail w4 */
window.TRAIL = window.TRAIL || [];
window.TRAIL.push({
  id: "w4",
  order: 4,
  title: "Living Well",
  tagline: "The fourth question: what is the treatment? Part 1: how you act, give, speak and earn.",
  stage: 3,
  goal: "You can name the 3 jobs of the training and use 5 tools from the first job. The tools are giving, 5 promises, the mirror check, 4 gates for words, and honest work.",
  icon: "img/worlds/w4.svg",
  intro: "You have asked what hurts, why, and whether it can stop. It can: a fire that is not fed goes out. Now comes the doctor’s fourth question: what is the treatment? It is a training. This world is its first part: how you act, give, speak and earn.",
  lessons: [

    /* ---------------------------------------------------------------- w4-l1 */
    {
      id: "w4-l1",
      title: "The Training Plan",
      minutes: 4,
      icon: "img/icons/dharma-wheel.svg",
      objective: "After this lesson you can say that the treatment is a training with 3 jobs. The jobs are: live kindly, steady the mind, see clearly.",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The nun who sorted the training",
          text: "You met Dhammadinna (say DUM-mah-DIN-nah) in World 2. She is the nun (a woman who trains full time) who explained the quick tags: nice, nasty or neutral.\n\nThat was one answer from a long talk. A man asked her many hard questions that day. He had once been her husband. She answered every one clearly.\n\nAnother answer sorted the Buddha’s training into 3 jobs. Live kindly. Steady the mind. See clearly.\n\nLater the Buddha heard it all. He said he would have explained it in exactly the same way."
        },
        {
          type: "idea",
          text: "Knowing why it hurts is only a start. The treatment is a training with 3 jobs: live kindly, steady the mind, see clearly. You train all 3, a little at a time."
        },
        {
          type: "example",
          label: "Our example",
          title: "The sore knee",
          text: "Your knee hurts, and you find out why. Knowing why does not mend it. You need a plan, and you need to follow it.\n\nThe Buddha’s plan has 3 jobs, and you have already begun one. Worlds 1 to 3 were practice in seeing clearly. This world is about living kindly. The next world is about steadying the mind."
        },
        {
          type: "try",
          text: "Look at the 3 jobs: living kindly, a steady mind, seeing clearly. Which one feels strongest for you right now? Which one feels wobbliest? There is no right answer. Only notice. You will train all 3.",
          seconds: 40,
          quietText: ""
        },
        {
          type: "word",
          term: "Eightfold Path",
          say: "",
          old: "",
          means: "The library’s name for this training plan. It splits the 3 jobs into 8 smaller steps, like 8 spokes of one wheel. You do not need the 8 yet."
        }
      ],
      quiz: [
        {
          q: "A friend says, “I know exactly why I snap at people when I am tired. But I still do it.” What does the training plan say?",
          options: [
            "Knowing why was a waste of time",
            "They need to think about it even harder",
            "It is a start, and practice comes next"
          ],
          answer: 2,
          why: "Knowing the cause is the start, and the treatment is a training you practice.",
          again: "Finding the cause comes first, and then the treatment is a training done a little at a time."
        },
        {
          q: "Someone says, “The Buddha’s treatment is only about sitting quietly.” What does that leave out?",
          options: [
            "How you live, and how clearly you see",
            "Nothing, a quiet mind is the whole plan",
            "A promise that pain will never come"
          ],
          answer: 0,
          why: "The training has 3 jobs, and a steady mind is only one of them.",
          again: "The training plan has 3 jobs that work together: live kindly, steady the mind, see clearly."
        },
        {
          q: "Someone takes the last seat just before you reach it. Anger flares up. What lets that fire burn down?",
          options: [
            "Fighting the anger as hard as you can",
            "Not feeding it with more angry thoughts",
            "Telling yourself it never happened"
          ],
          answer: 1,
          why: "A fire with no new fuel cools by itself, and the added hurt works the same way.",
          again: "The added hurt burns on fuel, so it cools when the fire is no longer fed.",
          lookBack: "w3-l6"
        }
      ],
      canNow: "You can now name the 3 jobs of the training: live kindly, steady the mind, see clearly.",
      deeper: [
        { label: "The nun whose answers the Buddha agreed with, word for word", href: "suttas.html#mn44" },
        { label: "Each part of the training, with one clear sentence for each", href: "suttas.html#mn141" },
        { label: "Where this training sits in the site’s study plan", href: "curriculum.html#stage3" }
      ]
    },

    /* ---------------------------------------------------------------- w4-l2 */
    {
      id: "w4-l2",
      title: "The Open Hand",
      minutes: 4,
      icon: "img/icons/open-hand.svg",
      objective: "After this lesson you can explain that giving, even something small, loosens the “gotta have it” pull. You can choose one small thing to give today.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "The tight fist",
          text: "Make a tight fist, or picture one. Hold it for a few seconds. It gets tiring. A closed fist cannot pick anything up. It cannot take a gift either.\n\nNow open the hand. Feel how it rests.\n\nThe “gotta have it” pull is like the fist. It grips, and it wears you out. Giving is the hand opening."
        },
        {
          type: "idea",
          text: "Giving loosens the “gotta have it” pull. Even a small gift opens the hand a little. It does not need to cost money."
        },
        {
          type: "example",
          label: "An old story",
          title: "Share what you get",
          text: "An old poem lists the best things in a life. Nearly all of them are things you do, not luck. Giving is one of them.\n\nAnother time, some monks (men who train full time) were arguing. The Buddha told them how to live together warmly. One way was to share what they got and not keep it all."
        },
        {
          type: "try",
          text: "Choose one small thing to give today. It could be a few minutes of full attention. It could be a kind message, a seat or a snack. It does not need to cost money.\n\nPicture yourself giving it. Notice how it feels as the hand opens.",
          seconds: 40,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You have 2 oranges and a friend has none. You feel a pull to keep both. What does this lesson suggest trying?",
          options: [
            "Keep both, so the pull is satisfied",
            "Give one, and notice the grip loosen",
            "Give both and go hungry, to be good"
          ],
          answer: 1,
          why: "Giving even one small thing opens the hand, and the pull can loosen.",
          again: "A small gift is enough to loosen the “gotta have it” pull, and it does not have to hurt."
        },
        {
          q: "A neighbor has no money to spare this week. Can they still practice giving?",
          options: [
            "Yes, time and attention are gifts too",
            "No, a gift has to cost money",
            "Only if they give something large"
          ],
          answer: 0,
          why: "A gift can be a few minutes, a kind word or a seat, with no money needed.",
          again: "Giving is the hand opening, and even something small that costs nothing counts."
        },
        {
          q: "Someone trains hard to calm the mind, but is unkind to people all day. What would the training plan say?",
          options: [
            "A calm mind is all that counts",
            "They need to stop the calm practice",
            "Living kindly is one of the 3 jobs too"
          ],
          answer: 2,
          why: "The plan has 3 jobs that work together, and living kindly is one of them.",
          again: "The training has 3 jobs, not one: live kindly, steady the mind, see clearly.",
          lookBack: "w4-l1"
        }
      ],
      canNow: "You can now explain how giving loosens the “gotta have it” pull, and choose one small thing to give.",
      deeper: [
        { label: "An old poem on what makes a life go well", href: "suttas.html#khp5" },
        { label: "The arguing monks, and 6 ways to live together warmly", href: "suttas.html#mn48" }
      ]
    },

    /* ---------------------------------------------------------------- w4-l3 */
    {
      id: "w4-l3",
      title: "Five Promises",
      minutes: 4,
      icon: "img/icons/shield.svg",
      objective: "After this lesson you can name the 5 training promises. They are: not to kill, steal, cheat in love, lie, or cloud the mind with alcohol or drugs. You know they are promises to practice, not commandments.",
      steps: [
        {
          type: "story",
          label: "Our example",
          title: "The guardrail",
          text: "A mountain road bends close to a steep drop. At the edge there is a guardrail, a strong fence beside the road. The rail is not a punishment. It lets people travel that road without fear.\n\nFor a very long time, people who follow the Buddha while living at home have made 5 promises. The promises work like that rail. They keep you, and the people near you, away from the drop. They leave you with nothing to hide."
        },
        {
          type: "idea",
          text: "The 5 promises are: not to kill, steal, cheat in love, lie, or cloud the mind with alcohol or drugs. They are promises you choose to practice, not orders from anyone. If you slip, you begin again."
        },
        {
          type: "example",
          label: "The Buddha said",
          title: "Nothing to hide",
          text: "The Buddha once named 4 kinds of happiness for people who live at home. Owning what you earned honestly. Enjoying it. Owing nothing to anyone. And having nothing to hide.\n\nThen he weighed them. The first 3 together are worth far less than having nothing to hide."
        },
        {
          type: "try",
          text: "Here are the 5 again. Not to kill. Not to steal. Not to cheat in love. Not to lie. Not to cloud the mind with alcohol or drugs.\n\nPick the one that feels most doable today. Say, out loud or in your head: “Only for today, I will train in this one.” Notice how it feels to choose it.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You choose the promise not to lie for today. At lunch a small lie slips out. What fits the 5 promises?",
          options: [
            "The promise is spoiled, so drop it",
            "Notice it, and begin again",
            "You have earned a punishment"
          ],
          answer: 1,
          why: "These are promises to practice, so a slip is a place to begin again.",
          again: "The 5 promises are a training you choose, and nobody hands out a punishment for a slip."
        },
        {
          q: "A shop gives you too much change. Nobody would ever know. You hand it back. How has the promise not to steal helped you?",
          options: [
            "It warns you that someone is watching",
            "It teaches that money is bad",
            "It lets you go home with no secret"
          ],
          answer: 2,
          why: "Handing it back keeps you free of anything to hide, and that happiness outweighs owning more.",
          again: "A promise like this protects your own peace of mind, whether or not anyone is looking."
        },
        {
          q: "You are holding tight to your free afternoon. A neighbor asks for 10 minutes of help. What might giving those minutes do?",
          options: [
            "Loosen the tight grip a little",
            "Show that you are better than other people",
            "Make the neighbor owe you a favor"
          ],
          answer: 0,
          why: "Giving something small, like 10 minutes, is the hand opening.",
          again: "Giving something small loosens the “gotta have it” pull, the way a tight fist opens.",
          lookBack: "w4-l2"
        }
      ],
      canNow: "You can now name the 5 training promises and say why they are promises, not orders.",
      deeper: [
        { label: "4 kinds of happiness, and the one that outweighs the rest", href: "suttas.html#an4.62" },
        { label: "Harmful and helpful acts, and the roots they grow from", href: "suttas.html#mn9" },
        { label: "Staying honest when life is messy: a Modern Life topic", href: "themes.html#ethics" }
      ]
    },

    /* ---------------------------------------------------------------- w4-l4 */
    {
      id: "w4-l4",
      title: "The Mirror Check",
      minutes: 4,
      icon: "img/icons/mirror.svg",
      objective: "After this lesson you can check any action at 3 moments: before, during and after. You ask, “Does this harm me or anyone else?”",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "What is a mirror for?",
          text: "The Buddha had a son named Rahula. Rahula came to train with his father while he was still a child.\n\nWhen the boy was 7, the Buddha asked him what a mirror is for. Rahula said it is for looking.\n\nThe Buddha told him to look at his actions in the same way. Look before you act. Look while you act. Look again once you have acted. Each time, ask if it harms you or anyone else."
        },
        {
          type: "idea",
          text: "Check what you do at 3 moments: before, during and after. Each time, ask one question: “Does this harm me or anyone else?” If it does, stop or do it another way."
        },
        {
          type: "example",
          label: "Our example",
          title: "Loud music at night",
          text: "You are about to play loud music at night. Before: could this harm anyone? The neighbors are asleep, so you turn it down.\n\nDuring: the sound gets louder again, and you lower it.\n\nAfter: next day you learn it woke someone. The old talk has a plain answer. Say what you did, learn from it, and take more care next time. There is no need to punish yourself."
        },
        {
          type: "try",
          text: "Think of the next thing you will do after this lesson. Hold up the mirror for a few seconds. Ask, out loud or in your head: “Will this harm me? Will it harm anyone else?” One look is enough. Notice what the mirror shows.",
          seconds: 30,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "You are halfway through a joke and see that it is hurting someone. What does the mirror check suggest?",
          options: [
            "Stop now, because you can check halfway too",
            "Finish it, since you have already started",
            "Think it over tomorrow instead"
          ],
          answer: 0,
          why: "The mirror check looks during an action too, so you can stop halfway.",
          again: "The mirror check looks before, during and after, and asks each time if this harms anyone."
        },
        {
          q: "Last night you took a housemate’s food without asking. Today you see it upset them. What does the mirror check suggest next?",
          options: [
            "Forget it, because it is over now",
            "Tell them it was you, and ask next time",
            "Feel bad about yourself for the whole week"
          ],
          answer: 1,
          why: "Once an action is done, the mirror check asks you to be honest about any harm and do better.",
          again: "The mirror check also looks back once an action is done, and it asks for honesty, never self-punishment."
        },
        {
          q: "A friend keeps the 5 promises. Someone asks her, “Who makes you keep them?” What is a fair answer for her to give?",
          options: [
            "A rule book that punishes every slip",
            "The Buddha, who gives the orders",
            "Nobody, I choose them as my training"
          ],
          answer: 2,
          why: "The 5 promises are chosen and practiced, and nobody gives them as orders.",
          again: "The 5 promises are a training a person chooses, and a slip means beginning again.",
          lookBack: "w4-l3"
        }
      ],
      canNow: "You can now check an action before, during and after by asking if it harms you or anyone else.",
      deeper: [
        { label: "The Buddha teaches his young son with a mirror", href: "suttas.html#mn61" },
        { label: "The mirror check in daily life: a Modern Life topic", href: "themes.html#ethics" }
      ]
    },

    /* ---------------------------------------------------------------- w4-l5 */
    {
      id: "w4-l5",
      title: "Four Gates for Words",
      minutes: 5,
      icon: "img/icons/speech-bubble.svg",
      objective: "After this lesson you can check your words at 4 gates before speaking: Is it true? Is it helpful? Is it said with care? Is this the right time?",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "The prince and the baby",
          text: "A prince tried to trap the Buddha with a question. “Would you ever say something people do not want to hear?”\n\nThe prince’s baby was there with them. The Buddha asked what the prince would do if the baby put a stick in its mouth. The prince said he would pull it out, even if it hurt the baby.\n\nThe Buddha said his words work the same way. He says hard things too, but only when they are true, helpful and well timed.\n\nAnother short talk adds one more test: say it gently."
        },
        {
          type: "idea",
          text: "Before you speak, take your words through 4 gates: true, helpful, said with care, and the right time. “Said with care” does not mean “pleasant to hear”. A hard thing can pass all 4 gates."
        },
        {
          type: "example",
          label: "Our example",
          title: "The friend who comes late",
          text: "A friend keeps coming late, and it spoils your plans. You want to tell them.\n\nIs it true? Yes. Is it helpful? Yes, they can change it. Is it said with care? You choose gentle words. Is this the right time? Not while you are upset, so you wait.\n\nIt is still hard to hear. It passes all 4 gates."
        },
        {
          type: "try",
          text: "Think of something you need to say or send today. Take it through the 4 gates.\n\n1. Is it true?\n\n2. Is it helpful?\n\n3. Is it said with care?\n\n4. Is this the right time?\n\nIf a gate is shut, change the words or wait. Notice which gate was hardest to pass.",
          seconds: 45,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "A friend asks you to check a letter before they send it. You see a big mistake. What do the 4 gates suggest?",
          options: [
            "Say it looks perfect, to be pleasant",
            "Mention it later, after it is sent",
            "Point it out gently now, before it is sent"
          ],
          answer: 2,
          why: "It is true, helpful, gentle and well timed, so this hard thing passes all 4 gates.",
          again: "A hard, true, helpful thing passes the gates when it is said gently and at the right time."
        },
        {
          q: "You know a true and embarrassing thing about a neighbor’s past. Telling others would help no one. What do the 4 gates suggest?",
          options: [
            "Leave it unsaid, because one gate is shut",
            "Share it, because true things are always fine to say",
            "Share it, but in a soft, friendly voice"
          ],
          answer: 0,
          why: "It is true, but it helps no one, so it does not pass the gates.",
          again: "Words pass only when all 4 gates are open: true, helpful, said with care, and the right time."
        },
        {
          q: "You are about to leave your trash on a park bench. What question does the mirror check ask first?",
          options: [
            "Will anyone see me do it?",
            "Does this harm me or anyone else?",
            "Is there a rule against it?"
          ],
          answer: 1,
          why: "The mirror check asks about harm, before, during and after you act.",
          again: "The mirror check is about what an action does to you and to others, not about being seen.",
          lookBack: "w4-l4"
        }
      ],
      canNow: "You can now take your words through 4 gates: true, helpful, said with care, and the right time.",
      deeper: [
        { label: "The prince, the baby and the hard truth", href: "suttas.html#mn58" },
        { label: "5 marks of words well spoken", href: "suttas.html#an5.198" },
        { label: "Hard talks and how to have them: a Modern Life topic", href: "themes.html#conflict" }
      ]
    },

    /* ---------------------------------------------------------------- w4-l6 */
    {
      id: "w4-l6",
      title: "Honest Work",
      minutes: 4,
      icon: "img/icons/hammer.svg",
      objective: "After this lesson you can ask one question about how you earn and spend: does this harm anyone?",
      steps: [
        {
          type: "story",
          label: "An old story",
          title: "A teaching for people at home",
          text: "A man who lived an ordinary home life came to the Buddha. He said that people like him live at home and handle money. He asked for a teaching that fits such a life.\n\nThe Buddha gave him one. Work with skill and care. Look after what you earn. Keep good friends.\n\nIn another short talk, the Buddha named a few kinds of work to stay out of. Selling weapons was one. Selling poison was another. The money in them comes from harm."
        },
        {
          type: "idea",
          text: "Ask one question about how you earn and how you spend: “Does this harm anyone?” Work that harms no one is honest ground to stand on. Few jobs are free of all harm, so use the question to guide you, not to judge yourself."
        },
        {
          type: "example",
          label: "Our example",
          title: "The fruit seller",
          text: "Ana sells fruit at a market. She could hide old fruit under the fresh and earn more. She asks, “Does this harm anyone?” It would cheat her buyers.\n\nSo she sells the old fruit cheaply and says what it is. She earns a little less that day. At night she has nothing to hide."
        },
        {
          type: "try",
          text: "Name one thing about how you earn, spend or help out that harms no one. That is honest ground. If you have no paid work right now, pick something you do for others.\n\nHold it in mind for a few seconds. Notice how it feels to stand on that ground.",
          seconds: 40,
          quietText: ""
        }
      ],
      quiz: [
        {
          q: "A friend is offered well-paid work. The job is to trick people into buying things they do not need. Which question helps most?",
          options: [
            "Does it pay more than the last job?",
            "Does this work harm anyone?",
            "Will other people be impressed?"
          ],
          answer: 1,
          why: "Honest work is tested by one question: does it harm anyone?",
          again: "This lesson asks what the work does to the people it touches."
        },
        {
          q: "A bike is for sale very cheaply. You are fairly sure it was stolen. What does this lesson’s question point to?",
          options: [
            "It is fine, because you did not steal it",
            "Only the price matters when you spend",
            "Buying it would pay for harm to someone"
          ],
          answer: 2,
          why: "The question covers spending too, and this money would reward harm done to the owner.",
          again: "The same question fits spending as well as earning: does this harm anyone?"
        },
        {
          q: "You are angry and want to tell a friend a true thing right now, in front of others. What would the 4 gates suggest?",
          options: [
            "Wait, then say it gently in private",
            "Say it now, because it is true",
            "Never say it, because it is hard to hear"
          ],
          answer: 0,
          why: "True is only one gate, and care and the right time are gates too.",
          again: "Words go through 4 gates: true, helpful, said with care, and the right time.",
          lookBack: "w4-l5"
        }
      ],
      canNow: "You can now ask one question about how you earn and spend: does this harm anyone?",
      deeper: [
        { label: "A teaching for people who live at home and handle money", href: "suttas.html#an8.54" },
        { label: "5 kinds of work the Buddha said to stay out of", href: "suttas.html#an5.177" },
        { label: "Money and feeling safe: a Modern Life topic", href: "themes.html#money" }
      ]
    }
  ],

  /* ------------------------------------------------------------ world check */
  boss: {
    title: "The Good Ground Check",
    intro: "Here are 5 short questions about living well. There is no score. If an answer is not quite right, you see the idea again and pick once more.",
    questions: [
      {
        q: "A friend has learned why the mind adds hurt. They ask, “So what is the treatment?” What would you say?",
        options: [
          "Knowing the cause well is the whole treatment",
          "One big effort, made once, and then it is done",
          "A training with 3 jobs, done a little at a time"
        ],
        answer: 2,
        why: "The treatment is a training with 3 jobs: live kindly, steady the mind, see clearly.",
        again: "The treatment is a training plan, practiced bit by bit, and knowing the cause is only its start.",
        lesson: "w4-l1"
      },
      {
        q: "You have some bread and want to keep it all. You give half to a neighbor. What may happen to the “gotta have it” pull?",
        options: [
          "It grows stronger, because you have less",
          "It loosens a little, like a fist opening",
          "Nothing, unless the gift cost a lot"
        ],
        answer: 1,
        why: "Giving, even something small, opens the hand and loosens the pull.",
        again: "Giving is the hand opening, and even a small gift can ease the tight grip.",
        lesson: "w4-l2"
      },
      {
        q: "A friend wants to try one of the 5 promises for one day only. Is that a real way to train?",
        options: [
          "Yes, one promise for one day is real practice",
          "No, it only counts if all 5 are kept forever",
          "No, a teacher has to order it first"
        ],
        answer: 0,
        why: "The 5 promises are chosen and practiced, so one day with one promise is a true start.",
        again: "The 5 promises are a training a person chooses and practices, not orders and not a test.",
        lesson: "w4-l3"
      },
      {
        q: "You are about to borrow a housemate’s coat without asking. What does the mirror check suggest?",
        options: [
          "Take it, and see later whether they mind",
          "Take it, because a coat is a small thing",
          "First ask yourself: could this harm anyone?"
        ],
        answer: 2,
        why: "The mirror check looks before, during and after, so the first look comes before you act.",
        again: "The mirror check asks about harm at 3 moments, and the first one is before you act.",
        lesson: "w4-l4"
      },
      {
        q: "A friend keeps interrupting people and is losing friends because of it. The friend asks you for honest advice. What do the 4 gates suggest?",
        options: [
          "Say all is well, because the truth would sting",
          "Tell them gently, in private, at a calm moment",
          "Tell them at once, in front of everyone"
        ],
        answer: 1,
        why: "It is true, helpful, said with care and well timed, so this hard thing passes all 4 gates.",
        again: "A hard thing can pass the gates when it is true, helpful, gentle and well timed.",
        lesson: "w4-l5"
      }
    ]
  }
});
