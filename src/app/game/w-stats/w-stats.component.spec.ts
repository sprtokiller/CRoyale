import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WStatsComponent } from './w-stats.component';

describe('WStatsComponent', () => {
  let component: WStatsComponent;
  let fixture: ComponentFixture<WStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
