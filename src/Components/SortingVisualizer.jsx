import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./SortingVisualizer.css";
import { bubbleSort } from "../Algorithms/BubbleSort";
import { mergeSort } from "../Algorithms/MergeSort";
import { insertionSort } from "../Algorithms/InsertionSort";
import { quickSort } from "../Algorithms/QuickSort";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(50);
  const [speed, setSpeed] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);

  const isPausedRef = useRef(isPaused);
  const isSortingRef = useRef(isSorting);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isSortingRef.current = isSorting;
  }, [isSorting]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    resetArray();
  }, [size]);

  const resetArray = () => {
    if (isSortingRef.current) return;

    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(randomIntFromInterval(5, 100));
    }
    setArray(newArray);
    setComparisonResults(null);
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const runComparison = async () => {
    setIsSorting(true);
    setIsPaused(false);

    const algorithms = [
      { name: "Bubble Sort", fn: bubbleSort, complexity: "O(n^2)" },
      { name: "Merge Sort", fn: mergeSort, complexity: "O(n log n)" },
      { name: "Insertion Sort", fn: insertionSort, complexity: "O(n^2)" },
      { name: "Quick Sort", fn: quickSort, complexity: "O(n log n)" },
    ];

    const results = [];
    const originalArray = array.slice();

    for (const algorithm of algorithms) {
      const arrayCopy = originalArray.slice();
      const start = performance.now();

      await algorithm.fn(arrayCopy, setArray, speedRef, isPausedRef);

      const end = performance.now();
      const timeTaken = (end - start).toFixed(2);
      results.push({ name: algorithm.name, time: parseFloat(timeTaken), complexity: algorithm.complexity });
    }

    setComparisonResults(results);
    setIsSorting(false);
  };

  const runAlgorithm = async (algorithm) => {
    setIsSorting(true);
    setIsPaused(false);

    const arrayCopy = array.slice();
    await algorithm.fn(arrayCopy, setArray, speedRef, isPausedRef);
    setIsSorting(false);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const getChartData = () => {
    if (!comparisonResults) return null;

    const labels = comparisonResults.map((result) => `${result.name} (${result.complexity})`);
    const data = comparisonResults.map((result) => result.time);

    return {
      labels: labels,
      datasets: [
        {
          label: "Time taken (ms)",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="sorting-visualizer">
      <div className="left-panel">
        <div className="array-container">
          {array.map((value, idx) => (
            <div className="array-bar-wrapper" key={idx}>
              <div className="array-bar" style={{ height: `${value}px` }}></div>
            </div>
          ))}
        </div>

        <div className="button-container">
          <button onClick={resetArray} disabled={isSorting}>
            Generate New Array
          </button>
          <button onClick={runComparison} disabled={isSorting}>
            Compare Algorithms
          </button>
          <button onClick={togglePause} disabled={!isSorting}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>

        <div className="individual-algorithms">
          <button onClick={() => runAlgorithm({ fn: bubbleSort })} disabled={isSorting}>
            Bubble Sort
          </button>
          <button onClick={() => runAlgorithm({ fn: mergeSort })} disabled={isSorting}>
            Merge Sort
          </button>
          <button onClick={() => runAlgorithm({ fn: insertionSort })} disabled={isSorting}>
            Insertion Sort
          </button>
          <button onClick={() => runAlgorithm({ fn: quickSort })} disabled={isSorting}>
            Quick Sort
          </button>
        </div>

        <div className="speed-control">
          <label>Speed (ms):</label>
          <input
            type="range"
            min="1"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span>{speed} ms</span>
        </div>

        <div className="size-control">
          <label>Array Size:</label>
          <input
            type="range"
            min="10"
            max="200"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <span>{size}</span>
        </div>
      </div>

      <div className="right-panel">
        {comparisonResults && (
          <div className="comparison-results">
            <h3>Algorithm Comparison Results:</h3>
            <ul>
              {comparisonResults.map((result, idx) => (
                <li key={idx}>
                  {result.name} (Complexity: {result.complexity}): {result.time} ms
                </li>
              ))}
            </ul>

            <div className="chart-container">
              <Bar data={getChartData()} options={{ responsive: true }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingVisualizer;


