/**
 * Tactile Terminal Atelier — a dark editorial workbench with a preview-first flow.
 * Phosphor green is reserved for controls and active states; wallpaper art remains the focal point.
 */
import { useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ChevronDown,
  CircleDot,
  Dice5,
  Maximize2,
  RotateCcw,
  WandSparkles,
} from "lucide-react";

type Mode =
  | "stacked_cards"
  | "diagonal_waves"
  | "liquid_waves"
  | "curves"
  | "stripes"
  | "waves"
  | "arches"
  | "soft_tiles"
  | "diamond_field"
  | "sunburst"
  | "orbit_grid";

type PatternConfig = {
  title: string;
  shortTitle: string;
  subtitle: string;
  labels: [string, string, string];
  units: [string, string, string];
  min: [number, number, number];
  max: [number, number, number];
  defaults: [number, number, number];
};

const patternConfig: Record<Mode, PatternConfig> = {
  stacked_cards: {
    title: "層疊卡片",
    shortTitle: "STACKED CARDS",
    subtitle: "以邊到邊的紙張層次，裁出鮮明的色彩節奏。",
    labels: ["基準高度", "層級間距", "圓角尺度"],
    units: ["px", "px", "px"],
    min: [1000, 50, 0],
    max: [3500, 400, 500],
    defaults: [2200, 150, 200],
  },
  diagonal_waves: {
    title: "斜向波紋",
    shortTitle: "DIAGONAL WAVES",
    subtitle: "讓色帶沿著對角線跨越整個畫面。",
    labels: ["起伏振幅", "波紋長度", "色帶寬度"],
    units: ["px", "px", "px"],
    min: [0, 500, 200],
    max: [1500, 3000, 1500],
    defaults: [350, 1500, 600],
  },
  liquid_waves: {
    title: "礦物液態",
    shortTitle: "LIQUID MINERAL",
    subtitle: "為螢幕注入平靜而富有流動感的顏料帶。",
    labels: ["液態振幅", "波紋長度", "垂直間距"],
    units: ["px", "px", "px"],
    min: [10, 200, 100],
    max: [600, 1500, 1000],
    defaults: [140, 640, 420],
  },
  curves: {
    title: "正弦流線",
    shortTitle: "SINE CURVES",
    subtitle: "以平行線條勾勒更輕盈的動態秩序。",
    labels: ["線條粗度", "波紋長度", "線條振幅"],
    units: ["px", "px", "px"],
    min: [50, 200, 0],
    max: [600, 1500, 800],
    defaults: [160, 700, 260],
  },
  stripes: {
    title: "垂直條紋",
    shortTitle: "VERTICAL STRIPES",
    subtitle: "以乾淨、規律的色塊建立一個有力的桌面背景。",
    labels: ["條紋寬度", "傾斜角度", "重複次數"],
    units: ["px", "°", "×"],
    min: [100, -2160, 1],
    max: [1000, 2160, 10],
    defaults: [360, 0, 1],
  },
  waves: {
    title: "山脈波層",
    shortTitle: "LAYERED WAVES",
    subtitle: "在大面積色域之間，留下平衡的地形感。",
    labels: ["波峰高度", "水平偏移", "垂直間距"],
    units: ["px", "px", "px"],
    min: [0, -1000, 200],
    max: [1000, 1000, 1000],
    defaults: [250, 100, 600],
  },
  arches: {
    title: "同心拱門",
    shortTitle: "CONCENTRIC ARCHES",
    subtitle: "把經典印刷構圖裁進一個充滿張力的行動比例。",
    labels: ["拱門粗度", "中心 X 軸", "中心 Y 軸"],
    units: ["px", "px", "px"],
    min: [100, -1000, -1000],
    max: [1000, 3160, 5000],
    defaults: [500, 2400, -300],
  },
  soft_tiles: {
    title: "交錯柔波",
    shortTitle: "SOFT TILES",
    subtitle: "以柔和圓弧交錯出連續、沉靜的色彩地形。",
    labels: ["曲線幅度", "條帶寬度", "流動間距"],
    units: ["px", "px", "px"],
    min: [150, 300, 600],
    max: [800, 850, 2000],
    defaults: [460, 500, 1100],
  },
  diamond_field: {
    title: "菱形田野",
    shortTitle: "DIAMOND FIELD",
    subtitle: "以交錯菱格建立有節奏的印刷式色面。",
    labels: ["菱形寬度", "菱形高度", "網格位移"],
    units: ["px", "px", "px"],
    min: [180, 160, -360],
    max: [720, 620, 360],
    defaults: [420, 330, 0],
  },
  sunburst: {
    title: "放射扇面",
    shortTitle: "SUNBURST",
    subtitle: "從可移動中心向外裁出強烈、乾淨的色彩光束。",
    labels: ["光束數量", "中心 X 軸", "中心 Y 軸"],
    units: ["條", "px", "px"],
    min: [6, 0, 0],
    max: [32, 2160, 4680],
    defaults: [16, 1080, 2340],
  },
  orbit_grid: {
    title: "軌道網格",
    shortTitle: "ORBIT GRID",
    subtitle: "用密集圓環與偏移軸線疊出克制的宇宙秩序。",
    labels: ["圓環尺度", "線條粗度", "網格偏移"],
    units: ["px", "px", "px"],
    min: [220, 20, -360],
    max: [900, 200, 360],
    defaults: [560, 75, 0],
  },
};

