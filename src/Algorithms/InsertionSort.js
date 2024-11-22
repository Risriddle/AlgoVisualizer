// src/Algorithms/InsertionSort.js
export const insertionSort = async (array, setArray, speedRef, isPausedRef) => {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    const arrayCopy = [...array];
    for (let i = 1; i < arrayCopy.length; i++) {
        let key = arrayCopy[i];
        let j = i - 1;
        
        while (j >= 0 && arrayCopy[j] > key) {
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
            
            arrayCopy[j + 1] = arrayCopy[j];
            setArray([...arrayCopy]);
            j--;
            await sleep(1001 - speedRef.current); // Use speed from ref
        }
        arrayCopy[j + 1] = key;
        setArray([...arrayCopy]);
        await sleep(1001 - speedRef.current); // Use speed from ref
    }
};
