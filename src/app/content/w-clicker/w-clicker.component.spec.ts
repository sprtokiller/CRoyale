import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WClickerComponent } from './w-clicker.component';

describe('WClickerComponent', () => {
  let component: WClickerComponent;
  let fixture: ComponentFixture<WClickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WClickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WClickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
