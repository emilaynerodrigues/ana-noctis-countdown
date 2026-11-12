/* =========================================================
   ANA NOCTIS — TELA 02 (DIGITAÇÃO, BOLO 2D & ESTRELA FINAL)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  iniciarDigitacaoCarta();
});

/* =========================================================
   1. DIGITAÇÃO LETRA POR LETRA DA CARTA
   ========================================================= */
function iniciarDigitacaoCarta() {
  const elementos = document.querySelectorAll(".typer");
  const btnSoprar = document.getElementById("btn-soprar");

  const textos = [];
  elementos.forEach((el) => {
    textos.push(el.textContent.trim());
    el.textContent = "";
    el.style.opacity = "1";
  });

  function digitarElemento(index) {
    if (index >= elementos.length) {
      if (btnSoprar) btnSoprar.classList.add("revelar-btn");
      return;
    }

    const el = elementos[index];
    const textoOriginal = textos[index];
    let i = 0;

    const velocidade = el.classList.contains("cartinha-titulo") ? 110 : 75;

    const timer = setInterval(() => {
      if (i < textoOriginal.length) {
        el.textContent += textoOriginal.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => digitarElemento(index + 1), 350);
      }
    }, velocidade);
  }

  digitarElemento(0);
}

/* Transição ao clicar em "SOPRAR AS VELAS" */
function acionarSoprarVelas() {
  const cartinha = document.getElementById("cartinha-container");
  const containerBolo = document.getElementById("container-bolo");

  if (cartinha) cartinha.classList.add("esconder");

  setTimeout(() => {
    if (containerBolo) {
      containerBolo.classList.remove("oculto");
      setTimeout(() => containerBolo.classList.add("revelar"), 50);
    }
    iniciarAnimacaoBolo();
  }, 700);
}

/* =========================================================
   2. REVELAÇÃO DA ESTRELA FINAL
   ========================================================= */
let estrelaFinalRevelada = false;

function revelarEstrelaFinal() {
  if (estrelaFinalRevelada) return;
  estrelaFinalRevelada = true;

  const estrela = document.getElementById("estrela-final");
  if (estrela) {
    setTimeout(() => {
      estrela.classList.add("revelar");
    }, 500);
  }
}

/* =========================================================
   3. MOTOR DO BOLO (CANVAS 2D)
   ========================================================= */
