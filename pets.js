import { readFile } from "node:fs/promises";

//Usage?: node pets.js [ read | create | update | destroy ]

const subcommand = process.argv[2];

if (subcommand === "read") {
  readFile("./pets.json", "utf-8").then((text) => {
    console.log("text", typeof text);
  });
} else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}
