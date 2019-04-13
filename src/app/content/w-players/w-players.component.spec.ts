import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WPlayersComponent } from './w-players.component';

describe('WPlayersComponent', () => {
  let component: WPlayersComponent;
  let fixture: ComponentFixture<WPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
