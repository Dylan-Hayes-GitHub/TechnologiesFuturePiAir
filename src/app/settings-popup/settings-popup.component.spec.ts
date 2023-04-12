import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { SettingsPopupComponent } from './settings-popup.component';
import { FormBuilder } from '@angular/forms';
describe('SettingsPopupComponent', () => {
  let component: SettingsPopupComponent;
  let fixture: ComponentFixture<SettingsPopupComponent>;
  let mockDialogRef: MatDialogRef<SettingsPopupComponent>; // Mock MatDialogRef with appropriate type parameter

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ SettingsPopupComponent ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef } // Provide the mock MatDialogRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
