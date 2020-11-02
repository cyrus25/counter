import React from "react";
import { useDoc } from "@syncstate/react";
import "./App.css";

function Counter() {
  const [doc, setDoc] = useDoc();

  const increment = () => {
    setDoc((doc) => {
      doc.counter++;
    });
  };

  const decrement = () => {
    setDoc((doc) => {
      doc.counter--;
    });
  };

  return (
    <div className="App">
      <h1>Counter</h1>
      <button onClick={decrement}>-</button>&nbsp;&nbsp;
      {doc.counter}&nbsp;&nbsp;
      <button onClick={increment}>+</button>
    </div>
  );
}
export default Counter;
