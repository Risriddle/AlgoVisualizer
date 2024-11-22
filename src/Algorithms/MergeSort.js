// src/Algorithms/MergeSort.js
export const mergeSort = async (array, setArray, speedRef, isPausedRef) => {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    

    const merge = async (left, right) => {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
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

            if (left[leftIndex] < right[rightIndex]) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
            setArray([...result, ...left.slice(leftIndex), ...right.slice(rightIndex)]);
            await sleep(1001 - speedRef.current); // Use speed from ref
        }

        return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    };

    const divideAndMerge = async (array) => {
        if (array.length <= 1) return array;

        const middle = Math.floor(array.length / 2);
        const left = array.slice(0, middle);
        const right = array.slice(middle);

        const sortedLeft = await divideAndMerge(left);
        const sortedRight = await divideAndMerge(right);

        return merge(sortedLeft, sortedRight);
    };

    const sortedArray = await divideAndMerge(array);
    setArray(sortedArray);
};
