import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutFixedAssetComponent } from './checkout-fixed-asset.component';

describe('CheckoutFixedAssetComponent', () => {
  let component: CheckoutFixedAssetComponent;
  let fixture: ComponentFixture<CheckoutFixedAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutFixedAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutFixedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
