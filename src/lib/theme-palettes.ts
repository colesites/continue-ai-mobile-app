import type { Theme } from "@/lib/theme";

export type Scheme = "light" | "dark";

export type SemanticPalette = {
  radius: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

type SemanticPaletteSource = {
  radius: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function linearToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value;
  }
  return 1.055 * value ** (1 / 2.4) - 0.055;
}

function oklchToRgb(color: string): string {
  const match = color.match(
    /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/i,
  );
  if (!match) {
    throw new Error(`Invalid oklch color token: ${color}`);
  }

  const lightness = Number.parseFloat(match[1]);
  const chroma = Number.parseFloat(match[2]);
  const hue = Number.parseFloat(match[3]);
  const hueRadians = (hue * Math.PI) / 180;

  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  const linearR = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const linearG = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const linearB = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const red = Math.round(clamp(linearToSrgb(linearR), 0, 1) * 255);
  const green = Math.round(clamp(linearToSrgb(linearG), 0, 1) * 255);
  const blue = Math.round(clamp(linearToSrgb(linearB), 0, 1) * 255);

  return `${red} ${green} ${blue}`;
}

function hexToRgb(color: string): string {
  const clean = color.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : clean;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `${red} ${green} ${blue}`;
}

function toRgb(color: string): string {
  if (color.startsWith("oklch(")) {
    return oklchToRgb(color);
  }
  if (color.startsWith("#")) {
    return hexToRgb(color);
  }
  return color;
}

function resolvePalette(source: SemanticPaletteSource): SemanticPalette {
  return {
    radius: source.radius,
    background: toRgb(source.background),
    foreground: toRgb(source.foreground),
    card: toRgb(source.card),
    cardForeground: toRgb(source.cardForeground),
    popover: toRgb(source.popover),
    popoverForeground: toRgb(source.popoverForeground),
    primary: toRgb(source.primary),
    primaryForeground: toRgb(source.primaryForeground),
    secondary: toRgb(source.secondary),
    secondaryForeground: toRgb(source.secondaryForeground),
    muted: toRgb(source.muted),
    mutedForeground: toRgb(source.mutedForeground),
    accent: toRgb(source.accent),
    accentForeground: toRgb(source.accentForeground),
    destructive: toRgb(source.destructive),
    border: toRgb(source.border),
    input: toRgb(source.input),
    ring: toRgb(source.ring),
    chart1: toRgb(source.chart1),
    chart2: toRgb(source.chart2),
    chart3: toRgb(source.chart3),
    chart4: toRgb(source.chart4),
    chart5: toRgb(source.chart5),
    sidebar: toRgb(source.sidebar),
    sidebarForeground: toRgb(source.sidebarForeground),
    sidebarPrimary: toRgb(source.sidebarPrimary),
    sidebarPrimaryForeground: toRgb(source.sidebarPrimaryForeground),
    sidebarAccent: toRgb(source.sidebarAccent),
    sidebarAccentForeground: toRgb(source.sidebarAccentForeground),
    sidebarBorder: toRgb(source.sidebarBorder),
    sidebarRing: toRgb(source.sidebarRing),
  };
}

function withSchemes(
  source: Record<Scheme, SemanticPaletteSource>,
): Record<Scheme, SemanticPalette> {
  return {
    light: resolvePalette(source.light),
    dark: resolvePalette(source.dark),
  };
}

