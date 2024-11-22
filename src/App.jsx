

import React, { useState } from "react";
import SortingVisualizer from "./Components/SortingVisualizer";
import GraphVisualizer from "./Components/GraphVisualizer";
import PrimVisualizer from "./Components/PrimVisualizer";
import CodeAnalyzer from "./Components/CodeAnalyzer";
import Home from "./Components/Home";
import "./App.css";

const App = () => {
  const [view, setView] = useState("home");

  const handleChangeView = (newView) => {
    setView(newView);
  };

  return (
    <div className="app">
      {view === "home" ? (
        <Home onStartVisualizer={() => setView("sorting")} />
      ) : (
        <div>
          <div className="view-selector">
            <h1>ALGORITHM VISUALIZER</h1>
            <button
              onClick={() => handleChangeView("sorting")}
              className={view === "sorting" ? "active" : ""}
            >
              Sorting Visualizer
            </button>
            <button
              onClick={() => handleChangeView("graph")}
              className={view === "graph" ? "active" : ""}
            >
              Graph Visualizer
            </button>
            <button
              onClick={() => handleChangeView("prim")}
              className={view === "prim" ? "active" : ""}
            >
              Prim's Algorithm
            </button>
            <button
              onClick={() => handleChangeView("code")}
              className={view === "code" ? "active" : ""}
            >
              Code Analyzer
            </button>
          </div>
          <div className="visualizer-container">
            {view === "sorting" && <SortingVisualizer />}
            {view === "graph" && <GraphVisualizer />}
            {view === "prim" && <PrimVisualizer />}
            {view === "code" && <CodeAnalyzer />}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
