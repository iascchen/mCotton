long linuxBaud = 250000;

byte data_readed = 0;
int led_pin = 12;
boolean on = true;

void setup() {
  pinMode(led_pin, OUTPUT);
//  Console.begin();
  Serial1.begin(linuxBaud); // Set the baud.
//  while (!Serial1)
//  {
//  }
}

void loop(){
  Serial1.println("12345");
  delay(1000);
}

//void loop()
//{
//  Serial1.println(".");
//  if (Serial1.available() > 0)
//  {
//    data_readed = Serial1.read();
//    if (data_readed == 'A')
//    {
//      if (on) {
//        on = false;
//        pin_off();
//      }
//      else {
//        on = true;
//        pin_on();
//      }
//    }
//  }
//}

void pin_on()
{
  digitalWrite(led_pin, HIGH);   // turn the LED on (HIGH is the voltage level)
}

void pin_off()
{
  digitalWrite(led_pin, LOW);   // turn the LED on (HIGH is the voltage level)
}
