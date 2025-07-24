import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyBoardComponent } from './party-board.component';

describe('PartyBoardComponent', () => {
  let component: PartyBoardComponent;
  let fixture: ComponentFixture<PartyBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyBoardComponent]
    });
    fixture = TestBed.createComponent(PartyBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
