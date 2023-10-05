#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
const char *ssid = "HackatecNM2";
const char *password = "itesca2024";

// MQTT Broker
const char *mqtt_broker = "10.7.84.226";
const int mqtt_port = 1883;
const char *topic = "main/topic";
const String client_id = "esp32-client-12345";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  Serial.println("-----------------------");
}

void setup()
{
  // Set software serial baud to 115200;
  Serial.begin(921600);

  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Conectando a Internet...");
  }
  Serial.println("Conexión a Internet Establecida");

  // connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected())
  {
    // client_id += String(WiFi.macAddress());
    Serial.printf("\nConectando al broker... ");
    if (client.connect(client_id.c_str()))
    {
      Serial.println("Conexión al Broker Establecida");
    }
    else
    {
      Serial.print("Falló con el estado: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // Publish and subscribe
  client.publish(topic, "Hi, I'm ESP32 ^^");
  client.subscribe(topic);
}

void sendTemperature()
{
  int randomNum = random(20, 21 + 1);
  char charArray[10];

  sprintf(charArray, "%d", randomNum);
  // Serial.print(charArray);

  client.publish("esp/temp", charArray);
}

void sendHumidity()
{
  // char *humedad = "18";
  client.publish("esp/hum", "18");
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.println("\nReintentando conexión con el Broker...");

    if (client.connect(client_id.c_str()))
    {
      Serial.println("Conexión al Broker establecida.");

      if (client.subscribe(topic))
      {
        Serial.println("Suscripción exitosa\n");
      }
      else
      {
        Serial.println("falló Suscripción");
      }
    }
    else
    {
      Serial.print("Falló con el estado: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void loop()
{
  if (!client.connected()){
    reconnect();
  }

  client.loop();

  sendTemperature();
  sendHumidity();

  delay(2000);
}