function iniciarAnimacaoBolo() {
  const canvas = document.getElementById("bolo-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 800;

  const OY = 56;
  const GAP = 6;
  const SIZES = [9, 10, 11, 12];
  const FONT = "Arial";

  const INTRO = 120;
  const BLOW_GAP = 40;
  const BLOW_N = 26;
  const BITE_GAP = 46;

  const PHRASES = [
    "Happy Birthday", "İyi ki doğdun", "Feliz cumpleaños", "Joyeux anniversaire",
    "Alles Gute zum Geburtstag", "Buon compleanno", "Feliz aniversário", "С днём рождения",
    "생일 축하해요", "お誕生日おめでとう", "生日快乐", "जन्मदिन मुबारक हो",
    "Χρόνια πολλά", "Gefeliciteerd", "Grattis på födelsedagen", "Wszystkiego najlepszego",
    "สุขสันต์วันเกิด", "Chúc mừng sinh nhật", "Selamat ulang tahun", "З днем народження",
    "عيد ميلاد سعيد", "تولدت مبارک", "יום הולדת שמח", "Tillykke med fødselsdagen", "Všechno nejlepší"
  ];

  const PARTS = [
    ["plate", 350, -302, -262, 18, 18],
    ["base", 300, -262, -110, 22, 10],
    ["mid", 225, -110, -5, 22, 0],
    ["top", 150, -5, 85, 20, 0]
  ];

  const TOPS = {};
  const BOTS = {};
  PARTS.forEach((p) => {
    TOPS[p[0]] = p[3];
    BOTS[p[0]] = p[2];
  });

  const CANDLE_X = [-100, -50, 0, 50, 100];
  const CANDLE_Y0 = 96;
  const CANDLE_Y1 = 166;
  const FLAME_Y = 170;

  const PAL = {
    plate: [242, 183, 76],
    base: [204, 30, 107],
    mid: [242, 76, 140],
    top: [255, 140, 178]
  };
  const CREAM = [255, 229, 237];
  const FILL = [255, 204, 140];
  const FLASH = [255, 225, 225];

  function mix(a, b, k) {
    return [
      a[0] + (b[0] - a[0]) * k,
      a[1] + (b[1] - a[1]) * k,
      a[2] + (b[2] - a[2]) * k
    ];
  }
  function dim(c, k) {
    return [c[0] * k, c[1] * k, c[2] * k];
  }
  function clamp(v) {
    return Math.max(0.0, Math.min(1.0, v));
  }
  function rgb(c) {
    return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
  }

  function cy(y) {
    return 400 - (y + OY);
  }
  function cx(x) {
    return 400 + x;
  }

  const YMAX = Math.max(...PARTS.map((p) => p[3]));
  const YMIN = Math.min(...PARTS.map((p) => p[2]));

  function half_w(part, y) {
    const [_, W, y1, y2, Rt, Rb] = part;
    let w = W;
    if (Rt && y > y2 - Rt) {
      let d = y - (y2 - Rt);
      w = W - Rt + Math.sqrt(Math.max(0.0, Rt * Rt - d * d));
    } else if (Rb && y < y1 + Rb) {
      let d = y1 + Rb - y;
      w = W - Rb + Math.sqrt(Math.max(0.0, Rb * Rb - d * d));
    }
    return w;
  }

  function spans(y) {
    for (let part of PARTS) {
      if (part[2] <= y && y < part[3]) {
        let w = half_w(part, y);
        return w > 0 ? [[-w, w]] : [];
      }
    }
    return [];
  }

  function intersect(A, B) {
    let out = [];
    for (let a of A) {
      for (let b of B) {
        let lo = Math.max(a[0], b[0]);
        let hi = Math.min(a[1], b[1]);
        if (hi - lo > 14) out.push([lo, hi]);
      }
    }
    return out;
  }

  function part_of(y) {
    for (let p of PARTS) if (p[2] <= y && y < p[3]) return p[0];
    return "base";
  }

  function drip(part, x) {
    let ph = { base: 0.0, mid: 1.7, top: 3.1 }[part];
    let a = 0.5 + 0.5 * Math.sin(x / 15.0 + ph);
    let b = 0.5 + 0.5 * Math.sin(x / 38.0 + ph * 2);
    return 22 + 26 * a * b;
  }

  function color_for(p) {
    let part = part_of(p.y);
    let base = PAL[part];
    let y = p.y;
    let x = p.x;
    if (part === "plate") {
      base = mix(base, [255, 255, 255], Math.random() * 0.35);
    } else {
      let top = TOPS[part];
      let bot = BOTS[part];
      if (y > top - drip(part, x)) base = mix(CREAM, base, Math.random() * 0.18);
      else if (part !== "base" && y < bot + 16)
        base = mix(FILL, base, Math.random() * 0.25);
      else
        base = mix(
          base,
          [255, 255, 255],
          Math.random() * 0.18 + (p.edge ? 0.15 : 0)
        );
    }
    return base;
  }

  let filaFrases = [];
  function proximaFrase() {
    if (filaFrases.length === 0) {
      filaFrases = [...PHRASES];
      for (let i = filaFrases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filaFrases[i], filaFrases[j]] = [filaFrases[j], filaFrases[i]];
      }
    }
    return filaFrases.pop();
  }

  function build() {
    let items = [];
    let row_h = 15;
    let half = row_h / 2;

    let y = YMAX - half;
    while (y > YMIN + half) {
      let row = intersect(spans(y + half), spans(y - half));
      for (let [lo, hi] of row) {
        lo += 4;
        hi -= 4;
        let cur = lo;
        let line = [];

        while (true) {
          let fit = null;
          for (let tentativa = 0; tentativa < 12; tentativa++) {
            let text = proximaFrase();
            let size =
              tentativa > 5
                ? SIZES[0]
                : SIZES[Math.floor(Math.random() * SIZES.length)];
            ctx.font = `bold ${size}px ${FONT}`;
            let w = ctx.measureText(text).width;
            if (cur + w <= hi) {
              fit = { text, size, w };
              break;
            }
          }
          if (!fit) break;
          line.push({ x: cur + fit.w / 2, text: fit.text, size: fit.size, w: fit.w });
          cur += fit.w + GAP;
        }

        if (line.length === 0) continue;

        if (line.length > 1) {
          let sobra = hi - (line[line.length - 1].x + line[line.length - 1].w / 2);
          for (let i = 0; i < line.length; i++) {
            line[i].x += (sobra * i) / (line.length - 1);
          }
        } else {
          line[0].x = (lo + hi) / 2;
        }

        for (let i = 0; i < line.length; i++) {
          let item = line[i];
          let edge = i === 0 || i === line.length - 1;
          items.push({
            x: item.x,
            y,
            text: item.text,
            size: item.size,
            edge,
            alive: true,
            opacity: 1,
            offX: 0,
            offY: 0,
            flash: 0
          });
        }
      }
      y -= row_h;
    }

    items.forEach((p) => {
      p.baseColor = color_for(p);
      p.color = p.baseColor;
      p.kind = part_of(p.y) === "plate" ? "plate" : "body";
    });

    [-75, -25, 25, 75].forEach((cx) => {
      const c = [235, 10, 30];
      items.push({
        x: cx,
        y: TOPS["top"] - 2,
        text: "●",
        size: 13,
        edge: false,
        baseColor: c,
        color: c,
        kind: "cherry",
        alive: true,
        opacity: 1,
        offX: 0,
        offY: 0,
        flash: 0
      });
    });

    CANDLE_X.forEach((cx, ci) => {
      let k = 0;
      let yy = CANDLE_Y0;
      while (yy <= CANDLE_Y1) {
        let col = k % 2 === 0 ? [255, 235, 242] : [115, 204, 255];
        items.push({
          x: cx,
          y: yy,
          text: "|",
          size: 12,
          edge: false,
          baseColor: col,
          color: col,
          kind: "candle",
          ci,
          alive: true,
          opacity: 1,
          offX: 0,
          offY: 0,
          flash: 0
        });
        yy += 13;
        k++;
      }
    });

    return items;
  }

  const ITEMS = build();
  const EATABLE = ITEMS.filter((p) => p.kind === "body" || p.kind === "cherry");

  const RED = [242, 25, 12];
  const ORANGE = [255, 140, 12];
  const YELLOW = [255, 204, 64];
  const EMBER = [76, 10, 5];

  let flames = CANDLE_X.map((x) => ({
    x,
    alive: true,
    sway: 0,
    h: 24,
    w: 8,
    colorOuter: RED,
    colorInner: YELLOW,
    glowOpacity: 0.18
  }));
  let smoke = [];
  let removals = [];

  function flicker(f) {
    let k = Math.random();
    f.h = 20 + Math.random() * 9;
    f.w = 7 + Math.random() * 3;
    f.sway = -2.5 + Math.random() * 5;
    f.colorOuter = mix(RED, ORANGE, k);
    f.colorInner = mix(ORANGE, YELLOW, 0.3 + Math.random() * 0.7);
    f.glowOpacity = 0.13 + Math.random() * 0.09;
  }

  function blow_step(f, u) {
    f.sway = 14 * Math.pow(u, 1.4) + (-1.5 + Math.random() * 3) * (1 - u);
    f.h = 24 * Math.pow(1 - u, 1.2) + 2 + Math.random() * 4 * (1 - u);
    f.w = 8 * (1 - 0.55 * u);
    f.colorOuter = mix(mix(RED, ORANGE, 0.4), EMBER, u);
    f.colorInner = mix(YELLOW, RED, clamp(u * 1.6));
    f.glowOpacity = 0.17 * Math.pow(1 - u, 1.5);
  }

  function finish_blow(f, ci) {
    f.alive = false;
    let by = cy(FLAME_Y);
    for (let i = 0; i < 4; i++) {
      smoke.push({
        x: f.x + 8,
        y: by - 2,
        f: -Math.floor(Math.random() * 14),
        N: 55 + Math.random() * 25,
        ph: Math.random() * 6,
        drift: 6 + Math.random() * 10
      });
    }
    lift_candle(ci);
  }

  function schedule_removal(p, dx, dy, n, delay = 0) {
    p.alive = false;
    removals.push({ p, f: -delay, N: n, dx, dy });
  }

  function lift_candle(ci) {
    ITEMS.forEach((p) => {
      if (p.kind === "candle" && p.ci === ci && p.alive) {
        schedule_removal(p, 0, -36, 24);
      }
    });
  }

  let eat_done = false;

  function finish_eating() {
    eat_done = true;
    ITEMS.forEach((p) => {
      if (p.kind === "plate" && p.alive) {
        let delay = Math.floor(((p.x + 350) / 700) * 40);
        schedule_removal(
          p,
          -6 + Math.random() * 12,
          20 + Math.random() * 20,
          20 + Math.random() * 8,
          delay
        );
      }
    });
  }

  function bite() {
    let pool = EATABLE.filter((p) => p.alive);
    if (pool.length <= 5) {
      pool.forEach((p) =>
        schedule_removal(
          p,
          -8 + Math.random() * 16,
          16 + Math.random() * 26,
          18 + Math.random() * 8,
          Math.random() * 10
        )
      );
      finish_eating();
      return;
    }
    let th = Math.random() * Math.PI * 2;
    let vx = Math.cos(th);
    let vy = Math.sin(th);
    let ext = pool.reduce(
      (maxP, p) => (p.x * vx + p.y * vy > maxP.x * vx + maxP.y * vy ? p : maxP),
      pool[0]
    );
    let bx = ext.x;
    let by = ext.y;
    let R = 85 + Math.random() * 30;

    pool.forEach((p) => {
      let d =
        Math.hypot((p.x - bx) / 1.6, (p.y - by) * 1.2) +
        (-10 + Math.random() * 20);
      if (d <= R) {
        schedule_removal(
          p,
          -8 + Math.random() * 16,
          16 + Math.random() * 26,
          18 + Math.random() * 8,
          Math.random() * 8
        );
      }
    });
  }

  function shimmer() {
    let vivos = ITEMS.filter((p) => p.alive && p.kind !== "candle");
    if (!vivos.length) return;
    let p = vivos[Math.floor(Math.random() * vivos.length)];
    p.flash = 16;
  }

  let fr = 0;
  function blow_t0(i) {
    return INTRO + i * BLOW_GAP;
  }

  const EAT_START = blow_t0(CANDLE_X.length - 1) + BLOW_N + 45;

  function tick() {
    fr++;
    ctx.clearRect(0, 0, 800, 800);

    flames.forEach((f, i) => {
      let t0 = blow_t0(i);
      if (fr < t0) {
        if (fr % 5 === 0) flicker(f);
      } else if (fr < t0 + BLOW_N) {
        if (f.alive) blow_step(f, (fr - t0) / BLOW_N);
      } else if (fr === t0 + BLOW_N && f.alive) {
        finish_blow(f, i);
      }
    });

    smoke = smoke.filter((sm) => {
      sm.f++;
      if (sm.f <= 0) return true;
      let u = clamp(sm.f / sm.N);
      let x = cx(sm.x + sm.drift * u + 5 * Math.sin(u * 7 + sm.ph));
      let y = sm.y - 60 * u;
      let rad = 2 + 8 * u;
      ctx.fillStyle = `rgba(180,180,195,${0.75 * Math.pow(1 - u, 1.3)})`;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
      return u < 1;
    });

    if (fr >= EAT_START && !eat_done && (fr - EAT_START) % BITE_GAP === 0) bite();
    if (fr % 14 === 0 && !eat_done) shimmer();

    removals = removals.filter((rm) => {
      rm.f++;
      if (rm.f <= 0) return true;
      let u = clamp(rm.f / rm.N);
      let p = rm.p;
      p.offX = rm.dx * u;
      p.offY = rm.dy * (rm.dy > 0 ? u * u : 1 - Math.pow(1 - u, 2));
      p.opacity = 1 - u;
      return u < 1;
    });

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ITEMS.forEach((p) => {
      if (!p.alive && p.opacity <= 0) return;
      let px = cx(p.x + p.offX);
      let py = cy(p.y) + p.offY;

      if (p.flash > 0) {
        p.color = mix(p.baseColor, FLASH, (p.flash / 16) * 0.65);
        p.flash--;
      } else {
        p.color = p.baseColor;
      }

      ctx.globalAlpha = Math.max(0, p.opacity);

      // 1. Sombra
      ctx.font = `bold ${p.size}px ${FONT}`;
      ctx.fillStyle = rgb(dim(p.color, 0.3));
      ctx.fillText(p.text, px + 2, py + 3);

      // 2. Halo de volume
      ctx.font = `bold ${p.size + 1}px ${FONT}`;
      ctx.fillStyle = rgb(dim(p.color, 0.22));
      ctx.fillText(p.text, px, py);

      // 3. Texto principal
      ctx.font = `bold ${p.size}px ${FONT}`;
      ctx.fillStyle = rgb(p.color);
      ctx.fillText(p.text, px, py);
    });
    ctx.globalAlpha = 1.0;

    flames.forEach((f) => {
      if (!f.alive) return;
      let bx = cx(f.x);
      let by = cy(FLAME_Y);
      let sway = f.sway || 0;

      let gRad = 28;
      let gradGlow = ctx.createRadialGradient(bx, by - 10, 2, bx, by - 10, gRad);
      gradGlow.addColorStop(0, `rgba(255,140,12,${f.glowOpacity})`);
      gradGlow.addColorStop(1, "rgba(255,140,12,0)");
      ctx.fillStyle = gradGlow;
      ctx.beginPath();
      ctx.arc(bx, by - 10, gRad, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = rgb(f.colorOuter);
      ctx.beginPath();
      ctx.ellipse(
        bx + sway,
        by - f.h / 2,
        Math.max(1, f.w),
        Math.max(1, f.h / 2),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = rgb(f.colorInner);
      ctx.beginPath();
      ctx.ellipse(
        bx + sway * 0.6,
        by - f.h * 0.3,
        Math.max(1, f.w * 0.45),
        Math.max(1, f.h * 0.28),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    if (eat_done && removals.length === 0 && smoke.length === 0) {
      revelarEstrelaFinal();
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}