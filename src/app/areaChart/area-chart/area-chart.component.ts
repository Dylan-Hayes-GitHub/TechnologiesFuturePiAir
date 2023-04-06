import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { filter, take } from 'rxjs';
import { AreaChart } from 'src/app/charts/charts';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<AreaChart>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.dataService.$co2Data.pipe(
      filter((arr) => arr[0].co2 !== 0), take(1)
    ).subscribe(co2Data => {
      this.chartOptions = {
        series: [
          {
            name: "CO2",
            data: co2Data.map((dataPoint) => ({
              x: new Date(dataPoint.timeCollectedAt),
              y: dataPoint.co2
            })),

          }
        ],
        chart: {
          height: 300,
          type: "area"
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        xaxis: {
          type: "datetime"
        }
      };
    });
  }

}
