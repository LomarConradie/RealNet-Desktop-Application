import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOverlayComponent } from './buyer-overlay.component';

describe('BuyerOverlayComponent', () => {
  let component: BuyerOverlayComponent;
  let fixture: ComponentFixture<BuyerOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
