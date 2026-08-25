function tickClock() {
  document.querySelectorAll(".time, .mcc-time").forEach((el) => {
    el.textContent = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  });
}

function bindVideos() {
  document.querySelectorAll(".vidwin video, .hellomov video").forEach((video) => {
    const play = () => video.play().catch(() => {});
    const pause = () => {
      video.pause();
      video.currentTime = 0;
    };
    const host = video.closest(".vidwin, .win-wrap, .hellomov") || video;
    host.addEventListener("mouseenter", play);
    host.addEventListener("mouseleave", pause);
    host.addEventListener("click", play);
  });
}

function bindDrag() {
  document.querySelectorAll(".vidwin, .m-decor, .abs.win-wrap").forEach((el) => {
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
  document.querySelector(".hero-modal-backdrop")?.remove();

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

function bindNav() {
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("nav-menu-open");
    toggle.setAttribute("aria-expanded", document.documentElement.classList.contains("nav-menu-open"));
  });
}

tickClock();
setInterval(tickClock, 30_000);
bindVideos();
bindDrag();
bindModals();
bindNowPlaying();
bindEasterAudio();
bindNav();
