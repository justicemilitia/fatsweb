/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsumableUnitService } from './consumable-unit.service';

describe('Service: ConsumableUnit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumableUnitService]
    });
  });

  it('should ...', inject([ConsumableUnitService], (service: ConsumableUnitService) => {
    expect(service).toBeTruthy();
  }));
});
