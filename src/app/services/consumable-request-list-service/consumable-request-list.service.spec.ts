import { TestBed } from '@angular/core/testing';

import { ConsumableRequestListService } from './consumable-request-list.service';

describe('ConsumableRequestListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumableRequestListService = TestBed.get(ConsumableRequestListService);
    expect(service).toBeTruthy();
  });
});
