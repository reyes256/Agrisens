const mqtt = require("mqtt");

const protocol = "mqtt";
const host = "localhost";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const clientMqtt = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

const topic = "esp/#";

// conection to mqtt
clientMqtt.on("connect", () => {
  console.log(`connected with id: [${clientId}]`);
  clientMqtt.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});
// reconnect to mqtt
clientMqtt.on("reconnect", (error) => {
  console.error("reconnect failed", error);
});
// message received
clientMqtt.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());
  insertarDatos(topic, payload.toString());
});

function GenerateTime() {
  const fullDate = new Date();

  const datePart = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDay() + 1}`
  const timePart = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`

  return `${datePart}T${timePart}`;
}

// Conection mongodb
const { MongoClient } = require("mongodb");
const uri = "mongodb://root:password@localhost:27017/";
const clientDB = new MongoClient(uri);
const db = clientDB.db("mqtt");

async function connectToMongo() {
  try {
    await clientDB.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongo();

async function traerDatos(colleccion) {
  try {
    const result = await db.collection(colleccion).find({}).toArray();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function insertarDatos(topic, payload) {
  let document = {
    value : payload.toString(),
    time : GenerateTime(),
  };
  try {
    const result = await db.collection(topic).insertOne(document);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// ---------------------------------------------------------------- Endpoints ----------------------------------------------------------------

const express = require("express");
const app = express();
const port2 = 3000;

// Middleware para manejar JSON en las solicitudes POST
app.use(express.json());

// Rutas para los endpoints
app.get("/temp/agua", (req, res) => {
  traerDatos("esp/temp/agua").then((document) => {
    res.send(document);
  });
});

app.get("/temp/aire", (req, res) => {
  traerDatos("esp/temp/aire").then((document) => {
    res.send(document);
  });
});

app.get("/humedad/aire", (req, res) => {
  traerDatos("esp/humedad/aire").then((document) => {
    res.send(document);
  });
});

app.get("/humedad/tierra", (req, res) => {
  traerDatos("esp/humedad/tierra").then((document) => {
    res.send(document);
  });
});

app.get("/luminosidad", (req, res) => {
  traerDatos("esp/luminosidad").then((document) => {
    res.send(document);
  });
});

// Post request
app.post("/foco", (req, res) => {
  clientMqtt.publish("foco", req.body.status);
  // Puedes acceder a los datos enviados en la solicitud POST con req.body
  console.log("Encendiendo el foco:", req.body);
  res.send("Success");
});

// Iniciar el servidor
app.listen(port2, () => {
  console.log(`Servidor Express escuchando en el puerto ${port2}`);
});
