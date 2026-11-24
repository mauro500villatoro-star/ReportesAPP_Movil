import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonasRegistradasPage } from './personas-registradas.page';

describe('PersonasRegistradasPage', () => {
  let component: PersonasRegistradasPage;
  let fixture: ComponentFixture<PersonasRegistradasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasRegistradasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
