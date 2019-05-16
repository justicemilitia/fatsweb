/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DepreciationDetailListComponent } from './depreciation-detail-list.component';

describe('DepreciationDetailListComponent', () => {
  let component: DepreciationDetailListComponent;
  let fixture: ComponentFixture<DepreciationDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
