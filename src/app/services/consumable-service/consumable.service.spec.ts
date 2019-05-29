import { TestBed } from '@angular/core/testing';

import { ConsumableService } from './consumable.service';

describe('ConsumableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumableService = TestBed.get(ConsumableService);
    expect(service).toBeTruthy();
  });
});
