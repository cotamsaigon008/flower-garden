"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import styles from "./FlowerGarden.module.css";
import { COMPLEXITY_LABEL } from "@/types/flower";
import type { FlowerSpecies, Structure } from "@/types/flower";
import { FLOWER_SPECIES, SPECIES_BY_ID } from "@/data/flowerSpecies";

type Visual = {
  petals?: number;
  size?: number;
  center?: string;
  centerScale?: number;
  notch?: boolean;
  fluff?: boolean;
  morning?: boolean;
  calla?: boolean;
  petalW?: number;
  petalH?: number;
  radius?: string;
  startAngle?: number;
  layers?: [number, number, number];
  pointed?: boolean;
  droop?: boolean;
  cone?: boolean;
  eye?: boolean;
  fringe?: boolean;
  iris?: boolean;
  bird?: boolean;
  crest?: boolean;
  spur?: boolean;
  corona?: boolean;
  face?: boolean;
  spikeCount?: number;
  budScale?: number;
  gapScale?: number;
  bell?: boolean;
  bead?: boolean;
  plume?: boolean;
  lip?: boolean;
  hang?: boolean;
  comb?: boolean;
  miniCount?: number;
  miniScale?: number;
  ball?: boolean;
  cloud?: boolean;
  paper?: boolean;
  chain?: boolean;
  puff?: boolean;
};

const STRUCTURE_DEFAULTS: Record<Structure, Visual> = {
  radial: { petals: 8, size: 72, center: "#fdd835" },
  cup: { petals: 5, size: 68 },
  layered: { petals: 0, size: 78, layers: [6, 5, 4] },
  trumpet: { petals: 1, size: 74, calla: true },
  spike: { petals: 0, size: 50, spikeCount: 10, budScale: 1, gapScale: 1 },
  cluster: { petals: 0, size: 72, miniCount: 7, miniScale: 1 },
};

