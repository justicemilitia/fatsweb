import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGridTableComponent } from './tree-grid-table.component';

describe('TreeGridTableComponent', () => {
  let component: TreeGridTableComponent;
  let fixture: ComponentFixture<TreeGridTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeGridTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeGridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
