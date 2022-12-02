import express from "express";
import { readFile, writeFile } from "fs/promises";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/pets", (req, res) => {
  readFile("./pets.json", "utf-8").then((text) => {
    const pets = JSON.parse(text);
    //res.setHeader("content-type", "application/JSON");
    res.status(200);
    res.json(pets);
  });
});

app.get("/pets/:index", (req, res) => {
  readFile("./pets.json", "utf-8").then((text) => {
    console.log(req.params);
    const pets = JSON.parse(text);
    if (pets[req.params.index - 1] !== undefined) {
      res.status(200);
      res.json(pets[req.params.index - 1]);
    } else {
      res.set("Content-Type", "text/plain").sendStatus(404);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
