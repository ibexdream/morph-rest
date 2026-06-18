const header = document.querySelector("[data-header]");
const hotspots = document.querySelectorAll(".hotspot");
const dreamText = document.querySelector("[data-dream-text]");
const dreamField = document.querySelector("[data-dream-field]");

const parts = {
  cap: {
    kicker: "Top cap",
    title: "Neural Interface",
    description:
      "Concentric dry-contact electrodes read your brainwaves through the night. The textured surface sits flush against the temple.",
  },
  mainboard: {
    kicker: "Mainboard",
    title: "On-Device AI",
    description:
      "A low-power neural co-processor classifies your sleep stage in real time and runs the dream-shaping engine locally. Nothing leaves the device.",
  },
  cell: {
    kicker: "LIR1254 cell",
    title: "All-Night Power",
    description:
      "A 3.6V rechargeable micro-cell delivers a full night of sensing and stimulation on a single charge.",
  },
  ring: {
    kicker: "Retention ring",
    title: "Featherweight Frame",
    description:
      "Holds everything in a 12mm disc light enough to forget you're wearing it.",
  },
  base: {
    kicker: "Base",
    title: "Sense & Stim Array",
    description:
      "EEG/EOG pickups plus the micro-stimulation contacts. This is where MÖRPH listens to your dream - and gently shapes it back.",
  },
  gel: {
    kicker: "Gel pad",
    title: "Skin Interface",
    description:
      "Reusable, skin-friendly adhesive that keeps signal clean and contact comfortable, every night.",
  },
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 44);
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const part = parts[hotspot.dataset.part];
    if (!part) return;

    hotspots.forEach((item) => item.classList.remove("is-active"));
    hotspot.classList.add("is-active");

    document.querySelector("#part-kicker").textContent = part.kicker;
    document.querySelector("#part-title").textContent = part.title;
    document.querySelector("#part-description").textContent = part.description;
  });
});

if (dreamField && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const context = dreamField.getContext("2d");
  let width = 0;
  let height = 0;
  let points = [];
  let frame = 0;

  const resizeField = () => {
    const ratio = window.devicePixelRatio || 1;
    width = dreamField.offsetWidth;
    height = dreamField.offsetHeight;
    dreamField.width = Math.floor(width * ratio);
    dreamField.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({ length: Math.max(24, Math.floor(width / 34)) }, (_, index) => ({
      x: (index / Math.max(1, Math.floor(width / 34))) * width + Math.random() * 60,
      y: Math.random() * height,
      speed: 0.14 + Math.random() * 0.32,
      drift: Math.random() * 120,
    }));
  };

  const drawField = () => {
    frame += 0.008;
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;

    points.forEach((point, index) => {
      point.y -= point.speed;
      if (point.y < -40) point.y = height + 40;

      const x = point.x + Math.sin(frame + point.drift) * 18;
      const next = points[index + 1];
      context.fillStyle = index % 5 === 0 ? "rgba(84, 242, 141, 0.55)" : "rgba(111, 184, 255, 0.42)";
      context.fillRect(x, point.y, 2, 2);

      if (next && index % 2 === 0) {
        const nextX = next.x + Math.sin(frame + next.drift) * 18;
        context.strokeStyle = "rgba(111, 184, 255, 0.08)";
        context.beginPath();
        context.moveTo(x, point.y);
        context.lineTo(nextX, next.y);
        context.stroke();
      }
    });

    requestAnimationFrame(drawField);
  };

  resizeField();
  window.addEventListener("resize", resizeField, { passive: true });
  drawField();
}

const dreams = [
  "Flying over an endless ocean at sunset.",
  "Walking through a silent city made of glass.",
  "Meeting future me in a blue-lit train station.",
];

let dreamIndex = 0;
setInterval(() => {
  if (!dreamText) return;
  dreamIndex = (dreamIndex + 1) % dreams.length;
  dreamText.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(8px)" },
    ],
    { duration: 180, easing: "ease-out" }
  ).onfinish = () => {
    dreamText.textContent = dreams[dreamIndex];
    dreamText.animate(
      [
        { opacity: 0, transform: "translateY(-8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 220, easing: "ease-out" }
    );
  };
}, 4200);
