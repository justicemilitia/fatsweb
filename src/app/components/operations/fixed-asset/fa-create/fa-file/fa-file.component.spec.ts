import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaFileComponent } from './fa-file.component';

describe('FaFileComponent', () => {
  let component: FaFileComponent;
  let fixture: ComponentFixture<FaFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
