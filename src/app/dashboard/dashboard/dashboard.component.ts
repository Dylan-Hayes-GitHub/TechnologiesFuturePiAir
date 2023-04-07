import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DataService } from 'src/app/data/data.service';
import { filter, take } from 'rxjs';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/charts/charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public averageCo2: number = 0;
  public peakCo2: number = 0;

  public last24Hours: boolean = true;
  public last3Days: boolean = false;
  public last7Days: boolean = false;

  public static defaultFilter: number = 24;
  constructor(private dashboardService: DashboardService, private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.dashboardService.getSensorData(DashboardComponent.defaultFilter);

    //subscribe to get the average and peak co2 data
    this.dataService.$last24Hours.pipe(
      filter((arr) => arr[0].co2 !== 0), take(1)
    ).subscribe(co2Data => {

      this.dataService.getMetrics(co2Data);

    this.dataService.$averageCo2.pipe(
      filter(x => x != 0)
    ).subscribe(co2Avg => {
      this.averageCo2 = co2Avg;
    });

    this.dataService.$peakCo2.pipe(
      filter(x => x != 0),
    ).subscribe(co2Peak => {
      this.peakCo2 = co2Peak;
    });

    })

  }

  public dashboardHome(): void {

  }

  public settings(): void {

  }

  public notifications(): void {

  }

  public filterData(value: number): void {
    switch (value) {
      case 24:
        this.dataService.$last24Hours.pipe(
          filter((arr) => arr[0].co2 !== 0)
        ).subscribe(filteredData => {
          this.dataService.getMetrics(filteredData);
          this.dataService.setCo2Data(filteredData);
        });
        break;
      case 72:
        this.dataService.$last3Days.pipe(
          filter((arr) => arr[0].co2 !== 0)
        ).subscribe(filteredData => {
          console.log(filteredData)
          this.dataService.getMetrics(filteredData);
          this.dataService.setCo2Data(filteredData);
        });
        break;
      case 168:
        this.dataService.$last7Days.pipe(
          filter((arr) => arr[0].co2 !== 0)
        ).subscribe(filteredData => {
          this.dataService.getMetrics(filteredData);
          this.dataService.setCo2Data(filteredData);
        });
        break;
      default:
        break;
    }
  }

}
