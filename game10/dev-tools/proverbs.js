// ==============================================
// Owned by Game 10
// ==============================================

// sv = the proverb, en = word-for-word English, meaning = explanation per language
export const PROVERBS = [
  {
    sv: "Borta bra men hemma bäst",
    en: "Away is good, but home is best",
    meaning: {
      en: "Travelling is nice, but nothing beats coming home.",
      sv: "Det är roligt att resa, men inget slår att komma hem."
    }
  },
  {
    sv: "Det är ingen ko på isen",
    en: "There is no cow on the ice",
    meaning: {
      en: "Don't worry, there is no danger or hurry.",
      sv: "Ingen fara, det finns ingen anledning att oroa sig."
    }
  },
  {
    sv: "Den som väntar på något gott väntar aldrig för länge",
    en: "Whoever waits for something good never waits too long",
    meaning: {
      en: "Good things are worth being patient for.",
      sv: "Det lönar sig att ha tålamod när något bra väntar."
    }
  },
  {
    sv: "Sälj inte skinnet förrän björnen är skjuten",
    en: "Don't sell the skin before the bear is shot",
    meaning: {
      en: "Don't count on something before it has actually happened.",
      sv: "Räkna inte med något innan det verkligen har hänt."
    }
  },
  {
    sv: "Lagom är bäst",
    en: "Just enough is best",
    meaning: {
      en: "Not too much, not too little. Moderation is key.",
      sv: "Inte för mycket och inte för lite. Måttlighet är bäst."
    }
  },
  {
    sv: "Även solen har sina fläckar",
    en: "Even the sun has its spots",
    meaning: {
      en: "Nobody is perfect, not even the best of us.",
      sv: "Ingen är perfekt, inte ens den bästa."
    }
  },
  {
    sv: "Liten tuva stjälper ofta stort lass",
    en: "A small tuft often tips over a big load",
    meaning: {
      en: "Small things can cause big problems.",
      sv: "Små saker kan ställa till med stora problem."
    }
  },
  {
    sv: "Ju fler kockar, desto sämre soppa",
    en: "The more cooks, the worse the soup",
    meaning: {
      en: "When too many people are in charge, the result gets worse.",
      sv: "När för många bestämmer blir resultatet sämre."
    }
  },
  {
    sv: "Smaken är som baken, delad",
    en: "Taste is like the bottom, split in two",
    meaning: {
      en: "Everyone has their own taste, and that is fine.",
      sv: "Alla tycker olika, och det är helt okej."
    }
  },
  {
    sv: "Bättre en fågel i handen än tio i skogen",
    en: "Better one bird in the hand than ten in the forest",
    meaning: {
      en: "What you already have is worth more than what you might get.",
      sv: "Det du redan har är värt mer än det du kanske får."
    }
  },
  {
    sv: "Tala är silver, tiga är guld",
    en: "Speaking is silver, silence is gold",
    meaning: {
      en: "Sometimes it is wiser to say nothing.",
      sv: "Ibland är det klokast att inte säga något."
    }
  },
  {
    sv: "Gammal kärlek rostar aldrig",
    en: "Old love never rusts",
    meaning: {
      en: "Feelings for someone you once loved never fully go away.",
      sv: "Känslor för någon man en gång älskat försvinner aldrig helt."
    }
  },
  {
    sv: "Gå inte över ån efter vatten",
    en: "Don't cross the river to fetch water",
    meaning: {
      en: "Don't make things harder than they are. Use what is close by.",
      sv: "Krångla inte till det. Använd det som finns nära."
    }
  },
  {
    sv: "Den som sitter i glashus ska inte kasta sten",
    en: "Whoever sits in a glass house shouldn't throw stones",
    meaning: {
      en: "Don't criticise others for faults you have yourself.",
      sv: "Kritisera inte andra för fel som du själv har."
    }
  },
  {
    sv: "Det finns inget dåligt väder, bara dåliga kläder",
    en: "There is no bad weather, only bad clothes",
    meaning: {
      en: "Dress for the weather and you can enjoy being outside.",
      sv: "Klär du dig rätt kan du vara ute i alla väder."
    }
  },
  {
    sv: "Alla goda ting är tre",
    en: "All good things are three",
    meaning: {
      en: "Third time lucky. Try again!",
      sv: "Tredje gången gillt. Försök igen!"
    }
  },
  {
    sv: "Man får ta det sura med det söta",
    en: "You have to take the sour with the sweet",
    meaning: {
      en: "Life has good and bad parts, and you have to accept both.",
      sv: "Livet har både bra och dåliga sidor, och man får ta båda."
    }
  },
  {
    sv: "Kärt barn har många namn",
    en: "A dear child has many names",
    meaning: {
      en: "Things we love often get lots of nicknames.",
      sv: "Det vi tycker om får ofta många smeknamn."
    }
  },
  {
    sv: "Morgonstund har guld i mun",
    en: "The morning hour has gold in its mouth",
    meaning: {
      en: "Getting up early pays off.",
      sv: "Det lönar sig att gå upp tidigt."
    }
  },
  {
    sv: "Den som gräver en grop åt andra faller själv däri",
    en: "Whoever digs a pit for others falls into it himself",
    meaning: {
      en: "Trying to harm others often comes back to hurt you.",
      sv: "Den som försöker skada andra drabbas ofta själv."
    }
  }
];

// Same proverb all day, a new one when the date changes
export function proverbOfTheDay(date = new Date()) {
  const day = Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
  return PROVERBS[day % PROVERBS.length];
}
