'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { AlertTriangle, ArrowDown, ChevronRight, Eye, Flame, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const scenes = [
  {
    id: 'scene-1',
    stage: 'Сцена 1',
    title: 'Старий Майор говорить про мрію',
    text: 'Над фермою висить важкий холод. У темряві народжується обіцянка рівності — така переконлива, що тварини приймають її за майбутнє.',
    accent: 'Ідея свободи ще звучить чисто.'
  },
  {
    id: 'scene-2',
    stage: 'Сцена 2',
    title: 'Повстання стає початком міфу',
    text: 'Людський батіг зникає, і кожен вдих схожий на перемогу. Але на місці страху швидко оселяється нова дисципліна.',
    accent: 'Революція завжди потребує нового голосу.'
  },
  {
    id: 'scene-3',
    stage: 'Сцена 3',
    title: 'Свині беруть на себе тлумачення',
    text: 'Поки інші працюють, дехто вивчає правила. Хто читає — той пояснює. Хто пояснює — той коригує памʼять.',
    accent: 'Знання перетворюється на інструмент влади.'
  },
  {
    id: 'scene-4',
    stage: 'Сцена 4',
    title: 'Сквілер шліфує брехню',
    text: 'Він не сперечається, а огортає сумнів комфортом. Кожне виправдання звучить розумно, якщо повторити його достатньо разів.',
    accent: 'Пропаганда не кричить. Вона переконує ласкаво.'
  },
  {
    id: 'scene-5',
    stage: 'Сцена 5',
    title: 'Боксер працює замість того, щоб запитувати',
    text: 'Віра в працю стає вірою у владу. Втома приглушує критичне мислення краще, ніж заборони.',
    accent: 'Відданість без рефлексії — ідеальний ресурс системи.'
  },
  {
    id: 'scene-6',
    stage: 'Сцена 6',
    title: 'Памʼять починає тріскатися',
    text: 'Заповіді на стіні залишаються знайомими, але інтонація змінюється. Те, що ще вчора здавалося очевидним, сьогодні вимагає уточнення.',
    accent: 'Деградація реальності починається з маленьких правок.'
  }
];

const contradictoryMessages = [
  'Ти впевнений?',
  'Це не помилка.',
  'Памʼять нестабільна.',
  'Спокій важливіший за точність.',
  'Повернення теж змінює текст.'
];

const monologue = [
  'Вони не забрали правду одразу.',
  'Вони лише навчили всіх сумніватися у власній памʼяті.',
  'Коли кожне слово можна переписати — опір стає нечітким.',
  'Коли нечітким стає опір — контроль починає виглядати природно.',
  'І тоді свобода зникає не з шумом, а з полегшенням.'
];

function useAmbientAudio(enabled) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.04;
    master.connect(context.destination);

    const hum = context.createOscillator();
    hum.type = 'sawtooth';
    hum.frequency.value = 49;
    const humGain = context.createGain();
    humGain.gain.value = 0.015;
    hum.connect(humGain).connect(master);
    hum.start();

    const whisper = context.createOscillator();
    whisper.type = 'triangle';
    whisper.frequency.value = 162;
    const whisperGain = context.createGain();
    whisperGain.gain.value = 0.01;
    whisper.connect(whisperGain).connect(master);
    whisper.start();

    const heartbeat = context.createOscillator();
    heartbeat.type = 'square';
    heartbeat.frequency.value = 2.2;
    const heartbeatAmp = context.createGain();
    heartbeatAmp.gain.value = 0;
    heartbeat.connect(heartbeatAmp).connect(master);
    heartbeat.start();

    let beatDirection = 1;
    const beatInterval = window.setInterval(() => {
      heartbeatAmp.gain.linearRampToValueAtTime(beatDirection > 0 ? 0.025 : 0.002, context.currentTime + 0.25);
      beatDirection *= -1;
    }, 640);

    return () => {
      window.clearInterval(beatInterval);
      hum.stop();
      whisper.stop();
      heartbeat.stop();
      context.close();
    };
  }, [enabled]);
}

