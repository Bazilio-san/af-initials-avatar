# Generating an avatar based on a name

```shell
npm i af-initials-avatar
```

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { generate, getInitials } from 'af-initials-avatar';

let name = 'Benny Any Cony Doo';
let img = generate(name, {
  width: 200,
  palette: ['#0d7554', '#a40e0e', '#0621b9'],
  maxLetters: 2,
  fontProportion: 0.5,
  fontOptions: { family: 'Arial' },
});
fs.writeFileSync(path.resolve('output', `${Date.now()}_${getInitials(2)(name)}.png`), img);

name = 'Any Benny Cony Doo';
img = generate('Any Benny Cony Doo', {
  width: 200,
  palette: ['#25d095', '#ff7373', '#6c8eff'],
  maxLetters: 2,
  fontProportion: 0.8,
  fontOptions: {
    pathToFont: path.resolve(__dirname, '../src/fonts', 'HarmonyOS_Sans_Regular.ttf'),
    family: 'HarmonyOS Sans',
  },
});
fs.writeFileSync(path.resolve('output', `${Date.now()}_${getInitials(2)(name)}.png`), img);
```

![BA.png](BA.png)


![AB.png](AB.png)
