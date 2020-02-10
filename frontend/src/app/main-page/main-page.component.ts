import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";
import {Dreams} from "../models/dreams";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))  // final
      ]),
    ]),
  ],
})
export class MainPageComponent implements OnInit {
  private dreams: Dreams [] = [];
  private listSize = 10;
  public sortType = {
    sort_type: 'likes',
    list_size: this.listSize,
  };
  dataSort = false;
  yourSort = false;
  likesSort = true;
  moreTen: boolean;

  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router) {
  }


  ngOnInit() {
    if (localStorage.getItem("dream_created") == 'false')
      this.router.navigate(['/dream-register']);
    if (localStorage.getItem("id_token")) {
      this.registerService.getAllLoginedDreams(this.sortType).subscribe(data => {
          this.dreams = data.dreams;
          if (this.dreams.length >= this.listSize) {
            this.moreTen = true;
          } else {
            this.moreTen = false;
          }
          console.warn('loggg');
        }, error => {
          console.warn('no ok');
        }
      );
    } else {
      this.registerService.getAllDreams(this.sortType).subscribe(data => {
          this.dreams = data.dreams;
          if (this.dreams.length >= this.listSize) {
            this.moreTen = true;
          } else {
            this.moreTen = false;
          }
          console.warn('No loggg');
        }, error => {
          console.warn('no ok');
        }
      );
    }

  }

  like(id: string, isLiked: string) {
    let like = {
      _id: id,
      action: 'like',
    };
    if (isLiked == 'true') {
      like = {
        _id: id,
        action: 'unlike',
      };
    }
    this.registerService.like(like).subscribe(data => {
        this.ngOnInit();
        console.warn('pzdts ok ok');
      }, error => {
        console.warn('no ok');
      }
    );

  }


  sortLikes() {
    this.sortType = {
      sort_type: 'likes',
      list_size: this.listSize,
    };
    this.ngOnInit();
    this.dataSort = false;
    this.likesSort = true;
    this.yourSort = false;
  }

  sortData() {
    this.sortType = {
      sort_type: 'create_time',
      list_size: this.listSize,
    };
    this.ngOnInit();
    this.dataSort = true;
    this.likesSort = false;
    this.yourSort = false;
  }

  sortYour() {
    this.sortType = {
      sort_type: 'my_likes',
      list_size: this.listSize,
    };
    this.ngOnInit();
    this.yourSort = true;
    this.likesSort = false;
    this.dataSort = false;
  }

  moreDreams() {
    this.listSize += 10;
    this.sortType = {
      sort_type: 'likes',
      list_size: this.listSize,
    };
    this.registerService.getAllDreams(this.sortType).subscribe(data => {
        this.dreams = data.dreams;
        if (this.dreams.length >= this.listSize) {
          this.moreTen = true;
        } else {
          this.moreTen = false;
        }
      }, error => {
        console.warn('no ok');
      }
    );
  }
}
