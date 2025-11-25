#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h"
#include "sensors.h"

// ========================================
// ИНИЦИАЛИЗАЦИЯ
// ========================================
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
Sensors sensors(DHT_PIN, DHT_TYPE);

// ========================================
// ПЕРЕМЕННЫЕ ВРЕМЕНИ
// ========================================
unsigned long lastSensorRead = 0;
unsigned long lastWiFiCheck = 0;
unsigned long lastMqttReconnect = 0;

// ========================================
// SETUP - ЗАПУСКАЕТСЯ ОДИН РАЗ
// ========================================
void setup() {
  // Инициализация Serial для отладки
  Serial.begin(SERIAL_BAUD);
  delay(2000);
  
  Serial.println("\n\n");
  Serial.println("╔════════════════════════════════════╗");
  Serial.println("║     NeuroHome ESP32 Starting       ║");
  Serial.println("║         Simple Version             ║");
  Serial.println("╚════════════════════════════════════╝");
  Serial.println();
  
  // Выводим настройки
  Serial.println("[CONFIG] Settings:");
  Serial.print("  WiFi SSID: ");
  Serial.println(WIFI_SSID);
  Serial.print("  MQTT Server: ");
  Serial.print(MQTT_SERVER);
  Serial.print(":");
  Serial.println(MQTT_PORT);
  Serial.print("  Device ID: ");
  Serial.println(DEVICE_ID);
  Serial.println();
  
  // Инициализация датчиков
  sensors.begin();
  
  // Подключение к WiFi
  connectWiFi();
  
  // Настройка MQTT
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  
  // Подключение к MQTT
  connectMQTT();
  
  Serial.println();
  Serial.println("✓ Setup completed!");
  Serial.println("════════════════════════════════════");
  Serial.println();
}

// ========================================
// LOOP - ЗАПУСКАЕТСЯ ПОСТОЯННО
// ========================================
void loop() {
  unsigned long now = millis();
  
  // Проверка WiFi подключения
  if (now - lastWiFiCheck > WIFI_RECONNECT_INTERVAL) {
    lastWiFiCheck = now;
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] ⚠ Connection lost! Reconnecting...");
      connectWiFi();
    }
  }
  
  // Проверка MQTT подключения
  if (!mqttClient.connected()) {
    if (now - lastMqttReconnect > MQTT_RECONNECT_INTERVAL) {
      lastMqttReconnect = now;
      connectMQTT();
    }
  }
  
  // Обработка MQTT сообщений
  mqttClient.loop();
  
  // Чтение и отправка данных датчиков
  if (now - lastSensorRead > SENSOR_READ_INTERVAL) {
    lastSensorRead = now;
    readAndPublishSensors();
  }
}

// ========================================
// ПОДКЛЮЧЕНИЕ К WiFi
// ========================================
void connectWiFi() {
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("[WiFi] ✓ Connected!");
    Serial.print("  IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("  Signal strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("[WiFi] ❌ Connection failed!");
    Serial.println("  Check your WiFi credentials in config.h");
  }
}

// ========================================
// ПОДКЛЮЧЕНИЕ К MQTT
// ========================================
void connectMQTT() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  Serial.print("[MQTT] Connecting to: ");
  Serial.print(MQTT_SERVER);
  Serial.print(":");
  Serial.println(MQTT_PORT);
  
  String clientId = "ESP32-" + String(DEVICE_ID);
  
  if (mqttClient.connect(clientId.c_str())) {
    Serial.println("[MQTT] ✓ Connected!");
    
    // Подписываемся на команды управления
    String controlTopic = "neurohome/" + String(DEVICE_ID) + "/control/#";
    if (mqttClient.subscribe(controlTopic.c_str())) {
      Serial.print("  Subscribed to: ");
      Serial.println(controlTopic);
    }
    
    // Отправляем событие подключения
    publishEvent("connected", "Device connected successfully");
  } else {
    Serial.print("[MQTT] ❌ Connection failed! State: ");
    Serial.println(mqttClient.state());
    Serial.println("  Check MQTT server address in config.h");
  }
}

