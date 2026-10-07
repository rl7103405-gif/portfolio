/* ============================================================
   Blackjack Palace — Entrenador de conteo Hi-Lo
   Vanilla JS, sin dependencias. Funciona con doble clic (file://).
   ============================================================ */
"use strict";

/* ── Constantes ─────────────────────────────────────────── */

const PALOS = [
  { simbolo: "♠", color: "negra" },
  { simbolo: "♥", color: "roja" },
  { simbolo: "♦", color: "roja" },
  { simbolo: "♣", color: "negra" },
];
const RANGOS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const BANCA_INICIAL = 1000;
// La unidad de apuesta vive en config.unidad (regla de Blackjack Apprenticeship:
// unidad ≈ 1% del bankroll; se ajusta en Reglas conforme crece la banca)

const CLAVE_CONFIG = "bjp_config";
const CLAVE_PROGRESO = "bjp_progreso";

const NIVELES = [
  null, // índice 0 sin usar
  {
    nombre: "Aprendiz",
    descripcion: "El coach corrige cada jugada. El botón Coach te dice la jugada y la cuenta cuando lo pidas (esa decisión no se califica).",
    coachMuestraCuenta: true, probQuiz: 0.15, quizTc: false,
    calificaApuesta: false, ritmoMs: 1150,
    requisitos: (s) =>
      s.manosJugadas >= 15 && s.decisiones >= 15 && s.decisionesOk / s.decisiones >= 0.8,
    textoRequisitos: "Subes con 15 manos jugadas y 80% de estrategia en 15 decisiones sin ayuda.",
  },
  {
    nombre: "Práctica",
    descripcion: "Igual, pero se te exige más precisión y empiezan los quizzes de cuenta.",
    coachMuestraCuenta: true, probQuiz: 0.2, quizTc: false,
    calificaApuesta: false, ritmoMs: 900,
    requisitos: (s) =>
      s.decisiones >= 40 && s.decisionesOk / s.decisiones >= 0.9 &&
      s.quizRc >= 5 && s.quizRcOk / s.quizRc >= 0.8,
    textoRequisitos: "Subes con 90% de estrategia en 40 decisiones y 80% en 5 quizzes de cuenta.",
  },
  {
    nombre: "Conteo",
    descripcion: "El Coach ya no te dice la cuenta, solo la jugada. Quizzes frecuentes de running count.",
    coachMuestraCuenta: false, probQuiz: 0.35, quizTc: false,
    calificaApuesta: false, ritmoMs: 650,
    requisitos: (s) =>
      s.decisiones >= 50 && s.decisionesOk / s.decisiones >= 0.92 &&
      s.quizRc >= 10 && s.quizRcOk / s.quizRc >= 0.85,
    textoRequisitos: "Subes con 92% de estrategia en 50 decisiones y 85% en 10 quizzes de cuenta.",
  },
  {
    nombre: "Casino",
    descripcion: "Quizzes de true count (estimando barajas) y tu apuesta se califica contra la cuenta.",
    coachMuestraCuenta: false, probQuiz: 0.35, quizTc: true,
    calificaApuesta: true, ritmoMs: 650,
    requisitos: (s) =>
      s.quizTcTotal >= 10 && s.quizTcOk / s.quizTcTotal >= 0.8 &&
      s.apuestas >= 30 && s.apuestasOk / s.apuestas >= 0.9 &&
      s.decisiones >= 30 && s.decisionesOk / s.decisiones >= 0.92,
    textoRequisitos:
      "Subes con 80% en 10 quizzes de true count, 90% de apuestas correctas en 30 manos y 92% de estrategia.",
  },
  {
    nombre: "Palace",
    descripcion: "Ritmo rápido, como en la mesa real. Mantén tus números.",
    coachMuestraCuenta: false, probQuiz: 0.3, quizTc: true,
    calificaApuesta: true, ritmoMs: 250,
    requisitos: () => false,
    textoRequisitos: "Nivel máximo. Aquí se vive.",
  },
];

// Rampa de apuesta recomendada: true count → unidades
function unidadesPorTc(tc) {
  if (tc <= 1) return 1;
  if (tc === 2) return 2;
  if (tc === 3) return 4;
  if (tc === 4) return 6;
  return 8;
}

// Si ya está programado el barajado, la ronda arrancará con TC 0: aconsejar sobre esa cuenta, no la del zapato viejo
function tcParaApuesta() {
  return (tocaBarajar || zapato.length < 60) ? 0 : trueCountExacto();
}

// Consejo de apuesta con su porqué — el corazón del conteo:
// la estrategia básica solo empata; la ganancia está en apostar según la cuenta.
function coachApuesta() {
  const tc = tcParaApuesta();
  const u = unidadesPorTc(tc);
  const monto = "$" + (u * config.unidad).toLocaleString("es-MX");
  let porque;
  if (tocaBarajar || zapato.length < 60) {
    porque = "se baraja zapato nuevo en esta mano: la cuenta arranca en cero, apuesta el mínimo.";
  } else if (tc >= 2) {
    porque = "la cuenta va alta: el zapato guarda más 10s y ases de lo normal — " +
      "vienen más blackjacks (que a ti te pagan mejor que a la casa) y el dealer se pasará más. Tu momento.";
  } else if (tc <= -2) {
    porque = "la cuenta va negativa: quedan puras cartas chicas, el peor zapato para ti. " +
      "En el casino real, aquí uno apuesta el mínimo o se levanta un rato.";
  } else {
    porque = "el zapato está neutral: la casa lleva su pequeña ventaja de siempre. " +
      "Sobrevive barato con el mínimo y espera a que la cuenta suba.";
  }
  let texto = "Coach: con TC " + signo(tc) + ", apuesta " + u +
    (u === 1 ? " unidad" : " unidades") + " (" + monto + ") — " + porque;
  if (u * config.unidad > progreso.banca) {
    texto += " (la rampa ideal excede tu banca: apuesta lo más que puedas)";
  }
  return texto;
}

/* ── Estrategia básica (6-8 barajas, peek americano) ──────
   Códigos: H pedir · S plantarse · D doblar-o-pedir · Ds doblar-o-plantarse
   P dividir · Ph dividir-solo-con-DAS-o-pedir
   Rh rendirse-o-pedir · Rs rendirse-o-plantarse · Rp rendirse-o-dividir
   Columnas (upcard del dealer): 2 3 4 5 6 7 8 9 10 A          */

const DURAS_S17 = {
  4:  ["H","H","H","H","H","H","H","H","H","H"],
  5:  ["H","H","H","H","H","H","H","H","H","H"],
  6:  ["H","H","H","H","H","H","H","H","H","H"],
  7:  ["H","H","H","H","H","H","H","H","H","H"],
  8:  ["H","H","H","H","H","H","H","H","H","H"],
  9:  ["H","D","D","D","D","H","H","H","H","H"],
  10: ["D","D","D","D","D","D","D","D","H","H"],
  11: ["D","D","D","D","D","D","D","D","D","H"],
  12: ["H","H","S","S","S","H","H","H","H","H"],
  13: ["S","S","S","S","S","H","H","H","H","H"],
  14: ["S","S","S","S","S","H","H","H","H","H"],
  15: ["S","S","S","S","S","H","H","H","Rh","H"],
  16: ["S","S","S","S","S","H","H","Rh","Rh","Rh"],
  17: ["S","S","S","S","S","S","S","S","S","S"],
  18: ["S","S","S","S","S","S","S","S","S","S"],
  19: ["S","S","S","S","S","S","S","S","S","S"],
  20: ["S","S","S","S","S","S","S","S","S","S"],
  21: ["S","S","S","S","S","S","S","S","S","S"],
};

const SUAVES_S17 = {
  12: ["H","H","H","H","H","H","H","H","H","H"],
  13: ["H","H","H","D","D","H","H","H","H","H"],
  14: ["H","H","H","D","D","H","H","H","H","H"],
  15: ["H","H","D","D","D","H","H","H","H","H"],
  16: ["H","H","D","D","D","H","H","H","H","H"],
  17: ["H","D","D","D","D","H","H","H","H","H"],
  18: ["S","Ds","Ds","Ds","Ds","S","S","H","H","H"],
  19: ["S","S","S","S","S","S","S","S","S","S"],
  20: ["S","S","S","S","S","S","S","S","S","S"],
  21: ["S","S","S","S","S","S","S","S","S","S"],
};

