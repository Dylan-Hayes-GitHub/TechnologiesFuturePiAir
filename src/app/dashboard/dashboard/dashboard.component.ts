import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DataService } from 'src/app/data/data.service';
import { filter, take } from 'rxjs';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions, Notifications } from 'src/app/charts/charts';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsPopupComponent } from 'src/app/settings-popup/settings-popup.component';
import { flip } from '@popperjs/core';

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

  //Dialog ref for making the pop up show
  public dialogRef: MatDialogRef<SettingsPopupComponent>;

  public showNotifications: boolean = false;
  public belowMenu: any;

  //notification text and time recoreded at
  public userNotifications: Notifications[] = [];
  //total number to be displayed on badge
  public totalUserNotifications: number = 0;
  constructor(private dashboardService: DashboardService, private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.dashboardService.getUserSettings();
    this.dashboardService.getNotificationData();
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

    });

    this.dataService.$notifications.pipe(
      filter((x) => x[0].co2LevelWarning !== 0)
    ).subscribe(notis => {
      this.userNotifications = notis;
    });

    this.dataService.$totalNotifications.pipe(
      filter((x) => x != 1000)
    ).subscribe(totalNotis => {
      this.totalUserNotifications = totalNotis;
    })

  }

  public dashboardHome(): void {

  }

  public settings(): void {
    //make dialog pop up
    this.dialogRef = this.dialog.open(SettingsPopupComponent);
    this.dialogRef.afterClosed().subscribe(result => {

    });
  }

  public notifications(): void {
    if(this.showNotifications){
      this.showNotifications = false;
    } else {
      this.showNotifications = true;
    }

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

  public onMouseEnter(notification: Notifications): void {
   //this is used to determine if a user has seen a specific notification so that the count can be reduced
   this.dashboardService.viewNotification(notification);
  }



}
