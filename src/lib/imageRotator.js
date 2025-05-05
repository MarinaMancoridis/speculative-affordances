// src/lib/imageRotator.js
import { readable } from 'svelte/store';

// ① import all nine images here
import hand1 from "../data/hand1.jpg";
import hand2 from "../data/hand2.jpg";
import hand3 from "../data/hand3.jpg";
import hand4 from "../data/hand4.jpg";
import hand5 from "../data/hand5.jpg";
import hand6 from "../data/hand6.jpg";
import hand7 from "../data/hand7.jpg";
import hand8 from "../data/hand8.jpg";
import hand9 from "../data/hand9.jpg";
import hand10 from "../data/hand10.jpg";
import hand11 from "../data/hand11.jpg";
import hand12 from "../data/hand12.jpg";
import hand13 from "../data/hand13.jpg";
import hand14 from "../data/hand14.jpg";
import hand15 from "../data/hand15.jpg";
import hand16 from "../data/hand16.jpg";
import hand17 from "../data/hand17.jpg";
import hand18 from "../data/hand18.jpg";
import hand19 from "../data/hand19.jpg";


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