// src/lib/imageRotator.js
import { readable } from 'svelte/store';

// ① import all nine images here
import hand1 from "../data/claw1-fs8.png";
import hand2 from "../data/claw2-fs8.png";
import hand3 from "../data/claw3-fs8.png";
import hand4 from "../data/claw4-fs8.png";
import hand5 from "../data/claw5-fs8.png";
import hand6 from "../data/claw6-fs8.png";
import hand7 from "../data/claw7-fs8.png";
import hand8 from "../data/claw88-fs8.png";
import hand9 from "../data/claw99-fs8.png";
import hand10 from "../data/claw10-fs8.png";
import hand11 from "../data/claw11-fs8.png";
import hand12 from "../data/claw12-fs8.png";
import hand13 from "../data/claw13-fs8.png";
import hand14 from "../data/claw14-fs8.png";
import hand15 from "../data/claw15-fs8.png";
import hand16 from "../data/claw16-fs8.png";
import hand17 from "../data/claw17-fs8.png";
import hand18 from "../data/claw18-fs8.png";
import hand19 from "../data/claw19-fs8.png";


// ② put them in an array
const images = [hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8, hand9,
  hand10, hand11, hand12, hand13, hand14, hand15, hand16, hand17, hand18,
  hand19];

// ③ readable(initialValue, start)
export const rotatingImage = readable(images[0], set => {
  let idx = 0;
  const timer = setInterval(() => {
    idx = (idx + 1) % images.length;
    set(images[idx]);
  }, 200);
  return () => clearInterval(timer);
});