import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAuthorizationComponent } from './role-authorization.component';

describe('RoleAuthorizationComponent', () => {
  let component: RoleAuthorizationComponent;
  let fixture: ComponentFixture<RoleAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
