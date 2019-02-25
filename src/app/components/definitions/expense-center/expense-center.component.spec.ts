import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCenterComponent } from './expense-center.component';

describe('ExpenseCenterComponent', () => {
  let component: ExpenseCenterComponent;
  let fixture: ComponentFixture<ExpenseCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
