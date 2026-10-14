/**
 * Configuratore preventivo a step.
 * Se PUBLIC_FORM_ENDPOINT è impostato (es. Formspree) invia lì i dati,
 * altrimenti apre il programma di posta con il riepilogo già scritto.
 */
type I18n = {
  from: string; required: string; name: string; surname: string; lastStep: string; email: string; privacy: string; sending: string; error: string;
  none: string; talk: string; subject: string; email_to: string; endpoint: string; locale: string;
  labels: Record<string, string>;
};

export function initQuote() {
  const form = document.querySelector<HTMLFormElement>('[data-quote]');
  const cfg = document.getElementById('quote-i18n');
  if (!form || !cfg) return;
  const i18n: I18n = JSON.parse(cfg.textContent || '{}');
  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-qstep]'));
  const dots = Array.from(form.querySelectorAll<HTMLElement>('[data-qdot]'));
  const prev = form.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const done = form.querySelector<HTMLElement>('[data-done]')!;
  const eur = (n: number) => new Intl.NumberFormat(i18n.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);
  let cur = 0;

  const $ = (sel: string) => document.querySelector<HTMLElement>(sel);
  const val = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value?.trim() ?? '';
  const checked = (name: string) => Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`));

  const summary = () => {
    const type = checked('type')[0];
    const price = type ? Number(type.dataset.price) : 0;
    const timing = checked('timing')[0];
    $('[data-sum-price]')!.textContent = type ? (price ? `${i18n.from} ${eur(price)}` : i18n.talk) : '-';
    $('[data-sum-type]')!.textContent = type?.dataset.label ?? '-';
    $('[data-sum-timing]')!.textContent = timing?.dataset.label ?? '-';
    return { type: type?.dataset.label ?? '', price, timing: timing?.dataset.label ?? '' };
  };
  form.addEventListener('change', summary);

  const err = (msg: string) => {
    const el = steps[cur].querySelector<HTMLElement>('[data-err]');
    if (el) el.textContent = msg;
  };
  const clearErr = () => steps.forEach((s) => { const e = s.querySelector<HTMLElement>('[data-err]'); if (e) e.textContent = ''; });

  const validate = (i: number) => {
    clearErr();
    if (i === 0 && !checked('type').length) { err(i18n.required); return false; }
    if (i === 2) {
      const fields: [string, string, (v: string) => boolean][] = [
        ['name', i18n.name, (v) => v.length > 1],
        ['surname', i18n.surname, (v) => v.length > 1],
        ['email', i18n.email, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)],
      ];
      for (const [name, msg, ok] of fields) {
        const el = form.elements.namedItem(name) as HTMLInputElement;
        const good = ok(val(name));
        el.setAttribute('aria-invalid', String(!good));
        if (!good) { err(msg); el.focus(); return false; }
      }
      if (!(form.elements.namedItem('privacy') as HTMLInputElement).checked) { err(i18n.privacy); return false; }
    }
    return true;
  };

  const show = (i: number, focus = true) => {
    cur = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('done', k < i); });
    prev.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    if (!focus) return;
    const legend = steps[i].querySelector('legend') as HTMLElement | null;
    if (legend) { legend.setAttribute('tabindex', '-1'); legend.focus({ preventScroll: true }); }
    const top = form.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  };

  next.addEventListener('click', () => { if (validate(cur)) show(Math.min(cur + 1, steps.length - 1)); });
  prev.addEventListener('click', () => show(Math.max(cur - 1, 0)));
  // invio con Enter nei passi intermedi = Avanti
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && cur < steps.length - 1 && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault(); next.click();
    }
  });
  // scegliere il tipo di progetto porta avanti da solo
  form.querySelectorAll<HTMLInputElement>('input[name="type"]').forEach((r) =>
    r.addEventListener('change', () => setTimeout(() => { if (cur === 0) next.click(); }, 260)),
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(2)) return;
    if (val('_gotcha')) return; // spam bot
    const s = summary();
    const L = i18n.labels;
    const data = {
      [L.type]: s.type, [L.price]: s.price ? `${i18n.from} ${eur(s.price)}` : i18n.talk,
      [L.timing]: s.timing || '-', [L.current]: val('current') || '-',
      [L.name]: val('name'), [L.surname]: val('surname'), [L.company]: val('company') || '-', [L.email]: val('email'), [L.phone]: val('phone') || '-',
      [L.message]: val('message') || '-',
    };
    submit.disabled = true;
    const label = submit.innerHTML;
    submit.textContent = i18n.sending;
    try {
      if (i18n.endpoint) {
        const res = await fetch(i18n.endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: i18n.subject, _replyto: val('email') }),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
        window.location.href = `mailto:${i18n.email_to}?subject=${encodeURIComponent(i18n.subject)}&body=${encodeURIComponent(body)}`;
        done.querySelector<HTMLElement>('[data-done-mail]')!.hidden = false;
        // senza invio automatico non diciamo "ricevuto": manca ancora il clic su Invia
        done.querySelector<HTMLElement>('[data-done-title]')!.textContent = i18n.lastStep;
      }
      steps.forEach((st) => st.classList.remove('is-active'));
      form.querySelector<HTMLElement>('[data-qnav]')!.hidden = true;
      dots.forEach((d) => { d.classList.remove('on'); d.classList.add('done'); });
      done.hidden = false;
      done.focus();
    } catch {
      err(i18n.error + i18n.email_to);
      submit.disabled = false;
      submit.innerHTML = label;
    }
  });

  summary();
  show(0, false);
}
