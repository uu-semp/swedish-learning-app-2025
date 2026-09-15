import { useState } from 'react';
import summerImg from './assets/seasons/summer.jpg';
import fallImg from './assets/seasons/fall.jpg';

// ── Shared site save API (see /scripts/SAVE.MD) ─────────────────────────────────
// Loaded as a plain script by index.html; may not be present yet (or at all, e.g. when
// this game is opened standalone during development), so every call is optional-chained.
declare global {
  interface Window {
    save?: {
      get: (game: string, key?: string | null) => any;
      set: (game: string, keyOrData: string | Record<string, unknown>, value?: unknown) => boolean;
      stats: {
        get: (game: string) => { wins: number; completion: number };
        set: (game: string, wins: number, completion: number) => boolean;
        incrementWin: (game: string) => boolean;
        setCompletion: (game: string, completion: number) => boolean;
      };
    };
  }
}
const GAME_ID = 'game04';

// ── Types ──────────────────────────────────────────────────────────────────────
type Season = 'vinter' | 'vår' | 'sommar' | 'höst';
type Screen = 'home' | 'practice' | 'game' | 'year-complete';
type AnswerState = 'idle' | 'correct' | 'wrong';
type CategoryKey = 'veckodagar' | 'manader' | 'arstider' | 'vader';

interface Question {
  type: string;
  instruction: string;
  monthIndex: number;
  options?: string[];
  answer?: string;
  sentence?: string;
  correctDays?: string[];
  shuffled?: string[];
  correct?: string[];
  season?: Season;
  imagelabel?: string;
  weatherIcon?: string;
  weatherLabel?: string;
  targetDate?: number;
  targetMonthIndex?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const WEEKDAYS = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];
const MONTHS_FULL = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
const MONTH_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];
const SEASON_OF_MONTH: Season[] = ['vinter', 'vinter', 'vår', 'vår', 'vår', 'sommar', 'sommar', 'sommar', 'höst', 'höst', 'höst', 'vinter'];

const COLORS: Record<Season, { primary: string; light: string; textDark: string; border: string; placeholder: string; dark: string }> = {
  vinter: { primary: '#3A7EC6', light: '#EBF3FB', textDark: '#1A3A5C', border: '#B0CDE8', placeholder: '#C2D9EE', dark: '#2B5E96' },
  vår:    { primary: '#3D9E63', light: '#EBF7F0', textDark: '#184028', border: '#98D4B0', placeholder: '#B8E4CA', dark: '#2D7849' },
  sommar: { primary: '#C98C08', light: '#FEF7E8', textDark: '#503800', border: '#F0D090', placeholder: '#F5E0A0', dark: '#A87008' },
  höst:   { primary: '#C85020', light: '#FBF0EB', textDark: '#4A1808', border: '#EAA080', placeholder: '#F0C0A0', dark: '#9C3E18' },
};

const SEASON_ICON: Record<Season, string> = { vinter: '❄', vår: '🌿', sommar: '☀', höst: '🍂' };
const WEATHER_EMOJI: Record<string, string> = { snow: '❄️', rain: '🌧️', sun: '☀️', wind: '💨', cloud: '☁️', thunder: '⛈️' };

const TRANSLATIONS: Record<string, string> = {
  // Weekdays
  måndag: 'Monday', tisdag: 'Tuesday', onsdag: 'Wednesday',
  torsdag: 'Thursday', fredag: 'Friday', lördag: 'Saturday', söndag: 'Sunday',
  måndagar: 'Mondays', tisdagar: 'Tuesdays', onsdagar: 'Wednesdays',
  torsdagar: 'Thursdays', fredagar: 'Fridays', lördagar: 'Saturdays', söndagar: 'Sundays',
  // Months
  januari: 'January', februari: 'February', mars: 'March', april: 'April',
  maj: 'May', juni: 'June', juli: 'July', augusti: 'August',
  september: 'September', oktober: 'October', november: 'November', december: 'December',
  // Seasons
  vår: 'spring', sommar: 'summer', höst: 'autumn', vinter: 'winter',
  // Calendar vocabulary
  dag: 'day', vecka: 'week', månad: 'month', årstid: 'season', datum: 'date',
  // Instruction words
  före: 'before', efter: 'after',
  // Weather
  regnar: 'is raining', snöar: 'is snowing', blåser: 'is blowing / windy',
  soligt: 'sunny', molnigt: 'cloudy', mulet: 'overcast', varmt: 'warm', kallt: 'cold',
};

const SEASON_PLACEHOLDER_TEXT: Record<Season, string> = {
  vinter: 'Framtida foto: Uppsala på vintern',
  vår:    'Framtida foto: Uppsala på våren',
  sommar: 'Framtida foto: Uppsala på sommaren',
  höst:   'Framtida foto: Uppsala på hösten',
};

