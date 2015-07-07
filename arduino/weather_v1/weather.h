void initWeatherSensor() {
  //初始化-气压   
  barometer.initialize();   
  Serial.println(barometer.testConnection() ? "BMP085 successful" : "BMP085 failed");   
  if(barometer.testConnection())
    volcdsetup("-BMP085 OK-",10,15);
  else
    volcdsetup("-BMP085 failed-",10,15);
  delay(1000);
  //初始化-光照   
  Serial.println(tsl.begin() ? "TSL2561 successful" : "TSL2561 failed");   
  tsl.enableAutoGain(true);                                  // 在1x 与16x 增益中切换  
  tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_13MS);      //13MS的采样速度 

  if(barometer.testConnection())
    volcdsetup("-TSL2561 OK-",10,15);
  else
    volcdsetup("-TSL2561 failed-",10,15);
  delay(1000);  
}



void updateSensorData() {
    //获取温湿度============================================== 
    am2321.read();   
    sensor_tem = am2321.temperature / 10.0;   
    sensor_hum = am2321.humidity / 10.0;   

    //获取气压、海拔========================================== 
    barometer.setControl(BMP085_MODE_TEMPERATURE);   
    unsigned long lastMicros = micros();      
    //先获取温度，用来补偿气压值  
    while (micros() - lastMicros < barometer.getMeasureDelayMicroseconds());    
    barometer.getTemperatureC();  
    barometer.setControl(BMP085_MODE_PRESSURE_3);   
    //得出气压值  
    while (micros() - lastMicros < barometer.getMeasureDelayMicroseconds());  
    sensor_pre = barometer.getPressure()/1000.0;  
    //结合气压值，以标准大气压得出海拔值  
    sensor_alt = barometer.getAltitude(sensor_pre);    

    //获取光照===============================================    
    sensors_event_t event;   
    tsl.getEvent(&event);   
    (event.light)?  sensor_lux = event.light : Serial.println("Sensor overload");   
}


void updateWeatherData() {
  if(s_data == '0') {
    digitalWrite(ledPin, LOW);      
  }
  else if(s_data == '1') {
    digitalWrite(ledPin, HIGH);
  }
  
  voCC3000_ping(0);
  voCC3000_rec();
}



void updateButton() {


  if(keyButton_get(buttonPin,0))
  {
    delay(200);
    buttonState=!buttonState;
  }
  if(statusChange!=buttonState)
  {
    statusChange=buttonState;
    if(buttonState) {
      Serial.println("ON");
      stateValue="true";
      digitalWrite(ledPin, HIGH); 
      s_data='1';
    } 
    else {
      Serial.println("OFF");
      stateValue="false";
      digitalWrite(ledPin, LOW); 
      s_data='0';
    }

    voCC3000_buttonPost(0);
  }


  // buttonState = digitalRead(buttonPin);
  // if (buttonState == LOW) {
  //   Serial.println("-------------------------------------------------------------");

  //   if(stateValue=="true") {
  //     stateValue="false";
  //     digitalWrite(ledPin, LOW); 
  //     s_data='0';
  //   }else {
  //     stateValue="true";
  //     digitalWrite(ledPin, HIGH); 
  //     s_data='1';
  //   }

  //   voCC3000_buttonPost(0);
  //   //voCC3000_rec();
  //   Serial.println("-------------------------------------------------------------");
  // } else {
  //   //digitalWrite(ledPin, LOW); 
  // }


  // // read the state of the pushbutton value:
  // buttonState = digitalRead(buttonPin);
  // // check if the pushbutton is pressed.
  // // if it is, the buttonState is HIGH:
  // if (buttonState == LOW) {
  //   if(lastButtonState) {
  //         // turn LED on:    
  //     digitalWrite(ledPin, HIGH);  
  //     Serial.println("on");
  //     lastButtonState=!lastButtonState;
  //     stateValue="true";
  //     // voCC3000_buttonPost(0);
  //     // voCC3000_rec();
  //     voCC3000_ping(0);
  //     voCC3000_rec();
  //   }   
  // } else {
  //   if(!lastButtonState) {
  //     // turn LED off:
  //     digitalWrite(ledPin, LOW); 
  //     Serial.println("off");
  //     lastButtonState=!lastButtonState;
  //     stateValue="false";
  //     // voCC3000_buttonPost(0);
  //     // voCC3000_rec();
  //     voCC3000_ping(0);
  //     voCC3000_rec();
  //     }
  // }



}

