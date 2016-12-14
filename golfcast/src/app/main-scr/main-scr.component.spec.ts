/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainScrComponent } from './main-scr.component';

describe('MainScrComponent', () => {
  let component: MainScrComponent;
  let fixture: ComponentFixture<MainScrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
