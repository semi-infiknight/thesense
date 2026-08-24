const DMG =
  "https://github.com/farzaa/clicky-releases/releases/latest/download/HeyClicky.dmg";

function tickClock() {
  document.querySelectorAll(".time, .mcc-time").forEach((el) => {
    el.textContent = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  });
}

function buildFeatures() {
  const root = document.getElementById("feat-rows");
  if (!root || root.children.length) return;

  const wave = () => {
    let bars = "";
    for (let i = 0; i < 12; i++) bars += `<i style="--bx:${1 - 18 * i}px"></i>`;
    return `<div class="feat-wave"><div class="wbars">${bars}</div></div>`;
  };

  const trans = (color, title, copy) => `
    <div class="feat-trans reveal rv-late">
      ${wave()}
      <div class="feat-mid">
        <div class="feat-pill ${color}">
          <span>heyclicky</span>
          <div class="gl no-drag"></div>
        </div>
      </div>
      <div class="feat-copy">
        <p class="feat-h">${title}</p>
        <p class="feat-d">${copy}</p>
      </div>
    </div>`;

  const win = (src, caption) => `
    <div class="feat-win reveal">
      <div class="feat-desktop">
        <img class="bg no-drag" loading="lazy" decoding="async" src="/assets/f-window.avif" alt="">
        <div class="feat-fig">
          <div class="bar">
            <div class="dots">
              <img class="no-drag" src="/assets/win-close.png" alt="">
              <img class="no-drag" src="/assets/win-min.png" alt="">
              <img class="no-drag" src="/assets/win-zoom.png" alt="">
            </div>
            <div class="t">${caption}</div>
          </div>
          <div class="canvas">
            <video class="no-drag" src="/assets/${src}.mp4" poster="/assets/${src}-poster.webp" muted loop playsinline preload="none"></video>
          </div>
        </div>
      </div>
    </div>`;

  const row = (html) => {
    const el = document.createElement("div");
    el.className = "feat-row";
    el.innerHTML = html;
    return el;
  };
  const divider = () => {
    const el = document.createElement("div");
    el.className = "feat-divider";
    el.setAttribute("aria-hidden", "true");
    return el;
  };

  const a = row(
    trans(
      "blue",
      "finally do the thing",
      "from fl studio to claude code, jump into any tool, ask questions and heyclicky draws on your screen and teaches you.",
    ) + win("clicky-fl", "FL Studio"),
  );
  const b = row(
    win("clicky-spatial", "Preview") +
      trans(
        "orange",
        "use your screen as context",
        "if you hit a wall, you can show heyclicky and it'll walk you through the next step.",
      ),
  );
  const c = row(
    trans(
      "teal",
      "spawn agents with your voice",
      "we let you spawn ai agents with just your voice no terminal needed. connect your gmail or notion and start doing stuff.",
    ) + win("clicky-agent", "Google Sheets"),
  );
  a.dataset.req = "heyclicky, help me make music on FLStudio";
  b.dataset.req = "heyclicky, what's this muscle called?";
  c.dataset.req = "heyclicky, find 10 tiktok creators perfect for my business";
  b.classList.add("align-right");
  root.append(a, divider(), b, divider(), c);
  animateWaves(root);
  typePills(root);
}