const PARES_S17 = {
  "A":  ["P","P","P","P","P","P","P","P","P","P"],
  "10": ["S","S","S","S","S","S","S","S","S","S"],
  "9":  ["P","P","P","P","P","S","P","P","S","S"],
  "8":  ["P","P","P","P","P","P","P","P","P","P"],
  "7":  ["P","P","P","P","P","P","H","H","H","H"],
  "6":  ["Ph","P","P","P","P","H","H","H","H","H"],
  "5":  ["D","D","D","D","D","D","D","D","H","H"],
  "4":  ["H","H","H","Ph","Ph","H","H","H","H","H"],
  "3":  ["Ph","Ph","P","P","P","P","H","H","H","H"],
  "2":  ["Ph","Ph","P","P","P","P","H","H","H","H"],
};

// Diferencias con dealer que PIDE con 17 suave (H17):
// duras: 11 vs A dobla · 15 vs A rinde · 17 vs A rinde-o-plantarse
// suaves: A7 vs 2 dobla · A8 vs 6 dobla
// pares: 8,8 vs A rinde-o-dividir
function clonarTabla(t) {
  const c = {};
  for (const k in t) c[k] = t[k].slice();
  return c;
}
const DURAS_H17 = clonarTabla(DURAS_S17);
DURAS_H17[11][9] = "D";
DURAS_H17[15][9] = "Rh";
DURAS_H17[17][9] = "Rs";
const SUAVES_H17 = clonarTabla(SUAVES_S17);
SUAVES_H17[18][0] = "Ds";
SUAVES_H17[19][4] = "Ds";
const PARES_H17 = clonarTabla(PARES_S17);
PARES_H17["8"][9] = "Rp";

/* ── Configuración y progreso ───────────────────────────── */

let config = {
  barajas: 6,
  h17: true,          // Palace [POR CONFIRMAR]: dealer pide con 17 suave
  das: true,          // [POR CONFIRMAR]
  rendirse: false,    // [POR CONFIRMAR]
  pagoBj: 1.5,        // 3:2 [POR CONFIRMAR]
  penetracion: 0.75,
  bots: 2,            // jugadores simulados en la mesa (0-2)
  unidad: 50,         // unidad de apuesta de la rampa
};
let configPendiente = null; // config leída pero aún no aplicada (hay ronda en curso)

function statsNuevas() {
  return {
    manosJugadas: 0,
    decisiones: 0, decisionesOk: 0,
    quizRc: 0, quizRcOk: 0,
    quizBar: 0, quizBarOk: 0,
    quizTcTotal: 0, quizTcOk: 0,
    apuestas: 0, apuestasOk: 0,
    seguros: 0, segurosOk: 0,
  };
}

let progreso = {
  nivel: 1,
  banca: BANCA_INICIAL,
  statsNivel: statsNuevas(),
  statsGlobal: statsNuevas(),
};

function guardar(clave, obj) {
  try { localStorage.setItem(clave, JSON.stringify(obj)); } catch (e) { /* file:// puede bloquearlo */ }
}
function cargar(clave, base) {
  try {
    const crudo = localStorage.getItem(clave);
    if (!crudo) return base;
    return Object.assign({}, base, JSON.parse(crudo));
  } catch (e) { return base; }
}

/* ── Estado de la partida ───────────────────────────────── */

let zapato = [];
let totalCartas = 6 * 52;
let runningCount = 0;      // solo cartas VISIBLES
let tocaBarajar = false;

let fase = "APUESTA";
let apuesta = 0;
let quizEstaRonda = false;
let rondaEnCurso = false;

let manoDealer = null;     // { cartas, holeOculta }
let manosBots = [null, null];
let manosJugador = [];     // [{ cartas, apuesta, deSplit, deAses, doblada, rendida, terminada, resultado }]
let indiceManoActiva = 0;
let seguroApostado = 0;
let ayudaPedida = false;   // la próxima decisión fue soplada por el coach: no se califica
let ayudaTexto = null;     // texto del chip de ayuda visible
let cuentaVisible = true;  // la cuenta arranca visible; se tapa/destapa con el ojito
let avisoCuentaDado = false;
let apuestaSoplada = false; // la apuesta de esta ronda fue sugerida por el coach: no se califica
let apuestaSugerida = 0;    // monto exacto que el coach dictó, para exigir que se haya seguido

/* ── Utilidades de cartas ───────────────────────────────── */

function crearZapato() {
  zapato = [];
  for (let b = 0; b < config.barajas; b++) {
    for (const palo of PALOS) {
      for (const rango of RANGOS) zapato.push({ rango, palo });
    }
  }
  // Fisher-Yates
  for (let i = zapato.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [zapato[i], zapato[j]] = [zapato[j], zapato[i]];
  }
  totalCartas = zapato.length;
  zapato.pop(); // carta quemada, boca abajo: no cuenta
  runningCount = 0;
  tocaBarajar = false;
}

function valorHiLo(carta) {
  if (["2", "3", "4", "5", "6"].includes(carta.rango)) return 1;
  if (["7", "8", "9"].includes(carta.rango)) return 0;
  return -1;
}

function valorCarta(carta) {
  if (carta.rango === "A") return 11;
  if (["J", "Q", "K"].includes(carta.rango)) return 10;
  return parseInt(carta.rango, 10);
}

function sacarCarta(visible) {
  if (zapato.length === 0) {
    crearZapato(); // salvavidas; no debería pasar
    toast("Se agotó el zapato a media mano: se barajó y la cuenta vuelve a cero", "error", 4000);
  }
  const carta = zapato.pop();
  if (visible) runningCount += valorHiLo(carta);
  if (zapato.length <= totalCartas * (1 - config.penetracion)) tocaBarajar = true;
  return carta;
}

function revelarHole() {
  if (manoDealer && manoDealer.holeOculta) {
    manoDealer.holeOculta = false;
    runningCount += valorHiLo(manoDealer.cartas[1]);
  }
}

function totalMano(cartas) {
  let total = 0, ases = 0;
  for (const c of cartas) {
    total += valorCarta(c);
    if (c.rango === "A") ases++;
  }
  while (total > 21 && ases > 0) { total -= 10; ases--; }
  return { total, esSuave: ases > 0 };
}

function esBlackjack(mano) {
  return !mano.deSplit && mano.cartas.length === 2 && totalMano(mano.cartas).total === 21;
}

function barajasRestantesExactas() {
  return zapato.length / 52;
}

function redondearMediaBaraja(x) {
  return Math.max(0.5, Math.round(x * 2) / 2);
}