const VISUALS: Record<string, Visual> = {
  rose: { size: 76, layers: [7, 6, 5], center: "#c2185b", centerScale: 0.18 },
  peony: { size: 90, layers: [9, 7, 6], center: "#f06292", centerScale: 0.2 },
  tulip: { petals: 6, size: 70, radius: "50% 50% 40% 40%", petalW: 26, petalH: 48 },
  sunflower: { petals: 14, size: 100, center: "#3e2723", centerScale: 0.38, petalW: 18, petalH: 46 },
  chrysanthemum: { petals: 16, size: 78, center: "#f57f17", petalW: 12, petalH: 42 },
  hibiscus: { petals: 5, size: 84, center: "#fdd835", centerScale: 0.22, petalW: 34, petalH: 46, spur: true },
  phalaenopsis: { petals: 6, size: 76, center: "#fdd835", petalW: 26, petalH: 36, radius: "50% 50% 45% 45%" },
  oncidium: { miniCount: 9, miniScale: 1.1, size: 74, center: "#fdd835" },
  cattleya: { petals: 6, size: 78, center: "#ab47bc", petalW: 30, petalH: 40 },
  dahlia: { size: 84, layers: [8, 8, 7], center: "#ab47bc", centerScale: 0.14 },
  lotus: { size: 86, layers: [8, 7, 5], pointed: true, center: "#fdd835", centerScale: 0.22 },
  mai: { petals: 5, size: 72, center: "#f57f17" },
  dao: { petals: 5, size: 66, center: "#fdd835" },
  jasmine: { petals: 5, size: 56, center: "#fdd835", petalW: 14, petalH: 36 },
  gardenia: { size: 74, layers: [6, 5, 4], center: "#efebe9", centerScale: 0.16 },
  lily: { petals: 6, size: 78, center: "#ef6c00", radius: "50% 50% 30% 30%", petalW: 20, petalH: 48 },
  alstroemeria: { petals: 6, size: 72, center: "#f9a825", eye: true },
  iris: { petals: 6, size: 76, center: "#fdd835", iris: true },
  waterlily: { petals: 10, size: 76, center: "#fdd835", pointed: true, petalW: 14, petalH: 44 },
  cherryblossom: { petals: 5, size: 58, center: "#f8bbd0", centerScale: 0.2, petalW: 22, petalH: 34, notch: true, startAngle: 8 },
  hydrangea: { miniCount: 9, miniScale: 1.35, size: 80, ball: true },
  carnation: { petals: 12, size: 72, center: "#c2185b", fringe: true, radius: "40% 40% 50% 50%" },
  babysbreath: { miniCount: 11, miniScale: 0.55, size: 70, cloud: true },
  lavender: { spikeCount: 12, size: 52, budScale: 0.85, gapScale: 0.9, bead: true },
  wisteria: { miniCount: 8, miniScale: 1.0, size: 76, chain: true },
  bougainvillea: { petals: 6, size: 64, center: "#fff8e1", paper: true, petalW: 24, petalH: 34 },
  phuong: { petals: 5, size: 90, center: "#fdd835", petalW: 32, petalH: 44, startAngle: 10 },
  banglang: { miniCount: 7, miniScale: 1.05, size: 74, puff: true, paper: true },
  plumeria: { petals: 5, size: 72, center: "#fdd835", radius: "50% 50% 45% 45%", petalW: 24, petalH: 40 },
  ngoclan: { size: 80, layers: [5, 5, 4], center: "#ff7043", pointed: true },
  moclan: { petals: 5, size: 84, radius: "50% 50% 40% 40%", petalW: 32, petalH: 48 },
  camellia: { size: 76, layers: [8, 6, 5], center: "#e53935", centerScale: 0.15 },
  violet: { petals: 5, size: 54, center: "#fdd835", petalW: 18, petalH: 34 },
  pansy: { petals: 5, size: 68, center: "#ffea00", face: true, petalW: 24, petalH: 36 },
  marigold: { petals: 14, size: 74, center: "#e65100", petalW: 14, petalH: 38 },
  zinnia: { petals: 12, size: 72, center: "#f9a825", petalW: 16, petalH: 40 },
  cosmos: { petals: 8, size: 70, center: "#fdd835", petalW: 16, petalH: 44 },
  daisy: { petals: 8, size: 72, center: "#f5c518" },
  gerbera: { petals: 12, size: 80, center: "#3e2723", centerScale: 0.34, petalW: 14, petalH: 44 },
  ranunculus: { size: 78, layers: [9, 8, 6], center: "#e65100", centerScale: 0.12 },
  poppy: { petals: 4, size: 84, center: "#1a1a1a", centerScale: 0.3, petalW: 34, petalH: 46 },
  foxglove: { spikeCount: 10, size: 56, budScale: 1.35, gapScale: 1.1, bell: true, hang: true },
  snapdragon: { spikeCount: 11, size: 54, budScale: 1.2, gapScale: 1.0, lip: true },
  calla: { petals: 1, size: 74, calla: true },
  strelitzia: { petals: 6, size: 78, center: "#fdd835", bird: true },
  redginger: { spikeCount: 8, size: 58, budScale: 1.5, gapScale: 1.2, cone: true },
  heliconia: { miniCount: 6, miniScale: 1.2, size: 78, hang: true, paper: true, puff: true },
  protea: { petals: 9, size: 88, center: "#e53935", centerScale: 0.4, petalW: 20, petalH: 42, pointed: true },
  thienly: { miniCount: 8, miniScale: 0.85, size: 68 },
  suguantu: { spikeCount: 10, size: 52, budScale: 1.1, gapScale: 1.0, bead: true },
  tigon: { miniCount: 8, miniScale: 0.9, size: 72, chain: true, hang: true },
  doquyen: { petals: 5, size: 76, center: "#f9a825", radius: "50% 50% 45% 45%", petalW: 28, petalH: 40 },
  gloxinia: { petals: 1, size: 80, calla: true, center: "#4a148c", bell: true },
  hue: { spikeCount: 12, size: 50, budScale: 0.95, gapScale: 0.95, bead: true },
  layon: { spikeCount: 10, size: 56, budScale: 1.3, gapScale: 1.1, bell: true, comb: true },
  freesia: { spikeCount: 9, size: 52, budScale: 1.1, gapScale: 1.0, comb: true, bell: true },
  dalanhuong: { spikeCount: 14, size: 54, budScale: 0.9, gapScale: 0.75, bead: true },
  thuytien: { petals: 6, size: 70, center: "#ff7043", corona: true, centerScale: 0.28 },
  chuongxanh: { spikeCount: 11, size: 50, budScale: 1.0, gapScale: 1.15, bell: true, hang: true },
  luuly: { petals: 5, size: 52, center: "#fdd835", petalW: 14, petalH: 32 },
  ctana: { petals: 8, size: 42, center: "#f5c518", centerScale: 0.7, petalW: 10, petalH: 16 },
  craspedia: { petals: 8, size: 46, center: "#f5a623", centerScale: 0.85, petalW: 8, petalH: 12, ball: true },
  statice: { miniCount: 9, miniScale: 0.8, size: 70, paper: true },
  salvia: { spikeCount: 12, size: 52, budScale: 1.1, gapScale: 0.95, lip: true },
  catmint: { spikeCount: 13, size: 48, budScale: 0.85, gapScale: 0.9, lip: true },
  verbena: { miniCount: 9, miniScale: 0.75, size: 68, ball: true },
  camtumai: { miniCount: 8, miniScale: 0.7, size: 64 },
  gazania: { petals: 14, size: 74, center: "#3e2723", eye: true, petalW: 14, petalH: 42 },
  africandaisy: { petals: 12, size: 70, center: "#7e57c2", petalW: 14, petalH: 40 },
  shasta: { petals: 10, size: 76, center: "#f5c518" },
  rudbeckia: { petals: 12, size: 68, center: "#5d4037", cone: true, centerScale: 0.36 },
  echinacea: { petals: 14, size: 76, center: "#ef6c00", cone: true, droop: true, centerScale: 0.32 },
  lupin: { spikeCount: 12, size: 56, budScale: 1.15, gapScale: 0.9 },
  delphinium: { spikeCount: 14, size: 58, budScale: 1.05, gapScale: 0.85 },
  stock: { spikeCount: 12, size: 54, budScale: 1.2, gapScale: 0.9, puff: true },
  wallflower: { miniCount: 7, miniScale: 0.9, size: 68 },
  alyssum: { miniCount: 11, miniScale: 0.5, size: 62, cloud: true },
  calendula: { petals: 20, size: 72, center: "#ff6d00", petalW: 12, petalH: 36 },
  nasturtium: { petals: 5, size: 78, center: "#ffea00", spur: true, petalW: 28, petalH: 38 },
  lisianthus: { size: 72, layers: [7, 6, 5], center: "#f8bbd0", centerScale: 0.16 },
  morningglory: { petals: 1, size: 76, morning: true, calla: false },
  sweetpea: { miniCount: 7, miniScale: 1.0, size: 72, puff: true },
  mimosa: { miniCount: 9, miniScale: 0.95, size: 70, puff: true, ball: true },
  dandelion: { petals: 24, size: 84, center: "#ffffff", fluff: true },
  geranium: { petals: 5, size: 64, center: "#e53935", petalW: 20, petalH: 36 },
  zonalgeranium: { miniCount: 8, miniScale: 0.9, size: 72, ball: true },
  begonia: { petals: 4, size: 68, center: "#fdd835", petalW: 30, petalH: 38, startAngle: 20 },
  impatiens: { petals: 5, size: 62, center: "#ffffff", petalW: 22, petalH: 36, spur: true },
  fuchsia: { miniCount: 6, miniScale: 1.15, size: 74, hang: true, chain: true },
  chocolatecosmos: { petals: 8, size: 68, center: "#3e2723", petalW: 18, petalH: 42 },
  climbingrose: { size: 70, layers: [6, 6, 5], center: "#e53935", centerScale: 0.17 },
  tearose: { size: 68, layers: [7, 5, 4], center: "#fdd835", centerScale: 0.15 },
  pingpong: { petals: 18, size: 76, center: "#80cbc4", centerScale: 0.42, petalW: 11, petalH: 34 },
  spidermum: { petals: 20, size: 78, center: "#fdd835", petalW: 8, petalH: 48, radius: "50%" },
  cockscomb: { petals: 10, size: 76, center: "#e53935", crest: true, centerScale: 0.55 },
  plumecelosia: { spikeCount: 10, size: 60, budScale: 1.25, gapScale: 1.0, plume: true },
  salpiglossis: { petals: 1, size: 76, calla: true, eye: true, center: "#fdd835" },
  nemesia: { spikeCount: 12, size: 50, budScale: 1.0, gapScale: 1.0, lip: true, comb: true },
  cotton: { petals: 5, size: 70, center: "#fff8e1", puff: true, petalW: 26, petalH: 40 },
  lilyofvalley: { spikeCount: 11, size: 50, budScale: 0.75, gapScale: 1.2, bell: true, hang: true },
};

