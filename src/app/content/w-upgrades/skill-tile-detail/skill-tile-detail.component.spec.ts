import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTileDetailComponent } from './skill-tile-detail.component';

describe('SkillTileDetailComponent', () => {
  let component: SkillTileDetailComponent;
  let fixture: ComponentFixture<SkillTileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillTileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillTileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
