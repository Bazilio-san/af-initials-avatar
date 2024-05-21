import { defaultPalette, getBgColor, getFontColor } from '../src';

describe('color', () => {
  describe('getBgColor', () => {
    it('should return colors based on name', () => {
      expect(defaultPalette).toContain(getBgColor('David Mart'));
      expect(defaultPalette).toContain(getBgColor('davidmart@gmail.com'));
    });
  });
  describe('getFontColor', () => {
    it('should return best font color', () => {
      expect(getFontColor(defaultPalette[0])).toEqual('#FFF');
      expect(getFontColor('#000')).toEqual('#FFF');
      expect(getFontColor('#FFF')).toEqual('#000');
    });
  });
});
