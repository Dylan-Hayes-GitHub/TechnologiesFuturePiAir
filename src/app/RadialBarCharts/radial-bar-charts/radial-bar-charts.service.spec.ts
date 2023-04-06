import { TestBed } from '@angular/core/testing';

import { RadialBarChartsService } from './radial-bar-charts.service';

describe('RadialBarChartsService', () => {
  let service: RadialBarChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadialBarChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
