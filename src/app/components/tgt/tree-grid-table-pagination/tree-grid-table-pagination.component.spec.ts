import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGridTablePaginationComponent } from './tree-grid-table-pagination.component';

describe('TreeGridTablePaginationComponent', () => {
  let component: TreeGridTablePaginationComponent;
  let fixture: ComponentFixture<TreeGridTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeGridTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeGridTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
