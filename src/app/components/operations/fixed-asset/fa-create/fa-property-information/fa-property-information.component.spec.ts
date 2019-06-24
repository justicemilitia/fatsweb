import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaPropertyInformationComponent } from './fa-property-information.component';

describe('FaPropertyInformationComponent', () => {
  let component: FaPropertyInformationComponent;
  let fixture: ComponentFixture<FaPropertyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaPropertyInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaPropertyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
