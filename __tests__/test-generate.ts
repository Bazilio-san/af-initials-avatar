import * as path from 'path';
import { generate } from '../src';

generate('Benny Any Cony Doo', {
  width: 200,
  palette: ['#0d7554', '#a40e0e', '#0621b9'],
  maxLetters: 2,
  fontProportion: 0.5,
  fontOptions: {
    pathToFont: path.resolve(__dirname, '../src/fonts', 'HarmonyOS_Sans_Regular.ttf'),
    family: 'HarmonyOS Sans',
  },
});

generate('Any Benny Cony Doo', {
  width: 200,
  palette: ['#25d095', '#ff7373', '#6c8eff'],
  maxLetters: 2,
  fontProportion: 0.8,
  fontOptions: { family: 'Arial' },
});
