"use client";

import { useScroll, useTransform, motion } from "framer-motion";

// Each wave group morphs between two organic shapes.
// Paths share the same command structure (M + 4×C) so morphing is smooth.
// Amplitudes, peak positions, and baselines are deliberately non-uniform.
//
// Per-wave knobs:
//   pos — vertical position of the group on the page (% from top)
//   sw  — stroke width (grosor) of the main trace; secondary uses sw × 0.48
const WAVES = [
  {
    // group 1 — top area, tilted slightly left-down
    pos: "5%",
    rotate: -1.2,
    main: [
      "M0,65 C80,28 190,95 320,48 C430,12 530,88 670,44 C790,14 900,82 1020,52 C1140,24 1300,78 1440,58",
      "M0,55 C100,92 230,18 360,72 C470,98 590,22 710,62 C840,96 970,28 1090,68 C1210,95 1350,38 1440,62",
    ] as [string, string],
    sec: [
      "M0,74 C80,37 190,104 320,57 C430,21 530,97 670,53 C790,23 900,91 1020,61 C1140,33 1300,87 1440,67",
      "M0,64 C100,101 230,27 360,81 C470,107 590,31 710,71 C840,105 970,37 1090,77 C1210,104 1350,47 1440,71",
    ] as [string, string],
    sw: 2.2,
    // opacity [min, max] — simulates waves at different distances
    so: [0.22, 0.72] as [number, number],
    opacDur: 4,
  },
  {
    // group 2 — upper-mid, tilted slightly right-down
    pos: "50%",
    rotate: 1.0,
    main: [
      "M0,58 C140,98 270,18 410,64 C520,98 660,18 780,56 C920,96 1060,16 1190,62 C1310,98 1400,42 1440,60",
      "M0,62 C110,24 250,94 380,50 C500,18 640,90 760,48 C900,16 1040,84 1170,52 C1290,22 1400,74 1440,60",
    ] as [string, string],
    sec: [
      "M0,67 C140,107 270,27 410,73 C520,107 660,27 780,65 C920,105 1060,25 1190,71 C1310,107 1400,51 1440,69",
      "M0,71 C110,33 250,103 380,59 C500,27 640,99 760,57 C900,25 1040,93 1170,61 C1290,31 1400,83 1440,69",
    ] as [string, string],
    sw: 2.0,
    so: [0.14, 0.62] as [number, number],
    opacDur: 3,
  },
  {
    // group 3 — lower-mid, flat tilt
    pos: "95%",
    rotate: -0.7,
    main: [
      "M0,62 C70,22 160,88 310,42 C450,8 550,82 680,50 C810,22 930,90 1060,55 C1190,24 1330,82 1440,60",
      "M0,58 C90,96 200,22 340,68 C460,96 580,28 720,58 C860,90 980,24 1120,68 C1240,96 1360,36 1440,62",
    ] as [string, string],
    sec: [
      "M0,71 C70,31 160,97 310,51 C450,17 550,91 680,59 C810,31 930,99 1060,64 C1190,33 1330,91 1440,69",
      "M0,67 C90,105 200,31 340,77 C460,105 580,37 720,67 C860,99 980,33 1120,77 C1240,105 1360,45 1440,71",
    ] as [string, string],
    sw: 2.0,
    so: [0.28, 0.70] as [number, number],
    opacDur: 5,
  },
  {
    // group 4 — bottom area, tilted right-down
    pos: "140%",
    rotate: 1.4,
    main: [
      "M0,60 C120,96 250,18 400,62 C510,94 650,20 770,54 C900,92 1040,18 1180,60 C1300,94 1390,44 1440,60",
      "M0,60 C100,26 240,96 370,54 C490,22 630,90 750,50 C890,18 1030,86 1170,52 C1290,24 1390,78 1440,60",
    ] as [string, string],
    sec: [
      "M0,69 C120,105 250,27 400,71 C510,103 650,29 770,63 C900,101 1040,27 1180,69 C1300,103 1390,53 1440,69",
      "M0,69 C100,35 240,105 370,63 C490,31 630,99 750,59 C890,27 1030,95 1170,61 C1290,33 1390,87 1440,69",
    ] as [string, string],
    sw: 2.2,
    so: [0.18, 0.68] as [number, number],
    opacDur: 3.5,
  },
] as const;

const DRIFT_CLASSES = ["fx-wave-drift", "fx-wave-drift-reverse", "fx-wave-drift", "fx-wave-drift-reverse"] as const;
// Morph durations varied per group so they never sync up
const MORPH_DURATIONS = [11, 8, 13, 9] as const;

export function BackgroundEffects() {
  const { scrollY } = useScroll();

  const orbAY = useTransform(scrollY, (v) => v * -0.08);
  const orbBY = useTransform(scrollY, (v) => v * -0.14);
  const orbCY = useTransform(scrollY, (v) => v * -0.06);

  const waveY = [
    useTransform(scrollY, (v) => v * -0.10),
    useTransform(scrollY, (v) => v * -0.18),
    useTransform(scrollY, (v) => v * -0.08),
    useTransform(scrollY, (v) => v * -0.22),
  ];

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ── Orbs ──────────────────────────────────────── */}

      <motion.div className="absolute -top-[15%] -left-[10%]" style={{ y: orbAY }}>
        <div className="fx-orb fx-orb-blue" />
      </motion.div>

      <motion.div className="absolute -top-[10%] -right-[8%]" style={{ y: orbBY }}>
        <div className="fx-orb fx-orb-violet" />
      </motion.div>

      <motion.div className="absolute bottom-[5%] left-1/2 -translate-x-1/2" style={{ y: orbCY }}>
        <div className="fx-orb fx-orb-teal" />
      </motion.div>

      {/* ── Waves ─────────────────────────────────────── */}

      {WAVES.map((wave, i) => {
        const dur = MORPH_DURATIONS[i];
        return (
          <motion.div
            key={i}
            className="absolute w-full"
            style={{ top: wave.pos, y: waveY[i], rotate: wave.rotate }}
          >
            <div className={DRIFT_CLASSES[i]}>
              <svg
                className="fx-wave-glow"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                style={{
                  width: "130%",
                  marginLeft: "-15%",
                  height: "180px",
                  color: "var(--wave-stroke)",
                }}
              >
                {/* Main trace — morphs shape + pulses opacity independently */}
                <motion.path
                  d={wave.main[0]}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={wave.sw}
                  animate={{
                    d: [wave.main[0], wave.main[1], wave.main[0]],
                    strokeOpacity: [wave.so[0], wave.so[1], wave.so[0]],
                  }}
                  transition={{
                    d: { duration: dur, ease: "easeInOut", repeat: Infinity },
                    strokeOpacity: { duration: wave.opacDur, ease: "easeInOut", repeat: Infinity },
                  }}
                />
                {/* Secondary trace — out-of-phase on both shape and opacity */}
                <motion.path
                  d={wave.sec[0]}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={wave.sw * 0.48}
                  animate={{
                    d: [wave.sec[0], wave.sec[1], wave.sec[0]],
                    strokeOpacity: [wave.so[0] * 0.42, wave.so[1] * 0.42, wave.so[0] * 0.42],
                  }}
                  transition={{
                    d: { duration: dur, ease: "easeInOut", repeat: Infinity, delay: dur * 0.4 },
                    strokeOpacity: { duration: wave.opacDur * 1.3, ease: "easeInOut", repeat: Infinity, delay: wave.opacDur * 0.55 },
                  }}
                />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