const RAW_PALETTES: Record<Theme, Record<Scheme, SemanticPaletteSource>> = {
  default: {
    light: {
      radius: "8px",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.144 0.004 339.9765904683926)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.144 0.004 339.9765904683926)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.144 0.004 339.9765904683926)",
      primary: "oklch(0.624 0.255 352.0131405922684)",
      primaryForeground: "oklch(0.96 0.003 339.5480951064927)",
      secondary: "oklch(0.908 0.019 339.92851312224747)",
      secondaryForeground: "oklch(0.207 0.03 342.47639842796104)",
      muted: "oklch(0.908 0.019 339.92851312224747)",
      mutedForeground: "oklch(0.528 0.107 343.5945872109025)",
      accent: "oklch(0.747 0.113 12.634461507948759)",
      accentForeground: "oklch(0.2 0.043 14.555924842760131)",
      destructive: "oklch(0.58 0.237 28.43022926835137)",
      border: "oklch(0.832 0.036 340.3900124382026)",
      input: "oklch(0.832 0.036 340.3900124382026)",
      ring: "oklch(0.624 0.255 352.0131405922684)",
      chart1: "oklch(0.624 0.255 352.0131405922684)",
      chart2: "oklch(0.654 0.199 346.00740106649624)",
      chart3: "oklch(0.73 0.132 343.1576592041782)",
      chart4: "oklch(0.43 0.172 350.54166116775815)",
      chart5: "oklch(0.324 0.127 349.69942628112705)",
      sidebar: "oklch(0.908 0.019 339.92851312224747)",
      sidebarForeground: "oklch(0.207 0.03 342.47639842796104)",
      sidebarPrimary: "oklch(0.624 0.255 352.0131405922684)",
      sidebarPrimaryForeground: "oklch(0.96 0.003 339.5480951064927)",
      sidebarAccent: "oklch(0.747 0.113 12.634461507948759)",
      sidebarAccentForeground: "oklch(0.2 0.043 14.555924842760131)",
      sidebarBorder: "oklch(0.832 0.036 340.3900124382026)",
      sidebarRing: "oklch(0.624 0.255 352.0131405922684)",
    },
    dark: {
      radius: "8px",
      background: "oklch(0.142 0.01 346.01689604482107)",
      foreground: "oklch(0.96 0.003 339.5480951064927)",
      card: "oklch(0.226 0.034 348.7375115168543)",
      cardForeground: "oklch(0.96 0.003 339.5480951064927)",
      popover: "oklch(0.226 0.034 348.7375115168543)",
      popoverForeground: "oklch(0.96 0.003 339.5480951064927)",
      primary: "oklch(0.63 0.239 348.9517413410027)",
      primaryForeground: "oklch(0.96 0.003 339.5480951064927)",
      secondary: "oklch(0.259 0.036 342.3143670246248)",
      secondaryForeground: "oklch(0.958 0.01 339.7050036441195)",
      muted: "oklch(0.259 0.036 342.3143670246248)",
      mutedForeground: "oklch(0.71 0.039 340.6400528470448)",
      accent: "oklch(0.27 0.038 338.33782822596083)",
      accentForeground: "oklch(0.921 0.007 336.01695596114143)",
      destructive: "oklch(0.58 0.237 28.43022926835137)",
      border: "oklch(0.246 0.041 349.1609631575777)",
      input: "oklch(0.246 0.041 349.1609631575777)",
      ring: "oklch(0.63 0.239 348.9517413410027)",
      chart1: "oklch(0.63 0.239 348.9517413410027)",
      chart2: "oklch(0.692 0.199 345.54932123448395)",
      chart3: "oklch(0.767 0.153 343.5440137550296)",
      chart4: "oklch(0.456 0.166 348.06383013392343)",
      chart5: "oklch(0.354 0.104 345.7406121023786)",
      sidebar: "oklch(0.142 0.01 346.01689604482107)",
      sidebarForeground: "oklch(0.96 0.003 339.5480951064927)",
      sidebarPrimary: "oklch(0.63 0.239 348.9517413410027)",
      sidebarPrimaryForeground: "oklch(0.96 0.003 339.5480951064927)",
      sidebarAccent: "oklch(0.27 0.038 338.33782822596083)",
      sidebarAccentForeground: "oklch(0.921 0.007 336.01695596114143)",
      sidebarBorder: "oklch(0.246 0.041 349.1609631575777)",
      sidebarRing: "oklch(0.63 0.239 348.9517413410027)",
    },
  },
  emerald: {
    light: {
      radius: "8px",
      background: "oklch(1.000 0.000 0)",
      foreground: "oklch(0.148 0.005 142.87363913138554)",
      card: "oklch(1.000 0.000 0)",
      cardForeground: "oklch(0.148 0.005 142.87363913138554)",
      popover: "oklch(1.000 0.000 0)",
      popoverForeground: "oklch(0.148 0.005 142.87363913138554)",
      primary: "oklch(0.813 0.256 141.96391322418273)",
      primaryForeground: "oklch(0.963 0.004 143.11378224864333)",
      secondary: "oklch(0.957 0.010 143.08533868128447)",
      secondaryForeground: "oklch(0.230 0.035 142.41343535246872)",
      muted: "oklch(0.957 0.010 143.08533868128447)",
      mutedForeground: "oklch(0.611 0.120 142.20814881226218)",
      accent: "oklch(0.882 0.083 158.55345791548442)",
      accentForeground: "oklch(0.244 0.043 155.72592146776853)",
      destructive: "oklch(0.580 0.237 28.43022926835137)",
      border: "oklch(0.886 0.027 142.98995372082507)",
      input: "oklch(0.886 0.027 142.98995372082507)",
      ring: "oklch(0.813 0.256 141.96391322418273)",
      chart1: "oklch(0.813 0.256 141.96391322418273)",
      chart2: "oklch(0.806 0.216 141.95352295065211)",
      chart3: "oklch(0.832 0.149 142.28241407116147)",
      chart4: "oklch(0.562 0.184 142.061122547071)",
      chart5: "oklch(0.421 0.136 141.98993438384792)",
      sidebar: "oklch(0.957 0.010 143.08533868128447)",
      sidebarForeground: "oklch(0.230 0.035 142.41343535246872)",
      sidebarPrimary: "oklch(0.813 0.256 141.96391322418273)",
      sidebarPrimaryForeground: "oklch(0.963 0.004 143.11378224864333)",
      sidebarAccent: "oklch(0.882 0.083 158.55345791548442)",
      sidebarAccentForeground: "oklch(0.244 0.043 155.72592146776853)",
      sidebarBorder: "oklch(0.886 0.027 142.98995372082507)",
      sidebarRing: "oklch(0.813 0.256 141.96391322418273)",
    },
    dark: {
      radius: "8px",
      background: "oklch(0.205 0.029 142.46372948609255)",
      foreground: "oklch(0.963 0.004 143.11378224864333)",
      card: "oklch(0.255 0.041 142.37609384561063)",
      cardForeground: "oklch(0.963 0.004 143.11378224864333)",
      popover: "oklch(0.255 0.041 142.37609384561063)",
      popoverForeground: "oklch(0.963 0.004 143.11378224864333)",
      primary: "oklch(0.802 0.220 141.94162263209196)",
      primaryForeground: "oklch(0.963 0.004 143.11378224864333)",
      secondary: "oklch(0.327 0.041 142.53955755381241)",
      secondaryForeground: "oklch(0.966 0.013 143.0737849400859)",
      muted: "oklch(0.327 0.041 142.53955755381241)",
      mutedForeground: "oklch(0.741 0.047 142.8367196064337)",
      accent: "oklch(0.811 0.170 154.09149175018496)",
      accentForeground: "oklch(0.969 0.017 160.60429681925515)",
      destructive: "oklch(0.580 0.237 28.43022926835137)",
      border: "oklch(0.440 0.071 142.3628208078975)",
      input: "oklch(0.440 0.071 142.3628208078975)",
      ring: "oklch(0.802 0.220 141.94162263209196)",
      chart1: "oklch(0.802 0.220 141.94162263209196)",
      chart2: "oklch(0.843 0.217 141.9813147248773)",
      chart3: "oklch(0.885 0.172 142.21632891386867)",
      chart4: "oklch(0.582 0.178 141.93182431611223)",
      chart5: "oklch(0.434 0.114 141.96857605482037)",
      sidebar: "oklch(0.349 0.062 142.2909086694026)",
      sidebarForeground: "oklch(0.963 0.004 143.11378224864333)",
      sidebarPrimary: "oklch(0.802 0.220 141.94162263209196)",
      sidebarPrimaryForeground: "oklch(0.963 0.004 143.11378224864333)",
      sidebarAccent: "oklch(0.811 0.170 154.09149175018496)",
      sidebarAccentForeground: "oklch(0.969 0.017 160.60429681925515)",
      sidebarBorder: "oklch(0.440 0.071 142.3628208078975)",
      sidebarRing: "oklch(0.802 0.220 141.94162263209196)",
    },
  },
  chelsea: {
    light: {
      radius: "8px",
      background: "oklch(0.974 0.007 254.99415061247748)",
      foreground: "oklch(0.245 0.073 260.52364584123814)",
      card: "oklch(0.974 0.007 254.99415061247748)",
      cardForeground: "oklch(0.245 0.073 260.52364584123814)",
      popover: "oklch(0.974 0.007 254.99415061247748)",
      popoverForeground: "oklch(0.245 0.073 260.52364584123814)",
      primary: "oklch(0.412 0.143 256.8203792327415)",
      primaryForeground: "oklch(1.000 0.000 0)",
      secondary: "oklch(0.470 0.170 257.48565226119246)",
      secondaryForeground: "oklch(0.210 0.019 252.1008211352249)",
      muted: "oklch(0.470 0.170 257.48565226119246)",
      mutedForeground: "oklch(0.537 0.069 252.37068402199122)",
      accent: "oklch(0.744 0.150 82.40311777122993)",
      accentForeground: "oklch(0.243 0.033 88.35550234146056)",
      destructive: "oklch(0.580 0.237 28.43022926835137)",
      border: "oklch(0.821 0.092 252.24279788675148)",
      input: "oklch(0.821 0.092 252.24279788675148)",
      ring: "oklch(0.412 0.143 256.8203792327415)",
      chart1: "oklch(0.412 0.143 256.8203792327415)",
      chart2: "oklch(0.658 0.133 253.18883052025075)",
      chart3: "oklch(0.743 0.085 252.25937807595975)",
      chart4: "oklch(0.408 0.129 255.84940334705084)",
      chart5: "oklch(0.312 0.093 255.21911378760365)",
      sidebar: "oklch(0.470 0.170 257.48565226119246)",
      sidebarForeground: "oklch(0.210 0.019 252.1008211352249)",
      sidebarPrimary: "oklch(0.412 0.143 256.8203792327415)",
      sidebarPrimaryForeground: "oklch(1.000 0.000 0)",
      sidebarAccent: "oklch(0.744 0.150 82.40311777122993)",
      sidebarAccentForeground: "oklch(0.243 0.033 88.35550234146056)",
      sidebarBorder: "oklch(0.821 0.092 252.24279788675148)",
      sidebarRing: "oklch(0.412 0.143 256.8203792327415)",
    },
    dark: {
      radius: "8px",
      background: "oklch(0.188 0.016 252.04811617711775)",
      foreground: "oklch(0.981 0.007 261.5115364181788)",
      card: "oklch(0.231 0.023 252.1424165180297)",
      cardForeground: "oklch(0.981 0.007 261.5115364181788)",
      popover: "oklch(0.231 0.023 252.1424165180297)",
      popoverForeground: "oklch(0.981 0.007 261.5115364181788)",
      primary: "oklch(0.455 0.147 256.14361381536565)",
      primaryForeground: "oklch(0.961 0.002 251.4690624152714)",
      secondary: "oklch(0.262 0.085 254.6829001874364)",
      secondaryForeground: "oklch(0.960 0.007 251.50690409700076)",
      muted: "oklch(0.262 0.085 254.6829001874364)",
      mutedForeground: "oklch(0.716 0.025 251.71477744583018)",
      accent: "oklch(0.729 0.147 82.60283334999859)",
      accentForeground: "oklch(0.970 0.013 88.8717324995499)",
      destructive: "oklch(0.580 0.237 28.43022926835137)",
      border: "oklch(0.367 0.133 256.83638423648074)",
      input: "oklch(0.367 0.133 256.83638423648074)",
      ring: "oklch(0.455 0.147 256.14361381536565)",
      chart1: "oklch(0.455 0.147 256.14361381536565)",
      chart2: "oklch(0.698 0.132 253.00252180083544)",
      chart3: "oklch(0.780 0.099 252.35734699468182)",
      chart4: "oklch(0.449 0.116 254.22192862982882)",
      chart5: "oklch(0.357 0.069 253.07840387507667)",
      sidebar: "oklch(0.312 0.035 252.24785742773832)",
      sidebarForeground: "oklch(0.961 0.002 251.4690624152714)",
      sidebarPrimary: "oklch(0.455 0.147 256.14361381536565)",
      sidebarPrimaryForeground: "oklch(0.961 0.002 251.4690624152714)",
      sidebarAccent: "oklch(0.729 0.147 82.60283334999859)",
      sidebarAccentForeground: "oklch(0.970 0.013 88.8717324995499)",
      sidebarBorder: "oklch(0.360 0.042 252.28742912940533)",
      sidebarRing: "oklch(0.455 0.147 256.14361381536565)",
    },
  },
  amethyst: {
    light: {
      radius: "8px",
      background: "oklch(1.000 0.000 0)",
      foreground: "oklch(0.144 0.005 318.3704213660966)",
      card: "oklch(1.000 0.000 0)",
      cardForeground: "oklch(0.144 0.005 318.3704213660966)",
      popover: "oklch(1.000 0.000 0)",
      popoverForeground: "oklch(0.144 0.005 318.3704213660966)",
      primary: "oklch(0.603 0.267 316.3767413595733)",
      primaryForeground: "oklch(0.960 0.004 318.32646315346904)",
      secondary: "oklch(0.950 0.010 318.3203355716297)",
      secondaryForeground: "oklch(0.205 0.034 318.1247337729461)",
      muted: "oklch(0.950 0.010 318.3203355716297)",
      mutedForeground: "oklch(0.520 0.120 317.98264133889177)",
      accent: "oklch(0.810 0.097 336.48815102493035)",
      accentForeground: "oklch(0.207 0.052 338.61088005321943)",
      destructive: "oklch(0.580 0.237 28.43022926835137)",
      border: "oklch(0.867 0.026 318.3004695155728)",
      input: "oklch(0.867 0.026 318.3004695155728)",
      ring: "oklch(0.603 0.267 316.3767413595733)",
      chart1: "oklch(0.603 0.267 316.3767413595733)",
      chart2: "oklch(0.636 0.222 317.45445634435475)",
      chart3: "oklch(0.720 0.149 318.04474702963864)",
      chart4: "oklch(0.408 0.192 315.6450083392257)",
      chart5: "oklch(0.309 0.142 316.04671362827025)",
      sidebar: "oklch(0.950 0.010 318.3203355716297)",
      sidebarForeground: "oklch(0.205 0.034 318.1247337729461)",
      sidebarPrimary: "oklch(0.603 0.267 316.3767413595733)",
      sidebarPrimaryForeground: "oklch(0.960 0.004 318.32646315346904)",
      sidebarAccent: "oklch(0.810 0.097 336.48815102493035)",
      sidebarAccentForeground: "oklch(0.207 0.052 338.61088005321943)",
      sidebarBorder: "oklch(0.867 0.026 318.3004695155728)",
      sidebarRing: "oklch(0.603 0.267 316.3767413595733)",
    },
    dark: {
      radius: "8px",
      background: "oklch(0.184 0.028 318.14868087282866)",
      foreground: "oklch(0.960 0.004 318.32646315346904)",
      card: "oklch(0.225 0.040 318.104853813231)",
      cardForeground: "oklch(0.960 0.004 318.32646315346904)",
      popover: "oklch(0.225 0.040 318.104853813231)",
      popoverForeground: "oklch(0.960 0.004 318.32646315346904)",
      primary: "oklch(0.628 0.226 317.3760303636354)",
      primaryForeground: "oklch(0.960 0.004 318.32646315346904)",
      secondary: "oklch(0.297 0.040 318.17982407703136)",
      secondaryForeground: "oklch(0.957 0.012 318.31792262341617)",
      muted: "oklch(0.297 0.040 318.17982407703136)",
      mutedForeground: "oklch(0.708 0.045 318.2667326504138)",
      accent: "oklch(0.661 0.209 339.815208177371)",
      accentForeground: "oklch(0.955 0.018 334.8614099153804)",
      destructive: "oklch(0.580 0.237 28.43022926835137)",
      border: "oklch(0.387 0.070 318.0972929048834)",
      input: "oklch(0.387 0.070 318.0972929048834)",
      ring: "oklch(0.628 0.226 317.3760303636354)",
      chart1: "oklch(0.628 0.226 317.3760303636354)",
      chart2: "oklch(0.674 0.222 317.5804713757914)",
      chart3: "oklch(0.756 0.172 317.99029983130515)",
      chart4: "oklch(0.438 0.184 316.74573125134833)",
      chart5: "oklch(0.345 0.116 317.5293370267737)",
      sidebar: "oklch(0.302 0.062 318.050921084113)",
      sidebarForeground: "oklch(0.960 0.004 318.32646315346904)",
      sidebarPrimary: "oklch(0.628 0.226 317.3760303636354)",
      sidebarPrimaryForeground: "oklch(0.960 0.004 318.32646315346904)",
      sidebarAccent: "oklch(0.661 0.209 339.815208177371)",
      sidebarAccentForeground: "oklch(0.955 0.018 334.8614099153804)",
      sidebarBorder: "oklch(0.387 0.070 318.0972929048834)",
      sidebarRing: "oklch(0.628 0.226 317.3760303636354)",
    },
  },
  normal: {
    light: {
      radius: "8px",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.1 0 0)",
      card: "oklch(0.99 0 0)",
      cardForeground: "oklch(0.1 0 0)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.1 0 0)",
      primary: "oklch(0 0 0)",
      primaryForeground: "oklch(1 0 0)",
      secondary: "oklch(0.97 0 0)",
      secondaryForeground: "oklch(0.2 0 0)",
      muted: "oklch(0.97 0 0)",
      mutedForeground: "oklch(0.4 0 0)",
      accent: "oklch(0.95 0 0)",
      accentForeground: "oklch(0.1 0 0)",
      destructive: "oklch(0.5 0.2 25)",
      border: "oklch(0.92 0 0)",
      input: "oklch(0.92 0 0)",
      ring: "oklch(0.1 0 0)",
      chart1: "oklch(0 0 0)",
      chart2: "oklch(0.2 0 0)",
      chart3: "oklch(0.4 0 0)",
      chart4: "oklch(0.6 0 0)",
      chart5: "oklch(0.8 0 0)",
      sidebar: "oklch(0.985 0 0)",
      sidebarForeground: "oklch(0.2 0 0)",
      sidebarPrimary: "oklch(0.1 0 0)",
      sidebarPrimaryForeground: "oklch(0.985 0 0)",
      sidebarAccent: "oklch(0.96 0 0)",
      sidebarAccentForeground: "oklch(0.1 0 0)",
      sidebarBorder: "oklch(0.92 0 0)",
      sidebarRing: "oklch(0.1 0 0)",
    },
    dark: {
      radius: "8px",
      background: "oklch(0 0 0)",
      foreground: "oklch(0.98 0 0)",
      card: "oklch(0.12 0 0)",
      cardForeground: "oklch(0.98 0 0)",
      popover: "oklch(0.08 0 0)",
      popoverForeground: "oklch(0.98 0 0)",
      primary: "oklch(1 0 0)",
      primaryForeground: "oklch(0 0 0)",
      secondary: "oklch(0.15 0 0)",
      secondaryForeground: "oklch(0.98 0 0)",
      muted: "oklch(0.15 0 0)",
      mutedForeground: "oklch(0.6 0 0)",
      accent: "oklch(0.18 0 0)",
      accentForeground: "oklch(1 0 0)",
      destructive: "oklch(0.4 0.15 25)",
      border: "oklch(0.2 0 0)",
      input: "oklch(0.2 0 0)",
      ring: "oklch(0.9 0 0)",
      chart1: "oklch(1 0 0)",
      chart2: "oklch(0.8 0 0)",
      chart3: "oklch(0.6 0 0)",
      chart4: "oklch(0.4 0 0)",
      chart5: "oklch(0.2 0 0)",
      sidebar: "oklch(0.05 0 0)",
      sidebarForeground: "oklch(0.98 0 0)",
      sidebarPrimary: "oklch(1 0 0)",
      sidebarPrimaryForeground: "oklch(0 0 0)",
      sidebarAccent: "oklch(0.12 0 0)",
      sidebarAccentForeground: "oklch(1 0 0)",
      sidebarBorder: "oklch(0.18 0 0)",
      sidebarRing: "oklch(0.9 0 0)",
    },
  },
};