const SEASON_IMAGES: Partial<Record<Season, string>> = {
  sommar: summerImg,
  höst: fallImg,
};
// ── Question Bank ──────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  // January – vinter
  { type: 'season-mc',      monthIndex: 0,  instruction: 'Vilken årstid?',                          season: 'vinter', imagelabel: SEASON_PLACEHOLDER_TEXT.vinter,    options: ['vår','sommar','höst','vinter'],                                              answer: 'vinter'             },
  { type: 'weekday-mc',     monthIndex: 0,  instruction: 'Vilken dag kommer efter onsdag?',          options: ['tisdag','torsdag','fredag'],                                                     answer: 'torsdag'            },
  { type: 'weather-mc',     monthIndex: 0,  instruction: 'Vad är det för väder?',                    weatherIcon: 'snow',    weatherLabel: 'Framtida foto: snö i Uppsala',         options: ['Det snöar.','Det regnar.','Det är varmt.','Det blåser.'],             answer: 'Det snöar.'         },
  // February – vinter
  { type: 'weekday-click',  monthIndex: 1,  instruction: 'Klicka på rätt dagar.',                   sentence: 'Jag studerar svenska på tisdagar och torsdagar.',                                correctDays: ['tisdag','torsdag']                                               },
  { type: 'month-mc',       monthIndex: 1,  instruction: 'Vilken månad kommer efter januari?',       options: ['mars','december','februari','april'],                                            answer: 'februari'           },
  { type: 'weather-mc',     monthIndex: 1,  instruction: 'Hur är vädret i dag?',                     weatherIcon: 'cloud',   weatherLabel: 'Framtida foto: mulet i Uppsala',       options: ['Det är soligt.','Det är mulet.','Det snöar.','Solen skiner.'],         answer: 'Det är mulet.'      },
  // March – vår
  { type: 'weekday-order',  monthIndex: 2,  instruction: 'Placera dagarna i rätt ordning.',          shuffled: ['fredag','måndag','onsdag','tisdag','lördag','torsdag','söndag'],                correct: WEEKDAYS                                                               },
  { type: 'month-order',    monthIndex: 2,  instruction: 'Placera månaderna i rätt ordning.',        shuffled: ['mars','januari','april','februari'],                                            correct: ['januari','februari','mars','april']                                   },
  { type: 'season-mc',      monthIndex: 2,  instruction: 'Vilken årstid?',                          season: 'vår',    imagelabel: SEASON_PLACEHOLDER_TEXT.vår,        options: ['vår','sommar','höst','vinter'],                                              answer: 'vår'                },
  // April – vår
  { type: 'weekday-mc',     monthIndex: 3,  instruction: 'Vilken dag kommer före lördag?',           options: ['fredag','söndag','torsdag'],                                                     answer: 'fredag'             },
  { type: 'date-calendar',  monthIndex: 3,  instruction: 'Klicka på den sextonde april.',            targetDate: 16, targetMonthIndex: 3                                                                                                                              },
  { type: 'month-mc',       monthIndex: 3,  instruction: 'Vilken månad kommer efter april?',         options: ['mars','maj','juni','augusti'],                                                   answer: 'maj'                },
  // May – vår
  { type: 'weekday-click',  monthIndex: 4,  instruction: 'Klicka på rätt dagar.',                   sentence: 'Jag arbetar på måndag och fredag.',                                             correctDays: ['måndag','fredag']                                                },
  { type: 'month-order',    monthIndex: 4,  instruction: 'Placera månaderna i rätt ordning.',        shuffled: ['maj','februari','april','mars'],                                                correct: ['februari','mars','april','maj']                                       },
  { type: 'weather-mc',     monthIndex: 4,  instruction: 'Vad är det för väder?',                    weatherIcon: 'rain',    weatherLabel: 'Framtida foto: regn i Uppsala',         options: ['Det regnar.','Det snöar.','Det är soligt.','Det blåser.'],            answer: 'Det regnar.'        },
  // June – sommar
  { type: 'season-mc',      monthIndex: 5,  instruction: 'Vilken årstid?',                          season: 'sommar', imagelabel: SEASON_PLACEHOLDER_TEXT.sommar,   options: ['vår','sommar','höst','vinter'],                                              answer: 'sommar'             },
  { type: 'weather-mc',     monthIndex: 5,  instruction: 'Hur är vädret i dag?',                     weatherIcon: 'sun',     weatherLabel: 'Framtida foto: soligt i Uppsala',       options: ['Det är soligt.','Det är mulet.','Det regnar.','Det blåser.'],         answer: 'Det är soligt.'     },
  { type: 'grammar-mc',     monthIndex: 5,  instruction: 'Vilken mening är rätt?',                   options: ['Det regnar.','Det är regnar.'],                                                  answer: 'Det regnar.'        },
  // July – sommar
  { type: 'weekday-mc',     monthIndex: 6,  instruction: 'Vilken dag kommer efter fredag?',          options: ['torsdag','måndag','lördag'],                                                     answer: 'lördag'             },
  { type: 'date-calendar',  monthIndex: 6,  instruction: 'Klicka på den tjugofemte juli.',           targetDate: 25, targetMonthIndex: 6                                                                                                                              },
  { type: 'weather-mc',     monthIndex: 6,  instruction: 'Vad är det för väder?',                    weatherIcon: 'thunder', weatherLabel: 'Framtida foto: åskväder i Uppsala',    options: ['Det åskar och det blixtrar.','Det blåser.','Det är soligt.','Det snöar.'], answer: 'Det åskar och det blixtrar.' },
  // August – sommar
  { type: 'weekday-order',  monthIndex: 7,  instruction: 'Placera dagarna i rätt ordning.',          shuffled: ['söndag','tisdag','fredag','måndag','torsdag','onsdag','lördag'],                correct: WEEKDAYS                                                               },
  { type: 'month-mc',       monthIndex: 7,  instruction: 'Vilken månad kommer före september?',      options: ['oktober','juli','augusti'],                                                      answer: 'augusti'            },
  { type: 'grammar-mc',     monthIndex: 7,  instruction: 'Vilken mening är rätt?',                   options: ['Det är soligt.','Det soligt.'],                                                  answer: 'Det är soligt.'     },
  // September – höst
  { type: 'season-mc',      monthIndex: 8,  instruction: 'Vilken årstid?',                          season: 'höst',   imagelabel: SEASON_PLACEHOLDER_TEXT.höst,      options: ['vår','sommar','höst','vinter'],                                              answer: 'höst'               },
  { type: 'weather-mc',     monthIndex: 8,  instruction: 'Hur är vädret i dag?',                     weatherIcon: 'wind',    weatherLabel: 'Framtida foto: blåsigt i Uppsala',     options: ['Det blåser.','Det snöar.','Det är soligt.','Solen skiner.'],          answer: 'Det blåser.'        },
  { type: 'month-mc',       monthIndex: 8,  instruction: 'Vilken månad kommer efter september?',     options: ['november','oktober','december'],                                                 answer: 'oktober'            },
  // October – höst
  { type: 'weekday-click',  monthIndex: 9,  instruction: 'Klicka på rätt dagar.',                   sentence: 'Jag har lektion på onsdag och lördag.',                                        correctDays: ['onsdag','lördag']                                                },
  { type: 'date-calendar',  monthIndex: 9,  instruction: 'Klicka på den andra oktober.',             targetDate: 2, targetMonthIndex: 9                                                                                                                               },
  { type: 'grammar-mc',     monthIndex: 9,  instruction: 'Vilken mening är rätt?',                   options: ['Det blåser.','Det är blåser.'],                                                  answer: 'Det blåser.'        },
  // November – höst
  { type: 'weekday-mc',     monthIndex: 10, instruction: 'Vilken dag kommer före onsdag?',           options: ['tisdag','torsdag','måndag'],                                                     answer: 'tisdag'             },
  { type: 'month-order',    monthIndex: 10, instruction: 'Placera månaderna i rätt ordning.',        shuffled: ['november','september','december','oktober'],                                    correct: ['september','oktober','november','december']                           },
  { type: 'weather-mc',     monthIndex: 10, instruction: 'Hur är vädret i dag?',                     weatherIcon: 'cloud',   weatherLabel: 'Framtida foto: molnigt i Uppsala',    options: ['Det är molnigt.','Det är soligt.','Det snöar.','Det regnar.'],        answer: 'Det är molnigt.'   },
  // December – vinter
  { type: 'season-mc',      monthIndex: 11, instruction: 'Vilken årstid?',                          season: 'vinter', imagelabel: 'Framtida foto: Uppsala i december',               options: ['vår','sommar','höst','vinter'],                                              answer: 'vinter'             },
  { type: 'grammar-mc',     monthIndex: 11, instruction: 'Vilken mening är rätt?',                   options: ['Det är kallt.','Det kallt.'],                                                    answer: 'Det är kallt.'      },
  { type: 'weekday-mc',     monthIndex: 11, instruction: 'Vilken dag kommer efter söndag?',          options: ['lördag','måndag','fredag'],                                                      answer: 'måndag'             },
];

// ── Practice data ─────────────────────────────────────────────────────────────

interface CategoryMeta {
  label: string;
  icon: string;
  season: Season;
  desc: string;
}

const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  veckodagar: { label: 'Veckodagar',      icon: '📅', season: 'vinter', desc: 'Måndag – söndag'           },
  manader:    { label: 'Månader & datum', icon: '🗓️', season: 'vår',    desc: 'Januari – december'        },
  arstider:   { label: 'Årstider',        icon: '🌿', season: 'sommar', desc: 'Vår, sommar, höst, vinter' },
  vader:      { label: 'Väder',           icon: '🌦️', season: 'höst',   desc: 'Det regnar. Det snöar...'  },
};

