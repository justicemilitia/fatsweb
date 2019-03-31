/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaSuspendComponent } from './fa-suspend.component';

describe('FaSuspendComponent', () => {
  let component: FaSuspendComponent;
  let fixture: ComponentFixture<FaSuspendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaSuspendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaSuspendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
