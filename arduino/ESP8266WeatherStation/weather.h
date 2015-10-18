void updateWeatherData() {

    esp8266Serial.println("AT+CIPMUX=1");
    delay(500);//delay after mode change    

     //create start command

    startcommand = "AT+CIPSTART=4,\"TCP\",\"" WEBSITE "\","; //443 is HTTPS, still to do
    startcommand+=String(websitePort);

     esp8266Serial.println(startcommand);
     //Serial.println(startcommand);
     
     delay(500);
      Serial.println();
      Serial.println("**************************");
      while (esp8266Serial.available() > 0) {
        Serial.print(char(esp8266Serial.read()));
      }
      Serial.println("**************************");

    sendcommand="POST ";
    sendcommand+=WEBPAGE;
    sendcommand+=" HTTP/1.1";
    sendcommand+="\r\n";
    sendcommand+="Host: "; 
    sendcommand+=WEBSITE;
    sendcommand+="\r\n";
    sendcommand+="Accept: *";
    sendcommand+="/";
    sendcommand+="*";
    sendcommand+="\r\n";

    dataToSend="{\"device_id\":";
    dataToSend+="\""+device_id+"\"";
    dataToSend+=",\"Temperature\":";
    dtostrf(sensor_tem,1,2,buf);
    dataToSend+="\""+String(buf)+"\"";
    dataToSend+=",\"Humidity\":";
    dtostrf(sensor_hum,1,2,buf); 
    dataToSend+="\""+String(buf)+"\"";

    dataToSend+=",\"Light\":";
    dtostrf(sensor_light,1,2,buf); 
    dataToSend+="\""+String(buf)+"\"";
    //dataToSend+="\"100.1\"";
    // dataToSend+=",\"PM 2.5\":";
    // dataToSend+="\"250.1\"";
    dataToSend+=",\"Air Pollution\":";
    dtostrf(Sensor_etoh,1,2,buf); 
    dataToSend+="\""+String(buf)+"\"";
    dataToSend+="}";

    sendcommand+="Content-Length: ";
    sendcommand+=dataToSend.length();
    sendcommand+="\r\n";
    sendcommand+="Content-Type: application/json";
    sendcommand+="\r\n";
    sendcommand+="Connection: close\r\n";
    sendcommand+="\r\n";

    sendcommand+=dataToSend;

    //Serial.print(sendcommand);

     //send 
     esp8266Serial.print("AT+CIPSEND=4,");
     esp8266Serial.println(sendcommand.length());
     
     //debug the command
     //Serial.print("AT+CIPSEND=4,");
     //Serial.println(sendcommand.length());
     
     //delay(5000);
     if(esp8266Serial.find(">")) {
       Serial.println("---");
       Serial.println(">");
       Serial.println("---");
     }else {
       esp8266Serial.println("AT+CIPCLOSE");
       Serial.println("connect timeout");
       delay(1000);
       return;
     }
     
     //Serial.print(getcommand);
     esp8266Serial.print(sendcommand); 
}


void updateSensorData() {

    //获取温湿度==============================================
    am2321.read();
    sensor_tem = am2321.temperature / 10.0;
    sensor_hum = am2321.humidity / 10.0;

    sensor_light = map(analogRead(A0), 0, 1023, 0, 255);

    Sensor_etoh= map(analogRead(A2), 0, 1023, 0, 30);

}