import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaExitComponent } from './fa-exit.component';

describe('FaExitComponent', () => {
  let component: FaExitComponent;
  let fixture: ComponentFixture<FaExitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaExitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
