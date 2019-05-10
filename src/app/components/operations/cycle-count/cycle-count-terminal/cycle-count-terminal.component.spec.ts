import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCountTerminalComponent } from './cycle-count-terminal.component';

describe('CycleCountTerminalComponent', () => {
  let component: CycleCountTerminalComponent;
  let fixture: ComponentFixture<CycleCountTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleCountTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleCountTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
