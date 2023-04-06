import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialBarChartsComponent } from './radial-bar-charts.component';

describe('RadialBarChartsComponent', () => {
  let component: RadialBarChartsComponent;
  let fixture: ComponentFixture<RadialBarChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadialBarChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadialBarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
