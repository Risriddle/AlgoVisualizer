// src/Algorithms/QuickSort.js
export const quickSort = async (array, setArray, speedRef, isPausedRef) => {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    const partition = async (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                await sleep(1001 - speedRef.current); // Use speed from ref
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        await sleep(1001 - speedRef.current); // Use speed from ref

        return i + 1;
    };

    const quickSortHelper = async (arr, low, high) => {
        if (low < high) {
            if (isPausedRef.current) {
                // Wait until paused state is false
                await new Promise(resolve => {
                    const checkPause = setInterval(() => {
                        if (!isPausedRef.current) {
                            clearInterval(checkPause);
                            resolve();
                        }
                    }, 50); // Check every 50ms
                });
            }

            const pi = await partition(arr, low, high);
            await quickSortHelper(arr, low, pi - 1);
            await quickSortHelper(arr, pi + 1, high);
        }
    };

    const arrayCopy = [...array];
    await quickSortHelper(arrayCopy, 0, arrayCopy.length - 1);
    setArray(arrayCopy);
};
