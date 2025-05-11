// bubbleFall.js

// Control points (normalized 0 to 1 animation progress)
export const fallStart = 0.17;
export const fallEnd   = 0.19;
export const bounceEnd = 0.23;
export const leaveEnd  = 0.3;

// Y positions (vh units)
export const startY    = -40;  // off-screen top
export const peakY     = 40;   // lowest point of initial drop
export const bounceUp  = 15;  
export const bounceY   = peakY - bounceUp;  
export const endY      = 100;  // off-screen bottom

// Delays for each bubble to stagger drops
export const delays = [0, 0.04, 0.02, 0.06];

export function clamp01(t) {
    return Math.min(Math.max(t, 0), 1);
}

export function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
}

export function calcBubbleY(progress) {
    if (progress < fallStart) {
        return startY;
    }
    if (progress < fallEnd) {
        const t = (progress - fallStart) / (fallEnd - fallStart);
        return lerp(startY, peakY, t);
    }
    if (progress < bounceEnd) {
        const t = (progress - fallEnd) / (bounceEnd - fallEnd);
        return lerp(peakY, bounceY, t);
    }
    if (progress < leaveEnd) {
        const t = (progress - bounceEnd) / (leaveEnd - bounceEnd);
        return lerp(bounceY, endY, t);
    }
    return endY;
}

export function getBubblesY(animationProgress) {
    return delays.map(d => calcBubbleY(animationProgress - d));
}
