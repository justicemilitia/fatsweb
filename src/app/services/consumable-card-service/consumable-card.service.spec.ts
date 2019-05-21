/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsumableCardService } from './consumable-card.service';

describe('Service: ConsumableCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumableCardService]
    });
  });

  it('should ...', inject([ConsumableCardService], (service: ConsumableCardService) => {
    expect(service).toBeTruthy();
  }));
});
