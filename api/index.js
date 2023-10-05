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

const topic = "testtopic/test"; // Sub topic name

// conection to mqtt
clientMqtt.on("connect", () => {
  console.log("connecting" + clientId);
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
});
// message to send
const MessageSend = "nodejs mqtt test 51165";

// message publish
clientMqtt.on("connect", () => {
  clientMqtt.publish(topic, MessageSend, { qos: 0, retain: false }, (error) => {
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
async function run() {
  try {
    await clientDB.connect();
    // database and collection code goes here
    const db = clientDB.db("mqtt");
    async function Collections() {
      conection();
      const coll = db.collection("Temperatura ambiente");
      const docs = [
        {
          temperaute: 75,
          Time: GenerateTime(),
        },
      ];
      // insert code goes here
      const result = await coll.insertMany(docs);
      //display the results of your operation
      return(result.insertedIds);
    }
    async function ViewColl() {
      // find code goes here
      const cursor = coll.find();
      // iterate code goes here
      await cursor.forEach(console.log);
    }
  } finally {
    // Ensures that the clientDB will close when you finish/error
    await clientDB.close();
  }
}

run().catch(console.dir);

// ---------------------------------------------------------------- Endpoints ----------------------------------------------------------------

const express = require("express");
const app = express();
const port2 = 3000;

// Middleware para manejar JSON en las solicitudes POST
app.use(express.json());

// Rutas para los endpoints
app.get("/temp/agua", (req, res) => {
  res.send("API gasbrother");
});

app.get("/temp/aire", (req, res) => {
  res.send("Obtener temperatura del aire");
});

app.get("/humedad/aire", (req, res) => {
  res.send("Obtener humedad del aire");
});

app.get("/humedad/tierra", (req, res) => {
  res.send("Obtener humedad del suelo");
});

app.get("/luminocidad", (req, res) => {
  console.log(Collections());
  res.send("Obtener luminosidad");
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
