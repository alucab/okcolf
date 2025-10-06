// utils.js – micro helper DOM + eventi globali
// --------------------------------------------

//Selettore singolo
const $ = (selector, context = document) => {
  const el = context.querySelector(selector);
  return el ? wrap(el) : null;
};

//Selettore multiplo → array-like + .each()
const $$ = (selector, context = document) => {
  const els = Array.from(context.querySelectorAll(selector));
  els.each = fn => { els.forEach((el, i) => fn(wrap(el), i)); return els; };
  return els;
};

//Wrapper universale per event listener
const $on = (obj, event, handler, opts) => {
  if (obj?.addEventListener) obj.addEventListener(event, handler, opts);
  return obj;
};

//Wrapper per oggetto window
const $w = {
  on(event, handler, opts) { $on(window, event, handler, opts); return $w; },
  off(event, handler, opts) { window.removeEventListener(event, handler, opts); return $w; },
  trigger(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
    return $w;
  }
};

//Wrapper per oggetto document
const $d = {
  on(event, handler, opts) { $on(document, event, handler, opts); return $d; },
  off(event, handler, opts) { document.removeEventListener(event, handler, opts); return $d; },
  trigger(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
    return $d;
  }
};

//Wrapper per singolo elemento DOM
function wrap(el) {
  return {
    el,

    // Eventi
    on(event, handler, opts) { $on(el, event, handler, opts); return this; },

    // Classi
    addClass(cls) { el.classList.add(cls); return this; },
    removeClass(cls) { el.classList.remove(cls); return this; },
    toggleClass(cls) { el.classList.toggle(cls); return this; },
    hasClass(cls) { return el.classList.contains(cls); },

    // Contenuto
    text(val) { if (val === undefined) return el.textContent; el.textContent = val; return this; },
    html(val) { if (val === undefined) return el.innerHTML; el.innerHTML = val; return this; },

    // Attributi e stile
    attr(name, val) {
      if (val === undefined) return el.getAttribute(name);
      el.setAttribute(name, val); return this;
    },
    css(styles) { Object.entries(styles).forEach(([k, v]) => el.style[k] = v); return this; },

    // Valori (input)
    val(v) { if (v === undefined) return el.value; el.value = v; return this; },

    // Visibilità
    show(displayType = 'block') { el.style.display = displayType; return this; },
    hide() { el.style.display = 'none'; return this; },
    toggle(force) {
      const show = force !== undefined ? force : el.style.display === 'none';
      el.style.display = show ? 'block' : 'none'; return this;
    },

    // Ricerca interna
    find(selector) { return $$(selector, el); },

    // Iterazione singola
    each(fn) { fn.call(el, wrap(el)); return this; }
  };
}
