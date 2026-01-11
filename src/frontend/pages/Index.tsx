import "./globals.css";
import "./ui.css";
import React from "react";
import { createRoot } from "react-dom/client";
import classes from "./index.module.css";
import { cls } from "@/common/util.js";
import { Button } from "egon-ui";

const App = () => {
  return (
    <div className={cls(classes.container)}>
      <a href="https://github.com/egonSchiele/webapp">
        <img
          className=" rounded-2xl hover:scale-105 cursor-pointer"
          src="/images/hello.png"
          alt="logo"
        />
      </a>
      <h1 className="text-white font-bold text-3xl">Simple Node Web App</h1>
      <p>
        A template for building web apps in Node, with React and Express.
        <br />
        Learn more on{" "}
        <Button
          size="sm"
          onClick={() =>
            window.open("https://github.com/egonSchiele/webapp", "_blank")
          }
        >
          Github
        </Button>
      </p>
    </div>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
