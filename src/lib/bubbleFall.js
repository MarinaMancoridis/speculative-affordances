export const fallStart = 0.14;
export const fallEnd   = 0.215;
export const bounceEnd = 0.230;
export const leaveEnd  = 0.28;

export const startY    = -40;  // off‐screen top
export const peakY     =  40;  // bottom of first drop
export const bounceUp  =  15;  
export const bounceY   =  peakY - bounceUp;  
export const endY      = 100;  // off‐screen bottom

export const delays = [0, 0.015, 0.03, 0.045];

export function clamp01(t) {
    return t < 0 ? 0 : t > 1 ? 1 : t;
}

export function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
}

export function calcBubbleY(p) {
    if (p < fallStart) {
        return startY;
    }
    if (p < fallEnd) {
        const t = (p - fallStart) / (fallEnd - fallStart);
        return lerp(startY, peakY, t);
    }
    if (p < bounceEnd) {
        const t = (p - fallEnd) / (bounceEnd - fallEnd);
        return lerp(peakY, bounceY, t);
    }
    if (p < leaveEnd) {
        const t = (p - bounceEnd) / (leaveEnd - bounceEnd);
        return lerp(bounceY, endY, t);
    }
    return endY;
}

export function getBubblesY(pageProgress) {
    return delays.map(d => calcBubbleY(pageProgress - d));
}
