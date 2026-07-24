// Dev-only script: verifies WCAG contrast ratios for the OKLCH tokens documented
// in DESIGN.md. Not shipped with the site. Run with: node scripts/contrast-check.mjs

function oklchToSrgb(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180;
  const a = Math.cos(h) * C;
  const b = Math.sin(h) * C;

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const toSrgb = (c) => {
    c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, c));
  };

  return [toSrgb(r), toSrgb(g), toSrgb(bl)];
}

function relativeLuminance([r, g, b]) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(oklchA, oklchB) {
  const la = relativeLuminance(oklchToSrgb(...oklchA));
  const lb = relativeLuminance(oklchToSrgb(...oklchB));
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

const themes = {
  dark: {
    bg: [0.16, 0.02, 260],
    surface: [0.21, 0.02, 260],
    ink: [0.96, 0.01, 260],
    inkMuted: [0.74, 0.02, 260],
    accent: [0.72, 0.19, 40],
    accentInk: [0.16, 0.02, 260],
  },
  light: {
    bg: [0.985, 0.003, 260],
    surface: [0.955, 0.004, 260],
    ink: [0.2, 0.02, 260],
    inkMuted: [0.42, 0.02, 260],
    accent: [0.54, 0.2, 35],
    accentInk: [0.99, 0.004, 260],
  },
};

const pairs = [
  ['ink on bg', 'ink', 'bg', 4.5],
  ['ink on surface', 'ink', 'surface', 4.5],
  ['inkMuted on bg', 'inkMuted', 'bg', 4.5],
  ['inkMuted on surface', 'inkMuted', 'surface', 4.5],
  ['accent on bg (large text/UI)', 'accent', 'bg', 3],
  ['accentInk on accent', 'accentInk', 'accent', 4.5],
];

let allPass = true;
for (const [themeName, tokens] of Object.entries(themes)) {
  console.log(`\n${themeName}`);
  for (const [label, fg, bg, min] of pairs) {
    const ratio = contrastRatio(tokens[fg], tokens[bg]);
    const pass = ratio >= min;
    allPass &&= pass;
    console.log(
      `  ${pass ? 'PASS' : 'FAIL'}  ${label.padEnd(30)} ${ratio.toFixed(2)}:1 (min ${min}:1)`,
    );
  }
}

process.exit(allPass ? 0 : 1);
