import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { co2Data } from '../charts/charts';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //data subjects to share databetween components
  private co2DataSubject: BehaviorSubject<co2Data[]> = new BehaviorSubject([{
    co2: 0,
    timeCollectedAt: ''
  }]);

  private goodAndBadAirQualityPercentageSubject: BehaviorSubject<number[]> = new BehaviorSubject([101]);

  private averageCo2Subject: BehaviorSubject<number> = new BehaviorSubject(0);
  private peakCo2Subject: BehaviorSubject<number> = new BehaviorSubject(0);



  //observable to transfer data
  public $co2Data: Observable<co2Data[]> = this.co2DataSubject.asObservable();
  public $averageCo2: Observable<number> = this.averageCo2Subject.asObservable();
  public $peakCo2: Observable<number> = this.peakCo2Subject.asObservable();


  public $goodAndBadAirQualityPercentage = this.goodAndBadAirQualityPercentageSubject.asObservable();


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
  
}
