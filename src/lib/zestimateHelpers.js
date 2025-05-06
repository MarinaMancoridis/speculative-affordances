import * as d3 from "d3";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import localData from "./../data/mapping_inequality_redlining.json";

// Config for threshold between sale to nearest zestimate
const saleToZestimateDateThreshold = 4e9; // Roughly 45 days

// Sort times and values for faster filtering
export function parseZestimateHistory (data) {
    const points = data?.zillowData?.data?.property?.homeValueChartData[0]?.points || [];
    const times = d3.sort(points.map(({x, y}) => x));
    const values = d3.sort(points.map(({x, y}) => y));
    return [times, values];
};

// Gets the most recent "sold" event, if it exists
export function getLastSoldEvent (home) {
    const priceHistory = home["priceHistory"];
    if (priceHistory) {
        for (const historicalEvent of priceHistory) {
            if (historicalEvent["event"] === "Sold") {
                return historicalEvent;
            }
        }
    }
    return undefined;
}

// Cache the lookup for each year
export function calculateZestimateSince (times, values, scale, base) {
    let lookup = new Map();
    for (let i = scale[0]; i <= scale[1]; i++) {
        const yearStart = new Date(i, 0, 1).getTime();
        let value = base;
        if (times) {
            for (let j = 0; j < times.length; j++) {
                if (times[j] >= yearStart) {
                    value = values[j];
                    break;
                }
            }
        }
        lookup.set(i, value);
    }
    return lookup;
};

// We can also cache this if there are performance issues
export function calculateAddressColor(home) {
    let color = "white";
    localData.features.some(f => {
        if (booleanPointInPolygon([home.Longitude, home.Latitude], f)) {
            color = f.properties?.fill || "white";
            return true;
        }
        return false;
    });
    return color;
}

export function calculateFairPrice(home) {
    let color = "white";
    localData.features.some(f => {
        if (home.difference < 0) {
            color = "#644E8F";
            return true;
        } else if (home.difference >= 0) {
            color = "goldenrod";
            return true;
        }
        return false;
    });
    return color;
}

// Establish scale across full history
export function zestimateHistoryScale ([times, values]) {
    const time_range = [new Date(d3.min(times)).getFullYear(), new Date(d3.max(times)).getFullYear()];
    const value_range = [d3.min(values), d3.max(values)];
    return [time_range, value_range];
};

export function matchSoldZestimate(e, [times, values]) {
    const d = (new Date(e["date"])).getTime()
    const time = times[0]
    if (!time) {
        // console.log("No zestimates available")
        return
    }
    const diff = d-time
    if (diff<0) {
        // console.log("Zestimate not recent enough"); 
        return
    }
    let idx = 0;
    for (let i=0; i<times.length; i++) {
        const diff = d-times[i]
        if (diff<0) {
            idx = i
            if (Math.abs(diff)>saleToZestimateDateThreshold) return
            break
        }
    }
    return values[idx]
    // console.log("date", d)
}
