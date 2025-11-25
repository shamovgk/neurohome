#ifndef SENSORS_H
#define SENSORS_H

#include <DHT.h>

class Sensors {
private:
  DHT dht;
  
public:
  float temperature;
  float airHumidity;
  bool lastReadSuccess;
  
  Sensors(uint8_t pin, uint8_t type) : dht(pin, type) {
    temperature = 0;
    airHumidity = 0;
    lastReadSuccess = false;
  }
  
  void begin() {
    dht.begin();
    Serial.println("[SENSOR] DHT11 initialized");
  }
  
  bool read() {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    
    if (isnan(temp) || isnan(hum)) {
      Serial.println("[SENSOR] ❌ Failed to read from DHT11!");
      lastReadSuccess = false;
      return false;
    }
    
    temperature = temp;
    airHumidity = hum;
    lastReadSuccess = true;
    
    Serial.println("[SENSOR] ✓ DHT11 data:");
    Serial.print("  Temperature: ");
    Serial.print(temperature);
    Serial.print("°C");
    Serial.print("  Humidity: ");
    Serial.print(airHumidity);
    Serial.println("%");
    
    return true;
  }
  
  float getTemperature() {
    return temperature;
  }
  
  float getHumidity() {
    return airHumidity;
  }
};

#endif
