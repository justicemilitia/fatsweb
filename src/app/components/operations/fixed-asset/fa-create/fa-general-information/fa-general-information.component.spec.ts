import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaGeneralInformationComponent } from './fa-general-information.component';

describe('FaGeneralInformationComponent', () => {
  let component: FaGeneralInformationComponent;
  let fixture: ComponentFixture<FaGeneralInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaGeneralInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaGeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
