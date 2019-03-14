import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetStatusComponent } from './fixed-asset-status.component';

describe('StatusComponent', () => {
  let component: FixedAssetStatusComponent;
  let fixture: ComponentFixture<FixedAssetStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedAssetStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAssetStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
