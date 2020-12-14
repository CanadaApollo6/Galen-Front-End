export const max = (a: number[]) => {
    let maxValue = a[0];
    a.forEach((num) => {
        if (num >= maxValue) {
            maxValue = num;
        }
    });
    return maxValue;
};

export const sumSeries = (n: number[]) => {
    let sum = 0;
    n.forEach((value) => {
        sum += value;
    });
    return sum;
};

export const mean = (n: number[]) => {
    const sum = sumSeries(n);
    const average = sum / n.length;
    return average;
};

export const stDev = (n: number[]) => {
    return sumDeviations(n) / n.length;
};

export const sumDeviationSquares = (n: number[]) => {
    const nMean = mean(n);
    const deviationSquares: number[] = [];
    n.forEach((value) => {
        const deviationSquared = (value - nMean) * (value - nMean);
        deviationSquares.push(deviationSquared);
    });
    const sumSquares = sumSeries(deviationSquares);
    return sumSquares;
};

export const sumDeviations = (n: number[]) => {
    const nMean = mean(n);
    const deviation: number[] = [];
    n.forEach((value) => {
        const diff = value - nMean;
        deviation.push(diff);
    });
    const sumOfDeviations = sumSeries(deviation);
    return sumOfDeviations;
};

export const sumDeviationProducts = (x: number[], y: number[]) => {
    if (x.length !== y.length) {
        throw new Error("Error: Length of x and y series do not match");
    }
    const xMean = mean(x);
    const yMean = mean(y);
    const deviationProducts: number[] = [];
    for (let index = 0; index < x.length; index++) {
        const xDeviation = x[index] - xMean;
        const yDeviation = y[index] - yMean;
        const deviationProduct = xDeviation * yDeviation;
        deviationProducts.push(deviationProduct);
    }
    const sumOfDeviationProducts = sumSeries(deviationProducts);
    return sumOfDeviationProducts;
};

export const PearsonCoefficient = (x: number[], y: number[]) => {
    if (x.length !== y.length) {
        throw new Error("Error: Length of x and y series do not match");
    }
    const SSx = sumDeviationSquares(x);
    const SSy = sumDeviationSquares(y);
    const R = sumDeviationProducts(x, y) / Math.sqrt(SSx * SSy);
    return R;
};

export const RSquared = (x: number[], y: number[]) => {
    if (x.length !== y.length) {
        throw new Error("Error: Length of x and y series do not match");
    }
    const R = PearsonCoefficient(x, y);
    const RSquared = R * R;
    return RSquared;
};

export const tTestForCorrelation = (R: number, N: number) => {
    const t = R * Math.sqrt((N - 2) / (1 - R * R));
    return t;
};

export const studentsTTest = (n: number[], u: number) => {
    const numerator = mean(n) - u;
    const denominator = stDev(n) / Math.sqrt(n.length);
    const t = numerator / denominator;
    return t;
};

// export const pValue = (R: number, N: number) => {
//     const t = tTestForCorrelation(R, N);
// };
