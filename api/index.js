const mqtt = require("mqtt");
const protocol = "mqtt";
const host = "localhost";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

const topic = "testtopic/test"; // Sub topic name

// conection to mqtt server
client.on("connect", () => {
  console.log("connecting" + clientId);
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});
// reconnect to mqtt server
client.on('reconnect', (error) => {
    console.error('reconnect failed', error)
  })  
// message received
client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());
  
});
// message to send 
const MessageSend = "nodejs mqtt test 51165";
  
// message publish
client.on("connect", () => {
  client.publish(
    topic,
    MessageSend,
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error('publish failed ',error);
      }
    }
  );
});
