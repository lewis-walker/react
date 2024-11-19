/// <reference path="./index.d.ts" />
import * as React from "./react";
import { render } from "./react-dom";

import { App } from "./App";

const rootElement = document.getElementById("root");

render(
  <div>
    <App />
  </div>,
  rootElement
);