function animateWaves(root) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  const rows = [...root.querySelectorAll(".feat-row")].map((row, i) => ({
    bars: [...row.querySelectorAll(".feat-wave .wbars i")],
    seed: i * 2.1,
  }));
  const floor = 8 / 28;
  let t = 0;
  const loop = () => {
    t += 0.035;
    rows.forEach(({ bars, seed }) => {
      bars.forEach((bar, a) => {
        const h = Math.max(
          floor,
          Math.min(
            1,
            floor +
              0.92 *
                Math.pow(
                  Math.abs(
                    0.46 * Math.sin(t * 1.4 + 1.1 * a + seed) +
                      0.33 * Math.sin(t * 0.9 + 1.9 * a + seed) +
                      0.25 * Math.sin(t * 2.1 - 0.7 * a),
                  ),
                  0.78,
                ),
          ),
        );
        bar.style.height = `${(h * 100).toFixed(1)}%`;
      });
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function typePills(root) {
  root.querySelectorAll(".feat-row").forEach((row) => {
    const pill = row.querySelector(".feat-pill span");
    const req = row.dataset.req;
    if (!pill || !req) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        pill.classList.add("typing");
        let i = 0;
        const tick = () => {
          i += 1;
          pill.textContent = req.slice(0, i);
          if (i < req.length) setTimeout(tick, 28);
          else pill.classList.remove("typing");
        };
        setTimeout(tick, 240);
      },
      { threshold: 0.35 },
    );
    io.observe(row);
  });
}

function bindFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const toggle = () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");
        other.setAttribute("aria-expanded", "false");
        const wrap = other.querySelector(".faq-a-wrap");
        if (wrap) {
          wrap.style.gridTemplateRows = "0fr";
          wrap.style.opacity = "0";
        }
      });
      if (!open) {
        item.classList.add("open");
        item.setAttribute("aria-expanded", "true");
        const wrap = item.querySelector(".faq-a-wrap");
        if (wrap) {
          wrap.style.gridTemplateRows = "1fr";
          wrap.style.opacity = "1";
        }
      }
    };
    item.addEventListener("click", toggle);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function bindPricing() {
  const month = document.querySelector(".pr-seg-month");
  const year = document.querySelector(".pr-seg-year");
  if (!month || !year) return;
  const notes = {
    month: ["free forever, no card needed", "per month, billed monthly", "per month, billed monthly"],
    year: ["free forever, no card needed", "per month, billed yearly", "per month, billed yearly"],
  };
  const prices = { month: ["$0", "$20", "$100"], year: ["$0", "$16", "$80"] };
  const set = (period) => {
    month.classList.toggle("on", period === "month");
    year.classList.toggle("on", period === "year");
    month.setAttribute("aria-selected", String(period === "month"));
    year.setAttribute("aria-selected", String(period === "year"));
    document.querySelectorAll(".pr-card").forEach((card, i) => {
      const slot = card.querySelector(".pr-price-slot");
      const note = card.querySelector(".pr-price-note");
      const value = prices[period][i];
      if (slot) {
        slot.setAttribute("aria-label", value);
        slot.innerHTML = [...value]
          .map(
            (ch) =>
              `<span class="pr-price-col" aria-hidden="true"><span class="pr-price-char">${ch}</span></span>`,
          )
          .join("");
      }
      if (note) note.textContent = notes[period][i];
    });
  };
  month.addEventListener("click", () => set("month"));
  year.addEventListener("click", () => set("year"));
}

function bindVideos() {
  document.querySelectorAll(".vidwin video, .hellomov video, .feat-fig video").forEach((video) => {
    const play = () => video.play().catch(() => {});
    const pause = () => {
      video.pause();
      video.currentTime = 0;
    };
    const host = video.closest(".vidwin, .win-wrap, .feat-fig, .hellomov") || video;
    host.addEventListener("mouseenter", play);
    host.addEventListener("mouseleave", pause);
    host.addEventListener("click", play);
  });

  const arches = document.querySelector(".man-arches-vid, .man-arches video");
  if (arches) {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) arches.play().catch(() => {});
      else arches.pause();
    });
    io.observe(arches);
  }
}

function bindDrag() {
  document.querySelectorAll(".vidwin, .m-decor, .abs.win-wrap").forEach((el) => {
    if (el.classList.contains("no-fade") && el.id === "hero-center") return;
    if (el.id === "hero-center" || el.classList.contains("headline-wrap")) return;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;
    let dragging = false;
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a,button,.win-zoom-btn,.folder-btn")) return;
      dragging = true;
      el.classList.add("dragging");
      sx = e.clientX;
      sy = e.clientY;
      ox = parseFloat(el.style.left) || el.offsetLeft;
      oy = parseFloat(el.style.top) || el.offsetTop;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      el.style.left = `${ox + (e.clientX - sx)}px`;
      el.style.top = `${oy + (e.clientY - sy)}px`;
    });
    const end = () => {
      dragging = false;
      el.classList.remove("dragging");
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  });
}

function modal({ title, body }) {
  const existing = document.querySelector(".hero-modal-backdrop");
  existing?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "hero-modal-backdrop";
  backdrop.innerHTML = `
    <div class="win hero-modal" role="dialog" aria-modal="true">
      <div class="bar">
        <div class="dots">
          <button type="button" class="hero-modal-dot" aria-label="Close"><img src="/assets/win-close.png" alt=""></button>
          <img src="/assets/win-min.png" alt="">
          <img src="/assets/win-zoom.png" alt="">
        </div>
        <div class="hero-modal-title">${title}</div>
        <img src="/assets/win-x.svg" alt="">
      </div>
      <div class="hero-modal-screen">${body}</div>
    </div>`;
  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector(".hero-modal-dot")?.addEventListener("click", close);
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", onKey);
    }
  });
  document.body.append(backdrop);
}

