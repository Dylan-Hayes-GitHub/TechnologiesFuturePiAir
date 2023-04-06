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

  //observable to transfer data
  public $co2Data: Observable<co2Data[]> = this.co2DataSubject.asObservable();

  public $goodAndBadAirQualityPercentage = this.goodAndBadAirQualityPercentageSubject.asObservable();

  constructor() { }

  public setCo2Data(data: co2Data[]): void {
    this.co2DataSubject.next(data);
  }

  public setgoodAndBadAirQualityPercentage(values: number[]): void {
    this.goodAndBadAirQualityPercentageSubject.next(values);
  }
}