function SceneCard({ scene, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.7, delay: index * 0.04 }}
      className="section-card relative overflow-hidden rounded-[2rem] p-8 md:p-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,17,27,0.18),transparent_35%)]" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/45">
          <span>{scene.stage}</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">{scene.title}</h2>
        <p className="max-w-3xl text-base leading-7 text-white/75 md:text-lg">{scene.text}</p>
        <p className="max-w-2xl border-l border-[#9f111b] pl-4 text-sm uppercase tracking-[0.3em] text-[#d44c55]">
          {scene.accent}
        </p>
      </div>
    </motion.article>
  );
}

export default function AnimalFarmExperience() {
  const shouldReduceMotion = useReducedMotion();
  const [heroTruth, setHeroTruth] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [ruleMutated, setRuleMutated] = useState(false);
  const [questionPath, setQuestionPath] = useState(null);
  const [monologueIndex, setMonologueIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [realityVersion, setRealityVersion] = useState(0);
  const topRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, shouldReduceMotion ? 1 : 1.16]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.3]);
  const napoleonScale = useTransform(scrollYProgress, [0.55, 0.75], [1, shouldReduceMotion ? 1 : 1.35]);
  const darkness = useTransform(scrollYProgress, [0.48, 0.9], [0.12, 0.55]);

  useAmbientAudio(audioEnabled);

  useEffect(() => {
    const timeout = window.setTimeout(() => setHeroTruth(true), 2200);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!topRef.current) return undefined;
    let previousY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < previousY && currentY < window.innerHeight * 5.2) {
        setRealityVersion((value) => value + 1);
      }
      previousY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mutateTimer = window.setTimeout(() => setRuleMutated(true), 2000);
    return () => window.clearTimeout(mutateTimer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessages((prev) => {
        const next = {
          id: crypto.randomUUID(),
          text: contradictoryMessages[Math.floor(Math.random() * contradictoryMessages.length)],
          top: `${10 + Math.random() * 75}%`,
          left: `${8 + Math.random() * 80}%`
        };
        return [...prev.slice(-5), next];
      });
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const clear = window.setInterval(() => {
      setMessages((prev) => prev.slice(1));
    }, 4000);
    return () => window.clearInterval(clear);
  }, []);

  const choiceContent = useMemo(() => {
    if (questionPath === 'silence') {
      return {
        title: 'Ти у безпеці',
        body: 'Екран стає тихішим. Сумнів відступає. Система винагороджує покірність мʼякими тінями й стабільним ритмом.',
        style: 'from-emerald-500/15 to-white/5'
      };
    }

    if (questionPath === 'truth') {
      return {
        title: 'Правда не гарантує безпеки',
        body: 'Зʼявляються взаємовиключні фрази, а шум наростає. Кожна спроба побачити реальність робить її менш стабільною.',
        style: 'from-[#9f111b]/30 to-white/5'
      };
    }

    return {
      title: 'Вибір ще не зроблено',
      body: 'У тоталітарній системі нейтралітет триває недовго. Відкласти рішення — теж означає погодитися на чужі умови.',
      style: 'from-white/10 to-white/5'
    };
  }, [questionPath]);

  const finalMorph = realityVersion % 2 === 0 ? 'Свині дивляться по-людськи.' : 'Люди усміхаються по-свинськи.';

  return (
    <main
      ref={topRef}
      className="noise relative isolate overflow-hidden bg-black text-white"
      onPointerMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(240px circle at ${cursor.x}px ${cursor.y}px, rgba(255,255,255,0.09), transparent 70%)`
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.82))]"
        style={{ opacity: darkness }}
      />

      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: questionPath === 'truth' ? 0.9 : 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed z-[3] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/60 backdrop-blur"
            style={{ top: message.top, left: message.left }}
          >
            {message.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <section className="relative flex min-h-screen items-center px-6 py-16 md:px-10 lg:px-16">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.45em] text-white/45">
            <Eye className="h-4 w-4" />
            digital dossier / animal farm / truth protocol
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-8">
              <motion.h1 layout className="max-w-4xl text-5xl font-semibold leading-none md:text-7xl lg:text-[7rem]">
                <span className={heroTruth ? 'distorted-text glitch' : ''} data-text={heroTruth ? 'Правда — це те, що тобі сказали' : 'Що є правда?'}>
                  {heroTruth ? 'Правда — це те, що тобі сказали' : 'Що є правда?'}
                </span>
              </motion.h1>
              <p className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
                Атмосферна скрол-історія про те, як влада переписує памʼять, підміняє мову та перетворює безпеку на інструмент покори.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAudioEnabled(true);
                    document.getElementById('story-start')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="heartbeat inline-flex items-center gap-3 rounded-full border border-[#d44c55]/50 bg-[#9f111b]/20 px-6 py-3 text-sm font-medium uppercase tracking-[0.35em] text-white transition hover:bg-[#9f111b]/35"
                >
                  Увійти у систему
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAudioEnabled((value) => !value)}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.35em] text-white/70 transition hover:border-white/25 hover:text-white"
                >
                  <ShieldAlert className="h-4 w-4" />
                  {audioEnabled ? 'Приглушити шум' : 'Увімкнути гул'}
                </button>
              </div>
            </div>

            <div className="section-card rounded-[2rem] p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.4em] text-white/40">Стан середовища</p>
              <div className="mt-6 space-y-5 text-sm text-white/72">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Рівень сумніву</span>
                  <span className="text-[#d44c55]">критичний</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Памʼять мас</span>
                  <span className="text-white/50">перезаписується</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span>Рекомендація</span>
                  <span>{questionPath === 'silence' ? 'мовчати' : 'спостерігати'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.5em] text-white/35">
            <ArrowDown className="h-4 w-4" />
            Скроль, щоб зануритися глибше
          </div>
        </motion.div>
      </section>

      <section id="story-start" className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-12 md:px-10 lg:px-16">
        {scenes.map((scene, index) => (
          <SceneCard key={scene.id} scene={scene} index={index} />
        ))}
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.8 }}
          className="section-card overflow-hidden rounded-[2rem] p-8 md:p-12"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-white/45">
            <AlertTriangle className="h-4 w-4 text-[#d44c55]" />
            Сцена 7 — перекручення правди
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/40">Заповідь / поточна редакція #{realityVersion + 1}</p>
              <div className="min-h-28 text-3xl font-semibold leading-tight md:text-5xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ruleMutated || realityVersion > 0 ? 'mutated' : 'base'}
                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.5 }}
                    className={ruleMutated || realityVersion > 0 ? 'glitch text-[#f2d6d8]' : ''}
                    data-text={ruleMutated || realityVersion > 0 ? 'Жодна тварина не спить у ліжку без простирадл' : 'Жодна тварина не спить у ліжку'}
                  >
                    {ruleMutated || realityVersion > 0
                      ? 'Жодна тварина не спить у ліжку без простирадл'
                      : 'Жодна тварина не спить у ліжку'}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/68">
                Через кілька секунд заборона отримує уточнення. Якщо повернутися назад, памʼять теж адаптується — ніби так було завжди.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm leading-7 text-white/65">
                Точність зникає не миттєво. Вона поступається місцем формулюванням, що звучать майже однаково, але змінюють саму мораль правила.
              </p>
              <button
                type="button"
                onClick={() => setRealityVersion((value) => value + 1)}
                className="inline-flex items-center justify-between rounded-full border border-[#d44c55]/60 px-5 py-3 text-sm uppercase tracking-[0.35em] text-white transition hover:bg-[#9f111b]/25"
              >
                Ти впевнений, що памʼятаєш правильно?
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-10 md:px-10 lg:px-16">
        <motion.div
          style={{ scale: napoleonScale }}
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.35 }}
          className="section-card rounded-[2rem] px-8 py-16 text-center md:px-12 md:py-24"
        >
          <p className="text-xs uppercase tracking-[0.5em] text-white/40">Сцена 8 — влада / Наполеон</p>
          <div className="mt-10 space-y-6">
            <motion.p className="text-4xl font-semibold md:text-6xl" whileInView={{ opacity: [0.4, 1, 0.55] }} viewport={{ once: false }}>
              Правда — це стабільність
            </motion.p>
            <motion.p
              className="text-3xl font-semibold text-[#d44c55] md:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
            >
              Стабільність — це контроль
            </motion.p>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/62">
              Чим довше дивишся на гасло, тим менше воно схоже на аргумент — і тим більше на наказ, який тисне просто з центру екрана.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          className={`section-card rounded-[2rem] bg-gradient-to-br ${choiceContent.style} p-8 md:p-12`}
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-white/40">Сцена 9 — вибір</p>
              <h3 className="text-3xl font-semibold md:text-5xl">Що ти робитимеш, коли слова перестануть бути сталими?</h3>
            </div>
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => setQuestionPath('silence')}
                className="flex w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-black/25 px-6 py-5 text-left transition hover:border-white/25"
              >
                <span>
                  <span className="block text-sm uppercase tracking-[0.35em] text-white/42">варіант 01</span>
                  <span className="mt-2 block text-xl font-medium">Не ставити запитань</span>
                </span>
                <ChevronRight className="h-5 w-5 text-white/60" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuestionPath('truth');
                  setAudioEnabled(true);
                }}
                className="flex w-full items-center justify-between rounded-[1.5rem] border border-[#d44c55]/40 bg-[#9f111b]/10 px-6 py-5 text-left transition hover:bg-[#9f111b]/20"
              >
                <span>
                  <span className="block text-sm uppercase tracking-[0.35em] text-white/42">варіант 02</span>
                  <span className="mt-2 block text-xl font-medium">Шукати правду</span>
                </span>
                <ChevronRight className="h-5 w-5 text-[#d44c55]" />
              </button>

              <motion.div
                key={questionPath || 'none'}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[1.5rem] border px-6 py-5 ${questionPath === 'truth' ? 'border-[#d44c55]/40 bg-black/50' : 'border-white/10 bg-black/25'}`}
              >
                <p className="text-sm uppercase tracking-[0.35em] text-white/40">Результат</p>
                <h4 className="mt-3 text-2xl font-semibold">{choiceContent.title}</h4>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">{choiceContent.body}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="section-card rounded-[2rem] overflow-hidden p-8 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.45em] text-white/40">Сцена 10 — фінал</p>
              <div className="space-y-2 text-4xl font-semibold leading-tight md:text-6xl">
                <p>Усі тварини рівні…</p>
                <p className="glitch text-[#d44c55]" data-text="Але деякі рівніші за інших">
                  Але деякі рівніші за інших
                </p>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/65">
                Межа між свинями та людьми стирається. {finalMorph} Принцип не скасовують — його просто переписують до невпізнаваності.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm uppercase tracking-[0.3em] text-white/55">
              {[
                ['Боксер', 'затемнений'],
                ['Голос народу', 'розмитий'],
                ['Сквілер', 'чіткий'],
                ['Наполеон', 'найбільший']
              ].map(([name, state], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                  className={`flex min-h-32 flex-col justify-end rounded-[1.5rem] border border-white/10 p-4 ${index === 0 ? 'bg-white/5 blur-[0.3px]' : ''} ${index === 1 ? 'bg-white/5 blur-[1px]' : ''} ${index === 2 ? 'bg-[#9f111b]/15' : ''} ${index === 3 ? 'bg-[#9f111b]/25 text-white' : ''}`}
                >
                  <span>{name}</span>
                  <span className="mt-2 text-xs text-white/38">{state}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-24 text-center md:px-10 lg:px-16">
        <div className="section-card rounded-[2rem] bg-black px-8 py-14 md:px-12">
          <p className="text-xs uppercase tracking-[0.45em] text-white/35">Фінальний монолог</p>
          <div className="mt-8 space-y-4 text-left text-2xl leading-relaxed md:text-3xl">
            {monologue.slice(0, monologueIndex + 1).map((line, index) => (
              <motion.p key={line} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                {line}
              </motion.p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMonologueIndex((value) => Math.min(value + 1, monologue.length - 1))}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.35em] text-white/72 transition hover:border-[#d44c55]/50 hover:text-white"
          >
            Наступний рядок
            <Flame className="h-4 w-4 text-[#d44c55]" />
          </button>
        </div>
      </section>
    </main>
  );
}
