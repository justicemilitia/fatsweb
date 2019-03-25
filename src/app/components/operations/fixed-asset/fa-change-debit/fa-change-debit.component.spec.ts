/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaChangeDebitComponent } from './fa-change-debit.component';

describe('FaChangeDebitComponent', () => {
  let component: FaChangeDebitComponent;
  let fixture: ComponentFixture<FaChangeDebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaChangeDebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaChangeDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
