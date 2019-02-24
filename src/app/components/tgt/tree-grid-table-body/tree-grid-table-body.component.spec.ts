import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGridTableBodyComponent } from './tree-grid-table-body.component';

describe('TreeGridTableBodyComponent', () => {
  let component: TreeGridTableBodyComponent;
  let fixture: ComponentFixture<TreeGridTableBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeGridTableBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeGridTableBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
