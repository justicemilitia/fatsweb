/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaChangeFirmComponent } from './fa-change-firm.component';

describe('FaChangeFirmComponent', () => {
  let component: FaChangeFirmComponent;
  let fixture: ComponentFixture<FaChangeFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaChangeFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaChangeFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
