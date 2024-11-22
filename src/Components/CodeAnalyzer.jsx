import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './CodeAnalyzer.css';

const CodeAnalyzer = () => {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeCode = () => {
    const lines = code.split('\n');
    let timeComplexity = 'O(1)';
    let spaceComplexity = 'O(1)';
    const steps = [];
    let loopDepth = 0;
    let maxLoopDepth = 0;
    let spaceVars = 0;
    let isRecursive = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      steps.push({
        line: index + 1,
        operation: trimmedLine,
        state: {} // State can be expanded based on actual logic
      });

      if (trimmedLine.startsWith('for') || trimmedLine.startsWith('while')) {
        loopDepth++;
        maxLoopDepth = Math.max(maxLoopDepth, loopDepth);
        timeComplexity = `O(n^${maxLoopDepth})`;
      }
      if (trimmedLine === '}') {
        loopDepth--;
      }
      if (trimmedLine.startsWith('if') || trimmedLine.startsWith('else if')) {
        timeComplexity = maxLoopDepth > 0 ? `O(n^${maxLoopDepth})` : 'O(1)';
      }
      if (trimmedLine.includes('let') || trimmedLine.includes('const') || trimmedLine.includes('var')) {
        spaceVars++;
        if (spaceVars > 1) spaceComplexity = 'O(n)';
      }
      if (trimmedLine.includes('function') || trimmedLine.includes('=>')) {
        const funcName = trimmedLine.split(' ')[1]?.split('(')[0];
        if (funcName && lines.some(l => l.includes(`${funcName}(`))) {
          isRecursive = true;
          timeComplexity = `O(T(n) * n)`;
        }
      }
    });

    if (isRecursive) {
      spaceComplexity = `O(n) due to recursion depth`;
    }

    const explanation = `The code has a time complexity of ${timeComplexity} because it ${maxLoopDepth > 0 ? `contains ${maxLoopDepth > 1 ? 'nested ' : ''}loops` : isRecursive ? `contains recursive calls` : 'does not contain loops or recursion'} and has a space complexity of ${spaceComplexity} due to variable declarations and recursion depth.`;

    setAnalysis({ timeComplexity, spaceComplexity, steps, explanation });
  };

  const clearCode = () => {
    setCode('');
    setAnalysis(null);
  };

  return (
    <div className="code-analyzer">
      <h1>Code Analyzer</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
      />
      <div className="buttons">
        <button onClick={analyzeCode}>Analyze Code</button>
        <button onClick={clearCode}>Clear</button>
      </div>
      {analysis && (
        <div className="analysis">
          <h2>Analysis</h2>
          <p><strong>Time Complexity:</strong> {analysis.timeComplexity}</p>
          <p><strong>Space Complexity:</strong> {analysis.spaceComplexity}</p>
          <p>{analysis.explanation}</p>
          <h3>Execution Steps</h3>
          <ul>
            {analysis.steps.map((step, index) => (
              <li key={index}>
                <strong>Line {step.line}:</strong> {step.operation}
              </li>
            ))}
          </ul>
        </div>
      )}
      {analysis && (
        <div className="chart-container">
          <Line
            data={{
              labels: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
              datasets: [
                {
                  label: 'Time Complexity',
                  data: [1, 2, 4, 8, 16], // Placeholder data
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
                {
                  label: 'Space Complexity',
                  data: [1, 2, 3, 4, 5], // Placeholder data
                  borderColor: 'rgba(153, 102, 255, 1)',
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Complexity Analysis',
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;
