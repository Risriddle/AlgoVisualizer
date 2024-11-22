

import React, { useState, useEffect, useRef } from "react";
import "./PrimVisualizer.css";

const PrimVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [steps, setSteps] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
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
      { from: 0, to: 1, weight: 4 },
      { from: 1, to: 2, weight: 1 },
      { from: 0, to: 3, weight: 2 },
      { from: 1, to: 4, weight: 7 },
      { from: 2, to: 5, weight: 3 },
      { from: 3, to: 4, weight: 2 },
      { from: 4, to: 5, weight: 1 },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
    nodeCounter.current = initialNodes.length;
    setSteps([]);
    setMstEdges([]);
  };

  const generateNewGraph = () => {
    const newNodes = [];
    const newEdges = [];
    const numNodes = Math.floor(Math.random() * 10) + 5;
    const numEdges = Math.floor(Math.random() * (numNodes * 2)) + numNodes;

    for (let i = 0; i < numNodes; i++) {
      newNodes.push({
        id: i,
        x: Math.floor(Math.random() * 600),
        y: Math.floor(Math.random() * 400),
        visited: false,
      });
    }

    for (let i = 0; i < numEdges; i++) {
      const from = Math.floor(Math.random() * numNodes);
      let to = Math.floor(Math.random() * numNodes);
      while (to === from) {
        to = Math.floor(Math.random() * numNodes);
      }
      newEdges.push({ from, to, weight: Math.floor(Math.random() * 10) + 1 });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    nodeCounter.current = newNodes.length;
    setMstEdges([]);
  };

  const visualizePrim = async () => {
    setIsVisualizing(true);
    const visited = new Set();
    const priorityQueue = [{ id: 0, weight: 0, from: null }];
    const mst = [];

    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.weight - b.weight);
      const { id: currentNode, from: parentNode } = priorityQueue.shift();

      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        await visitNode(currentNode);

        if (parentNode !== null) {
          mst.push({ from: parentNode, to: currentNode });
          await highlightEdge(parentNode, currentNode);
          updateSteps(`Added edge (${parentNode} - ${currentNode}) to MST`);
        }

        const neighbors = edges
          .filter((edge) => edge.from === currentNode || edge.to === currentNode)
          .map((edge) =>
            edge.from === currentNode
              ? { ...edge, neighbor: edge.to }
              : { ...edge, neighbor: edge.from }
          );

        for (const { neighbor, weight } of neighbors) {
          if (!visited.has(neighbor)) {
            priorityQueue.push({ id: neighbor, weight, from: currentNode });
          }
        }
      }
    }

    setMstEdges(mst);
    setIsVisualizing(false);
  };

  const visitNode = async (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, visited: true } : node
      )
    );
    updateSteps(`Visited node ${nodeId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const highlightEdge = async (from, to) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
          ? { ...edge, highlighted: true }
          : edge
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const updateSteps = (step) => {
    setSteps((prevSteps) => [...prevSteps, step]);
  };

  return (
    <div className="prim-visualizer">
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
            const x1 = fromNode.x + 15;
            const y1 = fromNode.y + 15;
            const x2 = toNode.x + 15;
            const y2 = toNode.y + 15;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const isMstEdge = mstEdges.some(
              (mstEdge) =>
                (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
                (mstEdge.from === edge.to && mstEdge.to === edge.from)
            );
            return (
              <g key={idx}>
                <line
                  className={`edge ${isMstEdge ? "highlighted" : ""}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                />
                <text x={midX} y={midY} fill="yellow" fontSize="16" dy=".3em">
                  {edge.weight}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="controls">
        <button onClick={visualizePrim} disabled={isVisualizing}>
          Visualize Prim's Algorithm
        </button>
        <button onClick={initializeGraph} disabled={isVisualizing}>
          Reset Graph
        </button>
        <button onClick={generateNewGraph} disabled={isVisualizing}>
          Generate New Graph
        </button>
      </div>
      <div className="steps-container">
        <h3>Algorithm Steps</h3>
        <ul>
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PrimVisualizer;

