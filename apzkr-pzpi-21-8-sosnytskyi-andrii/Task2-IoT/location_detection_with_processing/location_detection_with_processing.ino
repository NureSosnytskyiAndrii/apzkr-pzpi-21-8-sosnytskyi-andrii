#include <TinyGPS++.h>
#include <SoftwareSerial.h>

// Pin configuration for the GPS module
static const int RXPin = 4, TXPin = 3;
static const uint32_t GPSBaud = 9600;

const float office_latitude = 50.4501;   
const float office_longitude = 30.5234;  

// Serial port for communication with GPS module
TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

// Variables for the Kalman filter
float latitudeEstimate = 0;
float latitudeVariance = 1;
float processVariance = 0.1;


float longitudeEstimate = 0;
float longitudeVariance = 1;

void setup() {
  Serial.begin(9600);
  ss.begin(GPSBaud);

  latitudeEstimate = office_latitude;
  longitudeEstimate = office_longitude;
}

void loop() {

   // Read GPS data when available
  while (ss.available() > 0)
    if (gps.encode(ss.read()))
      processGPSData();

  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println(F("No GPS detected: check wiring."));
    while(true);
  }
}

void processGPSData() {
 
  // Get new latitude and longitude readings from GPS module
  float newLatitude = gps.location.lat();
  float newLongitude = gps.location.lng();

  kalmanFilter(newLatitude, newLongitude);

  // Format date and time for timestamp
  char timestamp[20];
  sprintf(timestamp, "%02d-%02d-%02d-%02d-%02d", gps.date.day(), gps.date.month(), gps.date.year(), gps.time.hour(), gps.time.minute());

  printData(latitudeEstimate, longitudeEstimate, timestamp);
}

void printData(float latitude, float longitude, char* timestamp) {
  
  Serial.print("{");
  Serial.print("\"latitude\":");
  Serial.print(latitude, 6);
  Serial.print(", \"longitude\":");
  Serial.print(longitude, 6);
  Serial.print(", \"office_latitude\":");
  Serial.print(office_latitude);
  Serial.print(", \"office_longitude\":");
  Serial.print(office_longitude);
  Serial.print(", \"timestamp\":\"");
  Serial.print(timestamp);
  Serial.println("\"}");

  delay(5000);
  
}

void kalmanFilter(float newLatitude, float newLongitude) {
 
   // Update latitude and longitude estimates with noise
  latitudeEstimate += 0; 
  longitudeEstimate += 0; 

  latitudeVariance += processVariance;
  longitudeVariance += processVariance;

  // Calculate Kalman gain for latitude and longitud
  float gainLatitude = latitudeVariance / (latitudeVariance + 1); 
  float gainLongitude = longitudeVariance / (longitudeVariance + 1); 

  // Update latitude and longitude estimates using Kalman gain
  latitudeEstimate += gainLatitude * (newLatitude - latitudeEstimate);
  longitudeEstimate += gainLongitude * (newLongitude - longitudeEstimate);

  // Update variance of latitude and longitude estimates
  latitudeVariance *= (1 - gainLatitude);
  longitudeVariance *= (1 - gainLongitude);
}


