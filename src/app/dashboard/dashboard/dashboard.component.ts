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
  }

  public dashboardHome(): void {

  }

  public settings(): void {

  }

  public notifications(): void {
    
  }

}
