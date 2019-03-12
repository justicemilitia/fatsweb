import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCreateComponent } from './fa-create.component';

describe('FaCreateComponent', () => {
  let component: FaCreateComponent;
  let fixture: ComponentFixture<FaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
