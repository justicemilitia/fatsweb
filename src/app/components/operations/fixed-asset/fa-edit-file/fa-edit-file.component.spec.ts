import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaEditFileComponent } from './fa-edit-file.component';

describe('FaEditFileComponent', () => {
  let component: FaEditFileComponent;
  let fixture: ComponentFixture<FaEditFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaEditFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaEditFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
