#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;

const String measureType = "heart_rate";
const String localization = "ua";

const byte DATA_SIZE = 4; 
byte data[DATA_SIZE];     
byte dataSpot = 0;
long lastBeat = 0; 

float avgBeat;
float emaValue = 0.0;
const float alpha = 0.2; // Adjust this value based on desired smoothing level

unsigned long lastMeasurementTime = 0;
const unsigned long measurementInterval = 5000; 

// Apply Exponential Moving Average to smooth out fluctuations
float applyEMA(float newValue, float oldValue, float alpha) {
    return alpha * newValue + (1.0 - alpha) * oldValue;
}

void setup() {
  Serial.begin(115200);

  Serial.println("{");
  Serial.println("\"message\": \"Initializing...\"");
  Serial.println("}");

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("{");
    Serial.println("\"message\": \"MAX30105 was not found. Please check wiring/power.\"");
    Serial.println("}");
    while (1);
  }
  Serial.println("{");
  Serial.println("\"message\": \"Place your index finger on the sensor with steady pressure.\"");
  Serial.println("}");

  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

void loop() {

  // Get IR value from sensor
  long irValue = particleSensor.getIR();

  // Check for a heartbeat
  if (checkForBeat(irValue) == true) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

  // Calculate heart rate in beats per minute
    float beatsPerMinute = 60 / (delta / 1000.0);

  // Ensure heart rate is within a reasonable range
    if (beatsPerMinute < 255 && beatsPerMinute > 20) {

      // Store heart rate data in circular buffer
      data[dataSpot++] = (byte)beatsPerMinute;
      dataSpot %= DATA_SIZE;

      // Calculate average heart rate from buffer
      avgBeat = 0;
      for (byte x = 0; x < DATA_SIZE; x++)
        avgBeat += data[x];
      avgBeat /= DATA_SIZE;

     // Apply Exponential Moving Average (EMA) for smoothing
      emaValue = applyEMA(avgBeat, emaValue, alpha);
    }
  }

  // Perform measurement at regular intervals
  if (millis() - lastMeasurementTime >= measurementInterval) {

    if ((avgBeat >= 20) && (emaValue >= 20)) {
        Serial.print("{");
        Serial.print("\"type\":\"");
        Serial.print(measureType);
        Serial.print("\", \"raw_heart_rate\":\"");
        Serial.print(static_cast<int>(avgBeat));
        Serial.print("\", \"smoothed_heart_rate\": \"");
        Serial.print(static_cast<int>(emaValue));
        Serial.print("\", \"localization\": \"");
        Serial.print(localization); 
        Serial.println("\"}");
    }
    
    lastMeasurementTime = millis();
    
  }
}

