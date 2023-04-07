import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, query, limitToLast, get } from '@angular/fire/database';
import { co2Data } from 'src/app/charts/charts';
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

  constructor(private dataService: DataService) { }

  public getSensorData(filterValue: number): any {
    let counter = 0;
    this.co2Data = [];
    this.peakCo2 = 0;
    this.averageCo2 = 0;
    this.badAirQualityPercentage = 0;
    this.goodAirQualityPercentage = 0;
    //this filter value determines how many hours of data should be selected from firebase to be displayed
    console.log(filterValue)

    this.co2Data = [];
    const db = getDatabase();
    const dataRef = ref(db, 'data/');
    const sensorQuery = query(dataRef, limitToLast(filterValue));

    get(sensorQuery).then(data => {
      data.forEach(parent => {
        parent.forEach(child => {
          child.forEach(sensorData => {
            counter+=1
            let co2DataCollected: co2Data = {
              co2: sensorData.child('co2_eq_ppm').val(),
              timeCollectedAt: sensorData.child('time').val()
            }
            if(sensorData.child('co2_eq_ppm').val() > 750){
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

      console.log("average amount " + this.averageCo2)
      this.averageCo2 = Math.round(this.averageCo2 / (filterValue * 60))


      this.goodAirQualityPercentage = (((filterValue * 60) - this.badAirQualityPercentage) / (filterValue * 60)) * 100
      this.badAirQualityPercentage = (this.badAirQualityPercentage / (filterValue * 60)) * 100



      let values: number[] = [Math.round(this.goodAirQualityPercentage) , Math.round(this.badAirQualityPercentage)];

      this.dataService.setAverageCo2(this.averageCo2);
      this.dataService.setPeakCo2(this.peakCo2);
      this.dataService.setgoodAndBadAirQualityPercentage(values);
      this.dataService.setCo2Data(this.co2Data);
    });
  }
}
