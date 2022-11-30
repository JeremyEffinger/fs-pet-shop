import { readFile } from "node:fs/promises";

//Usage?: node pets.js [ read | create | update | destroy ]

const subcommand = process.argv[2];

if (subcommand === "read") {
  const petIndex = process.argv[3];

  readFile("./pets.json", "utf-8").then((text) => {
    const pets = JSON.parse(text);
    if (petIndex === undefined) {
      console.log(pets);
    } else {
      console.log(pets[petIndex]);
    }
  });
} else if (subcommand === "create") {
} else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}
