import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaResetFormComponent } from './fa-reset-form.component';

describe('FaResetFormComponent', () => {
  let component: FaResetFormComponent;
  let fixture: ComponentFixture<FaResetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaResetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaResetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
