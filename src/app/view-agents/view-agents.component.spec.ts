import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentsComponent } from './view-agents.component';

describe('ViewAgentsComponent', () => {
  let component: ViewAgentsComponent;
  let fixture: ComponentFixture<ViewAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
