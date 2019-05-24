import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableListComponent } from './consumable-list.component';

describe('ConsumableListComponent', () => {
  let component: ConsumableListComponent;
  let fixture: ComponentFixture<ConsumableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
