/* =========================================================
   ANA NOCTIS — COUNTDOWN
   ========================================================= */


/* =========================================================
   0. ORIGEM / NOTIFICAÇÃO
   ========================================================= */

const parametros = new URLSearchParams(window.location.search);
const origem = parametros.get("origem");

console.log("Origem:", origem);

if (origem === "segredo") {

  emailjs
    .send("service_yd4mgxk", "template_4gzu3ls", {
      message: "A Ana abriu o contador.",
      footer: "O contador foi encontrado.",
    })
    .then(() => {
      console.log("✅ Notificação enviada pelo EmailJS.");
    })
    .catch((error) => {
      console.error(
        "❌ Erro ao enviar pelo EmailJS:",
        error
      );
    });

}


/* =========================================================
   1. CONTADOR
   ========================================================= */

/*
   Data final:
   13 de novembro de 2026
   Horário:
   00:00:00
*/

const dataFinal = new Date(
  2026,
  10,
  13,
  0,
  0,
  0
);


/*
   Elementos do contador
*/

const elementoDias =
  document.getElementById("dias");

const elementoHoras =
  document.querySelector(
    ".time:nth-of-type(1) .time-titulo"
  );

const elementoMinutos =
  document.querySelector(
    ".time:nth-of-type(2) .time-titulo"
  );

const elementoSegundos =
  document.querySelector(
    ".time:nth-of-type(3) .time-titulo"
  );


/*
   Coloca sempre dois dígitos.
*/

function doisDigitos(numero) {

  return String(numero).padStart(2, "0");

}


/*
   Atualiza o contador.
*/

function atualizarContador() {

  const agora = new Date();

  const diferenca =
    dataFinal - agora;


  if (diferenca <= 0) {

    elementoDias.textContent = "00";
    elementoHoras.textContent = "00";
    elementoMinutos.textContent = "00";
    elementoSegundos.textContent = "00";

    return;

  }


  const totalSegundos =
    Math.floor(diferenca / 1000);


  const dias =
    Math.floor(
      totalSegundos / 86400
    );


  const horas =
    Math.floor(
      (totalSegundos % 86400) / 3600
    );


  const minutos =
    Math.floor(
      (totalSegundos % 3600) / 60
    );


  const segundos =
    totalSegundos % 60;


  elementoDias.textContent =
    dias;

  elementoHoras.textContent =
    doisDigitos(horas);

  elementoMinutos.textContent =
    doisDigitos(minutos);

  elementoSegundos.textContent =
    doisDigitos(segundos);

}


/*
   Primeira atualização imediata.
*/

atualizarContador();


/*
   Continua atualizando a cada segundo.
*/

setInterval(
  atualizarContador,
  1000
);


/* =========================================================
   2. ESTRELAS DO CÉU
   ========================================================= */

const estrelasDoCeu =
  document.querySelectorAll(
    "#ceu #estrelas > *"
  );


estrelasDoCeu.forEach(
  (estrela) => {

    const duracao =
      2.5 + Math.random() * 2.5;

    const atraso =
      Math.random() * 2;


    estrela.style.setProperty(
      "--duracao-estrela",
      `${duracao}s`
    );


    estrela.style.setProperty(
      "--atraso-estrela",
      `${atraso}s`
    );

  }
);


/* =========================================================
   3. PONTINHOS DOURADOS
   ========================================================= */

const pontinhos =
  document.querySelectorAll(
    "#pontinhos circle"
  );


pontinhos.forEach(
  (pontinho) => {

    const duracao =
      3 + Math.random() * 4;

    const atraso =
      Math.random() * 3;


    pontinho.style.setProperty(
      "--duracao-pontinho",
      `${duracao}s`
    );


    pontinho.style.setProperty(
      "--atraso-pontinho",
      `${atraso}s`
    );

  }
);


/* =========================================================
   4. ÓRBITA
   ========================================================= */

const orbita =
  document.querySelector(
    "#orbita path"
  );


if (orbita) {

  orbita.setAttribute(
    "pathLength",
    "1"
  );


  orbita.style.strokeDasharray =
    "1";


  orbita.style.strokeDashoffset =
    "1";

}


/* =========================================================
   5. SEQUÊNCIA DA INTRODUÇÃO
   ========================================================= */

const corpo =
  document.body;


/*
   FASE 1 — CÉU
*/

setTimeout(() => {

  corpo.classList.add(
    "fase-ceu"
  );

}, 100);


/*
   FASE 2 — PONTINHOS
*/

setTimeout(() => {

  corpo.classList.add(
    "fase-pontinhos"
  );

}, 2800);


/*
   FASE 3 — ÓRBITA
*/

setTimeout(() => {

  corpo.classList.add(
    "fase-orbita"
  );

}, 4800);


/*
   FASE 4 — ELEMENTOS DA ÓRBITA
*/

setTimeout(() => {

  corpo.classList.add(
    "fase-elementos-orbita"
  );

}, 8200);


/*
   FASE 5 — TÍTULO
*/

setTimeout(() => {

  corpo.classList.add(
    "fase-titulo"
  );

}, 8800);


/*
   FASE 6 — CONTADOR
*/

setTimeout(() => {

  corpo.classList.add(
    "fase-conteudo"
  );

}, 10300);
