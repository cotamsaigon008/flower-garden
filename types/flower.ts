export type Complexity = "low" | "medium" | "high" | "very-high";

export type Structure = "radial" | "cup" | "layered" | "trumpet" | "spike" | "cluster";

export type FlowerSpecies = {
  id: string;
  vietnameseName: string;
  englishName: string;
  scientificName: string;
  colors: string[];
  colorHex: string[];
  shape: string;
  bloomSeason: string;
  complexity: Complexity;
  structure: Structure;
  desc: string;
  prompt: string;
  negativePrompt: string;
  model?: string;
  thumbnail?: string;
  referenceImages?: string[];
};

export const NEGATIVE_PROMPT =
  "generic flower, wrong species morphology, incorrect petal count, plastic petals, rubber material, wax toy, inflated petals, perfect symmetry, fake leaves, oversized stamens, missing sepals, floating petals, disconnected geometry, melted topology, noisy texture, excessive gloss, low-detail flower center, impossible anatomy, fantasy morphology, watermark, text, logo";

export function buildPrompt(english: string, scientific: string, colors: string, shape: string): string {
  return `Photorealistic botanically accurate 3D ${english} (${scientific}), ${colors}; preserve ${shape}; natural asymmetry, realistic petal thickness and translucency, detailed reproductive structures, sepals, stem and leaves, PBR materials, clean topology for Three.js/React Three Fiber, GLB-ready, no plastic/toy look.`;
}

export const COMPLEXITY_LABEL: Record<Complexity, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  "very-high": "Rất cao",
};
