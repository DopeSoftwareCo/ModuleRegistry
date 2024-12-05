export function TryIndexOrDefaultTo<T>(arr: Array<T>, index: number, defaultTo: T): T {
    if (index >= 0 && index < arr.length) {
        return arr[index] !== undefined ? arr[index] : defaultTo;
    }
    return defaultTo;
}

export function PartitionArray<T>(source: T[], groupSize: number): T[][] {
    // If the group size is too little, just return source nested in a new array
    if (groupSize < 2) {
        return [source];
    }

    return source.reduce((result: T[][], item: T, index: number) => {
        if (index % groupSize === 0) {
            result.push([]); // Start a new subarray every n elements
        }
        result[result.length - 1].push(item); // Add the current item to the last subarray
        return result;
    }, []);
}
