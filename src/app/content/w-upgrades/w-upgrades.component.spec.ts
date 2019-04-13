import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WUpgradesComponent } from './w-upgrades.component';

describe('WUpgradesComponent', () => {
  let component: WUpgradesComponent;
  let fixture: ComponentFixture<WUpgradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WUpgradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WUpgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
