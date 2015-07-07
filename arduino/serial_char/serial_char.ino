int led_pin = 12;
boolean on = false;

void setup() {
  pinMode(led_pin, OUTPUT);
  digitalWrite(led_pin, HIGH);
  delay(500);
  digitalWrite(led_pin, LOW);
  delay(500);
  digitalWrite(led_pin, HIGH);
  delay(500);
  digitalWrite(led_pin, LOW);

  Serial1.begin(9600);
}

void loop() {
  char c;

  if (Serial1.available() > 0) {
    c = Serial1.read();

    on = !on;
    if (on)
      digitalWrite(led_pin, HIGH);
    else
      digitalWrite(led_pin, LOW);

    //    if (c >= '0' && c < '9')
    c++;
    Serial1.print(c);
  }

  delay(1000);
}

