import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data/data.service';
import { filter, take } from 'rxjs';
import { ScatterPlot } from '../charts/charts';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ScatterPlot>;

  constructor(private dataService: DataService) { }

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
            name: "CO2",
            data: co2Data.map((dataPoint) => ({
              x: new Date(dataPoint.timeCollectedAt),
              y: dataPoint.co2
            })),

          }
        ],
        chart: {
          height: 300,
          type: "scatter"
        },
      colors: ["#A020F0"],
        xaxis: {
          type: "datetime"
        },
        markers: {
          colors:  ["#A020F0"],

        }
      };
    });
  }

}
