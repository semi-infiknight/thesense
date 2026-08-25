function tickClock() {
  document.querySelectorAll(".time, .mcc-time").forEach((el) => {
    el.textContent = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  });
}

function bindVideos() {
  document.querySelectorAll(".hero > video.abs").forEach((video) => {
    video.play().catch(() => {});
  });
}

const FOCUS_ANCHORS = {
  fystack: "top-left",
  "nova-link": "bottom-left",
  "magicblock-thailand": "top-center",
  "hackseasons": "top-right",
  "intern-cooked": "top-right",
  "mikado-defi": "bottom-left",
  "mikado-yield": "bottom-right",
  "nova-launch": "bottom-right",
  "magicblock-apply": "bottom-left",
};

function focusAnchor(wrap) {
  const caption = wrap.querySelector(".win-caption")?.textContent || "";
  for (const [key, anchor] of Object.entries(FOCUS_ANCHORS)) {
    if (caption.includes(key)) return anchor;
  }
  return "top-left";
}

function syncVideoFocus() {
  const active = document.querySelector(".vidwin.video-active, #big-video.video-active");
  document.body.classList.toggle("video-focus", !!active);
}

function bindVideoFocus() {
  let bigVideoWasPlaying = false;
  let resumeBigVideoTimer = null;

  document.querySelectorAll(".vidwin").forEach((wrap) => {
    const screen = wrap.querySelector(".screen");
    const video = screen?.querySelector("video");
    const win = wrap.querySelector(".win") || wrap;
    if (!screen || !video) return;

    const baseW = parseFloat(screen.style.width) || screen.getBoundingClientRect().width;
    const baseH = parseFloat(screen.style.height) || screen.getBoundingClientRect().height;
    const growW = baseW * 0.5;
    const growH = baseH * 0.5;
    const anchor = focusAnchor(wrap);

    let shiftX = 0;
    let shiftY = 0;
    if (anchor === "top-center") shiftX = -growW / 2;
    else if (anchor === "top-right") shiftX = -growW;
    else if (anchor === "bottom-left") shiftY = -growH;
    else if (anchor === "bottom-right") {
      shiftX = -growW;
      shiftY = -growH;
    }

    let active = false;
    let anim = 0;
    let progress = 0;

    const tick = () => {
      anim = 0;
      const target = active ? 1 : 0;
      progress += (target - progress) * 0.22;
      if (Math.abs(target - progress) > 0.0015) anim = requestAnimationFrame(tick);
      else progress = target;

      screen.style.width = `${baseW + growW * progress}px`;
      screen.style.height = `${baseH + growH * progress}px`;
      wrap.style.transform = progress
        ? `translate(${shiftX * progress}px, ${shiftY * progress}px)`
        : "";
    };

    const setFocus = (on) => {
      if (on === active) return;
      active = on;
      wrap.classList.toggle("video-active", on);
      syncVideoFocus();

      if (on) {
        clearTimeout(resumeBigVideoTimer);
        const bigVid = document.querySelector("#big-video video");
        if (bigVid && !bigVid.paused) {
          bigVid.pause();
          bigVideoWasPlaying = true;
        }
        const canUnmute = navigator.userActivation?.hasBeenActive;
        video.muted = !canUnmute;
        video.volume = 1;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      } else {
        video.pause();
        clearTimeout(resumeBigVideoTimer);
        resumeBigVideoTimer = setTimeout(() => {
          if (!document.querySelector(".vidwin.video-active, #big-video.video-active") && bigVideoWasPlaying) {
            bigVideoWasPlaying = false;
            document.querySelector("#big-video video")?.play().catch(() => {});
          }
        }, 80);
      }

      if (!anim) anim = requestAnimationFrame(tick);
    };

    win.addEventListener("mouseenter", () => setFocus(true));
    win.addEventListener("mouseleave", () => setFocus(false));

    screen.addEventListener("click", (e) => {
      if (e.target.closest(".win-zoom-btn")) return;
      e.stopPropagation();
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    });
  });

  const bigWrap = document.getElementById("big-video");
  const bigVid = bigWrap?.querySelector("video");
  const hellomov = bigWrap?.querySelector(".hellomov");
  if (!bigWrap || !bigVid || !hellomov) return;

  let bigActive = false;

  const setBigFocus = (on) => {
    if (on === bigActive) return;
    bigActive = on;
    bigWrap.classList.toggle("video-active", on);
    syncVideoFocus();

    if (on) {
      clearTimeout(resumeBigVideoTimer);
      document.querySelectorAll(".vidwin.video-active").forEach((w) => w.classList.remove("video-active"));
      bigVid.muted = true;
      bigVid.play().catch(() => {});
    } else {
      bigVid.pause();
    }
  };

  hellomov.addEventListener("mouseenter", () => setBigFocus(true));
  hellomov.addEventListener("mouseleave", () => setBigFocus(false));
  hellomov.addEventListener("click", (e) => {
    if (e.target.closest(".win-zoom-btn")) return;
    e.stopPropagation();
    if (bigVid.paused) bigVid.play().catch(() => {});
    else bigVid.pause();
  });
}

function bindDrag() {
  document.querySelectorAll(".hero .abs, .hero .win-wrap").forEach((el) => {
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
bindVideoFocus();
bindDrag();
bindModals();
bindNowPlaying();
bindEasterAudio();
bindNav();
