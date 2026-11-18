import type { SpriteId } from './content';

/** 7×7 pixel bitmaps ("1" = lit). */
const BITMAPS: Record<SpriteId, string[]> = {
  invader: ['0110110', '1111111', '1011101', '1111111', '0100010', '1011101', '0100010'],
  ship: ['0001000', '0011100', '0111110', '1111111', '1101011', '0101010', '0010100'],
  ghost: ['0111110', '1111111', '1101011', '1111111', '1111111', '1111111', '1010101'],
  sword: ['0000011', '0000110', '0001100', '1011000', '0110000', '1110000', '1010001'],
};

/** Pixel size in px; must match `.pixel` in style.css. */
const PIXEL = 8;

/**
 * CSS `box-shadow` value that paints a sprite from one 8px element: one shadow per lit pixel,
 * filled with the cabinet's `--c` custom property so it follows the theme.
 */
export function spriteShadow(id: SpriteId): string {
  const shadows: string[] = [];
  BITMAPS[id].forEach((row, y) => {
    [...row].forEach((bit, x) => {
      if (bit === '1') shadows.push(`${x * PIXEL}px ${y * PIXEL}px 0 var(--c)`);
    });
  });
  return shadows.join(',');
}
