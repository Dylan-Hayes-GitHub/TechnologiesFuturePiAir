import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DataService } from 'src/app/data/data.service';
import { filter, pipe, take } from 'rxjs';
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

  constructor(private dashboardService: DashboardService, private dataService: DataService) { }

  ngOnInit(): void {
    this.dashboardService.getSensorData();

    this.listenForData();
  }
  listenForData() {
    this.dataService.$co2Data.pipe(
      filter((arr) => arr[0].co2 !== 0), take(1)
    ).subscribe(fullData => {
      console.log(fullData)

      let chartData = fullData.map(data => ({
        x: new Date(data.timeCollectedAt),
        y: data.co2
      }))

      this.chartOptions = {
        series: [
          {
            name: "CO2 Data",
            data: fullData.map((dataPoint) => ({
              x: new Date(dataPoint.timeCollectedAt),
              y: dataPoint.co2
            })),

          }
        ],
        chart: {
          width: '100%',
          type: "scatter",
          zoom: {
            type: "xy"
          },

        },

        xaxis: {
          type: "datetime"
        },
        yaxis: {
          max: 26000
        }
      };

      // this.chartOptions = {
      //   series: [{
      //     name: "SAMPLE A",
      //     data: [
      //     fullData]
      //   }],
      //   chart: {
      //     height: 350,
      //     type: 'scatter',
      //     zoom: {
      //       enabled: true,
      //       type: 'xy'
      //     }
      //   },
      //   xaxis: {
      //     tickAmount: 10,
      //     labels: {
      //       formatter: function(val) {
      //         return parseFloat(val).toFixed(1)
      //       }
      //     }
      //   },
      //   yaxis: {
      //     tickAmount: 7
      //   }
      // };
    });

  }

}