function truncarHaciaCero(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

function trueCountExacto() {
  return truncarHaciaCero(runningCount / Math.max(0.5, barajasRestantesExactas()));
}

/* ── Estrategia: jugada correcta ────────────────────────── */

function indiceUpcard(carta) {
  const v = valorCarta(carta);
  if (v === 11) return 9;      // As
  return v - 2;                 // 2→0 ... 10→8
}

function jugadaCorrecta(mano, cartaDealer, puedeDividir, puedeDoblar, puedeRendirse) {
  const duras = config.h17 ? DURAS_H17 : DURAS_S17;
  const suaves = config.h17 ? SUAVES_H17 : SUAVES_S17;
  const pares = config.h17 ? PARES_H17 : PARES_S17;
  const col = indiceUpcard(cartaDealer);
  const { total, esSuave } = totalMano(mano.cartas);

  let codigo = null;

  // 1) Pares (solo si dividir es una opción real)
  if (puedeDividir) {
    const v = valorCarta(mano.cartas[0]);
    const clave = v === 11 ? "A" : String(v);
    const c = pares[clave][col];
    if (c === "P") codigo = "P";
    else if (c === "Ph") codigo = config.das ? "P" : null;
    else if (c === "Rp") codigo = (config.rendirse && puedeRendirse) ? "R" : "P";
    else if (clave === "5" || clave === "10") codigo = null; // caen a duras
    else if (c === "H" || c === "S" || c === "D") codigo = null; // caen a duras/suaves
  }

  // 2) Suaves / duras
  if (!codigo) {
    const fila = esSuave ? suaves[total] : duras[total];
    const c = fila ? fila[col] : "S";
    if (c === "D") codigo = puedeDoblar ? "D" : "H";
    else if (c === "Ds") codigo = puedeDoblar ? "D" : "S";
    else if (c === "Rh") codigo = (config.rendirse && puedeRendirse) ? "R" : "H";
    else if (c === "Rs") codigo = (config.rendirse && puedeRendirse) ? "R" : "S";
    else codigo = c;
  }

  return { P: "dividir", D: "doblar", H: "pedir", S: "plantarse", R: "rendirse" }[codigo];
}

const NOMBRE_ACCION = {
  pedir: "Pedir", plantarse: "Plantarse", doblar: "Doblar",
  dividir: "Dividir", rendirse: "Rendirse",
};

/* ── Referencias al DOM ─────────────────────────────────── */

const $ = (id) => document.getElementById(id);

const ui = {
  hudNiveles: $("hud-niveles"), hudNivelNombre: $("hud-nivel-nombre"),
  hudBanca: $("hud-banca"), letreroMesa: $("letrero-mesa"),
  hudCuenta: $("hud-cuenta"), hudRc: $("hud-rc"),
  hudTc2: $("hud-tc2"), hudBarajas: $("hud-barajas"),
  cartasDealer: $("cartas-dealer"), totalDealer: $("total-dealer"),
  cartasBot1: $("cartas-bot1"), totalBot1: $("total-bot1"),
  cartasBot2: $("cartas-bot2"), totalBot2: $("total-bot2"),
  manosJugador: $("manos-jugador"), sugerencia: $("sugerencia-coach"),
  mensaje: $("mensaje-mesa"), descarteRelleno: $("descarte-relleno"),
  panelApuesta: $("panel-apuesta"), panelJugada: $("panel-jugada"),
  panelSeguro: $("panel-seguro"), panelSiguiente: $("panel-siguiente"),
  montoApuesta: $("monto-apuesta"), btnRepartir: $("btn-repartir"),
  btnPedir: $("btn-pedir"), btnPlantarse: $("btn-plantarse"),
  btnDoblar: $("btn-doblar"), btnDividir: $("btn-dividir"),
  btnRendirse: $("btn-rendirse"), btnCoach: $("btn-coach"),
  textoSeguro: $("texto-seguro"),
  toast: $("toast"),
};

/* ── Render ─────────────────────────────────────────────── */

function elementoCarta(carta, oculta, chica) {
  const div = document.createElement("div");
  div.className = "carta " + (oculta ? "oculta" : carta.palo.color);
  div.innerHTML =
    `<div class="esquina">${carta.rango}<br>${carta.palo.simbolo}</div>` +
    `<div class="palo-centro">${carta.palo.simbolo}</div>`;
  return div;
}

function pintarCartas(contenedor, cartas, holeOculta) {
  contenedor.innerHTML = "";
  cartas.forEach((c, i) => {
    contenedor.appendChild(elementoCarta(c, holeOculta && i === 1, false));
  });
}

function textoTotal(cartas, ocultarSegunda) {
  if (cartas.length === 0) return "";
  if (ocultarSegunda) {
    return String(valorCarta(cartas[0]) === 11 ? "A" : valorCarta(cartas[0]));
  }
  const { total, esSuave } = totalMano(cartas);
  if (total > 21) return total + " · se pasó";
  return (esSuave && total < 21 ? "suave " : "") + total;
}

function pintarMesa() {
  const nivel = NIVELES[progreso.nivel];

  // HUD: solo nivel y dinero — la cuenta se lleva en la cabeza
  ui.hudNiveles.innerHTML = "";
  for (let n = 1; n <= 5; n++) {
    const punto = document.createElement("span");
    punto.className = "nivel-punto" +
      (n === progreso.nivel ? " activo" : n < progreso.nivel ? " superado" : "");
    punto.textContent = n;
    punto.title = NIVELES[n].nombre;
    ui.hudNiveles.appendChild(punto);
  }
  ui.hudNivelNombre.textContent = nivel.nombre;
  ui.hudBanca.textContent = "$" + progreso.banca.toLocaleString("es-MX");

  // HUD de la cuenta: siempre presente; el ojito tapa o destapa los números
  ui.hudCuenta.hidden = false; // (el quiz lo oculta por su cuenta mientras pregunta)
  if (cuentaVisible) {
    ui.hudRc.textContent = signo(runningCount);
    ui.hudTc2.textContent = signo(trueCountExacto());
    ui.hudBarajas.textContent = barajasRestantesExactas().toFixed(1);
  } else {
    ui.hudRc.textContent = "···";
    ui.hudTc2.textContent = "··";
    ui.hudBarajas.textContent = "··";
  }
  $("btn-ojo").textContent = cuentaVisible ? "👁" : "🙈";

  // Asientos de los jugadores simulados según la config
  $("asiento-bot1").style.display = config.bots >= 1 ? "" : "none";
  $("asiento-bot2").style.display = config.bots >= 2 ? "" : "none";

  // Letrero del fieltro con las reglas activas, como en la mesa real
  ui.letreroMesa.textContent =
    "BLACKJACK PAGA " + (config.pagoBj === 1.5 ? "3 A 2" : "6 A 5") +
    " · EL DEALER " + (config.h17 ? "PIDE" : "SE PLANTA") + " CON 17 SUAVE" +
    " · SEGURO PAGA 2 A 1 · " + config.barajas + " BARAJAS";

  // Pila de descarte
  const usadas = totalCartas - zapato.length;
  ui.descarteRelleno.style.height = Math.round((usadas / totalCartas) * 100) + "%";

  // Dealer
  if (manoDealer) {
    pintarCartas(ui.cartasDealer, manoDealer.cartas, manoDealer.holeOculta);
    ui.totalDealer.textContent = textoTotal(manoDealer.cartas, manoDealer.holeOculta);
  } else {
    ui.cartasDealer.innerHTML = "";
    ui.totalDealer.textContent = "";
  }

  // Bots
  [[ui.cartasBot1, ui.totalBot1, manosBots[0]], [ui.cartasBot2, ui.totalBot2, manosBots[1]]]
    .forEach(([cont, tot, mano]) => {
      if (mano) {
        cont.innerHTML = "";
        mano.cartas.forEach((c) => cont.appendChild(elementoCarta(c, false, true)));
        tot.textContent = textoTotal(mano.cartas, false);
      } else {
        cont.innerHTML = "";
        tot.textContent = "";
      }
    });

  // Jugador (una o varias manos)
  ui.manosJugador.innerHTML = "";
  manosJugador.forEach((mano, i) => {
    const caja = document.createElement("div");
    caja.className = "mano-jugador" +
      (fase === "JUGANDO" && i === indiceManoActiva && !mano.terminada ? " activa" : "");
    const cartas = document.createElement("div");
    // Con manos divididas, cartas chicas para que todo quepa en una fila
    cartas.className = "cartas" + (manosJugador.length > 1 ? " cartas-chicas" : "");
    mano.cartas.forEach((c) => cartas.appendChild(elementoCarta(c, false, false)));
    caja.appendChild(cartas);
    const total = document.createElement("div");
    total.className = "total-mano";
    if (mano.resultado) {
      total.innerHTML = `<span class="${mano.resultado.clase}">${mano.resultado.texto}</span>`;
    } else {
      total.textContent = mano.rendida ? "rendida" : textoTotal(mano.cartas, false);
    }
    caja.appendChild(total);
    const ap = document.createElement("div");
    ap.className = "mano-apuesta";
    ap.textContent = "$" + mano.apuesta.toLocaleString("es-MX") + (mano.doblada ? " (doblada)" : "");
    caja.appendChild(ap);
    ui.manosJugador.appendChild(caja);
  });

  // Ayuda del coach: en tu turno (jugada) o al apostar (coach de apuesta)
  if (ayudaTexto && (fase === "JUGANDO" || fase === "APUESTA")) {
    ui.sugerencia.textContent = ayudaTexto;
    ui.sugerencia.hidden = false;
  } else {
    ui.sugerencia.hidden = true;
  }

  actualizarBotonesJugada();
}

function actualizarBotonesJugada() {
  if (fase !== "JUGANDO") return;
  const mano = manosJugador[indiceManoActiva];
  if (!mano) return;
  ui.btnDoblar.disabled = !puedeDoblarMano(mano);
  ui.btnDividir.disabled = !puedeDividirMano(mano);
  ui.btnRendirse.hidden = !config.rendirse;
  ui.btnRendirse.disabled = !puedeRendirseMano(mano);
}

function mostrarPanel(nombre) {
  ui.panelApuesta.hidden = nombre !== "apuesta";
  ui.panelJugada.hidden = nombre !== "jugada";
  ui.panelSeguro.hidden = nombre !== "seguro";
  ui.panelSiguiente.hidden = nombre !== "siguiente";
}

let toastTimeout = null;
function toast(texto, tipo, ms) {
  ui.toast.textContent = texto;
  ui.toast.className = tipo || "";
  ui.toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { ui.toast.hidden = true; }, ms || 2800);
}

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

