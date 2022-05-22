import { render, createElement, useState } from "./src";

function App(props) {
  const [state, setState] = useState(1);

  return (
    <div>
      <h1>
        Counter power by {props.name}
      </h1>
      <button style={"margin: 10px"} onClick={() => setState(c => c + 1)}>plus 1</button>
      <button style={"margin: 10px"} onClick={() => setState(c => c - 1)}>minus 1</button>
      <span>result: {state}</span>
    </div>

  );
}

render(<App name="Noact" />, document.getElementById('app'));
