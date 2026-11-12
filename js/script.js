/* =========================================================
    ANA NOCTIS — COUNTDOWN
    ========================================================= */

/* =========================================================
   0. ORIGEM / NOTIFICAÇÃO
   ========================================================= */

const parametros = new URLSearchParams(window.location.search);
const origem = parametros.get("origem");

if (origem === "segredo") {
  emailjs
    .send("service_yd4mgxk", "template_4gzu3ls", {
      message: `
        A Ana abriu o contador.
      `,
      message: "A Ana abriu o contador.",
      footer: "O contador foi encontrado.",
    })
    .then(() => {
      console.log("✅ Notificação enviada pelo EmailJS.");
    })
    .catch((error) => {
      console.error("❌ Erro ao enviar pelo EmailJS:", error);
    });
}

/* =========================================================
    1. CONTADOR
    ========================================================= */

/*
    Data final de teste ou oficial.
    Para o aniversário oficial, use 13 de novembro de 2026,
    à meia-noite: new Date(2026, 10, 13, 0, 0, 0)
  */

const dataFinal = new Date(2026, 10, 13, 0, 0, 0);

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

function doisDigitos(numero) {
  return String(numero).padStart(2, "0");
}

function atualizarContador() {
  const agora = new Date();
  const diferenca = dataFinal - agora;

  if (diferenca <= 0) {
    if (elementoDias) elementoDias.textContent = "00";
    if (elementoHoras) elementoHoras.textContent = "00";
    if (elementoMinutos) elementoMinutos.textContent = "00";
    if (elementoSegundos) elementoSegundos.textContent = "00";
    return;
  }

  const totalSegundos = Math.floor(diferenca / 1000);
  const dias = Math.floor(totalSegundos / 86400);
  const horas = Math.floor((totalSegundos % 86400) / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  if (elementoDias) elementoDias.textContent = dias;
  if (elementoHoras) elementoHoras.textContent = doisDigitos(horas);
  if (elementoMinutos) elementoMinutos.textContent = doisDigitos(minutos);
  if (elementoSegundos) elementoSegundos.textContent = doisDigitos(segundos);
}

atualizarContador();
setInterval(atualizarContador, 1000);

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

setTimeout(() => {
  corpo.classList.add("fase-ceu");
}, 100);

setTimeout(() => {
  corpo.classList.add("fase-pontinhos");
}, 2800);

setTimeout(() => {
  corpo.classList.add("fase-orbita");
}, 4800);

setTimeout(() => {
  corpo.classList.add("fase-elementos-orbita");
}, 8200);

setTimeout(() => {
  corpo.classList.add("fase-titulo");
}, 8800);

setTimeout(() => {
  corpo.classList.add("fase-conteudo");
}, 10300);

/* =========================================================
    6. METAMORFOSE DO ANIVERSÁRIO

    Sequência:
    clarão → órbita → estrelas cadentes → mensagem
    → transição → portal → botão
    ========================================================= */

let aniversarioAtivado = false;

function verificarDiaEspecial() {
  const agora = new Date();

  if (agora >= dataFinal && !aniversarioAtivado) {
    aniversarioAtivado = true;

    const flash = document.getElementById("flash-luz");

    // 1. Inicia a cena especial e esconde o contador.
    document.body.classList.add("dia-chegou");

    // 2. Dispara o clarão.
    if (flash) {
      flash.classList.add("animar-flash");
    }

    // 3. Aguarda o clarão e o início do desenho da órbita.
    // A órbita leva cerca de 2,5 s para ser desenhada.
    setTimeout(() => {
      document.body.classList.add("orbita-pronta");

      // 4. Deixa as estrelas cadentes orbitarem antes da mensagem.
      setTimeout(() => {
        document.body.classList.add("mensagem-visivel");

        // 5. Espera a animação de entrada da mensagem terminar.
        // A animação CSS revelar-mensagem dura 1,8 s.
        setTimeout(() => {
          // A órbita e as estrelas somem suavemente.
          document.body.classList.add("transicao-portal");

          // 6. Aguarda a transição de saída de 0,9 s.
          setTimeout(() => {
            // O portal começa a aparecer e a ser desenhado.
            document.body.classList.add("portal-iniciando");

            // 7. Aguarda o desenho do portal antes de liberar o botão.
            setTimeout(() => {
              document.body.classList.add("portal-pronto");
            }, 2400);
          }, 1000);
        }, 1800);
      }, 4500);
    }, 2600);
  }
}

verificarDiaEspecial();
setInterval(verificarDiaEspecial, 1000);

/* =========================================================
    7. BOTÃO "ABRIR"
    ========================================================= */

function abrirSurpresa() {
  const btn = document.getElementById("btn-abrir");

  if (btn) {
    btn.style.pointerEvents = "none";
  }

  document.body.classList.add("saindo-da-tela");

  setTimeout(() => {
    window.location.href = "hb.html";
  }, 800);
}