type ResolvedVisual = Visual & { size: number; petals: number };

function visualFor(sp: FlowerSpecies): ResolvedVisual {
  const base = STRUCTURE_DEFAULTS[sp.structure];
  const over = VISUALS[sp.id];
  const merged = over ? { ...base, ...over } : base;
  return {
    ...merged,
    size: merged.size ?? 72,
    petals: merged.petals ?? 5,
  };
}

const STEM_WIDTHS: Partial<Record<Structure, number>> = {
  radial: 4,
  cup: 4,
  layered: 4,
  trumpet: 4,
  spike: 3,
  cluster: 4,
};

const minimumPlantY = 130;
const flowerRadius = 50;

type Flower = {
  id: number;
  x: number;
  y: number;
  stemHeight: number;
  color: string;
  speciesId: string;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type InfoPopup = {
  species: FlowerSpecies;
  x: number;
  y: number;
};

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── structure renderers ── */

function RadialHead({ sp, vis, color }: { sp: FlowerSpecies; vis: ResolvedVisual; color: string }) {
  const n = Math.max(4, vis.petals);
  const step = 360 / n;
  const start = vis.startAngle ?? 0;
  const pw = vis.petalW ?? Math.max(12, vis.size * 0.16);
  const ph = vis.petalH ?? vis.size * 0.48;
  const cScale = vis.centerScale ?? 0.24;
  const cSize = Math.max(12, vis.size * cScale);

  if (vis.fluff) {
    return (
      <div className={`${styles.flowerHead} ${styles.dandelionHead}`}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className={styles.seed} style={{ "--a": `${i * step}deg` } as CSSProperties}>
            <div className={styles.seedTip} />
          </div>
        ))}
        <div
          className={styles.center}
          style={{
            background: "radial-gradient(circle,#fff,#f0f0f0)",
            boxShadow: "0 0 10px rgba(255,255,255,.5)",
            width: 18,
            height: 18,
          }}
        />
      </div>
    );
  }

  if (vis.bird) {
    return (
      <div className={`${styles.flowerHead} ${styles.birdHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
        <div className={styles.birdSpiky} style={{ background: "#29b6f6" }} />
        <div className={styles.birdWing} style={{ background: color }} />
        <div className={styles.birdWing2} style={{ background: color, filter: "brightness(0.9)" }} />
        <div className={styles.birdBeak} />
        <div className={styles.birdStamen} />
      </div>
    );
  }

  if (vis.iris) {
    const falls = [30, 150, 270];
    const stands = [0, 120, 240];
    return (
      <div className={`${styles.flowerHead} ${styles.irisHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
        {falls.map((a, i) => (
          <div
            key={`f${i}`}
            className={`${styles.petal} ${styles.irisFall}`}
            style={{ "--petal-angle": `${a}deg`, background: color } as CSSProperties}
          />
        ))}
        {stands.map((a, i) => (
          <div
            key={`s${i}`}
            className={`${styles.petal} ${styles.irisStand}`}
            style={{ "--petal-angle": `${a}deg`, background: color, filter: "brightness(1.15)" } as CSSProperties}
          />
        ))}
        <div className={styles.center} style={{ background: vis.center ?? "#fdd835", width: 16, height: 16 }} />
      </div>
    );
  }

  const back = n > 10 ? Math.floor(n / 2) : 0;
  const front = back ? n - back : n;
  const radius = vis.radius ?? (notchRadius(vis) ?? "50% 50% 45% 45%");

  return (
    <div className={`${styles.flowerHead} ${styles.genericHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
      {back > 0 &&
        Array.from({ length: back }, (_, i) => (
          <div
            key={`b${i}`}
            className={`${styles.petal}${vis.eye ? ` ${styles.petalEye}` : ""}${vis.cone ? ` ${styles.petalDroop}` : ""}${vis.droop ? ` ${styles.petalDroop}` : ""}${vis.crest ? ` ${styles.petalCrest}` : ""}`}
            style={
              {
                "--petal-angle": `${i * step + start}deg`,
                background: color,
                filter: "brightness(0.88)",
                "--petal-w": `${pw}px`,
                "--petal-h": `${ph}px`,
                "--petal-radius": radius,
                "--eye-color": vis.center ?? "#3e2723",
              } as CSSProperties
            }
          />
        ))}
      {Array.from({ length: front }, (_, i) => (
        <div
          key={`f${i}`}
          className={`${styles.petal}${vis.eye ? ` ${styles.petalEye}` : ""}${vis.cone ? ` ${styles.petalDroop}` : ""}${vis.droop ? ` ${styles.petalDroop}` : ""}${vis.crest ? ` ${styles.petalCrest}` : ""}${vis.fringe ? ` ${styles.petalFringe}` : ""}${vis.spur ? ` ${styles.petalSpur}` : ""}`}
          style={
            {
              "--petal-angle": `${(back ? i * step + step / 2 : i * step) + start}deg`,
              background: color,
              filter: back ? "brightness(1.1)" : undefined,
              "--petal-w": `${pw}px`,
              "--petal-h": `${ph}px`,
              "--petal-radius": radius,
              "--eye-color": vis.center ?? "#3e2723",
            } as CSSProperties
          }
        >
          {vis.notch && <div className={styles.notch} />}
        </div>
      ))}
      {vis.corona && (
        <div
          className={styles.corona}
          style={{
            background: `radial-gradient(circle at 35% 30%, ${vis.center ?? "#ff7043"}, #ff9800)`,
            width: cSize * 0.9,
            height: cSize * 0.7,
          }}
        />
      )}
      {vis.face && vis.center && (
        <div
          className={styles.faceMark}
          style={{
            background: `radial-gradient(circle at 40% 35%, #ffea00, ${vis.center})`,
            width: cSize,
            height: cSize,
            boxShadow: `0 0 0 3px ${vis.center}55`,
          }}
        />
      )}
      {vis.crest && vis.center && (
        <div className={styles.crest} style={{ background: color, filter: "saturate(1.2) brightness(0.95)" }} />
      )}
      {!vis.corona && !vis.face && !vis.crest && vis.center && (
        <div
          className={styles.center}
          style={
            vis.cone
              ? {
                  background: `radial-gradient(circle at 35% 35%, ${vis.center}ee, ${vis.center})`,
                  width: cSize,
                  height: cSize,
                  boxShadow: `0 0 0 3px ${vis.center}40, inset 0 -2px 4px rgba(0,0,0,.25)`,
                  borderRadius: "50% 50% 45% 45%",
                }
              : {
                  background: `radial-gradient(circle at 35% 35%, ${vis.center}dd, ${vis.center})`,
                  width: cSize,
                  height: cSize,
                  boxShadow: `0 0 0 3px ${vis.center}40`,
                }
          }
        />
      )}
      <span className={styles.srOnly}>{sp.vietnameseName}</span>
    </div>
  );
}

