
void Serial_cal()
{
  cal_data = my_Serial.read();
  if ( cal_data == 170)
  {
    num = 0;
    cal[0] = cal_data;

    for ( num=1 ; num < 7; num++){
      delay(10);
      cal_data = my_Serial.read();
      cal[num] = cal_data;
    }

    //    for (int i = 0; i < 7; i++)
    //    {
    //      Serial.print(cal[i]);
    //      Serial.print(",");
    //      if (i == 6)
    //        Serial.println("");
    //    }

    if ((cal[0] == 170) && (cal[1] >= 0) && (cal[2] >= 0))
    {
      sum = cal[1] + cal[2] + cal[3] + cal[4];
      if (sum == cal[5] && cal[6] == 255)
      {
        sensor_pm_tmp = 550.0 * (256.0 * cal[1] + cal[2]) / 1024.0 * 5.0 ;

        if(sensor_pm_tmp > 0)
          sensor_cal = sensor_pm_tmp;

        //Serial.print(Sensor_cal);
        //Serial.println("ug/m3");
      }
    }
  }
}

void updateSensorData() {

  //获取温湿度==============================================
  am2321.read();
  sensor_tem = am2321.temperature / 10.0;
  sensor_hum = am2321.humidity / 10.0;

  sensor_light = map(analogRead(A0), 0, 1023, 0, 255);
  sensor_etoh= map(analogRead(A2), 0, 1023, 0, 30);

  //Serial_cal();
}

void updateWeatherData() {
  if(s_data == '0') {
    digitalWrite(ledPin, LOW);      
  }
  else if(s_data == '1') {
    digitalWrite(ledPin, HIGH);
  }

  NET_WEBSITE_sta=voCC3000_ping(0);

  if(NET_WEBSITE_sta)
  {
    Serial.println("\n ---UPDATA OK---");

    voCC3000_rec();
  }
  else
  {
    Serial.println("\n --UPDATA ERROR--");

    cc3000.reboot();

    //    if(voCC3000_init(0))
    //{
    freeMem("==============Step A");
    if(voCC3000_init(1))
    {
      freeMem("==============Step B");
      if(voCC3000_init(2))
      {
        freeMem("==============Step C");
        if(voCC3000_init(3))
          NET_WEBSITE_sta =  true;
        else
          NET_WEBSITE_sta = false; 
      }
      else
        NET_WEBSITE_sta = false; 
    }
    else
      NET_WEBSITE_sta = false; 
    //}
    //    else
    //      NET_WEBSITE_sta = false; 

    freeMem("==============Step D");
  }
}

void updateButton() {
//  if(keyButton_get(buttonPin,0))
//  {
//    delay(200);
//    buttonState=!buttonState;
//  }
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
}












