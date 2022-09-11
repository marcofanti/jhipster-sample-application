import { TestBed } from '@angular/core/testing';

import { BehaviosecCollectorService } from './behaviosec-collector.service';

describe('BehaviosecCollectorService', () => {
  let service: BehaviosecCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BehaviosecCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