function notchRadius(vis: Visual): string | undefined {
  return vis.notch ? "50% 50% 48% 48%" : undefined;
}

function CupHead({ vis, color }: { vis: ResolvedVisual; color: string }) {
  const n = vis.petals === 6 ? 6 : vis.petals === 5 ? 5 : 5;
  const spread = n === 6 ? 48 : 42;
  const angles = Array.from({ length: n }, (_, i) => -spread + (i * (spread * 2)) / (n - 1));
  const pw = vis.petalW ?? 26;
  const ph = vis.petalH ?? 46;
  return (
    <div className={`${styles.flowerHead} ${styles.cupHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
      {angles.map((a, i) => (
        <div
          key={i}
          className={styles.petal}
          style={
            {
              "--petal-angle": `${a}deg`,
              background: color,
              zIndex: Math.abs(a) < 12 ? 3 : Math.abs(a) < 30 ? 2 : 1,
              filter: `brightness(${1 - Math.abs(a) / 250})`,
              "--petal-w": `${pw}px`,
              "--petal-h": `${ph}px`,
              "--petal-radius": vis.radius ?? "50% 50% 42% 42%",
            } as CSSProperties
          }
        />
      ))}
      <div className={styles.cupCenter} style={vis.center ? { background: vis.center } : undefined} />
    </div>
  );
}

function LayeredHead({ vis, color }: { vis: ResolvedVisual; color: string }) {
  const [o, m, i] = vis.layers ?? [6, 5, 4];
  const radius = vis.pointed ? "60% 60% 40% 40% / 70% 70% 30% 30%" : "50% 50% 45% 45%";
  const cSize = Math.max(10, vis.size * (vis.centerScale ?? 0.18));
  return (
    <div className={`${styles.flowerHead} ${styles.layeredHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
      {Array.from({ length: o }, (_, idx) => (
        <div
          key={`o${idx}`}
          className={`${styles.petal} ${styles.petalOuter}`}
          style={
            {
              "--petal-angle": `${(idx * 360) / o}deg`,
              background: color,
              filter: "brightness(0.82)",
              "--petal-radius": radius,
            } as CSSProperties
          }
        />
      ))}
      {Array.from({ length: m }, (_, idx) => (
        <div
          key={`m${idx}`}
          className={`${styles.petal} ${styles.petalMid}`}
          style={
            {
              "--petal-angle": `${(idx * 360) / m + 18}deg`,
              background: color,
              filter: "brightness(0.96)",
              "--petal-radius": radius,
            } as CSSProperties
          }
        />
      ))}
      {Array.from({ length: i }, (_, idx) => (
        <div
          key={`i${idx}`}
          className={`${styles.petal} ${styles.petalInner}`}
          style={
            {
              "--petal-angle": `${(idx * 360) / i + 28}deg`,
              background: color,
              filter: "brightness(1.18)",
              "--petal-radius": radius,
            } as CSSProperties
          }
        />
      ))}
      <div
        className={styles.layeredCenter}
        style={{
          background: vis.center ?? color,
          filter: vis.center ? undefined : "brightness(0.7)",
          width: cSize,
          height: cSize,
        }}
      />
    </div>
  );
}

function TrumpetHead({ vis, color }: { vis: ResolvedVisual; color: string }) {
  if (vis.morning) {
    return (
      <div className={`${styles.flowerHead} ${styles.morningHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
        <div className={styles.morningThroat} style={{ background: color }} />
        <div className={styles.morningStar} style={{ background: color }} />
        <div className={styles.morningCenter} />
      </div>
    );
  }
  if (vis.eye) {
    return (
      <div className={`${styles.flowerHead} ${styles.paintedHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
        <div className={styles.paintedThroat} style={{ background: color }} />
        <div className={styles.paintedStripe} />
        <div className={styles.paintedStripe2} />
        <div className={styles.paintedLip} style={{ background: color, filter: "brightness(0.92)" }} />
        <div className={styles.paintedCenter} style={{ background: vis.center ?? "#fdd835" }} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.flowerHead} ${styles.callaHead}${vis.bell ? ` ${styles.gloxiniaHead}` : ""}`}
      style={{ "--head-size": `${vis.size}px` } as CSSProperties}
    >
      <div className={styles.callaSpathe} style={{ background: color }} />
      <div className={styles.callaSpadix} style={vis.center ? { background: `linear-gradient(to top, ${vis.center}, #fdd835)` } : undefined} />
    </div>
  );
}

function SpikeHead({ vis, color }: { vis: ResolvedVisual; color: string }) {
  const count = vis.spikeCount ?? 10;
  const budScale = vis.budScale ?? 1;
  const gapScale = vis.gapScale ?? 1;
  const budW = vis.size * 0.34 * budScale;
  const budH = vis.size * 0.38 * budScale;
  const gap = vis.size * 0.14 * gapScale;
  const containerH = count * gap + budH + 8;
  const hang = vis.hang ?? false;
  const plume = vis.plume ?? false;
  const bead = vis.bead ?? false;
  const cone = vis.cone ?? false;

  return (
    <div
      className={`${styles.flowerHead} ${styles.spikeHead}${plume ? ` ${styles.plumeHead}` : ""}`}
      style={
        {
          "--head-size": `${vis.size}px`,
          height: `${containerH}px`,
          bottom: `calc(var(--stem-height) - ${containerH * 0.35}px)`,
        } as CSSProperties
      }
    >
      {Array.from({ length: count }, (_, idx) => {
        const scaleTaper = hang ? 1 : 0.75 + (idx / Math.max(1, count - 1)) * 0.45;
        const w = budW * (cone ? 1.15 - idx * 0.04 : 1) * (plume ? 0.9 : 1);
        const h = budH * scaleTaper;
        const hangDx = hang ? (idx % 2 === 0 ? -budW * 0.35 : budW * 0.25) : idx % 2 === 0 ? -budW * 0.18 : budW * 0.18;
        const radius = plume ? "50% 50% 40% 40%" : bead ? "50%" : vis.bell || hang ? "50% 50% 55% 55%" : "50%";
        return (
          <div
            key={idx}
            className={`${styles.spikeBud}${vis.bell || hang ? ` ${styles.spikeBell}` : ""}${vis.lip ? ` ${styles.spikeLip}` : ""}${vis.comb ? ` ${styles.spikeComb}` : ""}`}
            style={
              {
                "--bud-index": idx,
                "--bud-offset": `${hangDx}px`,
                width: `${w}px`,
                height: `${h}px`,
                left: `calc(50% - ${w / 2}px + var(--bud-offset))`,
                bottom: `${idx * gap}px`,
                background: color,
                borderRadius: radius,
                filter: `brightness(${0.82 + (idx % 3) * 0.12})`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function ClusterHead({ vis, colors }: { vis: ResolvedVisual; colors: string[] }) {
  const palette = colors.length ? colors : ["#f48fb1"];
  const n = palette.length;
  const count = vis.miniCount ?? 7;
  const ms = vis.miniScale ?? 1;
  const mini = 26 * ms;
  const chain = vis.chain ?? false;
  const hang = vis.hang ?? false;
  const ball = vis.ball ?? false;
  const cloud = vis.cloud ?? false;
  const puff = vis.puff ?? false;

  if (chain || hang) {
    return (
      <div className={`${styles.flowerHead} ${styles.clusterHead} ${styles.chainHead}`} style={{ "--head-size": `${vis.size}px` } as CSSProperties}>
        {Array.from({ length: count + 3 }, (_, i) => {
          const t = i / (count + 2);
          const x = Math.sin(t * Math.PI * 1.2) * vis.size * 0.12;
          const y = t * vis.size * 0.85;
          const c = palette[i % n];
          const s = mini * (0.7 + t * 0.45);
          return (
            <div
              key={i}
              className={styles.miniFlower}
              style={{ left: `calc(50% + ${x}px - ${s / 2}px)`, top: `${y}px`, width: s, height: s } as CSSProperties}
            >
              {Array.from({ length: 5 }, (_, j) => (
                <div
                  key={j}
                  className={styles.miniPetal}
                  style={
                    {
                      "--a": `${j * 72}deg`,
                      background: c,
                      width: `${9 * ms}px`,
                      height: `${12 * ms}px`,
                    } as CSSProperties
                  }
                />
              ))}
              <div className={styles.miniCenter} style={puff ? { background: palette[0], filter: "brightness(1.2)" } : undefined} />
            </div>
          );
        })}
      </div>
    );
  }

  const radius = ball || cloud ? vis.size * 0.34 : vis.size * 0.3;
  return (
    <div
      className={`${styles.flowerHead} ${styles.clusterHead}${ball ? ` ${styles.ballHead}` : ""}${cloud ? ` ${styles.cloudHead}` : ""}${puff ? ` ${styles.puffHead}` : ""}`}
      style={{ "--head-size": `${vis.size}px` } as CSSProperties}
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * Math.PI * 2) / count - Math.PI / 2;
        const rr = ball || cloud ? radius * (0.55 + (i % 3) * 0.22) : radius;
        const x = Math.cos(angle) * rr;
        const y = Math.sin(angle) * rr;
        const c = palette[i % n];
        const s = mini * (cloud ? 0.85 : 1);
        return (
          <div
            key={i}
            className={styles.miniFlower}
            style={{ left: `calc(50% + ${x}px - ${s / 2}px)`, top: `calc(50% + ${y}px - ${s / 2}px)`, width: s, height: s } as CSSProperties}
          >
            {Array.from({ length: vis.paper ? 4 : 5 }, (_, j) => (
              <div
                key={j}
                className={styles.miniPetal}
                style={
                  {
                    "--a": `${(j * 360) / (vis.paper ? 4 : 5)}deg`,
                    background: c,
                    width: `${9 * ms}px`,
                    height: `${12 * ms}px`,
                    borderRadius: vis.paper ? "40% 40% 55% 55%" : undefined,
                  } as CSSProperties
                }
              />
            ))}
            <div className={styles.miniCenter} />
          </div>
        );
      })}
      <div
        className={styles.miniFlower}
        style={{ left: `calc(50% - ${mini / 2}px)`, top: `calc(50% - ${mini / 2}px)`, width: mini, height: mini } as CSSProperties}
      >
        {Array.from({ length: 5 }, (_, j) => (
          <div key={j} className={styles.miniPetal} style={{ "--a": `${j * 72}deg`, background: palette[0], width: `${9 * ms}px`, height: `${12 * ms}px` } as CSSProperties} />
        ))}
        <div className={styles.miniCenter} />
      </div>
    </div>
  );
}

function FlowerHead({ species, color }: { species: FlowerSpecies; color: string }) {
  const vis = visualFor(species);
  switch (species.structure) {
    case "radial":
      return <RadialHead sp={species} vis={vis} color={color} />;
    case "cup":
      return <CupHead vis={vis} color={color} />;
    case "layered":
      return <LayeredHead vis={vis} color={color} />;
    case "trumpet":
      return <TrumpetHead vis={vis} color={color} />;
    case "spike":
      return <SpikeHead vis={vis} color={color} />;
    case "cluster":
      return <ClusterHead vis={vis} colors={species.colorHex} />;
  }
}

/* ── main ── */

export default function FlowerGarden() {
  const gardenRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(1);
  const timersRef = useRef<number[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [info, setInfo] = useState<InfoPopup | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = selectedId ? SPECIES_BY_ID[selectedId] ?? null : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FLOWER_SPECIES;
    return FLOWER_SPECIES.filter(
      (s) =>
        s.vietnameseName.toLowerCase().includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.scientificName.toLowerCase().includes(q) ||
        s.bloomSeason.toLowerCase().includes(q),
    );
  }, [query]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const createFlower = useCallback(
    (clientX: number, clientY: number, forcedId?: string) => {
      const garden = gardenRef.current;
      if (!garden) return;
      const rect = garden.getBoundingClientRect();
      const gx = clientX - rect.left;
      const gy = clientY - rect.top;
      const safeX = Math.min(Math.max(gx, flowerRadius), Math.max(flowerRadius, rect.width - flowerRadius));
      const safeY = Math.max(gy, minimumPlantY);
      const species = forcedId
        ? SPECIES_BY_ID[forcedId]
        : selectedId
          ? SPECIES_BY_ID[selectedId]
          : pick(FLOWER_SPECIES);
      if (!species) return;
      const color = pick(species.colorHex);
      const stemHeight = Math.max(70, Math.min(80 + Math.random() * 120, safeY - 60));
      const id = nextIdRef.current;
      nextIdRef.current += 1;

      setFlowers((prev) => [...prev, { id, x: safeX, y: safeY, stemHeight, color, speciesId: species.id }]);

      const newParticles = Array.from({ length: 6 }, () => {
        const pid = nextIdRef.current;
        nextIdRef.current += 1;
        return { id: pid, x: safeX, y: safeY, dx: (Math.random() - 0.5) * 80, dy: (Math.random() - 0.5) * 80 };
      });
      setParticles((prev) => [...prev, ...newParticles]);

      const timer = window.setTimeout(() => {
        const ids = new Set(newParticles.map((p) => p.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, 800);
      timersRef.current.push(timer);
    },
    [selectedId],
  );

  const createRandomFlower = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const minX = flowerRadius;
    const maxX = Math.max(minX, w - flowerRadius);
    const minY = 180;
    const maxY = Math.max(minY, h - 100);
    createFlower(minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY));
  }, [createFlower]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ts = [
      window.setTimeout(() => createFlower(w * 0.15, h * 0.65, "rose"), 500),
      window.setTimeout(() => createFlower(w * 0.35, h * 0.72, "sunflower"), 800),
      window.setTimeout(() => createFlower(w * 0.55, h * 0.6, "lotus"), 1100),
      window.setTimeout(() => createFlower(w * 0.75, h * 0.68, "lavender"), 1400),
      window.setTimeout(() => createFlower(w * 0.9, h * 0.62, "cherryblossom"), 1700),
    ];
    timersRef.current.push(...ts);
    return clearTimers;
  }, [clearTimers, createFlower]);

  useEffect(() => clearTimers, [clearTimers]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, input, [data-panel]")) return;
    e.preventDefault();
    createFlower(e.clientX, e.clientY);
  };

  const handleClear = () => {
    setFlowers([]);
    setParticles([]);
    setInfo(null);
  };

  const openInfo = (speciesId: string, x: number, y: number) => {
    const species = SPECIES_BY_ID[speciesId];
    if (!species) return;
    setInfo({ species, x, y });
  };

  return (
    <main className={styles.garden} ref={gardenRef} onPointerDown={handlePointerDown}>
      <div className={styles.header} aria-hidden="true">
        <h1>Flower Garden</h1>
        <p>
          {selected
            ? `Đang trồng: ${selected.vietnameseName} — nhấn để đặt hoa`
            : "Nhấn vào bất kỳ đâu để trồng một bông hoa ngẫu nhiên"}
        </p>
      </div>

      <div className={styles.counter} aria-live="polite">
        Số hoa: <span>{flowers.length}</span>
      </div>

      <button
        type="button"
        className={styles.browserToggle}
        data-panel
        onClick={() => setBrowserOpen((v) => !v)}
        aria-expanded={browserOpen}
      >
        {browserOpen ? "Đóng danh sách" : `Danh sách 100 loài${selected ? ` · ${selected.vietnameseName}` : ""}`}
      </button>

      {browserOpen && (
        <aside className={styles.speciesPanel} data-panel aria-label="Danh sách loài hoa">
          <div className={styles.speciesPanelHead}>
            <strong>100 loài hoa</strong>
            <button type="button" className={styles.panelClose} onClick={() => setBrowserOpen(false)} aria-label="Đóng">
              ×
            </button>
          </div>
          <input
            className={styles.speciesSearch}
            type="search"
            placeholder="Tìm tên Việt / Anh / khoa học…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-panel
          />
          <div className={styles.speciesList} data-panel>
            {filtered.map((sp) => (
              <button
                key={sp.id}
                type="button"
                className={`${styles.speciesCard} ${selectedId === sp.id ? styles.speciesCardActive : ""}`}
                onClick={() => setSelectedId(sp.id === selectedId ? null : sp.id)}
              >
                <span className={styles.speciesSwatches} aria-hidden="true">
                  {sp.colorHex.slice(0, 4).map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                <span className={styles.speciesMeta}>
                  <span className={styles.speciesVi}>{sp.vietnameseName}</span>
                  <span className={styles.speciesSci}>{sp.scientificName}</span>
                </span>
                <span className={`${styles.badge} ${styles[`badge_${sp.complexity}`]}`}>
                  {COMPLEXITY_LABEL[sp.complexity]}
                </span>
              </button>
            ))}
            {filtered.length === 0 && <p className={styles.emptyList}>Không tìm thấy loài phù hợp.</p>}
          </div>
          {selected && (
            <button type="button" className={styles.clearSelect} onClick={() => setSelectedId(null)}>
              Bỏ chọn (trồng ngẫu nhiên)
            </button>
          )}
        </aside>
      )}

      <div className={styles.ground} aria-hidden="true" />

      {flowers.map((flower) => {
        const species = SPECIES_BY_ID[flower.speciesId];
        if (!species) return null;
        return (
          <div
            className={styles.flower}
            key={flower.id}
            style={
              {
                left: flower.x,
                top: flower.y,
                "--stem-height": `${flower.stemHeight}px`,
                "--stem-width": `${STEM_WIDTHS[species.structure] ?? 4}px`,
              } as CSSProperties
            }
          >
            <div className={styles.stem}>
              <div className={`${styles.leaf} ${styles.leafLeft}`} />
              <div className={`${styles.leaf} ${styles.leafRight}`} />
            </div>
            <FlowerHead species={species} color={flower.color} />
            <button
              type="button"
              className={styles.flowerName}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => openInfo(flower.speciesId, flower.x, flower.y)}
            >
              {species.vietnameseName}
            </button>
          </div>
        );
      })}

      {particles.map((p) => (
        <div
          className={styles.particle}
          key={p.id}
          style={{ left: p.x, top: p.y, "--x": `${p.dx}px`, "--y": `${p.dy}px` } as CSSProperties}
        />
      ))}

      {info && (
        <div
          className={styles.infoPopup}
          style={{
            left: Math.min(Math.max(info.x, 180), window.innerWidth - 180),
            top: Math.max(info.y - 16, 120),
          }}
          onPointerDown={(e) => e.stopPropagation()}
          data-panel
        >
          <button type="button" className={styles.infoClose} onClick={() => setInfo(null)} aria-label="Đóng">
            ×
          </button>
          <div className={styles.infoTitleRow}>
            <strong>{info.species.vietnameseName}</strong>
            <span className={`${styles.badge} ${styles[`badge_${info.species.complexity}`]}`}>
              {COMPLEXITY_LABEL[info.species.complexity]}
            </span>
          </div>
          <p className={styles.infoEn}>
            {info.species.englishName} · <em>{info.species.scientificName}</em>
          </p>
          <dl className={styles.infoGrid}>
            <div>
              <dt>Màu</dt>
              <dd>{info.species.colors.join(", ")}</dd>
            </div>
            <div>
              <dt>Hình dạng</dt>
              <dd>{info.species.shape}</dd>
            </div>
            <div>
              <dt>Mùa nở</dt>
              <dd>{info.species.bloomSeason}</dd>
            </div>
          </dl>
          <p className={styles.infoDesc}>{info.species.desc}</p>
        </div>
      )}

      <div className={styles.controls} onPointerDown={(e) => e.stopPropagation()} data-panel>
        <button type="button" onClick={handleClear}>
          Clear garden
        </button>
        <button type="button" onClick={createRandomFlower}>
          Create
        </button>
      </div>
    </main>
  );
}
