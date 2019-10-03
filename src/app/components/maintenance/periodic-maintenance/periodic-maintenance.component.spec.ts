import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicMaintenanceComponent } from './periodic-maintenance.component';

describe('PeriodicMaintenanceComponent', () => {
  let component: PeriodicMaintenanceComponent;
  let fixture: ComponentFixture<PeriodicMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodicMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
