import * as path from 'path';
import { generate, IRegisterFontOptions } from '../src';

const name = 'Any Benny Cony Doo';

const fontOptions: IRegisterFontOptions = {
  pathToFont: path.resolve(__dirname, '../src/fonts', 'HarmonyOS_Sans_Regular.ttf'),
  family: 'HarmonyOS Sans',
};

generate(name, {
  width: 200,
  palette: ['#0a6043'],
  maxLetters: 2,
  fontProportion: 0.5,
  fontOptions,
});

generate(name, {
  width: 200,
  palette: ['#25d095'],
  maxLetters: 2,
  fontProportion: 0.9,
  fontOptions,
});
