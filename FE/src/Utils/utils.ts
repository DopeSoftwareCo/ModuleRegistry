export const getColor = (ratingValue: string) => {
    // Clamp the value to the range 0-1
    let value = parseFloat(ratingValue);

    value = Math.max(0, Math.min(1, value));

    const r = Math.floor((1 - value) * 255);
    const g = Math.floor(value * 255);
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
};
