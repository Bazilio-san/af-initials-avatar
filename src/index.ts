import * as path from 'path';
import * as fs from 'fs';
import tinycolor2, { ColorInput } from 'tinycolor2';
import nearestColor from 'nearest-color';
import stringToColor from 'string-to-color';
import canvasModule, { Canvas, CanvasRenderingContext2D } from 'canvas';

export interface IRegisterFontOptions {
  pathToFont: string,
  family: string,
  weight?: string,
  style?: string
}

export interface IDrawOptions {
  background?: string;
  fontColor?: string;
  width?: number;
  fontProportion?: number;
  palette?: string[];
  maxLetters?: number;
  fontOptions?: IRegisterFontOptions
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

const DEFAULT = {
  BACKGROUND: '#000',
  WIDTH: 200,
  MAX_LETTERS: 3,
  FONT_PROPORTION: (value?: number) => Math.min(Math.max(value || 0.6, 0.2), 0.9),
  FONT_FAMILY: 'HarmonyOS Sans',
};

export const registerFont = (options: IRegisterFontOptions): void => {
  const { pathToFont } = options;
  if (!fs.existsSync(pathToFont)) {
    // eslint-disable-next-line no-console
    console.error(`Font not found: ${pathToFont}`);
  } else {
    canvasModule.registerFont(pathToFont, options);
  }
};

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

const text = (ctx: CanvasRenderingContext2D, initials: string, options: IDrawOptions) => {
  const {
    width = DEFAULT.WIDTH,
    fontOptions: { family = DEFAULT.FONT_FAMILY } = {},
  } = options;

  const fontProportion = DEFAULT.FONT_PROPORTION(options.fontProportion);

  let minFontSize = width / 6;
  let maxFontSize = width;
  let fontsize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'hanging';

  const needWidth = width * fontProportion;
  const sigma = needWidth * 0.01;
  let stop = false;
  do {
    fontsize = (minFontSize + maxFontSize) / 2;
    ctx.font = `${fontsize}px ${family}`;
    const currentFontWidth = ctx.measureText(initials).width;
    const delta = needWidth - currentFontWidth;
    stop = Math.abs(delta) < sigma;
    if (delta > 0) {
      minFontSize = fontsize * 0.9;
    } else {
      maxFontSize = fontsize * 1.1;
    }
  } while (!stop);
  const { actualBoundingBoxDescent: a, actualBoundingBoxAscent: b } = ctx.measureText(initials);
  const height = a - b;
  ctx.fillText(initials, width / 2, width / 2 - height / 2);
};

export const draw = (initials: string, options: IDrawOptions = {}): Canvas => {
  const background = options.background || DEFAULT.BACKGROUND;
  const fontColor = options.fontColor || getFontColor(background);
  const width = options.width || DEFAULT.WIDTH;

  const canvas = canvasModule.createCanvas(width, width);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  circle(ctx, width);
  ctx.fillStyle = fontColor;
  text(ctx, initials, options);

  fs.writeFileSync(path.resolve('output', `${Date.now()}_${initials}.png`), canvas.toBuffer());
  return canvas;
};

// eslint-disable-next-line arrow-body-style
export const getInitials = (maxLetters?: number): (name: string) => string => {
  // eslint-disable-next-line arrow-body-style
  return (name: string) => {
    return name.split(/\s+/).map((n) => (n[0] || '').toUpperCase()).splice(0, maxLetters || DEFAULT.MAX_LETTERS).join('');
  };
};

/**
 * Generate avatar
 * @param name Full name to be split into initials
 * @param options Configuration
 * @example generate('Pavel Durov', { width: 300, palette: ['#d97706','#4f46e5','#9333ea'], maxLetters: 2, fontProportion: 0.6 })
 * @returns base64 encoded image
 */
export const generate = (name: string, options: IDrawOptions = {}): Buffer => {
  options.background = getBgColor(name, options.palette) || DEFAULT.BACKGROUND;
  options.fontColor = options.fontColor || getFontColor(options.background);
  options.width = options.width || DEFAULT.WIDTH;
  options.fontProportion = DEFAULT.FONT_PROPORTION(options.fontProportion);
  options.maxLetters = options.maxLetters || DEFAULT.MAX_LETTERS;

  if (options.fontOptions?.pathToFont && options.fontOptions?.family) {
    options.fontOptions.family = options.fontOptions?.family || DEFAULT.FONT_FAMILY;
    registerFont(options.fontOptions);
  }

  const initials = getInitials(options.maxLetters)(name);
  const canvas = draw(initials, options);
  return canvas.toBuffer();
};
