import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, query, limitToLast, get } from '@angular/fire/database';
import { co2Data } from 'src/app/charts/charts';
import { DataService } from 'src/app/data/data.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public co2Data: co2Data[] = [];
  public badAirQualityPercentage: number = 0;
  public goodAirQualityPercentage: number = 0;

  constructor(private dataService: DataService) { }

  public getSensorData(): any {
    this.co2Data = [];
    const db = getDatabase();
    const dataRef = ref(db, 'data/');
    const sensorQuery = query(dataRef, limitToLast(100));

    get(sensorQuery).then(data => {
      data.forEach(parent => {
        parent.forEach(child => {
          child.forEach(sensorData => {
            let co2DataCollected: co2Data = {
              co2: sensorData.child('co2_eq_ppm').val(),
              timeCollectedAt: sensorData.child('time').val()
            }

            if(sensorData.child('co2_eq_ppm').val() > 700){
              this.badAirQualityPercentage++;
            }

            this.co2Data.push(co2DataCollected);
          });
        });
      });


      this.goodAirQualityPercentage = ((6000 - this.badAirQualityPercentage) / 6000) * 100
      this.badAirQualityPercentage = (this.badAirQualityPercentage / 6000) * 100

      console.log("bad air quality percentage " + this.goodAirQualityPercentage)
      console.log("good air quality percentage " + this.badAirQualityPercentage)

      let values: number[] = [Math.round(this.goodAirQualityPercentage) , Math.round(this.badAirQualityPercentage)];
      this.dataService.setgoodAndBadAirQualityPercentage(values);
      this.dataService.setCo2Data(this.co2Data);
    });
  }

  public convertTo24HourFormat(datetimeString: string): string {
    const date = new Date(datetimeString);
    const hour = date.getHours().toString().padStart(2, '0');
    return hour;
  }
}
