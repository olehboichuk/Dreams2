import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
  private _authService: MessageService;

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
