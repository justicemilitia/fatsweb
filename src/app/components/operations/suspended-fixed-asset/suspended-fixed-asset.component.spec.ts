import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedFixedAssetComponent } from './suspended-fixed-asset.component';

describe('SuspendedFixedAssetComponent', () => {
  let component: SuspendedFixedAssetComponent;
  let fixture: ComponentFixture<SuspendedFixedAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspendedFixedAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendedFixedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
