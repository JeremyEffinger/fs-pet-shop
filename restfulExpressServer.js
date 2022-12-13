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

app.get("/pets", (req, res, next) => {
  sql`SELECT * FROM pets`
    .then((pets) => {
      console.log("pets", pets);
      res.json(pets);
    })
    .catch(next);
});

app.get("/pets/:id", (req, res, next) => {
  let id = req.params.id;
  sql`SELECT * FROM pets WHERE id=${id}`
    .then((pet) => {
      if (pet.length === 0) {
        res.set("Content-Type", "text/plain");
        res.status(404);
        res.send("Not Found");
      }
      res.json(pet[0]);
    })
    .catch(next);
});

app.post("/pets", function (req, res, next) {
  const requiredKeys = ["age", "name", "kind"];
  if (
    typeof req.body.age === "number" &&
    requiredKeys.every((key) => req.body.hasOwnProperty(key))
  ) {
    sql`INSERT INTO pets (age, name, kind) VALUES (${req.body.age},${req.body.name},${req.body.kind}) RETURNING *;`
      .then((pet) => {
        res.status(201);
        res.json(pet[0]);
      })
      .catch(next);
  } else {
    res.status(400).send("Bad Request");
    console.log(req.body);
  }
});

app.patch("/pets/:id", function (req, res, next) {
  const { id } = req.params;
  sql`UPDATE pets SET ${sql(req.body)} WHERE id=${id} RETURNING *`.then(
    (result) => {
      console.log(result.statement.string);
      res.send(result[0]);
    }
  );
});

app.delete("/pets/:id", function (req, res, next) {
  const { id } = req.params;
  sql` DELETE FROM pets WHERE id=${id}`.then((result) => {
    console.log(result.statement.string);
    res.send(result[0]);
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});
app.use((req, res, next) => {
  res.contentType("text/plain").status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
