import { Injectable } from '@angular/core';
import { getDatabase, onValue, query, limitToLast, get, limitToFirst, ref } from '@angular/fire/database';
import { Notifications, co2Data } from 'src/app/charts/charts';
import { DataService } from 'src/app/data/data.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public co2Data: co2Data[] = [];
  public peakCo2: number = 0;
  public averageCo2: number = 0;
  public badAirQualityPercentage: number = 0;
  public goodAirQualityPercentage: number = 0;
  public last24Hours: co2Data[] = [];
  public last3Days:  co2Data[] = [];
  public last7Days:  co2Data[] = [];

  public co2WarningLevel: number = +localStorage.getItem('co2WarningLevel');
  constructor(private dataService: DataService) { }

  public getSensorData(filterValue: number): any {

    //default of 1500 if user has not set a value
    this.co2WarningLevel != 0 ? this.co2WarningLevel : 1500

    let counter = 0;
    this.co2Data = [];
    this.peakCo2 = 0;
    this.averageCo2 = 0;
    this.badAirQualityPercentage = 0;
    this.goodAirQualityPercentage = 0;
    this.last24Hours = [];
    this.last3Days = [];
    this.last24Hours = [];
    //this filter value determines how many hours of data should be selected from firebase to be displayed
    console.log(filterValue)

    this.co2Data = [];
    const db = getDatabase();
    const dataRef = ref(db, 'data/');
    const sensorQuery = query(dataRef, limitToLast(168));

    get(sensorQuery).then(data => {
      data.forEach(parent => {
        parent.forEach(child => {
          child.forEach(sensorData => {
            counter+=1
            let co2DataCollected: co2Data = {
              co2: sensorData.child('co2_eq_ppm').val(),
              timeCollectedAt: sensorData.child('time').val()
            }
            if(sensorData.child('co2_eq_ppm').val() > this.co2WarningLevel){
              this.badAirQualityPercentage++;
            }

            if(this.peakCo2 < sensorData.child('co2_eq_ppm').val()){
              this.peakCo2 = sensorData.child('co2_eq_ppm').val();
            }

            this.averageCo2 = this.averageCo2 + sensorData.child('co2_eq_ppm').val();

            this.co2Data.push(co2DataCollected);
          });
        });
      });

      this.averageCo2 = Math.round(this.averageCo2 / (filterValue * 60))

      let reversedArray = this.co2Data.reverse();


      this.last24Hours = reversedArray.slice(0, 1440);
      this.last3Days = reversedArray.slice(0, 4320);
      this.last7Days = reversedArray.slice(0, 10087);

      this.dataService.setLast24Hours(this.last24Hours);
      this.dataService.setlast3Days(this.last3Days);
      this.dataService.setLast7Days(this.last7Days);


      //this.dataService.setgoodAndBadAirQualityPercentage(values);
      this.dataService.setCo2Data(this.last24Hours);

      if(filterValue == 24){
        this.dataService.getMetrics(this.last24Hours);
      } else if (filterValue == 72) {
        this.dataService.getMetrics(this.last3Days);
      } else {
        this.dataService.getMetrics(this.last7Days);
      }

    });
  }

  public getUserSettings() {
    const db = getDatabase();
    const settingsRef = ref(db, 'settings');

    get(settingsRef).then(userSettings => {
      if(userSettings.hasChild('co2WarningLevel')) {
        localStorage.setItem('co2WarningLevel', userSettings.child('co2WarningLevel').val());
      }
    })
  }

  public getNotificationData(): void {
    const db = getDatabase();
    const notificationsRef = ref(db, 'notification')
    let userNotifications: Notifications[] = [];
    onValue(notificationsRef, notifications => {
      userNotifications = [];
      notifications.forEach(values => {
        let newNoti: Notifications = {co2LevelWarning : +values.child('co2LevelWarning').val, timeWarningOccured: values.child('timeWarningOccured').val()}
        userNotifications.push(newNoti);
      })
      this.dataService.setNotifications(userNotifications);
    })
  }
}
