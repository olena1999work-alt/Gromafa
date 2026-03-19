const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  initScrollReveal();
  initTruthMutation();
  initChoiceExperience();
  initMonologue();
  initAmbientAudio();
});

function initScrollReveal() {
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initTruthMutation() {
  const truthRule = document.querySelector('[data-truth-rule]');
  const truthExtra = document.querySelector('[data-truth-extra]');
  const truthStage = document.querySelector('[data-truth-stage]');
  const truthButton = document.querySelector('[data-truth-button]');
  if (!truthRule || !truthExtra || !truthStage) return;

  window.setTimeout(() => {
    truthExtra.textContent = '... без простирадл';
    truthStage.classList.add('glitching');
    truthRule.classList.add('glitch');
    truthRule.setAttribute('data-text', truthRule.textContent);
    window.setTimeout(() => truthStage.classList.remove('glitching'), 1200);
  }, 2000);

  if (truthButton) {
    truthButton.addEventListener('click', () => {
      truthStage.classList.add('glitching');
      truthExtra.textContent = 'Пояснення прийшло після зміни правила.';
      window.setTimeout(() => truthStage.classList.remove('glitching'), 1000);
    });
  }
}

function initChoiceExperience() {
  const buttons = document.querySelectorAll('[data-choice]');
  const result = document.querySelector('[data-choice-result]');
  const state = document.querySelector('[data-choice-state]');
  const title = document.querySelector('[data-choice-title]');
  const text = document.querySelector('[data-choice-text]');
  if (!buttons.length || !result || !state || !title || !text) return;

  const responses = {
    silence: {
      state: 'Схвалено системою',
      title: 'Тиша винагороджується',
      text: 'Екран вирівнюється, кольори заспокоюються, пульс стихає. Ніхто не сперечається, бо сумнів здається зайвим ризиком.',
      className: 'safe-result'
    },
    truth: {
      state: 'Порушення спокою',
      title: 'Правда дряпає реальність',
      text: 'Слова починають тремтіти, червоний сигнал прорізає темряву, а правильна відповідь раптом стає підозрілою.',
      className: 'truth-result'
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.choice;
      const config = responses[mode];
      result.classList.remove('safe-result', 'truth-result', 'active-shake');
      result.classList.add(config.className);
      state.textContent = config.state;
      title.textContent = config.title;
      text.textContent = config.text;

      if (mode === 'truth') {
        title.classList.add('glitch');
        title.setAttribute('data-text', config.title);
        text.style.color = '#ff7a88';
        result.classList.add('active-shake');
      } else {
        title.classList.remove('glitch');
        title.removeAttribute('data-text');
        text.style.color = '';
      }
    });
  });
}

function initMonologue() {
  const line = document.querySelector('[data-monologue-line]');
  const button = document.querySelector('[data-monologue-button]');
  if (!line || !button) return;

  const lines = [
    'Ми дивились на стіну й бачили слова, які ще вчора були іншими.',
    'Ми дивились на тих, хто повторював ці слова, й починали сумніватися у собі.',
    'Коли пам’ять втомлюється, брехня стає зручною формою порядку.',
    'Коли порядок здається важливішим за правду, обличчя влади вже не має значення.',
    'І тоді свині та люди дивляться одне на одного — а ти вже не можеш пояснити різницю.'
  ];

  let index = 0;
  line.textContent = lines[index];

  button.addEventListener('click', () => {
    index = (index + 1) % lines.length;
    line.classList.add('fading');
    window.setTimeout(() => {
      line.textContent = lines[index];
      line.classList.remove('fading');
    }, 360);
  });
}

function initAmbientAudio() {
  const toggle = document.querySelector('[data-audio-toggle]');
  if (!toggle) return;

  let context;
  let playing = false;
  let cleanup = null;

  toggle.addEventListener('click', async () => {
    if (!playing) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        toggle.textContent = 'Аудіо недоступне';
        toggle.disabled = true;
        return;
      }

      context = new AudioContextClass();
      await context.resume();
      cleanup = createAmbientSound(context);
      playing = true;
      toggle.textContent = 'Звук: увімкнено';
    } else {
      cleanup?.();
      await context?.close();
      playing = false;
      toggle.textContent = 'Звук: вимкнено';
    }
  });
}

function createAmbientSound(context) {
  const master = context.createGain();
  master.gain.value = 0.045;
  master.connect(context.destination);

  const hum = context.createOscillator();
  hum.type = 'sawtooth';
  hum.frequency.value = 48;
  const humGain = context.createGain();
  humGain.gain.value = 0.018;
  hum.connect(humGain).connect(master);

  const whisper = context.createOscillator();
  whisper.type = 'triangle';
  whisper.frequency.value = 164;
  const whisperGain = context.createGain();
  whisperGain.gain.value = 0.012;
  whisper.connect(whisperGain).connect(master);

  const heartbeat = context.createOscillator();
  heartbeat.type = 'square';
  heartbeat.frequency.value = 2.2;
  const beatGain = context.createGain();
  beatGain.gain.value = 0;
  heartbeat.connect(beatGain).connect(master);

  hum.start();
  whisper.start();
  heartbeat.start();

  let strongBeat = true;
  const interval = window.setInterval(() => {
    beatGain.gain.cancelScheduledValues(context.currentTime);
    beatGain.gain.setValueAtTime(0.002, context.currentTime);
    beatGain.gain.linearRampToValueAtTime(strongBeat ? 0.026 : 0.008, context.currentTime + 0.18);
    beatGain.gain.linearRampToValueAtTime(0.002, context.currentTime + 0.42);
    strongBeat = !strongBeat;
  }, 640);

  return () => {
    window.clearInterval(interval);
    hum.stop();
    whisper.stop();
    heartbeat.stop();
  };
}
