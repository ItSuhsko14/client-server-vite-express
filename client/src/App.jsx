import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [concurrency, setConcurrency] = useState(1);
  const [isStarted, setIsStarted] = useState(false);
  const [results, setResults] = useState([]);

  const handleStart = async () => {
    setIsStarted(true);
    setResults([]);
    const requests = [];
    let activeRequests = 0;

    for (let i = 1; i <= 1000; i++) {
      if (activeRequests >= concurrency) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        activeRequests = 0;
      }

      activeRequests++;
      requests.push(
        axios
          .post("/api", { index: i })
          .then((response) => {
            setResults((prevResults) => [...prevResults, response.data.index]);
          })
          .catch((error) => {
            if (error.response && error.response.status === 429) {
              console.error("Too many requests");
            }
          })
      );
    }

    await Promise.all(requests);
    setIsStarted(false);
  };

  return (
    <div className="container">
      <div className="controls">
        <input
          type="number"
          min="0"
          max="100"
          value={concurrency}
          onChange={(e) => setConcurrency(Number(e.target.value))}
          required
        />
        <button onClick={handleStart} disabled={isStarted}>
          Start
        </button>
      </div>
      <ul className="results">
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
