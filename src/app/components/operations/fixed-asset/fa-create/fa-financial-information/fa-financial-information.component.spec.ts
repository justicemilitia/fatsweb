import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaFinancialInformationComponent } from './fa-financial-information.component';

describe('FaFinancialInformationComponent', () => {
  let component: FaFinancialInformationComponent;
  let fixture: ComponentFixture<FaFinancialInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaFinancialInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaFinancialInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
