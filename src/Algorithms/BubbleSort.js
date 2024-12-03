// src/Algorithms/BubbleSort.js
export const bubbleSort = (array, setArray, speedRef, isPausedRef) => {
  const length = array.length;

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  const sort = async () => {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          // Swap elements
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          setArray([...array]);
          await sleep(1001-speedRef.current); // Use speed from ref
        }

        // Check for pause status
        while (isPausedRef.current) {
          await sleep(100); // Check pause every 100ms
        }
      }
    }
  };

  return sort(); // Return the sort function as a promise
};




