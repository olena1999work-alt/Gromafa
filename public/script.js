const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  initReveal();
  initTruth();
  initChoice();
  initMonologue();
});

function initReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item) => observer.observe(item));
}

function initTruth() {
  const truthLine = document.getElementById('truth-line');
  const trigger = document.getElementById('truth-trigger');
  if (!truthLine || !trigger) return;

  let changed = false;

  const mutate = () => {
    if (changed) return;
    changed = true;
    truthLine.textContent = 'Жодна тварина не спить у ліжку без простирадл';
    truthLine.classList.add('is-mutating');
  };

  window.setTimeout(mutate, 2200);
  trigger.addEventListener('click', mutate);
}

function initChoice() {
  const buttons = document.querySelectorAll('[data-choice]');
  const result = document.getElementById('choice-result');
  if (!buttons.length || !result) return;

  const heading = result.querySelector('h2');
  const text = result.querySelector('p:last-of-type');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.choice;
      result.classList.remove('is-silence', 'is-truth');

      if (choice === 'silence') {
        result.classList.add('is-silence');
        heading.textContent = 'Мовчання заспокоює залу';
        text.textContent = 'Тиша приглушує червоні спалахи. Ніхто не сперечається, і саме тому вистава стає ще небезпечнішою.';
        return;
      }

      result.classList.add('is-truth');
      heading.textContent = 'Правда рве декорації';
      text.textContent = 'Світло стає різкішим, слова тремтять, а сцена відповідає на сумнів майже ворожим червоним сигналом.';
    });
  });
}

function initMonologue() {
  const output = document.getElementById('monologue-text');
  const next = document.getElementById('monologue-next');
  if (!output || !next) return;

  const lines = [
    'Ми дивилися на стіну й чекали, що слова залишаться вірними собі.',
    'Потім хтось додав кілька тихих слів, і ціна мовчання стала вищою за страх.',
    'Ми шукали винних у темряві, не помічаючи, як темрява вже оселилася в наших звичках.',
    'І коли свині стали схожими на людей, найбільший жах полягав у тому, що дивувало це вже не всіх.'
  ];

  let index = 0;
  next.addEventListener('click', () => {
    index = (index + 1) % lines.length;
    output.textContent = lines[index];
  });
}