// El momento clave del contador: zapato nuevo, la cuenta arranca en cero
async function ceremoniaBarajado() {
  const pila = $("pila-descarte");
  ui.mensaje.textContent = "Barajando las " + config.barajas + " barajas — la cuenta vuelve a cero";
  pila.classList.add("barajando");
  crearZapato();
  pintarMesa();
  await esperar(2600);
  pila.classList.remove("barajando");
}

/* ── Reglas de acciones disponibles ─────────────────────── */

function puedeDoblarMano(mano) {
  if (mano.cartas.length !== 2 || mano.terminada || mano.deAses) return false;
  if (mano.deSplit && !config.das) return false;
  return progreso.banca >= mano.apuesta;
}

function puedeDividirMano(mano) {
  if (mano.cartas.length !== 2 || mano.terminada) return false;
  if (manosJugador.length >= 4) return false;
  if (valorCarta(mano.cartas[0]) !== valorCarta(mano.cartas[1])) return false;
  if (mano.deAses) return false; // ases divididos no se re-dividen
  return progreso.banca >= mano.apuesta;
}

function puedeRendirseMano(mano) {
  return config.rendirse && !mano.deSplit && mano.cartas.length === 2 &&
    manosJugador.length === 1 && !mano.terminada;
}

/* ── Coach: registrar decisiones ────────────────────────── */

function registrarDecision(accion, mano) {
  const correcta = jugadaCorrecta(
    mano, manoDealer.cartas[0],
    puedeDividirMano(mano), puedeDoblarMano(mano), puedeRendirseMano(mano));
  const acerto = accion === correcta;
  ayudaTexto = null;

  if (ayudaPedida) { // jugada soplada por el coach: no cuenta para tu precisión
    ayudaPedida = false;
    return acerto;
  }

  progreso.statsNivel.decisiones++;
  progreso.statsGlobal.decisiones++;
  if (acerto) { progreso.statsNivel.decisionesOk++; progreso.statsGlobal.decisionesOk++; }
  const { total, esSuave } = totalMano(mano.cartas);
  const descMano = esSuave ? "suave " + total : String(total);
  if (acerto) {
    toast("✓ " + NOMBRE_ACCION[accion] + " es correcto", "correcto", 1400);
  } else {
    toast("✗ Con " + descMano + " contra " + manoDealer.cartas[0].rango +
      " la jugada era " + NOMBRE_ACCION[correcta], "error", 3200);
  }
  return acerto;
}

/* ── Quiz de conteo ─────────────────────────────────────── */

let quizResolver = null;

function talVezQuiz(probabilidadExtra) {
  const nivel = NIVELES[progreso.nivel];
  if (quizEstaRonda) return Promise.resolve();
  const p = nivel.probQuiz * (probabilidadExtra || 1);
  if (Math.random() > p) return Promise.resolve();
  quizEstaRonda = true;
  return abrirQuiz();
}

function abrirQuiz() {
  const nivel = NIVELES[progreso.nivel];
  ui.hudCuenta.hidden = true; // que no se vea la respuesta detrás del modal
  // Capturar los valores correctos AHORA, con el juego pausado
  const rcCorrecto = runningCount;
  const barajasExactas = barajasRestantesExactas();
  const barajasCorrectas = redondearMediaBaraja(barajasExactas);
  const conTc = nivel.quizTc && Math.random() < 0.5;

  return new Promise((resolver) => {
    quizResolver = resolver;
    const modal = $("modal-quiz");
    const pasoRc = $("quiz-paso-rc");
    const pasoBar = $("quiz-paso-barajas");
    const pasoTc = $("quiz-paso-tc");
    const resultado = $("quiz-resultado");
    const btnCerrar = $("btn-quiz-cerrar");

    let rcElegido = null, barajasElegidas = null, tcElegido = null;

    resultado.hidden = true;
    resultado.innerHTML = "";
    btnCerrar.hidden = true;
    pasoRc.hidden = false;
    pasoBar.hidden = true;
    pasoTc.hidden = true;

    // Paso 1: running count (7 opciones alrededor de la correcta)
    const opsRc = $("quiz-opciones-rc");
    opsRc.innerHTML = "";
    for (let v = rcCorrecto - 3; v <= rcCorrecto + 3; v++) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = (v > 0 ? "+" : "") + v;
      b.onclick = () => {
        rcElegido = v;
        progreso.statsNivel.quizRc++; progreso.statsGlobal.quizRc++;
        if (v === rcCorrecto) { progreso.statsNivel.quizRcOk++; progreso.statsGlobal.quizRcOk++; }
        pasoRc.hidden = true;
        if (conTc) { prepararPasoBarajas(); pasoBar.hidden = false; }
        else cerrarConResultado();
      };
      opsRc.appendChild(b);
    }

    // Paso 2: barajas restantes estimadas
    function prepararPasoBarajas() {
      const opsBar = $("quiz-opciones-barajas");
      opsBar.innerHTML = "";
      const centro = barajasCorrectas;
      const valores = [];
      for (let v = centro - 1.5; v <= centro + 1.5; v += 0.5) {
        if (v >= 0.5 && v <= config.barajas) valores.push(v);
      }
      valores.forEach((v) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = String(v);
        b.onclick = () => {
          barajasElegidas = v;
          progreso.statsNivel.quizBar++; progreso.statsGlobal.quizBar++;
          if (Math.abs(v - barajasCorrectas) <= 0.5) {
            progreso.statsNivel.quizBarOk++; progreso.statsGlobal.quizBarOk++;
          }
          pasoBar.hidden = true;
          prepararPasoTc();
          pasoTc.hidden = false;
        };
        opsBar.appendChild(b);
      });
    }

    // Paso 3: true count con la estimación DEL JUGADOR
    function prepararPasoTc() {
      // Se califica el cálculo con las barajas que él eligió, no las exactas:
      // así un error de estimación no le cuenta doble.
      const tcCorrecto = truncarHaciaCero(rcCorrecto / barajasElegidas);
      const opsTc = $("quiz-opciones-tc");
      opsTc.innerHTML = "";
      for (let v = tcCorrecto - 3; v <= tcCorrecto + 3; v++) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = (v > 0 ? "+" : "") + v;
        b.onclick = () => {
          tcElegido = v;
          progreso.statsNivel.quizTcTotal++; progreso.statsGlobal.quizTcTotal++;
          if (v === tcCorrecto) { progreso.statsNivel.quizTcOk++; progreso.statsGlobal.quizTcOk++; }
          pasoTc.hidden = true;
          cerrarConResultado(tcCorrecto);
        };
        opsTc.appendChild(b);
      }
    }

    function cerrarConResultado(tcCorrecto) {
      let html = "";
      html += rcElegido === rcCorrecto
        ? `<p><span class="bien">✓ Running count: ${signo(rcCorrecto)}</span></p>`
        : `<p><span class="mal">✗ Dijiste ${signo(rcElegido)}; el running count era ${signo(rcCorrecto)}</span></p>`;
      if (barajasElegidas !== null) {
        const bien = Math.abs(barajasElegidas - barajasCorrectas) <= 0.5;
        html += bien
          ? `<p><span class="bien">✓ Barajas: quedan ${barajasExactas.toFixed(1)} (dijiste ${barajasElegidas})</span></p>`
          : `<p><span class="mal">✗ Dijiste ${barajasElegidas} barajas; quedan ${barajasExactas.toFixed(1)}</span></p>`;
      }
      if (tcElegido !== null) {
        html += tcElegido === tcCorrecto
          ? `<p><span class="bien">✓ True count: ${signo(tcCorrecto)} con tu estimación</span></p>`
          : `<p><span class="mal">✗ ${signo(rcCorrecto)} ÷ ${barajasElegidas} barajas = ${signo(tcCorrecto)}, no ${signo(tcElegido)}</span></p>`;
        html += `<p>Con las barajas exactas (${barajasExactas.toFixed(1)}): TC ${signo(truncarHaciaCero(rcCorrecto / Math.max(0.5, barajasExactas)))}</p>`;
      }
      resultado.innerHTML = html;
      resultado.hidden = false;
      btnCerrar.hidden = false;
      btnCerrar.onclick = () => {
        modal.hidden = true;
        guardarProgreso();
        pintarMesa();
        resolver();
      };
    }

    modal.hidden = false;
  });
}