const palettes: Record<Mode, { bg: string; layers: string[] }> = {
  stacked_cards: {
    bg: "#F2EFE9",
    layers: ["#13334C", "#1D5B79", "#25969E", "#468B71", "#83B24F", "#C4BA4B", "#F0B843", "#F08A4B", "#F25C5C", "#8C52AA"],
  },
  diagonal_waves: { bg: "#2B4D2E", layers: ["#2B4D2E", "#5E9646", "#94C455", "#F2E8CF", "#FC6D5B", "#C93F41"] },
  liquid_waves: { bg: "#0C1A30", layers: ["#F472B6", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6"] },
  curves: { bg: "#0F172A", layers: ["#3891E0", "#FC56B8", "#FFFFFF", "#5EDC7F", "#F18231", "#FFDA3E", "#884FB7"] },
  stripes: { bg: "#E5404B", layers: ["#E5404B", "#F18231", "#FFDA3E", "#6AD77A", "#2D80B9", "#884FB7"] },
  waves: { bg: "#3B0909", layers: ["#F46299", "#F75C6D", "#B72B3E", "#F07C3E", "#F69947", "#FBC952", "#F69947"] },
  arches: { bg: "#FF453A", layers: ["#FF9F0A", "#FFD60A", "#32D74B", "#0A84FF", "#5E5CE6", "#FF375F", "#FF9F0A"] },
  soft_tiles: { bg: "#376B49", layers: ["#376B49", "#6FA04E", "#B1CF59", "#F3E8CB", "#FF6B5A", "#D94E46"] },
  diamond_field: { bg: "#10151C", layers: ["#D8683B", "#E2B868", "#F0E7D3", "#377987", "#B94555", "#1F3B56"] },
  sunburst: { bg: "#F2E8D5", layers: ["#F2E8D5", "#EAB451", "#E57148", "#BC4451", "#5D405D", "#2D5C6E"] },
  orbit_grid: { bg: "#EAE2D3", layers: ["#163A54", "#22748B", "#D7A347", "#CC5C48", "#6F7E49", "#D9D2C3"] },
};

type ColorTheme = { id: string; title: string; background: string; layers: string[] };

const colorThemes: ColorTheme[] = [
  { id: "signal-ink", title: "訊號墨綠", background: "#101B1A", layers: ["#244F4D", "#4A857D", "#9BCF8A", "#E6D38E", "#F07A59", "#C64B4A"] },
  { id: "paper-riso", title: "紙感孔版", background: "#F1E8D7", layers: ["#26364A", "#47758A", "#D6A23F", "#D86D4F", "#B64F61", "#563D63"] },
  { id: "cobalt-citrus", title: "鈷藍柑橘", background: "#102B4E", layers: ["#174A7A", "#2D83A8", "#8FC7A6", "#F2D157", "#F28845", "#D8504D"] },
  { id: "orchid-night", title: "蘭夜殘光", background: "#201A36", layers: ["#3D2C60", "#6B4E8D", "#B56FA1", "#E9A67B", "#E9D6A3", "#8AA49B"] },
  { id: "clay-studio", title: "陶土工作室", background: "#35271F", layers: ["#704735", "#AE6841", "#D99B5C", "#E6C99A", "#A8B487", "#54756D"] },
];

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`;
const assets = {
  mark: assetUrl("wallgen-mark.png"),
  paperStage: assetUrl("wallgen-paper-stage.png"),
  stacked: assetUrl("wallgen-stacked-editorial.png"),
  liquid: assetUrl("wallgen-liquid-mineral.png"),
  arches: assetUrl("wallgen-arches-screenprint.png"),
  softTiles: assetUrl("wallgen-soft-tiles-reference.jpeg"),
};

const presets: Array<{ mode: Mode; title: string; asset: string }> = [
  { mode: "stacked_cards", title: "切紙層次", asset: assets.stacked },
  { mode: "liquid_waves", title: "礦物波帶", asset: assets.liquid },
  { mode: "arches", title: "螢幕印刷", asset: assets.arches },
  { mode: "soft_tiles", title: "交錯柔波", asset: assets.softTiles },
];

function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}

function makeWavePath(baseY: number, amplitude: number, wavelength: number, startX: number, endX: number, step = 55) {
  let d = `M ${startX},${baseY}`;
  for (let x = startX; x <= endX; x += step) d += ` L ${x},${baseY + amplitude * Math.sin(x / wavelength)}`;
  return d;
}

export default function Home() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<Mode>("stacked_cards");
  const [geometry, setGeometry] = useState<[number, number, number]>(patternConfig.stacked_cards.defaults);
  const [background, setBackground] = useState(palettes.stacked_cards.bg);
  const [layers, setLayers] = useState(palettes.stacked_cards.layers);
  const [exporting, setExporting] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const config = patternConfig[mode];
  const backgroundVisible = mode !== "stripes" && mode !== "diagonal_waves" && mode !== "soft_tiles" && mode !== "sunburst";

  const modeNumber = (Object.keys(patternConfig) as Mode[]).indexOf(mode) + 1;
  const modeTotal = Object.keys(patternConfig).length;
  const svgArtwork = useMemo(() => {
    const [a, b, c] = geometry;

    if (mode === "stacked_cards") {
      return [...layers].reverse().map((color, reverseIndex) => {
        const index = layers.length - 1 - reverseIndex;
        return <rect key={`${color}-${index}`} x="-100" y="-200" width="2360" height={a + index * b + 200} rx={c} fill={color} filter="url(#card-shadow)" />;
      });
    }
    if (mode === "diagonal_waves") {
      const rows = Math.ceil(13000 / (c * layers.length));
      return (
        <g transform="rotate(-45 1080 2340)">
          {Array.from({ length: rows }).flatMap((_, round) => layers.map((color, index) => {
            const baseY = -5000 + (round * layers.length + index) * c;
            return <path key={`${round}-${index}`} d={`${makeWavePath(baseY, a, b, -4000, 6000)} L 6000,10000 L -4000,10000 Z`} fill={color} />;
          }))}
        </g>
      );
    }
    if (mode === "liquid_waves") {
      return layers.map((color, index) => {
        const baseY = 600 + index * c;
        let d = `M -200,${baseY}`;
        for (let x = -200; x <= 2360; x += 25) d += ` L ${x},${baseY + a * Math.sin(x / b + index * 0.6)}`;
        return <path key={color} d={`${d} L 2360,4800 L -200,4800 Z`} fill={color} />;
      });
    }
    if (mode === "curves") {
      const startBaseX = 1080 - ((layers.length - 1) * a * 0.85) / 2;
      return layers.map((color, index) => {
        let d = "";
        for (let y = -200; y <= 4880; y += 25) {
          const x = startBaseX + index * a * 0.85 + c * Math.sin(y / b + index * 0.15);
          d += y === -200 ? `M ${x},${y}` : ` L ${x},${y}`;
        }
        return <path key={color} d={d} stroke={color} strokeWidth={a} fill="none" strokeLinecap="round" />;
      });
    }
    if (mode === "stripes") {
      const repeats = Math.ceil(8000 / (a * layers.length)) + 2;
      return (
        <g transform={b ? `rotate(${b / 15} 1080 2340)` : undefined}>
          {Array.from({ length: repeats * c }).flatMap((_, repeat) => layers.map((color, index) => (
            <rect key={`${repeat}-${index}`} x={-2920 + (repeat * layers.length + index) * a} y="-3000" width={a} height="10000" fill={color} />
          )))}
        </g>
      );
    }
    if (mode === "waves") {
      return layers.map((color, index) => {
        const y = 300 + index * c;
        const direction = index % 2 === 0 ? 1 : -1;
        return <path key={`${color}-${index}`} d={`M -200,${y} C 700,${y + a * direction} 1400,${y - a * direction} 2360,${y + b} L 2360,4800 L -200,4800 Z`} fill={color} />;
      });
    }
    if (mode === "soft_tiles") {
      return (
        <g transform="rotate(-13 1080 2340)">
          <rect x="-1500" y="-1500" width="5160" height="7680" fill={layers[0]} />
          {layers.slice(1).map((color, index) => {
            const baseX = -240 + (index + 1) * b;
            let d = "";
            for (let y = -1500; y <= 6200; y += 36) {
              const x = baseX + a * Math.sin(y / c + index * 0.58);
              d += y === -1500 ? `M ${x},${y}` : ` L ${x},${y}`;
            }
            return <path key={`${color}-${index}`} d={`${d} L 3660,6200 L 3660,-1500 Z`} fill={color} />;
          })}
        </g>
      );
    }
    if (mode === "diamond_field") {
      const columns = Math.ceil(2600 / a) + 3;
      const rows = Math.ceil(5200 / b) + 3;
      return Array.from({ length: rows }).flatMap((_, row) => Array.from({ length: columns }).map((__, column) => {
        const centerX = -a + column * a + (row % 2 ? a / 2 : 0) + c;
        const centerY = -b + row * b;
        const color = layers[(row + column) % layers.length];
        return <polygon key={`${row}-${column}`} points={`${centerX},${centerY - b / 2} ${centerX + a / 2},${centerY} ${centerX},${centerY + b / 2} ${centerX - a / 2},${centerY}`} fill={color} />;
      }));
    }
    if (mode === "sunburst") {
      const rayCount = Math.round(a);
      const radius = 7000;
      return Array.from({ length: rayCount }).map((_, index) => {
        const startAngle = (index / rayCount) * Math.PI * 2 - Math.PI / 2;
        const endAngle = ((index + 1) / rayCount) * Math.PI * 2 - Math.PI / 2;
        const startX = b + Math.cos(startAngle) * radius;
        const startY = c + Math.sin(startAngle) * radius;
        const endX = b + Math.cos(endAngle) * radius;
        const endY = c + Math.sin(endAngle) * radius;
        return <polygon key={index} points={`${b},${c} ${startX},${startY} ${endX},${endY}`} fill={layers[index % layers.length]} />;
      });
    }
    if (mode === "orbit_grid") {
      const columns = Math.ceil(2700 / a) + 2;
      const rows = Math.ceil(5200 / a) + 2;
      return Array.from({ length: rows }).flatMap((_, row) => Array.from({ length: columns }).map((__, column) => {
        const cx = -a + column * a + (row % 2 ? a / 2 : 0) + c;
        const cy = -a + row * a;
        return <circle key={`${row}-${column}`} cx={cx} cy={cy} r={a * 0.39} fill="none" stroke={layers[(row * 2 + column) % layers.length]} strokeWidth={b} />;
      }));
    }
    return (
      <>
        {layers.map((color, index) => <circle key={`${color}-${index}`} cx={b} cy={c} r={(layers.length - index + 1) * a} stroke={color} strokeWidth={a} fill="none" />)}
        <circle cx={b} cy={c} r={a / 2} fill={layers[layers.length - 1]} />
      </>
    );
  }, [background, geometry, layers, mode]);

  const selectMode = (nextMode: Mode) => {
    setMode(nextMode);
    setGeometry(patternConfig[nextMode].defaults);
    setBackground(palettes[nextMode].bg);
    setLayers(palettes[nextMode].layers);
  };

  const updateSlider = (index: number, value: number) => {
    setGeometry((previous) => previous.map((item, itemIndex) => itemIndex === index ? value : item) as [number, number, number]);
  };

  const updateLayer = (index: number, value: string) => {
    setLayers((previous) => previous.map((color, colorIndex) => colorIndex === index ? value : color));
  };

  const applyColorTheme = (theme: ColorTheme) => {
    setBackground(theme.background);
    setLayers([...theme.layers]);
  };

  const randomize = () => {
    if (backgroundVisible) setBackground(randomHex());
    setLayers((previous) => previous.map(() => randomHex()));
  };

  const reset = () => selectMode(mode);

  const applyPreset = (nextMode: Mode) => {
    selectMode(nextMode);
    setPresetsOpen(false);
  };

  const exportWallpaper = async () => {
    if (!svgRef.current || exporting) return;
    setExporting(true);
    try {
      const serialized = new XMLSerializer().serializeToString(svgRef.current);
      const svgData = serialized.includes("xmlns=") ? serialized : serialized.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("無法轉換輸出圖像"));
        image.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 2160;
      canvas.height = 4680;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("無法建立輸出畫布");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1));
      if (!png) throw new Error("無法產生 PNG 檔案");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(png);
      link.download = `WallGen-4K-${mode}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1200);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="atelier-shell">
      <div className="atelier-grain" aria-hidden="true" />
      <header className="atelier-header">
        <a className="brand" href="#workspace" aria-label="WallGen 工作台">
          <img src={assets.mark} alt="" className="brand-mark" />
          <span className="brand-wordmark"><b>WALL</b><i>/</i><b>GEN</b></span>
          <span className="brand-edition">4K STUDIO</span>
        </a>
        <div className="header-meta">
          <span><CircleDot size={13} /> LIVE CANVAS</span>
          <span className="desktop-only">2160 × 4680 PX</span>
          <button className="help-button" type="button" aria-label="檢視工作台資訊">?</button>
        </div>
      </header>

      <section className="workspace" id="workspace">
        <aside className="control-rail" aria-label="桌布參數控制">
          <div className="rail-head">
            <div><span className="section-number">01</span><p>幾何參數</p></div>
            <button className="reset-button" type="button" onClick={reset}><RotateCcw size={14} /> 重設</button>
          </div>

          <div className="control-section geometry-section geometry-primary">
            <div className="section-title"><p>尺度調整</p><span className="measure-tag">03 AXES</span></div>
            {config.labels.map((label, index) => (
              <label className="slider-control" key={label}>
                <span><b>{label}</b><output>{geometry[index].toLocaleString()}{config.units[index]}</output></span>
                <input type="range" min={config.min[index]} max={config.max[index]} value={geometry[index]} onChange={(event) => updateSlider(index, Number(event.target.value))} style={{ "--fill": `${((geometry[index] - config.min[index]) / (config.max[index] - config.min[index])) * 100}%` } as React.CSSProperties} />
                <small>{config.min[index].toLocaleString()}{config.units[index]}<i />{config.max[index].toLocaleString()}{config.units[index]}</small>
              </label>
            ))}
          </div>

          <div className="composition-section">
            <div className="section-title"><span className="section-number">02</span><p>構圖方式</p></div>
            <div className="mode-select-wrap">
              <label htmlFor="render-mode">選取圖樣</label>
              <select id="render-mode" value={mode} onChange={(event) => selectMode(event.target.value as Mode)}>
                {(Object.keys(patternConfig) as Mode[]).map((item) => <option key={item} value={item}>{patternConfig[item].title} · {patternConfig[item].shortTitle}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
            <div className="active-mode-caption"><span>模式 {String(modeNumber).padStart(2, "0")}</span><strong>{config.shortTitle}</strong><p>{config.subtitle}</p></div>
          </div>

          <div className="control-section color-section">
            <div className="section-title"><span className="section-number">03</span><p>顏色編輯</p><span className="measure-tag">{layers.length} TONES</span></div>
            <div className="theme-library" aria-label="精選調色盤">
              <span className="theme-library-label">精選調色盤</span>
              <div className="theme-grid">
                {colorThemes.map((theme) => (
                  <button className={`theme-chip ${theme.layers.join("") === layers.join("") ? "is-active" : ""}`} type="button" key={theme.id} onClick={() => applyColorTheme(theme)} aria-label={`套用${theme.title}配色`}>
                    <span className="theme-bars" aria-hidden="true">{theme.layers.slice(0, 4).map((color) => <i key={color} style={{ background: color }} />)}</span>
                    <span>{theme.title}</span>
                  </button>
                ))}
              </div>
            </div>
            {backgroundVisible && (
              <label className="base-color-control">
                <span>底色</span>
                <span className="color-edit" style={{ "--color": background } as React.CSSProperties}><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} aria-label="變更底色" /><code>{background}</code></span>
              </label>
            )}
            <div className="swatch-grid" aria-label="圖層顏色">
              {layers.map((color, index) => (
                <label className="swatch-control" key={`${color}-${index}`}>
                  <input type="color" value={color} onChange={(event) => updateLayer(index, event.target.value)} aria-label={`變更第 ${index + 1} 層顏色`} />
                  <span style={{ background: color }} />
                  <b>{String(index + 1).padStart(2, "0")}</b>
                </label>
              ))}
            </div>
          </div>

          <div className="rail-actions">
            <button className="subtle-action" type="button" onClick={randomize}><Dice5 size={17} /> 重擲色彩</button>
            <button className="primary-action" type="button" onClick={exportWallpaper} disabled={exporting}>
              {exporting ? <><span className="action-loader" /> 正在烘製 4K…</> : <><ArrowDownToLine size={18} /> 輸出 4K 成品</>}
            </button>
            <p>PNG · 2160 × 4680 · 裝置原生比例</p>
          </div>
        </aside>

        <section className="preview-stage" aria-label="即時手機預覽">
          <div className="stage-texture" style={{ backgroundImage: `linear-gradient(110deg, rgba(0,0,0,.35), rgba(0,0,0,0) 50%), url(${assets.paperStage})` }} />
          <div className="proof-spec proof-spec-left"><span>W-G / 4K-01</span><span>COLOUR PROOF</span></div>
          <div className="proof-spec proof-spec-right"><span>2160 × 4680</span><span>FULL BLEED</span></div>
          <div className="stage-topline"><span>LIVE PREVIEW</span><span>{config.shortTitle}</span></div>
          <div className="phone-plinth">
            <div className="phone-device">
              <div className="phone-speaker" />
              <svg ref={svgRef} className="wallpaper-canvas" viewBox="0 0 2160 4680" role="img" aria-label={`${config.title}桌布預覽`} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="25" stdDeviation="20" floodColor="#000000" floodOpacity="0.15" /></filter>
                </defs>
                <rect width="2160" height="4680" fill={background} />
                <g clipPath="inset(0)">{svgArtwork}</g>
              </svg>
              <div className="phone-edge-glow" />
            </div>
            <div className="plinth-shadow" />
          </div>
          <div className="stage-bottomline"><span><span className="pulse-dot" /> RENDER READY</span><span>MODE {String(modeNumber).padStart(2, "0")} / {String(modeTotal).padStart(2, "0")}</span></div>
          <button className="expand-button" type="button" aria-label="放大預覽"><Maximize2 size={17} /></button>
        </section>
      </section>

      <section className={`preset-library ${presetsOpen ? "is-open" : ""}`} aria-labelledby="preset-title">
        <button className="preset-toggle" type="button" onClick={() => setPresetsOpen((open) => !open)} aria-expanded={presetsOpen} aria-controls="preset-panel">
          <span className="preset-toggle-title"><span className="section-number">04</span><span id="preset-title">快速取樣</span><small>{presetsOpen ? "收起構圖方向" : "展開已挑選的構圖方向"}</small></span>
          <span className="preset-toggle-meta"><span>{presets.length} PRESETS</span><ChevronDown size={18} aria-hidden="true" /></span>
        </button>
        <div className="preset-body" id="preset-panel">
          <div className="preset-body-inner">
            <div className="preset-list">
              {presets.map((preset, index) => (
                <button className={`preset-card ${preset.mode === mode ? "is-active" : ""}`} key={preset.mode} type="button" onClick={() => applyPreset(preset.mode)}>
                  <img src={preset.asset} alt="" />
                  <span className="preset-overlay" />
                  <span className="preset-number">0{index + 1}</span>
                  <span className="preset-copy"><b>{preset.title}</b><small>{patternConfig[preset.mode].shortTitle}</small></span>
                  <WandSparkles size={16} className="preset-icon" />
                </button>
              ))}
              <div className="library-note"><span className="spark" />所有圖樣都可以從零開始編輯。<br />調整一個參數，畫面就會即時回應。</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="atelier-footer"><span>WALLGEN 4K / VERSION 1.0</span><span>DESIGNED FOR THE POCKET SCREEN</span></footer>
    </main>
  );
}
