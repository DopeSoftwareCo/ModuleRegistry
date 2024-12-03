import { Errors } from "isomorphic-git";
import { LogDebug, LogInfo } from "./Log";

// Errors
export namespace DSinc {
    export namespace Errors {
        /**
         * @author Jorge Puga Hernandez
         * @description
         * - Wraps a void function in a try-catch block, handling
         *   any errors that occur during its execution. If an error
         *   is caught, it logs the error message and exits with return code 1.
         *
         * @param func - The function to execute, which should not have any return values. {@type () => void}
         * @param message - The error message that is displayd if an error occurs. {@type string}
         *
         */
        export const ErrorWrapper = (func: () => void, message: string) => {
            try {
                func();
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message, message);
                    LogInfo(`${message}: ${err.message}`);
                } else {
                    console.log(message);
                    LogInfo(message);
                }
                process.exit(1);
            }
        };

        /**
         * @author Jorge Puga Hernandez
         * @description
         * - Wraps a function that returns a value in a try-catch block,
         *   handling any errors that occur during its execution. This
         *   function can accept multiple parameters.
         * - If an error is caught, it logs the error message and exits with return code 1.
         *
         * @template T - The return type of the function being wrapped (generic).
         * @param func - The function to execute which returns T. {@type (...args: any[]) => T}
         * @param message - The error message to display if an error occurs. {@type string}
         * @param args - The arguments to pass to the function. {@type ...any[]}
         * @returns The result of the function if no error occurs. {@type T}
         *
         */
        export const ErrorWrapperForReturns = <T>(
            func: (...args: any[]) => T,
            message: string,
            ...args: any[]
        ) => {
            try {
                return func(...args);
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message, message);
                    LogInfo(`${message}: ${err.message}`);
                } else {
                    console.log(message);
                    LogInfo(message);
                }
                process.exit(1);
            }
        };

        /**
         * @author Jorge Puga Hernandez
         * @description
         * - Wraps an async function in a try-catch block,
         *   handling any errors that occur during its execution. This
         *   function can accept multiple parameters.
         * - If an error is caught, it logs the error message and exits with return code 1.
         *
         * @template T - The return type of the function being wrapped (generic).
         * @param func - The async function to execute which returns a promise. {@type (...args: any[]) => Promise<T>}
         * @param message - The error message to display if an error occurs. {@type string}
         * @param args - The arguments to pass to the function. {@type ...any[]}
         * @returns The result of the function if no error occurs (promise). {@type T}
         *
         */
        export const ErrorWrapperForAsync = async <T>(
            func: (...args: any[]) => Promise<T>,
            message: string,
            ...args: any[]
        ): Promise<T | void> => {
            try {
                return await func(...args);
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message, message);
                    LogInfo(`${message}: ${err.message}`);
                } else {
                    console.log(message);
                    LogInfo(message);
                }
                process.exit(1);
            }
        };
    }
}

// Array
export namespace DSinc {
    export namespace Array {
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
    }
}

// Num
export namespace DSinc {
    export namespace Num {
        export function ToPositive(x: number): number {
            if (x >= 0) {
                return x;
            }

            let positive = (x * x) / x;
            return positive;
        }

        export function ToDecimalPoint(x: number, precision: number): number {
            let decimalOnly = x - Math.floor(x);
            return parseFloat(x.toPrecision(precision));
        }

        export const equalFloat = (a: number, b: number, epsilon: number = 0.001): boolean => {
            return Math.abs(a - b) < epsilon;
        };

        export function MakePositiveInteger(n: number): number {
            // Force positive
            let posInt = n > 0 ? n : n * -1;

            // Force integer
            return Math.floor(posInt);
        }
    }
}

// Text
export namespace DSinc {
    export namespace Text {
        export const pluralizeText = <T>(arr: T[], text: string) => `${text}${arr.length > 1 ? "s" : ""}`;
    }
}

// AsyncLoop
export namespace DSinc {
    export namespace AsyncLoop {
        export async function ForEach<MethodParam, MethodReturn>(
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

        export async function StoreForEach<MethodParam, TypeToStore>(
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
        export async function DiscardUndefined_StoreForEach<MethodParam, TypeToStore>(
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
}