function signo(n) { return (n > 0 ? "+" : "") + n; }

/* ── Flujo de la ronda ──────────────────────────────────── */

function manoNueva(apuestaMano, deSplit, deAses) {
  return {
    cartas: [], apuesta: apuestaMano,
    deSplit: !!deSplit, deAses: !!deAses,
    doblada: false, rendida: false, terminada: false, resultado: null,
  };
}

async function iniciarRonda() {
  if (rondaEnCurso) return;
  rondaEnCurso = true;
  const apuestaRonda = apuesta;
  fase = "REPARTO";
  mostrarPanel("jugada");
  const nivel = NIVELES[progreso.nivel];

  // Barajar si tocó la carta de corte al final de la ronda anterior
  if (tocaBarajar || zapato.length < 60) {
    await ceremoniaBarajado();
  }

  // Calificar la apuesta contra la rampa (niveles 4-5; soplada no cuenta)
  if (nivel.calificaApuesta && !(apuestaSoplada && apuestaRonda === apuestaSugerida)) {
    const tc = trueCountExacto();
    const esperadas = unidadesPorTc(tc);
    const apostadas = apuestaRonda / config.unidad;
    const montoIdeal = esperadas * config.unidad;
    const bancaPrevia = progreso.banca; // aquí aún no se descuenta la apuesta de esta ronda
    if (montoIdeal > bancaPrevia) {
      // la rampa ideal excedía la banca: no se califica
    } else {
      progreso.statsNivel.apuestas++; progreso.statsGlobal.apuestas++;
      if (apostadas === esperadas) {
        progreso.statsNivel.apuestasOk++; progreso.statsGlobal.apuestasOk++;
      } else {
        const razon = tc >= 2 ? " — la cuenta iba alta: era momento de subir"
          : " — el zapato no estaba a tu favor: mínimo y a esperar";
        toast("Apuesta: con TC " + signo(tc) + " la rampa dice " + esperadas +
          (esperadas === 1 ? " unidad" : " unidades") + " ($" + esperadas * config.unidad + ")" + razon, "error", 3600);
      }
    }
  }

  progreso.banca -= apuestaRonda;
  seguroApostado = 0;
  quizEstaRonda = false;
  ayudaPedida = false;
  ayudaTexto = null;
  manosJugador = [manoNueva(apuestaRonda, false, false)];
  indiceManoActiva = 0;
  manosBots = [
    config.bots >= 1 ? manoNueva(0, false, false) : null,
    config.bots >= 2 ? manoNueva(0, false, false) : null,
  ];
  manoDealer = { cartas: [], holeOculta: true };
  ui.mensaje.textContent = "";
  pintarMesa();

  // Reparto: dos vueltas, orden de mesa (bot1, jugador, bot2, dealer)
  for (let vuelta = 0; vuelta < 2; vuelta++) {
    for (const quien of ["bot1", "jugador", "bot2", "dealer"]) {
      if (quien === "bot1" && !manosBots[0]) continue;
      if (quien === "bot2" && !manosBots[1]) continue;
      await esperar(nivel.ritmoMs);
      if (quien === "bot1") manosBots[0].cartas.push(sacarCarta(true));
      else if (quien === "jugador") manosJugador[0].cartas.push(sacarCarta(true));
      else if (quien === "bot2") manosBots[1].cartas.push(sacarCarta(true));
      else {
        const esHole = vuelta === 1;
        manoDealer.cartas.push(sacarCarta(!esHole)); // la hole no cuenta hasta revelarse
      }
      pintarMesa();
    }
  }

  const upcard = manoDealer.cartas[0];

  // Seguro / even money con As de frente
  if (upcard.rango === "A") {
    fase = "SEGURO";
    const tieneBj = esBlackjack(manosJugador[0]);
    const esEvenMoney = tieneBj && config.pagoBj === 1.5;
    ui.textoSeguro.textContent = esEvenMoney
      ? "El dealer muestra un As y tú tienes blackjack. ¿Even money?"
      : "El dealer muestra un As. ¿Tomas seguro? (mitad de tu apuesta, paga 2 a 1)";
    $("btn-seguro-si").textContent = esEvenMoney ? "Even money" : "Tomar seguro";
    $("btn-seguro-si").disabled = progreso.banca < Math.floor(manosJugador[0].apuesta / 2);
    mostrarPanel("seguro");
    await new Promise((resolver) => { seguroDecision = resolver; });
    mostrarPanel("jugada");
  }

  // Peek americano con As o carta de valor 10
  if (valorCarta(upcard) >= 10) {
    await esperar(500);
    if (totalMano(manoDealer.cartas).total === 21) {
      ui.mensaje.textContent = "El dealer tiene blackjack";
      revelarHole();
      pintarMesa();
      await liquidarRonda(true);
      return;
    } else if (seguroApostado > 0) {
      toast("El dealer no tiene blackjack: seguro perdido (−$" + seguroApostado + ")", "error", 2200);
    }
  }

  await talVezQuiz(1); // punto de quiz: tras el reparto inicial

  // Turno del bot 1
  fase = "JUGANDO_BOT1";
  if (manosBots[0]) await jugarBot(manosBots[0], nivel.ritmoMs);

  // Turno del jugador
  fase = "JUGANDO";
  indiceManoActiva = 0;
  // Blackjack del jugador: no hay decisiones que tomar
  if (esBlackjack(manosJugador[0])) {
    manosJugador[0].terminada = true;
    ui.mensaje.textContent = "¡Blackjack!";
    fase = "JUGANDO_BOT2";
  }
  pintarMesa();

  if (fase === "JUGANDO") {
    await new Promise((resolver) => { turnoJugadorResolver = resolver; });
    await talVezQuiz(0.8); // punto de quiz: al terminar tu turno
  }

  // Turno del bot 2
  fase = "JUGANDO_BOT2";
  pintarMesa();
  if (manosBots[1]) await jugarBot(manosBots[1], nivel.ritmoMs);

  // Dealer
  fase = "DEALER";
  await esperar(nivel.ritmoMs);
  revelarHole();
  pintarMesa();

  const quedaAlguienVivo =
    manosJugador.some((m) => !m.rendida && totalMano(m.cartas).total <= 21) ||
    manosBots.filter(Boolean).some((m) => totalMano(m.cartas).total <= 21);

  if (quedaAlguienVivo) {
    let info = totalMano(manoDealer.cartas);
    while (info.total < 17 || (info.total === 17 && info.esSuave && config.h17)) {
      await esperar(nivel.ritmoMs);
      manoDealer.cartas.push(sacarCarta(true));
      info = totalMano(manoDealer.cartas);
      pintarMesa();
    }
  }

  await liquidarRonda(false);
}

let seguroDecision = null;
let turnoJugadorResolver = null;
let accionEnCurso = false; // evita doble clic / clics durante los await de una acción

async function jugarBot(mano, ritmo) {
  // Los bots juegan la tabla dura/suave (sin dividir, doblar = una carta).
  const duras = config.h17 ? DURAS_H17 : DURAS_S17;
  const suaves = config.h17 ? SUAVES_H17 : SUAVES_S17;
  const col = indiceUpcard(manoDealer.cartas[0]);
  let primeraAccion = true;

  while (true) {
    const { total, esSuave } = totalMano(mano.cartas);
    if (total >= 21) break;
    const fila = esSuave ? suaves[total] : duras[total];
    let c = fila ? fila[col] : "S";
    if (c === "Rh") c = "H";
    if (c === "Rs") c = "S";
    if (c === "D" && !primeraAccion) c = "H";
    if (c === "Ds" && !primeraAccion) c = "S";
    if (c === "S") break;
    await esperar(ritmo);
    mano.cartas.push(sacarCarta(true));
    pintarMesa();
    if (c === "D" || c === "Ds") break; // dobló: una sola carta
    primeraAccion = false;
  }
  await esperar(ritmo * 0.6);
}

