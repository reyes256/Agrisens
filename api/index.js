// mongoDB clientDB
const { MongoClient } = require("mongodb");
// mqtt
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

const topic = "temp/agua"; // Sub topic name

// conection to mqtt
clientMqtt.on("connect", () => {
  console.log("connecting: " + clientId);
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
  //switch (topic) {
  //  case "temp/agua":
  //    break;
  //  case "temp/aire":
  //  case "humedad/aire":
  //  case "humedad/tierra":
  //  case "luminosidad":
  //  case "foco":
  //}

});
// message to send
const MessageSend = "21";

// message publish
clientMqtt.on("connect", () => {
  clientMqtt.publish("temp/agua", MessageSend, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error("publish failed ", error);
    }
  });
});

function GenerateTime() {
  const fecha = new Date();

  fechaFormatiada = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${
    fecha.getDay() + 1
  }T${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  return fechaFormatiada;
}

// Conection mongodb
const uri = "mongodb://root:password@localhost:27017/";
const clientDB = new MongoClient(uri);

async function traerDatos(colleccion) {
  try {
    await clientDB.connect();
    const db = clientDB.db("mqtt");
    const result = await db.collection(colleccion).find({}).toArray();
    await clientDB.close();
    return result;
  } finally {
  }
}

async function insertarDatos(topic, payload) {
  let document = {
    value : payload.toString(),
    time : GenerateTime(),
  };
  try {
    await clientDB.connect();
    const db = clientDB.db("mqtt");
    const result = await db.collection(topic).insertOne(document);
    console.log(result);
  } finally {
    await clientDB.close();
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
  traerDatos("temp/agua").then((document) => {
    res.send(document);
  });
});

app.get("/temp/aire", (req, res) => {
  traerDatos("temp/aire").then((document) => {
    res.send(document);
  });
});

app.get("/humedad/aire", (req, res) => {
  traerDatos("humedad/aire").then((document) => {
    res.send(document);
  });
});

app.get("/humedad/tierra", (req, res) => {
  traerDatos("humedad/tierra").then((document) => {
    res.send(document);
  });
});

app.get("/luminosidad", (req, res) => {
  traerDatos("luminosidad").then((document) => {
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
