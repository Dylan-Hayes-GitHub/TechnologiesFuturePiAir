import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import {AuthModule} from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDialog: MatDialog;
  let mockOverlay: Overlay;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockOverlay = jasmine.createSpyObj('Overlay', ['create']);
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [MatMenuModule, provideFirebaseApp(() => initializeApp(environment.firebase)), AuthModule],
      providers: [MatDialog,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Overlay, useValue: mockOverlay },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
