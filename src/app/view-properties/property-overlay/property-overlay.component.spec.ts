import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyOverlayComponent } from './property-overlay.component';

describe('PropertyOverlayComponent', () => {
  let component: PropertyOverlayComponent;
  let fixture: ComponentFixture<PropertyOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyOverlayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
