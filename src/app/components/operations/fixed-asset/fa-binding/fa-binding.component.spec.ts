import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaBindingComponent } from './fa-binding.component';

describe('FaBindingComponent', () => {
  let component: FaBindingComponent;
  let fixture: ComponentFixture<FaBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaBindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
