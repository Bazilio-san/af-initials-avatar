import { getInitials } from '../src';

const examples: [string, number | undefined, string][] = [
  ['Any Benny Cony Doo', undefined, 'ABC'],
  ['Any Benny Cony Doo', 1, 'A'],
  ['Any Benny Cony Doo', 2, 'AB'],
  ['AnyBennyConyDoo', undefined, 'A'],
  ['Any Benny', undefined, 'AB'],
  ['', undefined, ''],
];

describe('getInitials', () => {
  examples.forEach(([name, letters, expected]) => {
    it(`${name} [${letters || ''}] => ${expected}`, () => {
      expect(getInitials(letters)(name)).toEqual(expected);
    });
  });
});
