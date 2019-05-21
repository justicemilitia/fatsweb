/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsumableCategoryService } from './consumable-category.service';

describe('Service: ConsumableCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumableCategoryService]
    });
  });

  it('should ...', inject([ConsumableCategoryService], (service: ConsumableCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
