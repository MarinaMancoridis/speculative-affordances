// src/lib/imageRotator.js
import { readable } from 'svelte/store';

// ① import all nine images here
import grab1 from '../data/grab1.jpg';
import grab2 from '../data/grab2.jpg';
import grab3 from '../data/grab3.jpg';
import grab4 from '../data/grab4.jpg';
import grab5 from '../data/grab5.jpg';
import grab6 from '../data/grab6.jpg';
import grab7 from '../data/grab7.jpg';
import grab8 from '../data/grab8.jpg';
import grab9 from '../data/grab9.jpg';

// ② put them in an array
const images = [grab1, grab2, grab3, grab4, grab5, grab6, grab7, grab8, grab9];

// ③ readable(initialValue, start)
export const rotatingImage = readable(images[0], set => {
  let idx = 0;
  const timer = setInterval(() => {
    idx = (idx + 1) % images.length;
    set(images[idx]);
  }, 600);
  return () => clearInterval(timer);
});