/* Acciones del jugador */

function manoActiva() { return manosJugador[indiceManoActiva]; }

async function avanzarMano() {
  pintarMesa();
  // ¿Sigue una mano de split pendiente?
  for (let i = 0; i < manosJugador.length; i++) {
    if (!manosJugador[i].terminada) {
      indiceManoActiva = i;
      const mano = manosJugador[i];
      // Mano recién creada por split: recibe su segunda carta al activarse
      if (mano.cartas.length === 1) {
        await esperar(NIVELES[progreso.nivel].ritmoMs);
        mano.cartas.push(sacarCarta(true));
        if (mano.deAses) mano.terminada = true; // as dividido: una sola carta
        else if (totalMano(mano.cartas).total === 21) mano.terminada = true;
        pintarMesa();
        if (mano.terminada) return avanzarMano();
      }
      pintarMesa();
      return;
    }
  }
  // Todas terminadas
  if (turnoJugadorResolver) { turnoJugadorResolver(); turnoJugadorResolver = null; }
}

async function accionPedir() {
  if (accionEnCurso) return;
  const mano = manoActiva();
  if (!mano || mano.terminada) return;
  accionEnCurso = true;
  try {
    registrarDecision("pedir", mano);
    mano.cartas.push(sacarCarta(true));
    const t = totalMano(mano.cartas).total;
    if (t >= 21) mano.terminada = true;
    await avanzarMano();
  } finally {
    accionEnCurso = false;
  }
}

async function accionPlantarse() {
  if (accionEnCurso) return;
  const mano = manoActiva();
  if (!mano || mano.terminada) return;
  accionEnCurso = true;
  try {
    registrarDecision("plantarse", mano);
    mano.terminada = true;
    await avanzarMano();
  } finally {
    accionEnCurso = false;
  }
}

async function accionDoblar() {
  if (accionEnCurso) return;
  const mano = manoActiva();
  if (!mano || mano.terminada) return;
  if (!puedeDoblarMano(mano)) return;
  accionEnCurso = true;
  try {
    registrarDecision("doblar", mano);
    progreso.banca -= mano.apuesta;
    mano.apuesta *= 2;
    mano.doblada = true;
    mano.cartas.push(sacarCarta(true));
    mano.terminada = true;
    await avanzarMano();
  } finally {
    accionEnCurso = false;
  }
}

async function accionDividir() {
  if (accionEnCurso) return;
  const mano = manoActiva();
  if (!mano || mano.terminada) return;
  if (!puedeDividirMano(mano)) return;
  accionEnCurso = true;
  try {
    registrarDecision("dividir", mano);
    progreso.banca -= mano.apuesta;
    const esAs = mano.cartas[0].rango === "A";
    const cartaMovida = mano.cartas.pop();
    const nueva = manoNueva(mano.apuesta, true, esAs);
    nueva.cartas.push(cartaMovida);
    mano.deSplit = true;
    mano.deAses = esAs;
    manosJugador.splice(indiceManoActiva + 1, 0, nueva);
    // La mano activa recibe su segunda carta ya
    await esperar(NIVELES[progreso.nivel].ritmoMs);
    mano.cartas.push(sacarCarta(true));
    if (esAs) mano.terminada = true;
    else if (totalMano(mano.cartas).total === 21) mano.terminada = true;
    await avanzarMano();
  } finally {
    accionEnCurso = false;
  }
}

async function accionRendirse() {
  if (accionEnCurso) return;
  const mano = manoActiva();
  if (!mano || mano.terminada) return;
  if (!puedeRendirseMano(mano)) return;
  accionEnCurso = true;
  try {
    registrarDecision("rendirse", mano);
    mano.rendida = true;
    mano.terminada = true;
    progreso.banca += Math.floor(mano.apuesta / 2); // recupera la mitad
    await avanzarMano();
  } finally {
    accionEnCurso = false;
  }
}

function decidirSeguro(toma) {
  if (!seguroDecision) return;
  const resolver = seguroDecision;
  seguroDecision = null;
  ayudaPedida = false;
  ayudaTexto = null;
  const mano = manosJugador[0];
  const costoSeguro = Math.floor(mano.apuesta / 2);
  if (toma && progreso.banca < costoSeguro) {
    // No alcanza la banca: se trata como si no hubiera tomado seguro,
    // sin registrar decisión de estrategia (el botón debería estar deshabilitado).
    resolver();
    return;
  }
  const tc = trueCountExacto();
  const correcta = tc >= 3;
  // Métrica: cuenta como decisión de seguro, no de estrategia básica
  progreso.statsNivel.seguros++; progreso.statsGlobal.seguros++;
  if (toma === correcta) { progreso.statsNivel.segurosOk++; progreso.statsGlobal.segurosOk++; }
  if (toma !== correcta) {
    toast(correcta
      ? "Con TC " + signo(tc) + " el seguro SÍ convenía (regla: TC +3 o más)"
      : "Seguro: solo con TC +3 o más (iba " + signo(tc) + "). A la larga es dinero regalado", "error", 3400);
  } else if (toma) {
    toast("✓ Con TC " + signo(tc) + " el seguro es jugada correcta", "correcto", 2200);
  }
  if (toma) {
    seguroApostado = costoSeguro;
    progreso.banca -= seguroApostado;
  }
  resolver();
}

/* ── Liquidación ────────────────────────────────────────── */

async function liquidarRonda(dealerBj) {
  fase = "LIQUIDACION";
  const totalDealer = totalMano(manoDealer.cartas).total;
  const pago = config.pagoBj;
  let neto = 0;

  // Seguro
  if (seguroApostado > 0 && dealerBj) {
    progreso.banca += seguroApostado * 3; // recupera + 2:1
    neto += seguroApostado * 2;
  } else if (seguroApostado > 0) {
    neto -= seguroApostado;
  }

  for (const mano of manosJugador) {
    if (mano.rendida) {
      mano.resultado = { texto: "rendida −$" + Math.ceil(mano.apuesta / 2), clase: "res-pierde" };
      neto -= Math.ceil(mano.apuesta / 2);
      continue;
    }
    const t = totalMano(mano.cartas).total;
    const bj = esBlackjack(mano);

    if (dealerBj) {
      if (bj) { progreso.banca += mano.apuesta; mano.resultado = { texto: "empate", clase: "res-empata" }; }
      else { mano.resultado = { texto: "−$" + mano.apuesta, clase: "res-pierde" }; neto -= mano.apuesta; }
      continue;
    }
    if (t > 21) {
      mano.resultado = { texto: "−$" + mano.apuesta, clase: "res-pierde" };
      neto -= mano.apuesta;
    } else if (bj) {
      const premio = Math.round(mano.apuesta * pago);
      progreso.banca += mano.apuesta + premio;
      mano.resultado = { texto: "¡BJ! +$" + premio, clase: "res-gana" };
      neto += premio;
    } else if (totalDealer > 21 || t > totalDealer) {
      progreso.banca += mano.apuesta * 2;
      mano.resultado = { texto: "+$" + mano.apuesta, clase: "res-gana" };
      neto += mano.apuesta;
    } else if (t === totalDealer) {
      progreso.banca += mano.apuesta;
      mano.resultado = { texto: "empate", clase: "res-empata" };
    } else {
      mano.resultado = { texto: "−$" + mano.apuesta, clase: "res-pierde" };
      neto -= mano.apuesta;
    }
  }

  ui.mensaje.textContent = neto > 0 ? "Ganaste $" + neto : neto < 0 ? "Perdiste $" + (-neto) : "Empate";

  progreso.statsNivel.manosJugadas++;
  progreso.statsGlobal.manosJugadas++;
  pintarMesa();

  await talVezQuiz(1.4); // punto de quiz: con las cartas todavía en la mesa

  revisarSubidaDeNivel();

  // Banca fundida: recarga de práctica
  if (progreso.banca < 50) {
    progreso.banca = BANCA_INICIAL;
    toast("Banca recargada a $" + BANCA_INICIAL.toLocaleString("es-MX") +
      " — en el casino real no hay de estas", "", 3200);
  }

  guardarProgreso();
  fase = "FIN_RONDA";
  rondaEnCurso = false;
  mostrarPanel("siguiente");
  pintarMesa();

  // Nivel 5: ritmo de casino, avanza solo
  if (NIVELES[progreso.nivel].ritmoMs < 400) {
    await esperar(1800);
    if (fase === "FIN_RONDA") prepararApuesta();
  }
}

