/* =========================================================
   ANA NOCTIS — COUNTDOWN
   ========================================================= */

/* =========================================================
   1. CONTADOR & METAMORFOSE
   ========================================================= */

/*
   Data final:
   13 de novembro de 2026
   Horário:
   00:00:00
*/
const dataFinal = new Date(2026, 10, 13, 0, 0, 0);

/*
   Elementos do contador e controle
*/
const elementoDias = document.getElementById("dias");
const elementoHoras = document.querySelector(
  ".time:nth-of-type(1) .time-titulo",
);
const elementoMinutos = document.querySelector(
  ".time:nth-of-type(2) .time-titulo",
);
const elementoSegundos = document.querySelector(
  ".time:nth-of-type(3) .time-titulo",
);

let metamorfoseIniciada = false;

/*
   Coloca sempre dois dígitos.
*/
function doisDigitos(numero) {
  return String(numero).padStart(2, "0");
}

/*
   Atualiza o contador e dispara a transição no dia 13.
*/
function atualizarContador() {
  const agora = new Date();
  const diferenca = dataFinal - agora;

  if (diferenca <= 0) {
    elementoDias.textContent = "00";
    elementoHoras.textContent = "00";
    elementoMinutos.textContent = "00";
    elementoSegundos.textContent = "00";

    clearInterval(intervaloContador);

    if (!metamorfoseIniciada) {
      metamorfoseIniciada = true;
      iniciarMetamorfose();
    }
    return;
  }

  const totalSegundos = Math.floor(diferenca / 1000);
  const dias = Math.floor(totalSegundos / 86400);
  const horas = Math.floor((totalSegundos % 86400) / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  elementoDias.textContent = doisDigitos(dias);
  elementoHoras.textContent = doisDigitos(horas);
  elementoMinutos.textContent = doisDigitos(minutos);
  elementoSegundos.textContent = doisDigitos(segundos);
}

/*
   Primeira atualização imediata e intervalo contínuo.
*/
atualizarContador();
const intervaloContador = setInterval(atualizarContador, 1000);

/* =========================================================
   2. ESTRELAS DO CÉU
   ========================================================= */
const estrelasDoCeu = document.querySelectorAll("#ceu #estrelas > *");

estrelasDoCeu.forEach((estrela) => {
  const duracao = 2.5 + Math.random() * 2.5;
  const atraso = Math.random() * 2;

  estrela.style.setProperty("--duracao-estrela", `${duracao}s`);
  estrela.style.setProperty("--atraso-estrela", `${atraso}s`);
});

/* =========================================================
   3. PONTINHOS DOURADOS
   ========================================================= */
const pontinhos = document.querySelectorAll("#pontinhos circle");

pontinhos.forEach((pontinho) => {
  const duracao = 3 + Math.random() * 4;
  const atraso = Math.random() * 3;

  pontinho.style.setProperty("--duracao-pontinho", `${duracao}s`);
  pontinho.style.setProperty("--atraso-pontinho", `${atraso}s`);
});

/* =========================================================
   4. ÓRBITA
   ========================================================= */
const orbita = document.querySelector("#orbita path");

if (orbita) {
  orbita.setAttribute("pathLength", "1");
  orbita.style.strokeDasharray = "1";
  orbita.style.strokeDashoffset = "1";
}

/* =========================================================
   5. SEQUÊNCIA DA INTRODUÇÃO
   ========================================================= */
const corpo = document.body;

/* FASE 1 — CÉU */
setTimeout(() => {
  corpo.classList.add("fase-ceu");
}, 100);

/* FASE 2 — PONTINHOS */
setTimeout(() => {
  corpo.classList.add("fase-pontinhos");
}, 2800);

/* FASE 3 — ÓRBITA */
setTimeout(() => {
  corpo.classList.add("fase-orbita");
}, 4800);

/* FASE 4 — ELEMENTOS DA ÓRBITA */
setTimeout(() => {
  corpo.classList.add("fase-elementos-orbita");
}, 8200);

/* FASE 5 — TÍTULO */
setTimeout(() => {
  corpo.classList.add("fase-titulo");
}, 8800);

/* FASE 6 — CONTADOR */
setTimeout(() => {
  corpo.classList.add("fase-conteudo");
}, 10300);

/* =========================================================
   6. SEQUÊNCIA DA METAMORFOSE (DIA 13)
   ========================================================= */
function iniciarMetamorfose() {
  const flash = document.getElementById("flash-luz");

  // 1. Esconde o contador antigo e acelera a rotação das órbitas
  corpo.classList.add("fase-metamorfose");

  // 2. Após 1.5s, aciona a explosão de luz (flash)
  setTimeout(() => {
    if (flash) {
      flash.classList.add("animar-flash");
    }

    // 3. No pico do clarão (1s depois), ativa o portal e revela a tela final
    setTimeout(() => {
      corpo.classList.remove("fase-metamorfose");
      corpo.classList.add("fase-portal");
    }, 1000);
  }, 1500);
}

/*
   Ação do botão "ABRIR" da tela final.
*/
function abrirSurpresa() {
  window.location.href = "tela-02.html";
}