const PRACTICE_QUESTIONS: Record<CategoryKey, Question[]> = {
  veckodagar: [
    { type: 'weekday-mc',    monthIndex: 0, instruction: 'Vilken dag kommer efter onsdag?',                        options: ['tisdag','torsdag','fredag'],                                                        answer: 'torsdag'                     },
    { type: 'weekday-mc',    monthIndex: 0, instruction: 'Vilken dag kommer före lördag?',                         options: ['fredag','söndag','torsdag'],                                                        answer: 'fredag'                      },
    { type: 'weekday-mc',    monthIndex: 0, instruction: 'Vilken dag kommer efter måndag?',                        options: ['söndag','tisdag','onsdag'],                                                         answer: 'tisdag'                      },
    { type: 'weekday-click', monthIndex: 0, instruction: 'Klicka på rätt dagar.',  sentence: 'Jag går på nation på fredagar.',                                                          correctDays: ['fredag']                                                                                },
    { type: 'weekday-order', monthIndex: 0, instruction: 'Placera dagarna i rätt ordning.',                        shuffled: ['fredag','tisdag','söndag','måndag','torsdag','onsdag','lördag'],                  correct: WEEKDAYS                     },
  ],
  manader: [
    { type: 'month-mc',      monthIndex: 2, instruction: 'Vilken månad kommer efter april?',                       options: ['mars','maj','juni','augusti'],                                                      answer: 'maj'                         },
    { type: 'month-mc',      monthIndex: 2, instruction: 'Vilken månad kommer före september?',                    options: ['oktober','juli','augusti'],                                                         answer: 'augusti'                     },
    { type: 'month-order',   monthIndex: 2, instruction: 'Placera månaderna i rätt ordning.',                      shuffled: ['mars','januari','april','februari'],                                               correct: ['januari','februari','mars','april'] },
    { type: 'date-calendar', monthIndex: 2, instruction: 'Klicka på den tjugofemte maj.',                          targetDate: 25, targetMonthIndex: 4                                                                                                  },
    { type: 'grammar-mc',    monthIndex: 2, instruction: 'Hur säger man datumet?\n"16 april"',                     options: ['den sextonde april','den sexton april','sextonde i april'],                         answer: 'den sextonde april'          },
  ],
  arstider: [
    { type: 'grammar-mc',    monthIndex: 5, instruction: 'I Sverige är det ______ i januari.',                     options: ['vår','sommar','höst','vinter'],                                                     answer: 'vinter'                      },
    { type: 'season-mc',     monthIndex: 5, instruction: 'Vilken årstid?',  season: 'sommar', imagelabel: SEASON_PLACEHOLDER_TEXT.sommar, options: ['vår','sommar','höst','vinter'],    answer: 'sommar'                      },
    { type: 'season-mc',     monthIndex: 5, instruction: 'Vilken årstid?',  season: 'vår',    imagelabel: SEASON_PLACEHOLDER_TEXT.vår,    options: ['vår','sommar','höst','vinter'],    answer: 'vår'                         },
    { type: 'grammar-mc',    monthIndex: 5, instruction: 'Det är kallt och det snöar.\nVilken årstid passar bäst?', options: ['vår','sommar','höst','vinter'],                                                   answer: 'vinter'                      },
    { type: 'grammar-mc',    monthIndex: 5, instruction: 'Det är varmt och soligt.\nVilken årstid passar bäst?',    options: ['vår','sommar','höst','vinter'],                                                   answer: 'sommar'                      },
  ],
  vader: [
    { type: 'weather-mc',    monthIndex: 9, instruction: 'Vad är det för väder?',  weatherIcon: 'snow',   weatherLabel: 'Framtida foto: snö i Uppsala',     options: ['Det snöar.','Det regnar.','Det är varmt.','Det blåser.'],       answer: 'Det snöar.'      },
    { type: 'weather-mc',    monthIndex: 9, instruction: 'Vad är det för väder?',  weatherIcon: 'sun',    weatherLabel: 'Framtida foto: soligt väder',       options: ['Det är soligt.','Det är mulet.','Det regnar.','Solen skiner.'], answer: 'Det är soligt.'  },
    { type: 'weather-mc',    monthIndex: 9, instruction: 'Vad är det för väder?',  weatherIcon: 'wind',   weatherLabel: 'Framtida foto: blåsigt väder',      options: ['Det blåser.','Det snöar.','Det är varmt.','Det är soligt.'],   answer: 'Det blåser.'     },
    { type: 'grammar-mc',    monthIndex: 9, instruction: 'Vilken mening är rätt?', options: ['Det regnar.','Det är regnar.'],                                                           answer: 'Det regnar.'     },
    { type: 'grammar-mc',    monthIndex: 9, instruction: 'Vilken mening är rätt?', options: ['Det är soligt.','Det soligt.'],                                                           answer: 'Det är soligt.'  },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getMonthCalendar(monthIndex: number) {
  const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
  const firstDay = new Date(2025, monthIndex, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // Mon = 0
  return { daysInMonth, startOffset };
}

// ── Vocabulary tooltip components ─────────────────────────────────────────────

function VocabTooltip({ text }: { text: string }) {
  return (
    <span
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap z-50 pointer-events-none select-none"
      style={{ backgroundColor: '#1C1916', color: '#F5F3F0', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
    >
      {text}
      <span
        className="absolute top-full left-1/2 -translate-x-1/2 block w-0 h-0"
        style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1C1916' }}
      />
    </span>
  );
}

function SwedishWord({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const clean = text.toLowerCase().replace(/[.,?!;:""]/g, '');
  const translation = TRANSLATIONS[clean];
  if (!translation) return <>{text}</>;
  return (
    <span
      className="relative inline"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <span style={{ borderBottom: '1.5px dotted rgba(0,0,0,0.32)', cursor: 'help' }}>{text}</span>
      {show && <VocabTooltip text={translation} />}
    </span>
  );
}

function AnnotatedText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.split(/(\s+)/).map((token, ti) => {
            if (/^\s+$/.test(token)) return <span key={ti}>{token}</span>;
            const clean = token.toLowerCase().replace(/[.,?!;:""]/g, '');
            return TRANSLATIONS[clean]
              ? <SwedishWord key={ti} text={token} />
              : <span key={ti}>{token}</span>;
          })}
        </span>
      ))}
    </>
  );
}

// ── Shared UI pieces ───────────────────────────────────────────────────────────

