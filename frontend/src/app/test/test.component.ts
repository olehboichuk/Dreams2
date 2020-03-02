import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  private idlePeriod = 100;
  private animationDuration = 1000;
  private lastAnimation = 0;
  private index = 0;
  one = true;
  two = false;
  tree = false;
  four = false;

  constructor(private authService: MessageService) {
  }


  ngOnInit() {
    this.authService.colorHeader(false);
    window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    //handle your scroll here
    //notice the 'odd' function assignment to a class field
    //this is used to be able to remove the event listener
  };

  toggleText(index, state) {
    if (state === 'show') {
      if (index == 0)
        this.one = true;
      if (index == 1) {
        this.two = true;
        this.authService.colorHeader(false);
      }
      if (index == 2) {
        this.tree = true;
        this.authService.colorHeader(true);
      }
      if (index == 3) {
        this.four = true;
        this.authService.colorHeader(false);
      }

    } else {
      if (index == 0)
        this.one = false;
      if (index == 1)
        this.two = false;
      if (index == 2)
        this.tree = false;
      if (index == 3)
        this.four = false;
    }
  }

  Scroll($event: WheelEvent) {
    let delta = $event.deltaY;
    let timeNow = new Date().getTime();
    if (timeNow - this.lastAnimation < this.idlePeriod + this.animationDuration) {
      return;
    }
    if (delta > 0) {
      this.Next();
    } else {
      this.Prev();
    }
    this.lastAnimation = timeNow;
  }

  Next() {
    if (this.index > 2) return;
    this.toggleText(this.index, 'hide');
    this.index++;
    this.toggleText(this.index, 'show');
  }

  Prev() {
    if (this.index < 1) return;
    this.toggleText(this.index, 'hide');
    this.index--;
    this.toggleText(this.index, 'show');
  }


}
