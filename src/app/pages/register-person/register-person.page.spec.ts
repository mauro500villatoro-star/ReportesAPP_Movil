import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPersonPage } from './register-person.page';

describe('RegisterPersonPage', () => {
  let component: RegisterPersonPage;
  let fixture: ComponentFixture<RegisterPersonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
