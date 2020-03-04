import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-sidebar-blue',
  templateUrl: './sidebar-blue.component.html',
  styleUrls: ['./sidebar-blue.component.scss']
})

export class SidebarBlueComponent implements OnInit, OnDestroy {
  public _authService: MessageService;

  constructor(private authService: MessageService) {
    this._authService = authService;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  hamburger() {
    const hamburger = document.querySelector(".hamburger");
    const bar = document.querySelector(".sidebar");
    bar.classList.toggle("active");
    hamburger.classList.toggle("is-active");
  }
}
