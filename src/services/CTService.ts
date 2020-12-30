export type Intersection = {
    onLine1: boolean;
    onLine2: boolean;
    x: string;
    y: string;
};

export const findIntersects = (line1: number[], line2: number[]) => {
    const intersects: Intersection[] = [];

    line1.forEach((val, idx) => {
        const line1StartX = idx;
        const line1StartY = line1[idx];
        const line1EndX = idx + 1;
        const line1EndY = line1[idx + 1];
        const line2StartX = idx;
        const line2StartY = line2[idx];
        const line2EndX = idx + 1;
        const line2EndY = line2[idx + 1];

        const result: Intersection = checkLineIntersection(
            line1StartX,
            line1StartY,
            line1EndX,
            line1EndY,
            line2StartX,
            line2StartY,
            line2EndX,
            line2EndY
        );

        if (result.onLine1 && result.onLine2) {
            intersects.push(result);
        }
    });

    if (intersects.length === 0) {
        const noResult: Intersection = {
            x: "Not Found",
            y: "Not Found",
            onLine1: false,
            onLine2: false,
        };
        intersects.push(noResult);
    }
    return intersects;
};

const checkLineIntersection = (
    line1StartX: number,
    line1StartY: number,
    line1EndX: number,
    line1EndY: number,
    line2StartX: number,
    line2StartY: number,
    line2EndX: number,
    line2EndY: number
) => {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    const result: Intersection = {
        x: "Not Found",
        y: "Not Found",
        onLine1: false,
        onLine2: false,
    };
    const denominator =
        (line2EndY - line2StartY) * (line1EndX - line1StartX) -
        (line2EndX - line2StartX) * (line1EndY - line1StartY);
    if (denominator === 0) {
        return result;
    }
    let a = line1StartY - line2StartY;
    let b = line1StartX - line2StartX;
    const numerator1 =
        (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
    const numerator2 =
        (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = (line1StartX + a * (line1EndX - line1StartX) + 1).toPrecision(4);
    result.y = (line1StartY + a * (line1EndY - line1StartY) + 1).toPrecision(4);
    /*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};
