export async function AsyncForEach_AndStore<MethodParam, TypeToStore>(
    items: MethodParam[],
    storage: Array<TypeToStore>,
    method: (item: MethodParam) => Promise<TypeToStore>,
    sequential: boolean = false
): Promise<void> {
    if (sequential) {
        for (let item of items) {
            // 'let' allows modification of 'item'
            let result = await method(item); // Wait for each promise to resolve before continuing
            storage.push(result);
        }
    } else {
        const promises = items.map(method);
        storage = await Promise.all(promises);
    }
}

export async function AsyncForEach_StoreDefined<MethodParam, TypeToStore>(
    items: MethodParam[],
    storage: Array<TypeToStore>,
    method: (item: MethodParam) => Promise<TypeToStore | undefined>,
    sequential: boolean = false
): Promise<void> {
    if (sequential) {
        for (let item of items) {
            // 'let' allows modification of 'item'
            let result = await method(item); // Wait for each promise to resolve before continuing
            if (result) {
                storage.push(result);
            }
        }
    } else {
        const promises = items.map(method);
        const results = await Promise.all(promises);

        results.forEach((element) => {
            if (element) {
                storage.push(element);
            }
        });
    }
}

// The idea to address foreach not supporting async in this way came from Google Gemini
export async function AsyncForEach<MethodParam, MethodReturn>(
    items: MethodParam[],
    method: (item: MethodParam) => Promise<MethodReturn>,
    sequential: boolean = false
): Promise<void> {
    if (sequential) {
        for (let item of items) {
            // 'let' allows modification of 'item'
            await method(item); // Wait for each promise to resolve before continuing
        }
    } else {
        const promises = items.map(method);
        await Promise.all(promises);
    }
}

export function TryIndexOrDefaultTo<T>(arr: Array<T>, index: number, defaultTo: T): T {
    try {
        let result = arr[index];
        return result;
    } catch {
        return defaultTo;
    }
}

export class AsyncLooper {
    constructor() {}

    async ForEach<MethodParam, MethodReturn>(
        items: MethodParam[],
        method: (item: MethodParam) => Promise<MethodReturn>,
        runSequential: boolean = false
    ): Promise<void> {
        if (runSequential) {
            for (let item of items) {
                // 'let' allows modification of 'item'
                // This await means qait for each promise to resolve before continuing
                await method(item);
            }
        } else {
            const promises = items.map(method);
            await Promise.all(promises);
        }
    }

    async StoreForEach<MethodParam, TypeToStore>(
        items: MethodParam[],
        storage: Array<TypeToStore>,
        method: (item: MethodParam) => Promise<TypeToStore>,
        runSequential: boolean = false
    ): Promise<void> {
        if (runSequential) {
            for (let item of items) {
                let result = await method(item); // Wait for each promise to resolve before continuing
                storage.push(result);
            }
        } else {
            const promises = items.map(method);
            storage = await Promise.all(promises);
        }
    }

    // The idea to address foreach not supporting async in this way came from Google Gemini
    async DiscardUndefined_StoreForEach<MethodParam, TypeToStore>(
        items: MethodParam[],
        storage: Array<TypeToStore>,
        method:
            | ((item: MethodParam) => Promise<TypeToStore>)
            | ((item: MethodParam) => Promise<TypeToStore | undefined>),
        runSequential: boolean = false
    ): Promise<void> {
        if (runSequential) {
            for (let item of items) {
                // 'let' allows modification of 'item'
                let result = await method(item); // Wait for each promise to resolve before continuing
                if (result) {
                    storage.push(result);
                }
            }
        } else {
            const promises = items.map(method);
            const results = await Promise.all(promises);

            results.forEach((element) => {
                if (element) {
                    storage.push(element);
                }
            });
        }
    }
}
