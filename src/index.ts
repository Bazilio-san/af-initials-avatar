import * as path from 'path';
import * as fs from 'fs';
import tinycolor2, { ColorInput } from 'tinycolor2';
import nearestColor from 'nearest-color';
import stringToColor from 'string-to-color';
import canvasModule, { Canvas, CanvasRenderingContext2D } from 'canvas';

// const FAMILY = 'HarmonyOS Sans';
// const FONT_FILE_NAME = 'HarmonyOS_Sans_Regular.ttf';
const FAMILY = 'SFUIText-Light';
const FONT_FILE_NAME = 'SFUIText-Light.otf';
canvasModule.registerFont(path.resolve(__dirname, 'fonts', FONT_FILE_NAME), { family: FAMILY });

export interface IAGConfig {
  palette?: string[];
  width?: number;
  fontProportion?: number;
  maxLetters?: number;
}

/**
 * Color Palette
 */
export const defaultPalette: string[] = [
  '#dc2626',
  '#d97706',
  '#059669',
  '#2563eb',
  '#4f46e5',
  '#9333ea',
  '#db2777',
];

export const getBgColor = (name: string, colors: string[] = defaultPalette): string | undefined => {
  const initial = stringToColor(name);
  // noinspection UnnecessaryLocalVariableJS
  const color = nearestColor.from(colors)(initial) || undefined;
  return color;
};

export const getFontColor = (background: ColorInput): string => {
  const list: ColorInput[] = ['#000', '#FFF'];
  return list.sort((a, b) => tinycolor2.readability(b, background) - tinycolor2.readability(a, background))[0] as string;
};

const circle = (ctx: CanvasRenderingContext2D, width: number = 100) => {
  ctx.beginPath();
  ctx.arc(width / 2, width / 2, width / 2, 0, 2 * Math.PI);
  ctx.fill();
};

const text = (ctx: CanvasRenderingContext2D, initials: string, width: number = 100, textProportion: number = 0.6) => {
  textProportion = textProportion < 0.2 ? 0.2 : textProportion > 0.9 ? 0.9 : textProportion;

  let fontsize = width / 1.5;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'hanging';

  const maxWidth = width * textProportion; // textProportion; VVQ
  do {
    fontsize--;
    ctx.font = `${fontsize}px ${FAMILY}`;
    const ccc = ctx.measureText(initials).width;
    console.log(ccc, maxWidth);
  } while (ctx.measureText(initials).width > maxWidth);
  const height = ctx.measureText(initials).actualBoundingBoxDescent - ctx.measureText(initials).actualBoundingBoxAscent;
  ctx.fillText(initials, width / 2, width / 2 - height / 2);
};

export interface IDrawOptions {
  background?: string | undefined;
  fontColor?: string | undefined;
  width?: number | undefined;
  fontProportion?: number | undefined;
}

export const draw = (initials: string, options?: IDrawOptions): Canvas => {
  const { background = '#000', width = 200, fontProportion = 0.6 } = options || {};
  const fontColor = options?.fontColor || getFontColor(background);

  const canvas = canvasModule.createCanvas(width, width);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  circle(ctx, width);
  ctx.fillStyle = fontColor;
  text(ctx, initials, width, fontProportion);

  fs.writeFileSync(path.resolve('output', `${Date.now()}_${initials}.png`), canvas.toBuffer());
  return canvas;
};

// eslint-disable-next-line arrow-body-style
export const getInitials = (maxLetters: number = 3): (name: string) => string => {
  // eslint-disable-next-line arrow-body-style
  return (name: string) => {
    return name.split(/\s+/).map((n) => (n[0] || '').toUpperCase()).splice(0, maxLetters).join('');
  };
};

/**
 * Generate avatar
 * @param name Full name to be split into initials
 * @param config Configuration
 * @example generate('Pavel Durov', { width: 300, palette: ['#d97706','#4f46e5','#9333ea'], maxLetters: 2, fontProportion: 0.6 })
 * @returns base64 encoded image
 */
export const generate = (name: string, config: IAGConfig = {}): Buffer => {
  const background = getBgColor(name, config.palette);

  const initials = getInitials(config.maxLetters)(name);
  const canvas = draw(initials, { background });
  return canvas.toBuffer();
};
