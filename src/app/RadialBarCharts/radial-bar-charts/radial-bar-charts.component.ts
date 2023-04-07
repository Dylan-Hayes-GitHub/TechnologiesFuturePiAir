import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { filter, take } from 'rxjs';
import { RadialBarChart } from 'src/app/charts/charts';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-radial-bar-charts',
  templateUrl: './radial-bar-charts.component.html',
  styleUrls: ['./radial-bar-charts.component.css']
})
export class RadialBarChartsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<RadialBarChart>;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getAirQualityOverView();
  }

  public getAirQualityOverView() {
    this.dataService.$goodAndBadAirQualityPercentage.pipe(
      filter((arr) => arr[0] !== 101), take(1)
    ).subscribe(qualityPercentages => {
      this.chartOptions = {
        series: [qualityPercentages[0], qualityPercentages[1]],
        chart: {
          height: 300,
          type: "radialBar"
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "10%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        colors: ["#A020F0", "#6A0DAD"],
        labels: ["Good Air Quality", "Bad Air Quality"],
        legend: {
          show: true,
          floating: true,
          fontSize: "16px",
          position: "left",
          offsetX: 0,
          offsetY: 10,
          labels: {
            useSeriesColors: true
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + " %";
          },
          itemMargin: {
            horizontal: 3
          }
        },

      };
    })
  }

}
