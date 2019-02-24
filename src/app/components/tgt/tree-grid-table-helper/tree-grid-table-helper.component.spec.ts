import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGridTableHelperComponent } from './tree-grid-table-helper.component';

describe('TreeGridTableHelperComponent', () => {
  let component: TreeGridTableHelperComponent;
  let fixture: ComponentFixture<TreeGridTableHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeGridTableHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeGridTableHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
