// This make it so if your in the 0-25 percentile it red, 25-75 percentile it white, 75-90 percentile it light green, 90-99 percentile it dark green, 99-100 it blue
function getColorClassStyle(percentile) {
    if (Number.isNaN(percentile) || percentile < 0 || percentile > 1) {
        return "white-style";
    }
    return percentile < 0.25 ? "red-style" :
        percentile < .75 ? "white-style" :
            percentile < .9 ? "light-green-style" :
                percentile < .99 ? "dark-green-style" : "blue-style";
}

// Exactly as the name suggests
function calculateStandardDeviation(numbers) {
    if (numbers.length === 0) return 0; // Handle empty array

    // Step 1: Calculate the mean
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

    // Step 2: Calculate squared differences from the mean
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));

    // Step 3: Find the mean of the squared differences
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;

    // Step 4: Take the square root of the variance
    return Math.sqrt(variance);
}