const PALETTES: Record<Theme, Record<Scheme, SemanticPalette>> = {
  default: withSchemes(RAW_PALETTES.default),
  emerald: withSchemes(RAW_PALETTES.emerald),
  chelsea: withSchemes(RAW_PALETTES.chelsea),
  amethyst: withSchemes(RAW_PALETTES.amethyst),
  normal: withSchemes(RAW_PALETTES.normal),
};

export function getThemePalette(theme: Theme, scheme: Scheme): SemanticPalette {
  return PALETTES[theme][scheme];
}

export function toThemeVars(palette: SemanticPalette): Record<string, string> {
  return {
    "--radius": palette.radius,
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--card": palette.card,
    "--card-foreground": palette.cardForeground,
    "--popover": palette.popover,
    "--popover-foreground": palette.popoverForeground,
    "--primary": palette.primary,
    "--primary-foreground": palette.primaryForeground,
    "--secondary": palette.secondary,
    "--secondary-foreground": palette.secondaryForeground,
    "--muted": palette.muted,
    "--muted-foreground": palette.mutedForeground,
    "--accent": palette.accent,
    "--accent-foreground": palette.accentForeground,
    "--destructive": palette.destructive,
    "--border": palette.border,
    "--input": palette.input,
    "--ring": palette.ring,
    "--chart-1": palette.chart1,
    "--chart-2": palette.chart2,
    "--chart-3": palette.chart3,
    "--chart-4": palette.chart4,
    "--chart-5": palette.chart5,
    "--sidebar": palette.sidebar,
    "--sidebar-foreground": palette.sidebarForeground,
    "--sidebar-primary": palette.sidebarPrimary,
    "--sidebar-primary-foreground": palette.sidebarPrimaryForeground,
    "--sidebar-accent": palette.sidebarAccent,
    "--sidebar-accent-foreground": palette.sidebarAccentForeground,
    "--sidebar-border": palette.sidebarBorder,
    "--sidebar-ring": palette.sidebarRing,
  };
}
