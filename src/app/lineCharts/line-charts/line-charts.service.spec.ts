import { TestBed } from '@angular/core/testing';

import { LineChartsService } from './line-charts.service';

describe('LineChartsService', () => {
  let service: LineChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