function bindModals() {
  document.querySelectorAll(".folder-btn").forEach((btn, i) => {
    const open = () => {
      if (i === 0 || (btn.getAttribute("aria-label") || "").includes("team")) {
        modal({
          title: "the-ogs.png",
          body: `<img src="/assets/hero-modal-team.avif" alt="the heyclicky team">`,
        });
      } else {
        modal({
          title: "heyclicky-trailer.mov",
          body: `<video src="/assets/hero-modal-trailer.mp4" autoplay controls playsinline></video>`,
        });
      }
    };
    btn.addEventListener("click", open);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") open();
    });
  });

  document.querySelectorAll(".win-zoom-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wrap = btn.closest(".vidwin, .win-wrap");
      const video = wrap?.querySelector("video");
      const caption = wrap?.querySelector(".win-caption")?.textContent || "clip.mov";
      if (!video) return;
      modal({
        title: caption,
        body: `<video src="${video.getAttribute("src")}" poster="${video.getAttribute("poster") || ""}" autoplay controls playsinline></video>`,
      });
    });
  });

  document.querySelector(".footer-folder-btn")?.addEventListener("click", () => {
    modal({
      title: "heyclicky-demo.mov",
      body: `<video src="/assets/hero-modal-trailer.mp4" autoplay controls playsinline></video>`,
    });
  });

  document.querySelector(".footer-mark-egg")?.addEventListener("click", () => {
    modal({
      title: "heyclicky-heals.mov",
      body: `<video src="/assets/footer-heal.mp4" autoplay controls playsinline></video>`,
    });
  });
}

function bindNowPlaying() {
  const btn = document.querySelector(".np-btn, .np-play");
  if (!btn) return;
  let audio;
  const play = () => {
    if (!audio) {
      audio = new Audio("/assets/phone-song.m4a");
      audio.loop = true;
    }
    const item = btn.closest(".status-item");
    if (audio.paused) {
      audio.play().catch(() => {});
      item?.classList.add("playing");
      btn.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      item?.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
    }
  };
  document.querySelectorAll(".np-btn, .np-play").forEach((el) => el.addEventListener("click", play));
}

function bindEasterAudio() {
  const bind = (sel, src) => {
    const el = document.querySelector(sel);
    if (!el) return;
    let audio;
    el.addEventListener("click", () => {
      if (!audio) audio = new Audio(src);
      if (audio.paused) audio.play().catch(() => {});
      else {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };
  bind(".m-phone", "/assets/phone-song.m4a");
  bind(".m-pika", "/assets/pika-song.m4a");
}

function bindReveal() {
  if (!document.getElementById("feat-rows")) return;
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("rvg-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll(".reveal, .feat-row, .pr-card, .faq-item").forEach((el) => io.observe(el));
}

function bindNav() {
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      document.querySelector(el.getAttribute("data-scroll"))?.scrollIntoView({ behavior: "smooth" });
    });
  });
  document.querySelectorAll('a[href="/index.html#feat"], a[href="#feat"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      if (location.pathname.endsWith("index.html") || location.pathname === "/") {
        e.preventDefault();
        document.querySelector("#feat")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  document.querySelectorAll('a[href="/index.html#pr"], a[href="#pr"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      if (location.pathname.endsWith("index.html") || location.pathname === "/") {
        e.preventDefault();
        document.querySelector("#pr")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("nav-menu-open");
    toggle.setAttribute("aria-expanded", document.documentElement.classList.contains("nav-menu-open"));
  });
}

function bindParallax() {
  const layer = document.querySelector(".pr-parallax");
  if (!layer) return;
  const onScroll = () => {
    const rect = layer.parentElement.getBoundingClientRect();
    const y = Math.max(-24, Math.min(48, (rect.top - 120) * 0.08));
    layer.style.transform = `translateY(${y}px)`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function bindSkyFallback() {
  const canvas = document.querySelector("canvas.pricing-sky");
  if (!canvas) return;
  const img = document.createElement("img");
  img.className = "pricing-sky";
  img.src = "/assets/pr-sky.webp";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  canvas.replaceWith(img);
}

function bindJoin() {
  document.querySelectorAll(".fb-banner-link").forEach((a) => {
    a.setAttribute("href", DMG);
  });
}

tickClock();
setInterval(tickClock, 30_000);
buildFeatures();
bindFaq();
bindPricing();
bindVideos();
bindDrag();
bindModals();
bindNowPlaying();
bindEasterAudio();
bindReveal();
bindNav();
bindParallax();
bindSkyFallback();
bindJoin();
