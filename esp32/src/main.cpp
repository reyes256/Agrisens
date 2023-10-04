#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
const char *ssid = "HackatecNM2"; // Enter your Wi-Fi name
const char *password = "itesca2024";  // Enter Wi-Fi password

// MQTT Broker
const char *mqtt_broker = "10.7.84.226";
const char *topic = "led/status";
// const char *mqtt_username = "emqx";
// const char *mqtt_password = "public";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
      Serial.print((char) payload[i]);
  }
  Serial.println();
  Serial.println("-----------------------");
}

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(921600);

  // Connecting to a WiFi network
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");

  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected()) {
      String client_id = "esp32-client-12345";
      // client_id += String(WiFi.macAddress());
      Serial.printf("\nConnecting to broker...");
      if (client.connect(client_id.c_str())) {
        Serial.println("Connection Established");
      } else {
        Serial.print("failed with state ");
        Serial.print(client.state());
        delay(2000);
      }
  }
  // Publish and subscribe
  client.publish(topic, "Hi, I'm ESP32 ^^");
  client.subscribe(topic);  
}


void loop() {
  client.loop();
}