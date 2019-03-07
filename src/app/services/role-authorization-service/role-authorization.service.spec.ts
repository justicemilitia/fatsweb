import { TestBed } from '@angular/core/testing';

import { RoleAuthorizationService } from '../role-authorization/role-authorization.service';

describe('RoleAuthorizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleAuthorizationService = TestBed.get(RoleAuthorizationService);
    expect(service).toBeTruthy();
  });
});
