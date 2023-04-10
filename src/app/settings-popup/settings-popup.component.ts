import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";
import { SettingsService } from './settings.service';
import { DataService } from '../data/data.service';
import { DashboardService } from '../dashboard/dashboard/dashboard.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-settings-popup',
  templateUrl: './settings-popup.component.html',
  styleUrls: ['./settings-popup.component.css']
})
export class SettingsPopupComponent implements OnInit {
  public formGroup: FormGroup;
  public co2WarningLevel: string = localStorage.getItem('co2WarningLevel');
  public static defaultFilter: number = 24;

  constructor(private dialogRef: MatDialogRef<SettingsPopupComponent>, private fb: FormBuilder,
    private settingsService: SettingsService, private dashboardService: DashboardService
    , private dataService: DataService) { }


  public closeSettings(): void {
    this.dialogRef.close();
  }

  public ngOnInit(): void {
    //create formgroup
    this.createFormGroup();
  }
  public createFormGroup(): void {
    this.formGroup = this.fb.group({
      co2LevelWarning: new FormControl(this.co2WarningLevel, Validators.required),
    },
    {updateOn: 'submit'});
  }

  public updateCo2QualitySettings(): void {
    //perform logic
    let co2Level: number = +this.formGroup.get('co2LevelWarning').value;
    this.settingsService.storeCo2WarningLevel(co2Level);

    //update graphs for new filter setting
    this.dataService.$lastHourFilter.pipe(
      filter(x => x), take(1)
    )
    .subscribe(filter => {
      if(filter){
        console.log("last hour")

        this.dashboardService.getSensorData(1);
      }
    });

    this.dataService.$last24HoursFilter.pipe(
      filter(x => x), take(1)
    ).subscribe(filter => {

      if(filter){
        console.log("last 24 hour")

        this.dashboardService.getSensorData(24);
      }
    });

    this.dataService.$lastThreeDaysFilter.pipe(
      filter(x => x), take(1)
    ).subscribe(filter => {

      if(filter){
        console.log("last three days")

        this.dashboardService.getSensorData(72);
      }
    });


    this.dialogRef.close();
  }
}