function revisarSubidaDeNivel() {
  const nivel = NIVELES[progreso.nivel];
  if (progreso.nivel < 5 && nivel.requisitos(progreso.statsNivel)) {
    progreso.nivel++;
    progreso.statsNivel = statsNuevas();
    const nuevo = NIVELES[progreso.nivel];
    toast("🎉 Subiste a nivel " + progreso.nivel + " — " + nuevo.nombre + ". " + nuevo.descripcion, "correcto", 5200);
  }
}

/* ── Apuesta ────────────────────────────────────────────── */

function prepararApuesta() {
  if (configPendiente) {
    config = configPendiente;
    configPendiente = null;
    crearZapato();
  }
  fase = "APUESTA";
  apuesta = 0;
  apuestaSoplada = false;
  apuestaSugerida = 0;
  ui.montoApuesta.textContent = "$0";
  ui.btnRepartir.disabled = true;
  // Limpiar la mesa (las cartas se van al descarte)
  manoDealer = null;
  manosBots = [null, null];
  manosJugador = [];
  ui.mensaje.textContent = tocaBarajar ? "Carta de corte: se baraja en la siguiente mano" : "";
  // En los niveles de aprendizaje, el coach de apuesta aconseja solo
  // (en los demás, está en el botón Coach del panel de apuesta)
  ayudaTexto = progreso.nivel <= 2 ? coachApuesta() : null;
  mostrarPanel("apuesta");
  pintarMesa();
}

function agregarFicha(valor) {
  if (fase !== "APUESTA") return;
  if (apuesta + valor > progreso.banca) {
    toast("No te alcanza la banca para esa ficha", "error", 1800);
    return;
  }
  apuesta += valor;
  ui.montoApuesta.textContent = "$" + apuesta.toLocaleString("es-MX");
  ui.btnRepartir.disabled = apuesta === 0;
}

/* ── Modales: tablas, progreso, config ──────────────────── */

function porcentaje(ok, total) {
  if (!total) return "—";
  return Math.round((ok / total) * 100) + "%";
}

function pintarProgreso() {
  const s = progreso.statsNivel;
  const g = progreso.statsGlobal;
  const nivel = NIVELES[progreso.nivel];
  $("contenido-progreso").innerHTML = `
    <p><strong>Nivel ${progreso.nivel} — ${nivel.nombre}.</strong> ${nivel.descripcion}</p>
    <div class="metrica"><span>Manos jugadas (nivel)</span><strong>${s.manosJugadas}</strong></div>
    <div class="metrica"><span>Estrategia básica</span><strong>${porcentaje(s.decisionesOk, s.decisiones)} (${s.decisionesOk}/${s.decisiones})</strong></div>
    <div class="metrica"><span>Decisiones de seguro</span><strong>${porcentaje(s.segurosOk, s.seguros)} (${s.segurosOk}/${s.seguros})</strong></div>
    <div class="metrica"><span>Quiz running count</span><strong>${porcentaje(s.quizRcOk, s.quizRc)} (${s.quizRcOk}/${s.quizRc})</strong></div>
    <div class="metrica"><span>Estimación de barajas</span><strong>${porcentaje(s.quizBarOk, s.quizBar)} (${s.quizBarOk}/${s.quizBar})</strong></div>
    <div class="metrica"><span>Quiz true count</span><strong>${porcentaje(s.quizTcOk, s.quizTcTotal)} (${s.quizTcOk}/${s.quizTcTotal})</strong></div>
    <div class="metrica"><span>Apuestas según la rampa</span><strong>${porcentaje(s.apuestasOk, s.apuestas)} (${s.apuestasOk}/${s.apuestas})</strong></div>
    <div class="requisitos"><strong>Para subir:</strong> ${nivel.textoRequisitos}</div>
    <p class="nota-chica" style="margin-top:12px">Histórico total: ${g.manosJugadas} manos ·
    estrategia ${porcentaje(g.decisionesOk, g.decisiones)} ·
    cuenta ${porcentaje(g.quizRcOk, g.quizRc)} ·
    true count ${porcentaje(g.quizTcOk, g.quizTcTotal)}</p>`;
}

function pintarTablas() {
  const upcards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];
  const duras = config.h17 ? DURAS_H17 : DURAS_S17;
  const suaves = config.h17 ? SUAVES_H17 : SUAVES_S17;
  const pares = config.h17 ? PARES_H17 : PARES_S17;

  function tabla(titulo, filas, etiquetas) {
    let html = `<h3>${titulo}</h3><div class="envoltura-tabla"><table class="tabla-estrategia"><tr><th></th>`;
    upcards.forEach((u) => { html += `<th>${u}</th>`; });
    html += "</tr>";
    etiquetas.forEach(([clave, nombre]) => {
      html += `<tr><th>${nombre}</th>`;
      filas[clave].forEach((c) => {
        const letra = { H: "P", S: "Q", D: "D", Ds: "D", P: "Ñ", Ph: "Ñ*", Rh: "R", Rs: "R", Rp: "R" }[c];
        const clase = { H: "ac-H", S: "ac-S", D: "ac-D", Ds: "ac-D", P: "ac-P", Ph: "ac-P", Rh: "ac-R", Rs: "ac-R", Rp: "ac-R" }[c];
        html += `<td class="${clase}">${letra}</td>`;
      });
      html += "</tr>";
    });
    return html + "</table></div>";
  }

  const filasDuras = [];
  for (let t = 8; t <= 17; t++) filasDuras.push([t, String(t)]);
  const filasSuaves = [];
  for (let t = 13; t <= 20; t++) filasSuaves.push([t, "A," + (t - 11)]);
  const filasPares = [["A", "A,A"], ["10", "10,10"], ["9", "9,9"], ["8", "8,8"], ["7", "7,7"],
    ["6", "6,6"], ["5", "5,5"], ["4", "4,4"], ["3", "3,3"], ["2", "2,2"]];

  $("contenido-tablas").innerHTML = `
    <p><strong>Reglas activas:</strong> ${config.barajas} barajas ·
    dealer ${config.h17 ? "pide con 17 suave (H17)" : "se planta con 17 suave (S17)"} ·
    ${config.das ? "se puede doblar tras dividir" : "sin doblar tras dividir"} ·
    ${config.rendirse ? "con rendición" : "sin rendición"} ·
    BJ paga ${config.pagoBj === 1.5 ? "3:2" : "6:5"}</p>
    <p><strong>P</strong> = pedir · <strong>Q</strong> = quedarse ·
    <strong>D</strong> = doblar (si no se puede, sigue la tabla sin doblar) ·
    <strong>Ñ</strong> = dividir (Ñ* solo si se puede doblar tras dividir) ·
    <strong>R</strong> = rendirse (si no hay rendición, la jugada de respaldo)</p>
    ${tabla("Manos duras (total vs carta del dealer)", duras, filasDuras)}
    ${tabla("Manos suaves", suaves, filasSuaves)}
    ${tabla("Pares", pares, filasPares)}
    <h3>Conteo Hi-Lo</h3>
    <p>2 a 6 valen <strong>+1</strong> · 7 a 9 valen <strong>0</strong> · 10, J, Q, K y As valen <strong>−1</strong>.
    Solo cuentan las cartas que ya se vieron: la carta tapada del dealer se suma hasta que se voltea.</p>
    <p><strong>True count</strong> = running count ÷ barajas que quedan (estímalo con la pila de descarte,
    a la media baraja). Trunca el resultado hacia cero.</p>
    <h3>Rampa de apuesta (niveles 4 y 5)</h3>
    <p>TC +1 o menos: 1 unidad · TC +2: 2 · TC +3: 4 · TC +4: 6 · TC +5 o más: 8.
    Unidad = $${config.unidad} (ajústala en Reglas: lo sano es ~1% de tu banca).
    <strong>Seguro:</strong> solo con TC +3 o más; si no, nunca.</p>`;
}

