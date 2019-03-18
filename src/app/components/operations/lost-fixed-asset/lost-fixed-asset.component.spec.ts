import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostFixedAssetComponent } from './lost-fixed-asset.component';

describe('LostFixedAssetComponent', () => {
  let component: LostFixedAssetComponent;
  let fixture: ComponentFixture<LostFixedAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostFixedAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostFixedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
