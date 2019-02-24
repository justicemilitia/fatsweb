import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGridTableHeaderComponent } from './tree-grid-table-header.component';

describe('TreeGridTableHeaderComponent', () => {
  let component: TreeGridTableHeaderComponent;
  let fixture: ComponentFixture<TreeGridTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeGridTableHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeGridTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