// ========================================
// ЧТЕНИЕ И ОТПРАВКА ДАННЫХ ДАТЧИКОВ
// ========================================
void readAndPublishSensors() {
  Serial.println();
  Serial.println("════════ Reading Sensors ════════");
  
  // Читаем DHT11
  bool success = sensors.read();
  
  if (!success) {
    Serial.println("[PUBLISH] ⚠ Skipping publish due to sensor error");
    Serial.println("════════════════════════════════════");
    return;
  }
  
  // Создаем JSON документ
  StaticJsonDocument<256> doc;
  
  doc["temperature"] = sensors.getTemperature();
  doc["airHumidity"] = sensors.getHumidity();
  doc["soilMoisture"] = 0;      // Пока нет датчика
  doc["lightLevel"] = 0;         // Пока нет датчика
  doc["waterLevel"] = 0;         // Пока нет датчика
  doc["timestamp"] = millis();
  
  // Конвертируем в строку
  String payload;
  serializeJson(doc, payload);
  
  // Публикуем в MQTT
  String topic = "neurohome/" + String(DEVICE_ID) + "/sensors";
  
  Serial.print("[PUBLISH] Sending to: ");
  Serial.println(topic);
  Serial.print("  Payload: ");
  Serial.println(payload);
  
  if (mqttClient.publish(topic.c_str(), payload.c_str())) {
    Serial.println("[PUBLISH] ✓ Data sent successfully!");
  } else {
    Serial.println("[PUBLISH] ❌ Failed to send data!");
  }
  
  Serial.println("════════════════════════════════════");
  Serial.println();
}

// ========================================
// ОТПРАВКА СОБЫТИЙ
// ========================================
void publishEvent(const char* eventType, const char* message) {
  StaticJsonDocument<128> doc;
  doc["type"] = eventType;
  doc["message"] = message;
  doc["timestamp"] = millis();
  
  String payload;
  serializeJson(doc, payload);
  
  String topic = "neurohome/" + String(DEVICE_ID) + "/events";
  mqttClient.publish(topic.c_str(), payload.c_str());
}

// ========================================
// ОБРАБОТКА КОМАНД УПРАВЛЕНИЯ
// ========================================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.println();
  Serial.println("════════ Command Received ════════");
  Serial.print("[MQTT] Topic: ");
  Serial.println(topic);
  
  // Парсим JSON
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  
  if (error) {
    Serial.print("[MQTT] ❌ JSON parsing failed: ");
    Serial.println(error.c_str());
    Serial.println("════════════════════════════════════");
    return;
  }
  
  // Обработка команд
  String topicStr = String(topic);
  
  if (topicStr.indexOf("/control/pump") != -1) {
    bool enabled = doc["enabled"] | false;
    int duration = doc["duration"] | 0;
    
    Serial.print("[CONTROL] Pump: ");
    Serial.print(enabled ? "ON" : "OFF");
    if (duration > 0) {
      Serial.print(" for ");
      Serial.print(duration);
      Serial.print(" seconds");
    }
    Serial.println();
    
    // TODO: Управление помпой через реле
    // digitalWrite(PUMP_PIN, enabled ? HIGH : LOW);
  }
  else if (topicStr.indexOf("/control/growLight") != -1) {
    bool enabled = doc["enabled"] | false;
    
    Serial.print("[CONTROL] Grow Light: ");
    Serial.println(enabled ? "ON" : "OFF");
    
    // TODO: Управление фитолампой через реле
    // digitalWrite(LIGHT_PIN, enabled ? HIGH : LOW);
  }
  else if (topicStr.indexOf("/control/fan") != -1) {
    bool enabled = doc["enabled"] | false;
    
    Serial.print("[CONTROL] Fan: ");
    Serial.println(enabled ? "ON" : "OFF");
    
    // TODO: Управление вентилятором через реле
    // digitalWrite(FAN_PIN, enabled ? HIGH : LOW);
  }
  
  Serial.println("════════════════════════════════════");
  Serial.println();
}
