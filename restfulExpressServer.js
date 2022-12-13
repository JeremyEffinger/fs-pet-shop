import express from "express";
import { readFile, writeFile } from "fs/promises";
import morgan from "morgan";
import postgres from "postgres";

const app = express();
const port = 3000;

const sql = postgres({
  database: "petshop",
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200);
  res.send("Welcome the petshop");
});

app.get("/pets", (req, res) => {
  sql`SELECT * FROM pets`.then((pets) => {
    console.log("pets", pets);
    res.json(pets);
  });
});

app.get("/pets/:id", (req, res) => {
  let id = req.params.id;
  sql`SELECT * FROM pets WHERE id=${id}`.then((pet) => {
    if (pet.length === 0) {
      res.set("Content-Type", "text/plain");
      res.status(404);
      res.send("Not Found");
    }
    res.json(pet[0]);
  });
});

app.post("/pets", function (req, res) {
  const requiredKeys = ["age", "name", "kind"];

  if (
    typeof req.body.age === "number" &&
    requiredKeys.every((key) => req.body.hasOwnProperty(key))
  ) {
    sql`INSERT INTO pets (age, name, kind) VALUES (${req.body.age},${req.body.name},${req.body.kind});`.then(
      () => {
        res.status(201);
        res.send(req.body);
      }
    );
    //res.json(sql);
  } else {
    res.status(400).send("Bad Request");
    console.log(req.body);
  }
});

app.use((req, res, next) => {
  res.contentType("text/plain").status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
