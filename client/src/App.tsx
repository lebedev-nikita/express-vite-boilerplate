import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null as any);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(({ data }) => setData(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
          <div>data: {data}</div>
        </p>
      </header>
    </div>
  );
}

export default App;
