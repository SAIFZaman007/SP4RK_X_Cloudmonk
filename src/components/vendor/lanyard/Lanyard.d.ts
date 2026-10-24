import type { CSSProperties, ReactElement } from 'react';

export interface LanyardProps {
  /** Image printed on the front of the card. Any size or aspect works. */
  frontImage?: string | undefined;
  /** Image on the back. Falls back to `frontImage`, then a blank card. */
  backImage?: string | undefined;
  /** How the images fill the card: `cover` fills and crops, `contain` fits inside. */
  imageFit?: 'cover' | 'contain' | undefined;
  /** Card colour, shown where there is no image and around contained images. */
  cardColor?: string | undefined;
  orientation?: 'portrait' | 'landscape' | undefined;
  finish?: 'glossy' | 'matte' | 'holographic' | 'metallic' | undefined;
  /** 0 = square corners, 1 = very round. */
  cornerRadius?: number | undefined;
  /** Card height as a fraction of the container height. */
  size?: number | undefined;
  anchor?: 'left' | 'center' | 'right' | undefined;
  /** How far below the top edge the card hangs, 0 (short) to 1 (long). */
  strapLength?: number | undefined;
  /** Image printed along the band; repeats along its length. */
  strapImage?: string | undefined;
  strapColor?: string | undefined;
  /** Band width relative to its default, 0.4 to 2. */
  strapWidth?: number | undefined;
  /** Finish of the clamp and the ring that holds the card. */
  metal?: 'graphite' | 'silver' | 'gold' | undefined;
  gravity?: number | undefined;
  damping?: number | undefined;
  elasticity?: number | undefined;
  /** Gentle wind that keeps the card moving when nobody touches it. */
  breeze?: number | undefined;
  /** Lets visitors drag, throw and click-to-flip the card. */
  interactive?: boolean | undefined;
  /** On mount the card drops in from the side and swings into place. */
  intro?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

declare const Lanyard: (props: LanyardProps) => ReactElement;
export default Lanyard;