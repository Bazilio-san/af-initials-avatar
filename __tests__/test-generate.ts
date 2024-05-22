import * as fs from 'fs';
import * as path from 'path';
import { generate, getInitials, GlobalFonts } from '../src';

let name = 'Benny Any Cony Doo';
let img = generate(name, {
  width: 200,
  palette: ['#0d7554', '#a40e0e', '#0621b9'],
  maxLetters: 2,
  fontProportion: 0.5,
  fontOptions: { family: 'Arial' },
});
fs.writeFileSync(path.resolve('output', `${Date.now()}_${getInitials(2)(name)}.png`), img);

name = '?';
img = generate(name, {
  width: 200,
  palette: ['#25d095'],
  maxLetters: 2,
  fontProportion: 0.6,
  fontOptions: { family: 'Arial', weight: 700 },
});
fs.writeFileSync(path.resolve('output', `${Date.now()}_Q.png`), img);

name = 'Any Benny Cony Doo';
img = generate('Any Benny Cony Doo', {
  width: 200,
  palette: ['#25d095', '#ff7373', '#6c8eff'],
  maxLetters: 2,
  fontProportion: 0.8,
  fontOptions: {
    // pathToFont: path.resolve(process.cwd(), 'node_modules/af-initials-avatar/src/fonts', 'HarmonyOS_Sans_Regular.ttf'),
    pathToFont: path.resolve(__dirname, '../src/fonts', 'HarmonyOS_Sans_Regular.ttf'),
    family: 'HarmonyOS Sans',
  },
});
fs.writeFileSync(path.resolve('output', `${Date.now()}_${getInitials(2)(name)}.png`), img);

console.info('GlobalFonts.families:', GlobalFonts.families);
