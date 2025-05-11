export const zoomInStart = 0.170;
export const zoomPeak    = 0.19;
export const zoomOutEnd  = 0.28;

export function getZoomParams(pageProgress) {
    let zoomP =
        pageProgress < zoomInStart ? 0
        : pageProgress < zoomPeak ? (pageProgress - zoomInStart) / (zoomPeak - zoomInStart)
        : pageProgress < zoomOutEnd ? 1 - ((pageProgress - zoomPeak) / (zoomOutEnd - zoomPeak))
        : 0;

    const scale   = 0.1 + zoomP * 0.9;
    const opacity = zoomP * 1.3;

    return { scale, opacity };
}

export function packHouseImages(baseOriginals, baseModifieds, repeatCount = 4) {
    const originalImgs = Array(repeatCount).fill(baseOriginals).flat();
    const modifiedImgs = Array(repeatCount).fill(baseModifieds).flat();
    
    return { originalImgs, modifiedImgs };
}