function abrirConfig() {
  const cfg = configPendiente || config;
  $("cfg-barajas").value = String(cfg.barajas);
  $("cfg-h17").value = cfg.h17 ? "H17" : "S17";
  $("cfg-das").value = cfg.das ? "si" : "no";
  $("cfg-rendirse").value = cfg.rendirse ? "si" : "no";
  $("cfg-pago").value = String(cfg.pagoBj);
  $("cfg-penetracion").value = String(cfg.penetracion);
  $("cfg-bots").value = String(cfg.bots);
  $("cfg-unidad").value = String(cfg.unidad);
  $("modal-config").hidden = false;
}

function guardarConfig() {
  const valoresLeidos = {
    barajas: parseInt($("cfg-barajas").value, 10),
    h17: $("cfg-h17").value === "H17",
    das: $("cfg-das").value === "si",
    rendirse: $("cfg-rendirse").value === "si",
    pagoBj: parseFloat($("cfg-pago").value),
    penetracion: parseFloat($("cfg-penetracion").value),
    bots: parseInt($("cfg-bots").value, 10),
    unidad: parseInt($("cfg-unidad").value, 10),
  };
  $("modal-config").hidden = true;
  if (rondaEnCurso) {
    // No se aplica con cartas en la mesa: queda pendiente hasta la siguiente mano
    configPendiente = valoresLeidos;
    guardar(CLAVE_CONFIG, configPendiente);
    toast("Reglas guardadas — el zapato se baraja al terminar esta mano", "", 2600);
  } else {
    config = valoresLeidos;
    guardar(CLAVE_CONFIG, config);
    crearZapato();
    toast("Reglas guardadas — zapato barajado, la cuenta vuelve a cero", "", 2600);
    prepararApuesta();
  }
  pintarMesa();
}

function guardarProgreso() { guardar(CLAVE_PROGRESO, progreso); }

/* ── Eventos ────────────────────────────────────────────── */

function conectarEventos() {
  document.querySelectorAll(".ficha").forEach((b) => {
    b.addEventListener("click", () => agregarFicha(parseInt(b.dataset.valor, 10)));
  });
  $("btn-limpiar-apuesta").addEventListener("click", () => {
    if (fase !== "APUESTA") return;
    apuesta = 0;
    ui.montoApuesta.textContent = "$0";
    ui.btnRepartir.disabled = true;
  });
  ui.btnRepartir.addEventListener("click", () => {
    if (apuesta > 0 && fase === "APUESTA") iniciarRonda();
  });
  ui.btnPedir.addEventListener("click", () => { if (fase === "JUGANDO") accionPedir(); });
  ui.btnPlantarse.addEventListener("click", () => { if (fase === "JUGANDO") accionPlantarse(); });
  ui.btnDoblar.addEventListener("click", () => { if (fase === "JUGANDO") accionDoblar(); });
  ui.btnDividir.addEventListener("click", () => { if (fase === "JUGANDO") accionDividir(); });
  ui.btnRendirse.addEventListener("click", () => { if (fase === "JUGANDO") accionRendirse(); });
  ui.btnCoach.addEventListener("click", () => {
    if (fase !== "JUGANDO") return;
    if (accionEnCurso) return;
    const mano = manoActiva();
    if (!mano || mano.terminada) return;
    if (mano.cartas.length < 2) return;
    const nivel = NIVELES[progreso.nivel];
    const jugada = jugadaCorrecta(
      mano, manoDealer.cartas[0],
      puedeDividirMano(mano), puedeDoblarMano(mano), puedeRendirseMano(mano));
    ayudaPedida = true;
    ayudaTexto = "Coach: " + NOMBRE_ACCION[jugada];
    if (nivel.coachMuestraCuenta) {
      ayudaTexto += " · cuenta " + signo(runningCount) +
        " (TC " + signo(trueCountExacto()) + ", " +
        barajasRestantesExactas().toFixed(1) + " barajas)";
    }
    pintarMesa();
  });
  $("hud-grupo-nivel").addEventListener("click", () => { pintarProgreso(); $("modal-progreso").hidden = false; });
  $("btn-ojo").addEventListener("click", () => {
    cuentaVisible = !cuentaVisible;
    if (cuentaVisible && progreso.nivel >= 3 && !avisoCuentaDado) {
      avisoCuentaDado = true;
      toast("En la mesa real no existe este ojito — úsalo para verificarte, no para depender de él", "", 3400);
    }
    pintarMesa();
  });
  $("btn-coach-apuesta").addEventListener("click", () => {
    if (fase !== "APUESTA") return;
    ayudaTexto = coachApuesta();
    if (NIVELES[progreso.nivel].calificaApuesta) {
      apuestaSoplada = true;
      apuestaSugerida = unidadesPorTc(tcParaApuesta()) * config.unidad;
    }
    pintarMesa();
  });
  $("btn-seguro-si").addEventListener("click", () => decidirSeguro(true));
  $("btn-seguro-no").addEventListener("click", () => decidirSeguro(false));
  $("btn-siguiente").addEventListener("click", prepararApuesta);

  $("btn-config").addEventListener("click", abrirConfig);
  $("btn-config-guardar").addEventListener("click", guardarConfig);
  $("btn-checklist").addEventListener("click", () => { $("modal-checklist").hidden = false; });
  $("btn-tablas").addEventListener("click", () => { pintarTablas(); $("modal-tablas").hidden = false; });
  $("btn-progreso").addEventListener("click", () => { pintarProgreso(); $("modal-progreso").hidden = false; });
  $("btn-reiniciar-progreso").addEventListener("click", () => {
    if (confirm("¿Borrar todo el progreso y volver al nivel 1?")) {
      progreso = { nivel: 1, banca: BANCA_INICIAL, statsNivel: statsNuevas(), statsGlobal: statsNuevas() };
      guardarProgreso();
      location.reload();
    }
  });
  document.querySelectorAll(".btn-cerrar-modal").forEach((b) => {
    b.addEventListener("click", () => { b.closest(".modal").hidden = true; });
  });
}

/* ── Arranque ───────────────────────────────────────────── */

function iniciar() {
  config = cargar(CLAVE_CONFIG, config);
  const progresoBase = progreso;
  progreso = cargar(CLAVE_PROGRESO, progresoBase);
  progreso.statsNivel = Object.assign(statsNuevas(), progreso.statsNivel);
  progreso.statsGlobal = Object.assign(statsNuevas(), progreso.statsGlobal);

  // Sanear datos de localStorage: pueden venir corruptos o alterados a mano
  if (!Number.isFinite(progreso.banca)) progreso.banca = BANCA_INICIAL;
  if (!Number.isInteger(progreso.nivel) || progreso.nivel < 1 || progreso.nivel > 5) progreso.nivel = 1;
  for (const campo in progreso.statsNivel) {
    if (!Number.isFinite(progreso.statsNivel[campo])) progreso.statsNivel[campo] = 0;
  }
  for (const campo in progreso.statsGlobal) {
    if (!Number.isFinite(progreso.statsGlobal[campo])) progreso.statsGlobal[campo] = 0;
  }
  if (![4, 6, 8].includes(config.barajas)) config.barajas = 6;
  if (!(config.penetracion >= 0.5 && config.penetracion <= 0.9)) config.penetracion = 0.75;
  if (config.pagoBj !== 1.5 && config.pagoBj !== 1.2) config.pagoBj = 1.5;
  config.h17 = !!config.h17;
  config.das = !!config.das;
  config.rendirse = !!config.rendirse;
  if (![0, 1, 2].includes(config.bots)) config.bots = 2;
  if (![50, 100, 200].includes(config.unidad)) config.unidad = 50;

  crearZapato();
  conectarEventos();
  prepararApuesta();

  // Ceremonia de inicio: que se vea que el zapato arranca recién barajado
  ui.mensaje.textContent = "Barajando las " + config.barajas + " barajas — tu cuenta empieza en cero";
  $("pila-descarte").classList.add("barajando");
  setTimeout(() => { $("pila-descarte").classList.remove("barajando"); }, 2600);

  if (progreso.statsGlobal.manosJugadas === 0) {
    toast("Bienvenido. Lleva la cuenta en tu cabeza; si te atoras, el botón Coach te dice la jugada (sin calificarte). Apuesta y reparte.", "", 5600);
  }
}

iniciar();
