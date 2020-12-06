import React from "react";
import "./App.css";
import names from "./assets/names.json";
import adjectives from "./assets/adjectives.json";
import { Dialer } from "./dialer";
import { Presence } from "./Presence";
import Signaler from "./signaler";
import { AuthorizationModal } from "./AuthorizationModal";
import { Files } from "./Files";


const getID = (): string => {
  return [...Array(8)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join("");
};


const capitalizeFirstLetter = (
  [first, ...rest]: string,
  locale = navigator.language
) => {
  return [first.toLocaleUpperCase(locale), ...rest].join("");
};

const pick = (array: string[]): string => {
  return array[Math.floor(Math.random() * array.length)];
};

const getName = (): string => {
  return `${capitalizeFirstLetter(pick(adjectives))} ${capitalizeFirstLetter(
    pick(names)
  )}`;
};

const id = getID();
const name = getName();

const signaler = new Signaler(id, name);

const dialer = new Dialer(signaler, id);
dialer.register();

function App() {
  return (
    <div className="App">
      <AuthorizationModal
        signaler={signaler}
        dialer={dialer}
      ></AuthorizationModal>
      <div className="peers">
        <Presence
          dialer={dialer}
          friendlyName={name}
          signaler={signaler}
          id={id}
        />
      </div>
      <div className="self">
        <div>I am {name}</div>
        <Files dialer={dialer}></Files>
      </div>
    </div>
  );
}

export default App;
