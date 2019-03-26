import { TestBed } from '@angular/core/testing';

import { AlertInfoService } from './alert-info.service';

describe('AlertInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertInfoService = TestBed.get(AlertInfoService);
    expect(service).toBeTruthy();
  });
});
