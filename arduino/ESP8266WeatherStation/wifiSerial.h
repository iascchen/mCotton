void esp8266Init() {
	esp8266Serial.println("AT");
	delay(500);
	esp8266Serial.println("AT+CWMODE=1");
	delay(500);
	esp8266Serial.println("AT+RST");
	delay(500);
  // esp8266Serial.println("AT+CWJAP=\"Makermodule\",\"microduino\"");
  // esp8266Serial.println("AT+CWJAP=\"Maker_HWF\",\"microduino\"");
  esp8266Serial.println("AT+CWJAP=\"AZURE\",\"azure001\"");
	delay(500);
}


void esp8266SmartConfig() {
  esp8266Serial.println("AT");
  delay(500);
  // esp8266Serial.println("AT+CWMODE=1");
  // delay(500);

  // esp8266Serial.println("AT+CWSMARTSTOP");
  // delay(500);
  esp8266Serial.println("AT+CWSMARTSTART=0");
  delay(500);
  esp8266Serial.println("AT+CIFSR");
  delay(500);
  Serial.println();
  while (esp8266Serial.available() > 0) {
    Serial.print(char(esp8266Serial.read()));
  }
  esp8266Serial.println("AT+RST");
  delay(500);
}


void retrievalData() {
	//output everything from ESP8266 to the Arduino Micro Serial output
  //while (esp8266Serial.available() > 0) {
  if (esp8266Serial.available() > 0) {
    dataToRead = esp8266Serial.readStringUntil('\n');
  }

  if(dataToRead.length()>0) {

    // start=dataToRead.indexOf('_id');
    // if(start>0) {
    //   Serial.println(dataToRead);
    // }

    Serial.println(dataToRead);

    dataToRead="";
  }
}

//web request needs to be sent without the http for now, https still needs some working
void WebRequest(String request){

    esp8266Serial.println("AT+CIPMUX=1");
    delay(500);//delay after mode change

 //find the dividing marker between domain and path
     int slash = request.indexOf('/');
     
     //grab the domain
     String domain;
     if(slash>0){  
       domain = request.substring(0,slash);
     }else{
       domain = request;
     }

     //get the path
     String path;
     if(slash>0){  
       path = request.substring(slash);   
     }else{
       path = "/";          
     }
     
     //output domain and path to verify
     Serial.println("domain: |" + domain + "|");
     Serial.println("path: |" + path + "|");     
     
     //create start command
    // startcommand = "AT+CIPSTART=4,\"TCP\",\"" + domain + "\","+WEBSITEPORT; //443 is HTTPS, still to do
    startcommand = "AT+CIPSTART=4,\"TCP\",\"" + domain + "\","; //443 is HTTPS, still to do
    startcommand+=String(websitePort);
     esp8266Serial.println(startcommand);
     Serial.println(startcommand);
     
     delay(500);

      Serial.println();
      Serial.println("**************************");
      while (esp8266Serial.available() > 0) {
        Serial.print(char(esp8266Serial.read()));
      }
      Serial.println("**************************");
     
     //create the request command
     sendcommand = "GET http://"+ domain + path + " HTTP/1.0\r\n\r\n\r\n";//works for most cases
     
     Serial.print(sendcommand);
     
     //send 
     esp8266Serial.print("AT+CIPSEND=4,");
     esp8266Serial.println(sendcommand.length());
     
     //debug the command
     Serial.print("AT+CIPSEND=4,");
     Serial.println(sendcommand.length());
     
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


void commondFromSerial() {
	  if (Serial.available() > 0) {
     //read from serial until terminating character
     int len = Serial.readBytesUntil('\n', serialbuffer, sizeof(serialbuffer));
  
     //trim buffer to length of the actual message
     //String message = String(serialbuffer).substring(0,len-1);
     String message = String(serialbuffer).substring(0,len);
     Serial.println("message: " + message);
 
     //check to see if the incoming serial message is a url or an AT command
     if(message.substring(0,2)=="AT"){
       //make command request
       Serial.println("COMMAND REQUEST");
       esp8266Serial.println(message); 
     }else{
      //make webrequest
       Serial.println("WEB REQUEST");
       WebRequest(message);
     }
  }
}
