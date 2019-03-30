/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaLostComponent } from './fa-lost.component';

describe('FaLostComponent', () => {
  let component: FaLostComponent;
  let fixture: ComponentFixture<FaLostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaLostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
