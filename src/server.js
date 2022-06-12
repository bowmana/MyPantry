import express from "express";
import morgan from "morgan";

import { readFile, writeFile } from "fs/promises";
import { RowEntryDatabase } from "./db.js";

let entries = {};

const JSONfile = "entries.json";

async function reload(filename) {
  try {
    const data = await readFile(filename, { encoding: "utf8" });
    entries = JSON.parse(data);
  } catch (e) {
    entries = {};
  }
}

async function saveEntries(filename) {
  try {
    const data = JSON.stringify(entries);
    await writeFile(filename, data, { encoding: "utf8" });
  } catch (e) {
    console.log(e);
  }
}

function entryExists(name) {
  return name in entries;
}

async function readEntry(response, name) {
  await reload(JSONfile);
  if (entryExists(name)) {
    response.send(JSON.stringify(entries[name]));
  } else {
    response.status(404).send({ error: "Entry not found" });
  }
}
async function listEntries(response) {
  await reload(JSONfile);
  response.send(JSON.stringify(entries));
}

async function addEntry(response, name, quantity, units) {
  console.log(name, quantity, units, +"testing units here");
  await reload(JSONfile);
  if (entryExists(name)) {
    // response.send({ error: "Entry already exists" });
    // response.end();
    entries[name] = { quantity, units };
    await saveEntries(JSONfile);
    response.send(JSON.stringify(entries[name]));
    response.end();
  } else {
    entries[name] = { quantity, units };
    await saveEntries(JSONfile);
    //response.send(JSON.stringify(entries[name]));
    response.json(entries[name]);
    response.end();
  }
}

async function updateEntry(response, name, quantity, units) {
  await reload(JSONfile);
  if (entryExists(name)) {
    entries[name] = { quantity, units };
    await saveEntries(JSONfile);
    response.send(JSON.stringify(entries[name]));
  } else {
    response.send({ error: "Entry not found" });
  }
}

async function deleteEntry(response, name) {
  await reload(JSONfile);
  if (entryExists(name)) {
    delete entries[name];
    await saveEntries(JSONfile);
    response.send({ success: "Entry deleted" });
  } else {
    response.send({ error: "Entry not found" });
  }
}

const app = express();
const port = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/client", express.static("client"));

app.post("/pantry", async (request, response) => {
  const { item_name, quantity, units } = request.query;
  await addEntry(response, item_name, quantity, units);
});

app.get("/read", async (request, response) => {
  const { item_name } = request.query;
  await readEntry(response, item_name);
});

//update
app.put("/update", async (request, response) => {
  const { item_name, quantity, units } = request.body;
  await updateEntry(response, item_name, quantity, units);
});

//delete
app.delete("/delete", async (request, response) => {
  const { item_name } = request.query;
  await deleteEntry(response, item_name);
});

//list all entries
app.get("/list", async (request, response) => {
  await listEntries(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