function MonthBar({ completed, current }: { completed: boolean[]; current: number }) {
  return (
    <div className="flex items-end gap-1">
      {MONTH_SHORT.map((label, i) => {
        const s = SEASON_OF_MONTH[i];
        const c = COLORS[s];
        const done = completed[i];
        const active = i === current;
        const future = i > current;
        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1, minWidth: 0 }}>
            <div
              className="w-full rounded-full transition-all duration-500"
              style={{
                height: active ? 8 : 4,
                backgroundColor: done || active ? c.primary : '#E2DDD8',
                opacity: future ? 0.3 : 1,
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 8,
                color: done || active ? c.primary : '#AAA49E',
                opacity: future ? 0.4 : 1,
                letterSpacing: '0.05em',
              }}
            >
              {done ? '✓' : label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SeasonPlaceholder({
  season,
  label,
  minH = 90,
}: {
  season: Season;
  label: string;
  minH?: number;
}) {
  const c = COLORS[season];
  const image = SEASON_IMAGES[season];

  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden"
      style={{
        backgroundColor: c.placeholder,
        minHeight: minH,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <span style={{ fontSize: 28, lineHeight: 1 }}>
            {SEASON_ICON[season]}
          </span>

          <p
            className="font-mono text-[10px] text-center px-4 opacity-60"
            style={{ color: c.textDark }}
          >
            {label}
          </p>
        </>
      )}
    </div>
  );
}

function WeatherPlaceholder({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center justify-center gap-1"
      style={{ backgroundColor: '#DDE8F0', minHeight: 90 }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{WEATHER_EMOJI[icon] ?? '🌥️'}</span>
      <p className="font-mono text-[10px] text-center px-4 opacity-50 text-slate-700">{label}</p>
    </div>
  );
}

function FeedbackBar({ state, onNext, colors }: { state: AnswerState; onNext: () => void; colors: (typeof COLORS)[Season] }) {
  if (state === 'idle') return null;
  const ok = state === 'correct';
  return (
    <div
      className="rounded-xl px-4 py-2 flex items-center justify-between fade-in shrink-0"
      style={{
        backgroundColor: ok ? '#EDFBF3' : '#FFF5EB',
        border: `1.5px solid ${ok ? '#6ECC9A' : '#F5B872'}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{ok ? '✅' : '⚠️'}</span>
        <div>
          <p className="font-display font-bold text-sm" style={{ color: ok ? '#1A5C38' : '#7A4200' }}>
            {ok ? 'Rätt!' : 'Försök igen.'}
          </p>
          {ok && <p className="text-xs" style={{ color: '#2D8854' }}>Bra jobbat!</p>}
        </div>
      </div>
      {ok && (
        <button
          onClick={onNext}
          className="px-4 py-2 rounded-lg font-display font-semibold text-sm text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: colors.dark }}
        >
          Nästa →
        </button>
      )}
    </div>
  );
}

// ── Question renderers ─────────────────────────────────────────────────────────

function MCQuestion({
  q, answerState, onSelect,
}: {
  q: Question;
  answerState: AnswerState;
  onSelect: (opt: string) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);

  const handleClick = (opt: string) => {
    if (answerState === 'correct') return;
    setChosen(opt);
    onSelect(opt);
  };

  const optionState = (opt: string): 'correct' | 'wrong' | 'idle' | 'neutral' => {
    if (answerState === 'idle') return chosen === opt ? 'idle' : 'neutral';
    if (opt === q.answer) return 'correct';
    if (opt === chosen && answerState === 'wrong') return 'wrong';
    return 'neutral';
  };

  const season = SEASON_OF_MONTH[q.monthIndex];
  const c = COLORS[season];

  return (
    <div className="flex flex-col gap-3">
      {q.options!.map((opt) => {
        const s = optionState(opt);
        let bg = '#FFFFFF';
        let border = '#DDD8D2';
        let textColor = '#1C1916';
        let cursor = answerState === 'correct' ? 'not-allowed' : 'pointer';
        if (s === 'idle') { bg = c.light; border = c.primary; textColor = c.textDark; }
        if (s === 'correct') { bg = '#EDFBF3'; border = '#4CAF82'; textColor = '#1A5C38'; }
        if (s === 'wrong') { bg = '#FFF0F0'; border = '#E57373'; textColor = '#8B2020'; }

        return (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            style={{ backgroundColor: bg, border: `2px solid ${border}`, color: textColor, cursor }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:shadow-sm relative"
          >
            <AnnotatedText text={opt} />
          </button>
        );
      })}
    </div>
  );
}

function SeasonMCQuestion({ q, answerState, onSelect }: { q: Question; answerState: AnswerState; onSelect: (opt: string) => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const s = q.season!;
  const c = COLORS[s];

  const handleClick = (opt: string) => {
    if (answerState === 'correct') return;
    setChosen(opt);
    onSelect(opt);
  };

  const optionState = (opt: string) => {
    if (answerState === 'idle') return chosen === opt ? 'selected' : 'neutral';
    if (opt === q.answer) return 'correct';
    if (opt === chosen && answerState === 'wrong') return 'wrong';
    return 'neutral';
  };

  return (
    <div className="flex flex-col gap-2">
      <SeasonPlaceholder season={s} label={q.imagelabel!} minH={90} />
      <div className="grid grid-cols-2 gap-2">
        {q.options!.map((opt) => {
          const state = optionState(opt);
          const sc = COLORS[opt as Season] ?? c;
          let bg = '#FFFFFF', border = '#DDD8D2', textColor = '#1C1916';
          if (state === 'selected') { bg = c.light; border = c.primary; textColor = c.textDark; }
          if (state === 'correct') { bg = sc.light; border = sc.primary; textColor = sc.textDark; }
          if (state === 'wrong') { bg = '#FFF0F0'; border = '#E57373'; textColor = '#8B2020'; }

          return (
            <button
              key={opt}
              onClick={() => handleClick(opt)}
              style={{ backgroundColor: bg, border: `2px solid ${border}`, color: textColor }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-display font-semibold text-sm transition-all duration-150 hover:shadow-sm cursor-pointer relative"
            >
              <span>{SEASON_ICON[opt as Season]}</span>
              <AnnotatedText text={opt} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeatherMCQuestion({ q, answerState, onSelect }: { q: Question; answerState: AnswerState; onSelect: (opt: string) => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const season = SEASON_OF_MONTH[q.monthIndex];
  const c = COLORS[season];

  const handleClick = (opt: string) => {
    if (answerState === 'correct') return;
    setChosen(opt);
    onSelect(opt);
  };

  const optionState = (opt: string) => {
    if (answerState === 'idle') return chosen === opt ? 'selected' : 'neutral';
    if (opt === q.answer) return 'correct';
    if (opt === chosen && answerState === 'wrong') return 'wrong';
    return 'neutral';
  };

  return (
    <div className="flex flex-col gap-2">
      <WeatherPlaceholder icon={q.weatherIcon!} label={q.weatherLabel!} />
      <div className="flex flex-col gap-2">
        {q.options!.map((opt) => {
          const state = optionState(opt);
          let bg = '#FFFFFF', border = '#DDD8D2', textColor = '#1C1916';
          if (state === 'selected') { bg = c.light; border = c.primary; textColor = c.textDark; }
          if (state === 'correct') { bg = '#EDFBF3'; border = '#4CAF82'; textColor = '#1A5C38'; }
          if (state === 'wrong') { bg = '#FFF0F0'; border = '#E57373'; textColor = '#8B2020'; }
          return (
            <button
              key={opt}
              onClick={() => handleClick(opt)}
              style={{ backgroundColor: bg, border: `2px solid ${border}`, color: textColor }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:shadow-sm relative"
            >
              <AnnotatedText text={opt} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekdayClickQuestion({ q, answerState, onSubmit }: { q: Question; answerState: AnswerState; onSubmit: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const season = SEASON_OF_MONTH[q.monthIndex];
  const c = COLORS[season];

  const toggle = (day: string) => {
    if (answerState === 'correct') return;
    setSelected(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    onSubmit(selected);
  };

  const dayState = (day: string) => {
    const sel = selected.includes(day);
    if (answerState === 'idle') return sel ? 'selected' : 'neutral';
    const correct = q.correctDays!.includes(day);
    if (correct && sel) return 'correct';
    if (!correct && sel) return 'wrong';
    if (correct && !sel) return 'missed';
    return 'neutral';
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="px-3 py-2 rounded-xl"
        style={{ backgroundColor: c.light, border: `1.5px solid ${c.border}` }}
      >
        <p className="font-display font-semibold text-sm" style={{ color: c.textDark }}><AnnotatedText text={q.sentence!} /></p>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => {
          const state = dayState(day);
          let bg = '#FFFFFF', border = '#DDD8D2', textColor = '#1C1916';
          if (state === 'selected') { bg = c.light; border = c.primary; textColor = c.textDark; }
          if (state === 'correct') { bg = '#EDFBF3'; border = '#4CAF82'; textColor = '#1A5C38'; }
          if (state === 'wrong') { bg = '#FFF0F0'; border = '#E57373'; textColor = '#8B2020'; }
          if (state === 'missed') { bg = '#FFF9E8'; border = '#F5C842'; textColor = '#7A5800'; }
          return (
            <button
              key={day}
              onClick={() => toggle(day)}
              style={{ backgroundColor: bg, border: `2px solid ${border}`, color: textColor }}
              className="flex items-center justify-center py-1.5 rounded-lg font-semibold text-[11px] transition-all duration-150 hover:shadow-sm cursor-pointer relative"
            >
              <AnnotatedText text={day} />
            </button>
          );
        })}
      </div>
      {answerState === 'idle' && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="self-start px-4 py-2 rounded-lg font-display font-semibold text-sm text-white transition-opacity hover:opacity-85 disabled:opacity-40"
          style={{ backgroundColor: c.primary }}
        >
          Kontrollera
        </button>
      )}
    </div>
  );
}

function OrderQuestion({ q, answerState, onSubmit }: { q: Question; answerState: AnswerState; onSubmit: (ordered: string[]) => void }) {
  const [placed, setPlaced] = useState<string[]>([]);
  const season = SEASON_OF_MONTH[q.monthIndex];
  const c = COLORS[season];

  const remaining = q.shuffled!.filter(item => !placed.includes(item));
  const isComplete = placed.length === q.shuffled!.length;

  const handleSourceClick = (item: string) => {
    if (answerState === 'correct') return;
    setPlaced(prev => [...prev, item]);
  };

  const handlePlacedClick = (item: string) => {
    if (answerState === 'correct') return;
    setPlaced(prev => prev.filter(p => p !== item));
  };

  const handleCheck = () => {
    if (!isComplete) return;
    onSubmit(placed);
  };

  const handleReset = () => {
    setPlaced([]);
  };

  const placedState = (item: string, idx: number): 'correct' | 'wrong' | 'placed' => {
    if (answerState === 'idle') return 'placed';
    return item === q.correct![idx] ? 'correct' : 'wrong';
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Target slots */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Din ordning</p>
        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl" style={{ border: `2px dashed ${c.border}`, backgroundColor: c.light }}>
          {placed.map((item, idx) => {
            const state = placedState(item, idx);
            let bg = c.primary, textColor = '#FFFFFF', border = 'transparent';
            if (state === 'correct') { bg = '#4CAF82'; }
            if (state === 'wrong') { bg = '#E57373'; }
            return (
              <button
                key={`placed-${idx}`}
                onClick={() => answerState === 'idle' && handlePlacedClick(item)}
                style={{ backgroundColor: bg, color: textColor, border: `2px solid ${border}` }}
                className="px-2.5 py-1 rounded-lg font-semibold text-xs transition-all hover:opacity-80 capitalize relative"
              >
                <AnnotatedText text={item} />
                {answerState === 'idle' && <span className="opacity-60 ml-1">×</span>}
              </button>
            );
          })}
          {placed.length === 0 && (
            <span className="text-xs text-gray-400 italic">Klicka på orden nedan...</span>
          )}
        </div>
      </div>

      {/* Source items */}
      {answerState === 'idle' && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Tillgängliga</p>
          <div className="flex flex-wrap gap-1.5">
            {remaining.map(item => (
              <button
                key={item}
                onClick={() => handleSourceClick(item)}
                style={{ backgroundColor: '#FFFFFF', border: `2px solid ${c.border}`, color: '#1C1916' }}
                className="px-2.5 py-1 rounded-lg font-semibold text-xs transition-all hover:shadow-sm capitalize relative"
              >
                <AnnotatedText text={item} />
              </button>
            ))}
          </div>
        </div>
      )}

      {answerState === 'idle' && (
        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            disabled={!isComplete}
            className="px-4 py-2 rounded-lg font-display font-semibold text-sm text-white transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ backgroundColor: c.primary }}
          >
            Kontrollera
          </button>
          {placed.length > 0 && (
            <button onClick={handleReset} className="px-3 py-2 rounded-lg font-semibold text-sm text-gray-500 hover:bg-gray-100 transition-all">
              Börja om
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DateCalendarQuestion({ q, answerState, onSelect }: { q: Question; answerState: AnswerState; onSelect: (date: number) => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const season = SEASON_OF_MONTH[q.monthIndex];
  const c = COLORS[season];
  const { daysInMonth, startOffset } = getMonthCalendar(q.targetMonthIndex!);
  const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  const handleClick = (day: number) => {
    if (answerState === 'correct') return;
    setChosen(day);
    onSelect(day);
  };

  const dayState = (day: number) => {
    if (answerState === 'idle') return chosen === day ? 'selected' : 'neutral';
    if (day === q.targetDate) return 'correct';
    if (day === chosen && day !== q.targetDate) return 'wrong';
    return 'neutral';
  };

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-2">
      <div
        className="px-3 py-1.5 rounded-xl flex items-center justify-between"
        style={{ backgroundColor: c.light, border: `1.5px solid ${c.border}` }}
      >
        <p className="font-display font-bold text-sm capitalize" style={{ color: c.textDark }}>
          {MONTHS_FULL[q.targetMonthIndex!]} 2025
        </p>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map(d => (
          <div key={d} className="text-[9px] font-mono font-medium uppercase tracking-wide text-gray-400 py-0.5">{d}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const state = dayState(day);
          let bg = 'transparent', textColor = '#374151', border = 'transparent';
          let hoverClass = 'hover:bg-gray-100';
          if (state === 'selected') { bg = c.light; border = c.primary; textColor = c.textDark; hoverClass = ''; }
          if (state === 'correct') { bg = '#EDFBF3'; border = '#4CAF82'; textColor = '#1A5C38'; hoverClass = ''; }
          if (state === 'wrong') { bg = '#FFF0F0'; border = '#E57373'; textColor = '#8B2020'; hoverClass = ''; }

          return (
            <button
              key={day}
              onClick={() => handleClick(day)}
              style={{ backgroundColor: bg, border: `2px solid ${border}`, color: textColor }}
              className={`h-6 flex items-center justify-center rounded-md font-semibold text-[11px] transition-all ${hoverClass} cursor-pointer`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Game Screen ────────────────────────────────────────────────────────────────

function GameScreen({
  q, qIdx, score, completedMonths, answerState, season, colors,
  onAnswerMC, onAnswerClick, onAnswerOrder, onAnswerDate,
  onAdvance, onHome,
}: {
  q: Question;
  qIdx: number;
  score: number;
  completedMonths: boolean[];
  answerState: AnswerState;
  season: Season;
  colors: (typeof COLORS)[Season];
  onAnswerMC: (ans: string) => void;
  onAnswerClick: (days: string[]) => void;
  onAnswerOrder: (ordered: string[]) => void;
  onAnswerDate: (date: number) => void;
  onAdvance: () => void;
  onHome: () => void;
}) {
  const qInMonth = (qIdx % 3) + 1;
  const monthLabel = MONTHS_FULL[q.monthIndex];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Top nav */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onHome}
            className="text-gray-400 hover:text-gray-700 transition-colors text-xl font-display"
            title="Till startsidan"
          >
            ⌂
          </button>
          <span
            className="font-display font-bold text-xl"
            style={{ color: colors.primary }}
          >
            Ett år i Uppsala
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-gray-500">
          <span className="capitalize">{monthLabel}</span>
          <span style={{ color: colors.primary }} className="font-bold">{qIdx + 1} / {QUESTIONS.length}</span>
          <span>⭐ {score}</span>
        </div>
      </header>

      {/* Month progress */}
      <div className="px-5 pb-2">
        <MonthBar completed={completedMonths} current={q.monthIndex} />
      </div>

      {/* Question card */}
      <main className="flex-1 min-h-0 px-5 pb-3 flex flex-col gap-2 max-w-3xl w-full mx-auto overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2 fade-in min-h-0 overflow-y-auto">
          {/* Question meta */}
          <div className="flex items-center justify-between">
            <span
              className="px-4 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-widest"
              style={{ backgroundColor: colors.light, color: colors.primary }}
            >
              {monthLabel} · Fråga {qInMonth}/3
            </span>
            <span className="text-2xl">{SEASON_ICON[season]}</span>
          </div>

          {/* Instruction */}
          <h2 className="font-display font-bold text-lg text-gray-900"><AnnotatedText text={q.instruction} /></h2>

          {/* Question body */}
          {(q.type === 'weekday-mc' || q.type === 'month-mc' || q.type === 'grammar-mc') && (
            <MCQuestion key={qIdx} q={q} answerState={answerState} onSelect={onAnswerMC} />
          )}
          {q.type === 'season-mc' && (
            <SeasonMCQuestion key={qIdx} q={q} answerState={answerState} onSelect={onAnswerMC} />
          )}
          {q.type === 'weather-mc' && (
            <WeatherMCQuestion key={qIdx} q={q} answerState={answerState} onSelect={onAnswerMC} />
          )}
          {q.type === 'weekday-click' && (
            <WeekdayClickQuestion key={qIdx} q={q} answerState={answerState} onSubmit={onAnswerClick} />
          )}
          {(q.type === 'weekday-order' || q.type === 'month-order') && (
            <OrderQuestion key={qIdx} q={q} answerState={answerState} onSubmit={onAnswerOrder} />
          )}
          {q.type === 'date-calendar' && (
            <DateCalendarQuestion key={qIdx} q={q} answerState={answerState} onSelect={onAnswerDate} />
          )}
        </div>

        {/* Feedback */}
        <FeedbackBar state={answerState} onNext={onAdvance} colors={colors} />
      </main>
    </div>
  );
}

// ── Month Complete Screen ──────────────────────────────────────────────────────

function MonthCompleteScreen({
  monthIdx, completedMonths, onNext, onHome,
}: {
  monthIdx: number;
  completedMonths: boolean[];
  onNext: () => void;
  onHome: () => void;
}) {
  const season = SEASON_OF_MONTH[monthIdx];
  const c = COLORS[season];
  const isLast = monthIdx === 11;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 fade-in overflow-y-auto" style={{ backgroundColor: '#F5F3F0' }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Season banner */}
        <div
          className="px-6 py-5 flex flex-col items-center gap-1.5"
          style={{ backgroundColor: c.placeholder }}
        >
          <span style={{ fontSize: 36 }}>{SEASON_ICON[season]}</span>
          <h1 className="font-display font-bold text-xl capitalize" style={{ color: c.textDark }}>
            {MONTHS_FULL[monthIdx]} klar!
          </h1>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 flex flex-col gap-3">
          <MonthBar completed={completedMonths} current={-1} />

          <div className="flex gap-2 justify-center">
            <button
              onClick={onHome}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all"
            >
              ⌂ Hem
            </button>
            <button
              onClick={onNext}
              className="px-5 py-2 rounded-xl font-display font-bold text-sm text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: c.primary }}
            >
              {isLast ? 'Avsluta' : 'Nästa månad →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Year Complete Screen ───────────────────────────────────────────────────────

function YearCompleteScreen({
  score, onReplay, onPractice, onHome,
}: {
  score: number;
  onReplay: () => void;
  onPractice: () => void;
  onHome: () => void;
}) {
  const total = QUESTIONS.length;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="h-full flex flex-col items-center justify-center p-3 fade-in overflow-y-auto" style={{ backgroundColor: '#F5F3F0' }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Celebration banner */}
        <div className="px-6 py-4 text-center" style={{ background: 'linear-gradient(135deg, #C2D9EE 0%, #B8E4CA 33%, #F5E0A0 66%, #F0C0A0 100%)' }}>
          <div className="flex justify-center gap-2 text-2xl mb-2">
            {['❄️','🌿','☀️','🍂'].map((e, i) => (
              <span key={i} style={{ animation: `fadeIn 0.3s ease-out ${i * 0.1}s both` }}>{e}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-lg text-gray-900 mb-1">
            Du klarade ett år i Uppsala!
          </h1>
          <p className="text-gray-600 text-xs">Januari – December ✓</p>
        </div>

        <div className="px-6 py-3 flex flex-col gap-2.5">
          {/* Score */}
          <div className="flex flex-col items-center gap-0.5 py-2 rounded-xl" style={{ backgroundColor: '#F5F3F0' }}>
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Resultat</p>
            <p className="font-display font-bold text-2xl text-gray-900">{score} / {total} rätt</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 max-w-xs">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#4CAF82' : pct >= 60 ? '#C98C08' : '#E57373' }}
              />
            </div>
            <p className="text-[10px] text-gray-500">{pct}%</p>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-6 gap-1">
            {MONTH_SHORT.map((m, i) => {
              const c = COLORS[SEASON_OF_MONTH[i]];
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: c.light }}
                >
                  <span className="font-mono text-[9px] font-bold" style={{ color: c.primary }}>✓</span>
                  <span className="font-mono text-[8px] text-gray-500">{m}</span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onReplay}
              className="flex-1 py-2 rounded-xl font-display font-bold text-sm text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#3A7EC6' }}
            >
              Spela igen
            </button>
            <button
              onClick={onPractice}
              className="px-3 py-2 rounded-xl text-sm font-display font-semibold text-gray-700 hover:bg-gray-100 transition-all border-2 border-gray-200"
            >
              Öva
            </button>
            <button
              onClick={onHome}
              className="px-3 py-2 rounded-xl text-sm font-display font-semibold text-gray-500 hover:bg-gray-100 transition-all"
            >
              ⌂ Hem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Practice: shared question renderer ────────────────────────────────────────

function renderPracticeQuestion(
  q: Question,
  qIdx: number,
  answerState: AnswerState,
  onMC: (a: string) => void,
  onClick: (days: string[]) => void,
  onOrder: (ordered: string[]) => void,
  onDate: (date: number) => void,
) {
  if (q.type === 'weekday-mc' || q.type === 'month-mc' || q.type === 'grammar-mc')
    return <MCQuestion key={qIdx} q={q} answerState={answerState} onSelect={onMC} />;
  if (q.type === 'season-mc')
    return <SeasonMCQuestion key={qIdx} q={q} answerState={answerState} onSelect={onMC} />;
  if (q.type === 'weather-mc')
    return <WeatherMCQuestion key={qIdx} q={q} answerState={answerState} onSelect={onMC} />;
  if (q.type === 'weekday-click')
    return <WeekdayClickQuestion key={qIdx} q={q} answerState={answerState} onSubmit={onClick} />;
  if (q.type === 'weekday-order' || q.type === 'month-order')
    return <OrderQuestion key={qIdx} q={q} answerState={answerState} onSubmit={onOrder} />;
  if (q.type === 'date-calendar')
    return <DateCalendarQuestion key={qIdx} q={q} answerState={answerState} onSelect={onDate} />;
  return null;
}

// ── Practice: results screen ───────────────────────────────────────────────────

function PracticeResults({
  category, score, total, onRetry, onMenu, onHome,
}: {
  category: CategoryKey;
  score: number;
  total: number;
  onRetry: () => void;
  onMenu: () => void;
  onHome: () => void;
}) {
  const meta = CATEGORIES[category];
  const c = COLORS[meta.season];
  const pct = Math.round((score / total) * 100);
  const praise = score === total ? 'Perfekt!' : score >= total * 0.8 ? 'Bra jobbat!' : 'Fortsätt öva!';

  return (
    <div className="h-full flex flex-col items-center justify-center p-3 fade-in overflow-y-auto" style={{ backgroundColor: '#F5F3F0' }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="px-6 py-4 text-center flex flex-col items-center gap-1.5" style={{ backgroundColor: c.placeholder }}>
          <span style={{ fontSize: 32 }}>{meta.icon}</span>
          <h1 className="font-display font-bold text-lg" style={{ color: c.textDark }}>{praise}</h1>
          <p className="font-display font-semibold text-sm" style={{ color: c.dark }}>
            {score} av {total} rätt
          </p>
        </div>

        <div className="px-6 py-3 flex flex-col gap-2.5">
          {/* Score bar */}
          <div className="flex flex-col gap-1">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: pct >= 80 ? '#4CAF82' : pct >= 60 ? '#C98C08' : '#E57373',
                }}
              />
            </div>
            <p className="text-xs text-gray-400 text-right font-mono">{pct}%</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={onRetry}
              className="w-full py-2 rounded-xl font-display font-bold text-sm text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: c.primary }}
            >
              Öva igen
            </button>
            <button
              onClick={onMenu}
              className="w-full py-2 rounded-xl text-sm font-display font-semibold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-all"
            >
              Välj annat område
            </button>
            <button
              onClick={onHome}
              className="w-full py-1.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              ⌂ Till startsidan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Practice Screen ────────────────────────────────────────────────────────────

function PracticeScreen({ onBack }: { onBack: () => void }) {
  type PracticeView = 'menu' | 'session' | 'results';
  const [view, setView] = useState<PracticeView>('menu');
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');

  const startSession = (cat: CategoryKey) => {
    setCategory(cat);
    setQIdx(0);
    setScore(0);
    setAnswerState('idle');
    setView('session');
  };

  const handleCorrect = () => { setScore(s => s + 1); setAnswerState('correct'); };
  const handleWrong   = () => setAnswerState('wrong');

  const handleMC    = (chosen: string) => { if (answerState === 'correct') return; const q = PRACTICE_QUESTIONS[category!][qIdx]; if (chosen === q.answer) handleCorrect(); else handleWrong(); };
  const handleClick = (days: string[]) => { if (answerState === 'correct') return; const q = PRACTICE_QUESTIONS[category!][qIdx]; const ok = days.length === q.correctDays!.length && q.correctDays!.every(d => days.includes(d)); if (ok) handleCorrect(); else handleWrong(); };
  const handleOrder = (ordered: string[]) => { if (answerState === 'correct') return; const q = PRACTICE_QUESTIONS[category!][qIdx]; const ok = ordered.every((item, i) => item === q.correct![i]); if (ok) handleCorrect(); else handleWrong(); };
  const handleDate  = (date: number) => { if (answerState === 'correct') return; const q = PRACTICE_QUESTIONS[category!][qIdx]; if (date === q.targetDate) handleCorrect(); else handleWrong(); };

  const advance = () => {
    const questions = PRACTICE_QUESTIONS[category!];
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
      setAnswerState('idle');
    } else {
      setView('results');
    }
  };

  // ── Menu ──
  if (view === 'menu') {
    return (
      <div className="h-full flex flex-col p-5 overflow-y-auto" style={{ backgroundColor: '#F5F3F0' }}>
        <div className="max-w-3xl w-full mx-auto flex flex-col gap-4 fade-in">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition-colors font-display text-lg">←</button>
            <div>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Övningsläge</p>
              <h1 className="font-display font-bold text-xl text-gray-900">Vad vill du öva på?</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(CATEGORIES) as [CategoryKey, CategoryMeta][]).map(([key, { label, icon, season, desc }]) => {
              const c = COLORS[season];
              return (
                <button
                  key={key}
                  onClick={() => startSession(key)}
                  className="text-left p-4 rounded-2xl transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer"
                  style={{ backgroundColor: c.light, border: `2px solid ${c.border}` }}
                >
                  <span className="text-2xl mb-1 block">{icon}</span>
                  <h2 className="font-display font-bold text-base mb-0.5" style={{ color: c.textDark }}>{label}</h2>
                  <p className="text-xs" style={{ color: c.primary }}>{desc}</p>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 italic">
            Välj ett ämne för att öva specifika frågor.
          </p>
        </div>
      </div>
    );
  }

  // ── Results ──
  if (view === 'results' && category) {
    return (
      <PracticeResults
        category={category}
        score={score}
        total={PRACTICE_QUESTIONS[category].length}
        onRetry={() => startSession(category)}
        onMenu={() => setView('menu')}
        onHome={onBack}
      />
    );
  }

  // ── Session ──
  if (!category) return null;
  const questions = PRACTICE_QUESTIONS[category];
  const q = questions[qIdx];
  const meta = CATEGORIES[category];
  const c = COLORS[meta.season];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('menu')}
            className="text-gray-400 hover:text-gray-700 transition-colors font-display text-xl"
          >
            ←
          </button>
          <span className="font-display font-bold text-xl" style={{ color: c.primary }}>
            {meta.icon} {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-gray-500">
          <span style={{ color: c.primary }} className="font-bold">{qIdx + 1} / {questions.length}</span>
          <span>⭐ {score}</span>
        </div>
      </header>

      {/* Progress dots */}
      <div className="px-5 pb-2 flex gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < qIdx ? c.primary : i === qIdx ? c.primary : '#E2DDD8', opacity: i > qIdx ? 0.35 : 1 }}
          />
        ))}
      </div>

      {/* Question card */}
      <main className="flex-1 min-h-0 px-5 pb-3 flex flex-col gap-2 max-w-3xl w-full mx-auto overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2 fade-in min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span
              className="px-4 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-widest"
              style={{ backgroundColor: c.light, color: c.primary }}
            >
              Fråga {qIdx + 1} av {questions.length}
            </span>
            <span className="text-2xl">{meta.icon}</span>
          </div>

          <h2 className="font-display font-bold text-lg text-gray-900"><AnnotatedText text={q.instruction} /></h2>

          {renderPracticeQuestion(q, qIdx, answerState, handleMC, handleClick, handleOrder, handleDate)}
        </div>

        <FeedbackBar state={answerState} onNext={advance} colors={c} />
      </main>
    </div>
  );
}

// ── Home Screen ────────────────────────────────────────────────────────────────

function HomeScreen({ onStart, onPractice }: { onStart: () => void; onPractice: () => void }) {
  const seasonData = [
    { season: 'vinter' as Season, label: 'Vinter', months: 'Dec · Jan · Feb' },
    { season: 'vår'    as Season, label: 'Vår',    months: 'Mar · Apr · Maj' },
    { season: 'sommar' as Season, label: 'Sommar', months: 'Jun · Jul · Aug' },
    { season: 'höst'   as Season, label: 'Höst',   months: 'Sep · Okt · Nov' },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F5F3F0' }}>
      <div className="flex-1 flex flex-row min-h-0">
        {/* Left – hero text */}
        <div className="flex-1 flex flex-col justify-center px-6 py-5 min-w-0">
          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2">Uppsala Universitet · Basic Swedish 1</p>
          <h1
            className="font-display font-bold leading-none mb-3"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)', color: '#1C1916' }}
          >
            Ett år i Uppsala
          </h1>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Träna dagar, månader, datum, årstider och väder.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onStart}
              className="px-5 py-3 rounded-xl font-display font-bold text-sm text-white transition-all hover:opacity-88 hover:shadow-lg"
              style={{ backgroundColor: '#3A7EC6' }}
            >
              Starta spelet →
            </button>
            <button
              onClick={onPractice}
              className="px-4 py-3 rounded-xl font-display font-semibold text-sm text-gray-600 hover:bg-white hover:shadow-sm transition-all border-2 border-gray-200 bg-transparent"
            >
              Öva
            </button>
          </div>
        </div>

        {/* Right – season grid */}
        <div className="flex-1 grid grid-cols-2 gap-1.5 p-4" style={{ gridTemplateRows: '1fr 1fr' }}>
          {seasonData.map(({ season, label, months }) => {
            const c = COLORS[season];
            return (
              <div
                key={season}
                className="rounded-2xl flex flex-col justify-end p-3 relative overflow-hidden"
                style={{ backgroundColor: c.placeholder }}
              >
                <div className="absolute top-2 right-2 text-xl opacity-60">{SEASON_ICON[season]}</div>
                <p className="font-display font-bold text-sm" style={{ color: c.textDark }}>{label}</p>
                <p className="font-mono text-[9px] mt-0.5 opacity-60" style={{ color: c.textDark }}>{months}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completedMonths, setCompletedMonths] = useState<boolean[]>(Array(12).fill(false));
  const [showMonthComplete, setShowMonthComplete] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');

  const q = QUESTIONS[qIdx];
  const season = SEASON_OF_MONTH[q?.monthIndex ?? 0];
  const colors = COLORS[season];

  const resetQ = () => {
    setAnswerState('idle');
  };

  const handleCorrect = () => {
    setScore(s => s + 1);
    setAnswerState('correct');
  };

  const handleWrong = () => {
    setAnswerState('wrong');
  };

  const handleAnswerMC = (chosen: string) => {
    if (answerState === 'correct') return;
    if (chosen === q.answer) handleCorrect();
    else handleWrong();
  };

  const handleAnswerClick = (days: string[]) => {
    if (answerState === 'correct') return;
    const correct = q.correctDays!;
    const ok = days.length === correct.length && correct.every(d => days.includes(d));
    if (ok) handleCorrect(); else handleWrong();
  };

  const handleAnswerOrder = (ordered: string[]) => {
    if (answerState === 'correct') return;
    const correct = q.correct!;
    const ok = ordered.every((item, i) => item === correct[i]);
    if (ok) handleCorrect(); else handleWrong();
  };

  const handleAnswerDate = (date: number) => {
    if (answerState === 'correct') return;
    if (date === q.targetDate) handleCorrect(); else handleWrong();
  };

  const advance = () => {
    const isLastQ = qIdx === QUESTIONS.length - 1;
    const isLastOfMonth = (qIdx + 1) % 3 === 0;
    const mIdx = Math.floor(qIdx / 3);

    if (isLastQ) {
      const next = [...completedMonths];
      next[11] = true;
      setCompletedMonths(next);
      setScreen('year-complete');
      window.save?.stats?.incrementWin(GAME_ID);
      window.save?.stats?.setCompletion(GAME_ID, 100);
    } else if (isLastOfMonth) {
      const next = [...completedMonths];
      next[mIdx] = true;
      setCompletedMonths(next);
      setShowMonthComplete(true);
    } else {
      setQIdx(i => i + 1);
      resetQ();
    }
  };

  const continueFromMonth = () => {
    setShowMonthComplete(false);
    setQIdx(i => i + 1);
    resetQ();
  };

  const startGame = () => {
    setQIdx(0);
    setScore(0);
    setCompletedMonths(Array(12).fill(false));
    setAnswerState('idle');
    setShowMonthComplete(false);
    setScreen('game');
  };

  const goHome = () => {
    setShowMonthComplete(false);
    setScreen('home');
  };

  if (screen === 'home') return <HomeScreen onStart={startGame} onPractice={() => setScreen('practice')} />;
  if (screen === 'practice') return <PracticeScreen onBack={goHome} />;
  if (screen === 'year-complete') return <YearCompleteScreen score={score} onReplay={startGame} onPractice={() => setScreen('practice')} onHome={goHome} />;

  if (showMonthComplete) {
    const mIdx = Math.floor(qIdx / 3);
    return <MonthCompleteScreen monthIdx={mIdx} completedMonths={completedMonths} onNext={continueFromMonth} onHome={goHome} />;
  }

  return (
    <GameScreen
      q={q}
      qIdx={qIdx}
      score={score}
      completedMonths={completedMonths}
      answerState={answerState}
      season={season}
      colors={colors}
      onAnswerMC={handleAnswerMC}
      onAnswerClick={handleAnswerClick}
      onAnswerOrder={handleAnswerOrder}
      onAnswerDate={handleAnswerDate}
      onAdvance={advance}
      onHome={goHome}
    />
  );
}
