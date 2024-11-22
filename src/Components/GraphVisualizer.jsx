

import React, { useState, useEffect, useRef } from "react";
import "./GraphVisualizer.css";

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [bfsSteps, setBfsSteps] = useState([]); // State to manage BFS steps
  const [dfsSteps, setDfsSteps] = useState([]); // State to manage DFS steps
  const nodeCounter = useRef(0);

  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = () => {
    const initialNodes = [
      { id: 0, x: 100, y: 100, visited: false },
      { id: 1, x: 300, y: 100, visited: false },
      { id: 2, x: 500, y: 100, visited: false },
      { id: 3, x: 100, y: 300, visited: false },
      { id: 4, x: 300, y: 300, visited: false },
      { id: 5, x: 500, y: 300, visited: false },
    ];

    const initialEdges = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
    nodeCounter.current = initialNodes.length;
    setBfsSteps([]); // Reset BFS steps
    setDfsSteps([]); // Reset DFS steps
  };

  const generateNewGraph = () => {
    const newNodes = [];
    const newEdges = [];
    const numNodes = Math.floor(Math.random() * 10) + 5; // Generate 5-15 nodes
    const numEdges = Math.floor(Math.random() * (numNodes * 2)) + numNodes; // Generate numNodes to numNodes*2 edges

    for (let i = 0; i < numNodes; i++) {
      newNodes.push({
        id: i,
        x: Math.floor(Math.random() * 600), // Random x position
        y: Math.floor(Math.random() * 400), // Random y position
        visited: false,
      });
    }

    for (let i = 0; i < numEdges; i++) {
      const from = Math.floor(Math.random() * numNodes);
      let to = Math.floor(Math.random() * numNodes);
      while (to === from) {
        to = Math.floor(Math.random() * numNodes);
      }
      newEdges.push({ from, to });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    nodeCounter.current = newNodes.length;
    setBfsSteps([]); // Reset BFS steps
    setDfsSteps([]); // Reset DFS steps
  };

  const visualizeBFS = async () => {
    setIsVisualizing(true);
    const queue = [0];
    const visited = new Set();
    const steps = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!visited.has(current)) {
        visited.add(current);
        steps.push(`Visited node ${current}`);
        await visitNode(current);
        const neighbors = edges
          .filter((edge) => edge.from === current || edge.to === current)
          .map((edge) => (edge.from === current ? edge.to : edge.from));
        queue.push(...neighbors);
      }
    }

    setBfsSteps(steps);
    setIsVisualizing(false);
  };

  const visualizeDFS = async () => {
    setIsVisualizing(true);
    const stack = [0];
    const visited = new Set();
    const steps = [];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!visited.has(current)) {
        visited.add(current);
        steps.push(`Visited node ${current}`);
        await visitNode(current);
        const neighbors = edges
          .filter((edge) => edge.from === current || edge.to === current)
          .map((edge) => (edge.from === current ? edge.to : edge.from));
        stack.push(...neighbors);
      }
    }

    setDfsSteps(steps);
    setIsVisualizing(false);
  };

  const visitNode = async (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, visited: true } : node
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="graph-visualizer">
      <div className="graph-and-controls">
        <div className="graph-container">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`node ${node.visited ? "visited" : ""}`}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
            >
              {node.id}
            </div>
          ))}
          <svg className="edges" width="100%" height="100%">
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((node) => node.id === edge.from);
              const toNode = nodes.find((node) => node.id === edge.to);
              return (
                <line
                  key={idx}
                  className="edge"
                  x1={fromNode.x + 15}
                  y1={fromNode.y + 15}
                  x2={toNode.x + 15}
                  y2={toNode.y + 15}
                />
              );
            })}
          </svg>
        </div>

        <div className="controls">
          <button onClick={visualizeBFS} disabled={isVisualizing}>
            Visualize BFS
          </button>
          <button onClick={visualizeDFS} disabled={isVisualizing}>
            Visualize DFS
          </button>
          <button onClick={initializeGraph} disabled={isVisualizing}>
            Reset Graph
          </button>
          <button onClick={generateNewGraph} disabled={isVisualizing}>
            Generate New Graph
          </button>
        </div>
      </div>

      <div className="steps-container">
        <h3>Algorithm Steps:</h3>
        <h4>BFS Steps</h4>
        <ul>
          {bfsSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
        <h4>DFS Steps</h4>
        <ul>
          {dfsSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GraphVisualizer;
