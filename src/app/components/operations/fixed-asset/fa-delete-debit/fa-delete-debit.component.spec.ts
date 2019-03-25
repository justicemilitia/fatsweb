/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaDeleteDebitComponent } from './fa-delete-debit.component';

describe('FaDeleteDebitComponent', () => {
  let component: FaDeleteDebitComponent;
  let fixture: ComponentFixture<FaDeleteDebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaDeleteDebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaDeleteDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
