export const startScroll = 0.25;
export const endScroll = 0.4;

export function computeReplaceCount(pageProgress, totalCells) {
    if (pageProgress <= startScroll) return 0;
    if (pageProgress >= endScroll) return totalCells;

    return Math.floor(
        ((pageProgress - startScroll) / (endScroll - startScroll)) * totalCells
    );
}