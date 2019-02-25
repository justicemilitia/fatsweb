import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutReasonsComponent } from './check-out-reasons.component';

describe('CheckedOutReasonsComponent', () => {
  let component: CheckOutReasonsComponent;
  let fixture: ComponentFixture<CheckOutReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
