import express from "express";
import { readFile, writeFile } from "fs/promises";

const app = express();
const port = 3000;

app.use(express.json());

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

app.post("/pets", function (req, res) {
  readFile("./pets.json", "utf-8").then((text) => {
    const pets = JSON.parse(text);
    const requiredKeys = ["age", "kind", "name"];
    if (
      typeof req.body.age === "number" &&
      requiredKeys.every((key) => req.body.hasOwnProperty(key))
    ) {
      pets.push(req.body);
      writeFile("./pets.json", JSON.stringify(pets));
      res.status(201);
      res.json(pets);
    } else {
      res.status(400).send("Bad Request");
      console.log(req.body);
    }
  });
});

app.use((req, res, next) => {
  res.contentType("text/plain").status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
