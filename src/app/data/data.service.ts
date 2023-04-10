import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notifications, co2Data } from '../charts/charts';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public co2WarningLevel: number = +localStorage.getItem('co2WarningLevel');

  //data subjects to share databetween components
  private co2DataSubject: BehaviorSubject<co2Data[]> = new BehaviorSubject([{
    co2: 0,
    timeCollectedAt: ''
  }]);

  private goodAndBadAirQualityPercentageSubject: BehaviorSubject<number[]> = new BehaviorSubject([101]);
  private averageCo2Subject: BehaviorSubject<number> = new BehaviorSubject(0);
  private peakCo2Subject: BehaviorSubject<number> = new BehaviorSubject(0);

  private last24HoursSubject: BehaviorSubject<co2Data[]> = new BehaviorSubject([{
    co2: 0,
    timeCollectedAt: ''
  }]);

  private last3DaysSubject: BehaviorSubject<co2Data[]> = new BehaviorSubject([{
    co2: 0,
    timeCollectedAt: ''
  }]);

  private last7DaysSubject: BehaviorSubject<co2Data[]> = new BehaviorSubject([{
    co2: 0,
    timeCollectedAt: ''
  }]);

  private notificationsSubject: BehaviorSubject<Notifications[]> = new BehaviorSubject([{
    co2LevelWarning: 0,
    timeWarningOccured: '',
    formattedTime: ''
  }])

  private totalNotificationsSubject: BehaviorSubject<number> = new BehaviorSubject(1000);

  //observable to transfer data
  public $co2Data: Observable<co2Data[]> = this.co2DataSubject.asObservable();
  public $averageCo2: Observable<number> = this.averageCo2Subject.asObservable();
  public $peakCo2: Observable<number> = this.peakCo2Subject.asObservable();

  public $last24Hours: Observable<co2Data[]> = this.last24HoursSubject.asObservable();
  public $last3Days: Observable<co2Data[]> = this.last3DaysSubject.asObservable();
  public $last7Days: Observable<co2Data[]> = this.last7DaysSubject.asObservable();

  public $goodAndBadAirQualityPercentage = this.goodAndBadAirQualityPercentageSubject.asObservable();

  public $notifications = this.notificationsSubject.asObservable();

  public $totalNotifications = this.totalNotificationsSubject.asObservable();

  constructor() { }

  public setCo2Data(data: co2Data[]): void {
    this.co2DataSubject.next(data);
  }

  public setgoodAndBadAirQualityPercentage(values: number[]): void {
    this.goodAndBadAirQualityPercentageSubject.next(values);
  }

  public setAverageCo2(average: number): void {
    this.averageCo2Subject.next(average);
  }

  public setPeakCo2(peak: number): void {
    this.peakCo2Subject.next(peak);
  }

  public setLast24Hours(value: co2Data[]): void {
    this.last24HoursSubject.next(value);
  }

  public setlast3Days(value: co2Data[]): void {
    this.last3DaysSubject.next(value);
  }

  public setLast7Days(value: co2Data[]): void {
    this.last7DaysSubject.next(value);
  }

  public setNotifications(notifications: Notifications[]){
    this.notificationsSubject.next(notifications);
  }

  public setTotalNotifications(total: number): void {
    this.totalNotificationsSubject.next(total);
  }

  public getMetrics(filteredData: co2Data[]): void {

    this.co2WarningLevel != 0 ? this.co2WarningLevel : 1500

    //work out average and co2 Peak
    let co2Total = 0;
    let peak = 0;
    let counter = 0;
    let totalAmountOfBadAir = 0;
    filteredData.forEach(co2Data => {
      co2Total = co2Total + co2Data.co2;

      if(peak < co2Data.co2){
        peak = co2Data.co2;
      }

      if(co2Data.co2 >= this.co2WarningLevel){
        totalAmountOfBadAir++;
      }
      counter ++;
    });

    let goodAirQualityPercentage = ((filteredData.length - totalAmountOfBadAir) / filteredData.length) * 100;
    let badAirQualityPercentage = (totalAmountOfBadAir / filteredData.length) * 100;

    let values: number[] = [Math.round(goodAirQualityPercentage) , Math.round(badAirQualityPercentage)];
    let co2Avg = Math.round(co2Total / counter);

    //set values
    this.setAverageCo2(co2Avg);
    this.setPeakCo2(peak);
    this.setgoodAndBadAirQualityPercentage(values);
  }
}
