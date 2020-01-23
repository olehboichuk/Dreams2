import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  liked = false;

  constructor() {
  }

  ngOnInit() {
  }

  like() {
    if (this.liked == true)
      this.liked = false;
    else
      this.liked = true;
  }
}
