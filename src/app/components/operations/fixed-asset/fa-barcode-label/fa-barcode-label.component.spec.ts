import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaBarcodeLabelComponent } from './fa-barcode-label.component';

describe('FaBarcodeLabelComponent', () => {
  let component: FaBarcodeLabelComponent;
  let fixture: ComponentFixture<FaBarcodeLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaBarcodeLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaBarcodeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
