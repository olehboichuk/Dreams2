import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBlueComponent } from './sidebar-blue.component';

describe('SidebarComponent', () => {
  let component: SidebarBlueComponent;
  let fixture: ComponentFixture<SidebarBlueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarBlueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
