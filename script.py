import seeed_sgp30
import time 
from datetime import datetime, timedelta
from grove.i2c import Bus
import pyrebase

config = {
  "apiKey": "i3lpgjhlZPi5Hc5rHGApzqiZkIUpSr0Tyy3wKHxz",
  "authDomain": "pi-air-4ab95.firebaseapp.com",
  "databaseURL": "https://pi-air-4ab95-default-rtdb.europe-west1.firebasedatabase.app/",
  "storageBucket": "pi-air-4ab95.appspot.com",
  "serviceAccount": "C:/Users/dylan/Desktop/test/pi-air-4ab95-firebase-adminsdk-9aqbp-ad9d97d4fb.json"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

sgp30 = seeed_sgp30.grove_sgp30(Bus())
dateTimeLast15Mins = datetime.now() - timedelta(minutes=20)

#Co2 warning level that cant be changed
co2ThresholdLevel = 2000

def within_15_mins(dt1, dt2):
    #Calculate the difference between both date times
    diff = abs(dt2 - dt1)
    #check if difference is less than or equal to 15 minutes
    if diff <= timedelta(minutes=15):
        return False
    else:
        return True

def getData(dateTimeLast15Mins):
    last15Mins = dateTimeLast15Mins

    #initialise counter to send data every hour
    counter = 0
    dataToSend = []

    while counter != 60:
        #get sensor data
        data = sgp30.read_measurements()

        co2_eq_ppm, tvoc_ppb = data.data

        now = datetime.now()

        #check to see if co2 level is at migraine threshold
        if(int(co2_eq_ppm) >= co2ThresholdLevel):
            if(within_15_mins(dateTimeLast15Mins, now)):
                dateTimeLast15Mins = now

                #set data in firebase for notification actuation
                db.child('notification').push({
                    'co2LevelWarning': int(co2_eq_ppm),
                    'timeWarningOccured': str(now)
                })
                
        combinedData = {
            'co2_eq_ppm': int(co2_eq_ppm),
            'time': str(now)
        }

        dataToSend.append(combinedData)

        counter = counter + 1
        time.sleep(60)

    db.child('data').push({
        'collectedData': dataToSend
    })

    time.sleep(1)
    getData(last15Mins)

def start():
    while True:
        #get sensor data as when sensor first starts reading it does not get correct values initially
        data = sgp30.read_measurements()

        co2_eq_ppm, tvoc_ppb = data.data
        if((co2_eq_ppm != 400 or co2_eq_ppm != 0) and tvoc_ppb != 0):
            #data collection can start
            break
    
    getData(dateTimeLast15Mins)

start()
