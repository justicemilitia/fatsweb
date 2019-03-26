import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertInfosComponent } from './alert-infos.component';

describe('AlertInfosComponent', () => {
  let component: AlertInfosComponent;
  let fixture: ComponentFixture<AlertInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
