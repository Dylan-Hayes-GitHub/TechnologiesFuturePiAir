import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { filter, take } from 'rxjs';
import { LineChartOptions } from 'src/app/charts/charts';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-line-charts',
  templateUrl: './line-charts.component.html',
  styleUrls: ['./line-charts.component.css']
})
export class LineChartsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<LineChartOptions>;
  constructor(private dataService: DataService) {

   }

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.dataService.$co2Data.pipe(
      filter((arr) => arr[0].co2 !== 0)
    ).subscribe(co2Data => {
      this.chartOptions = {
        series: [
          {
            name: "CO2 Data",
            data: co2Data.map((dataPoint) => ({
              x: new Date(dataPoint.timeCollectedAt),
              y: dataPoint.co2
            })),

          }
        ],
        chart: {
          height: 250,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Co2 Levels",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        colors:
        ["#A020F0"],
        xaxis: {
          type: "datetime"
        }
      };
    });
  }

}
