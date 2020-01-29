import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";
import {Dreams} from "../models/dreams";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  private liked = false;
  public loading = false;
  private dreams: Dreams [] = [];
  private listSize = 10;
  dataSort = false;
  yourSort = false;
  likesSort = true;
  moreTen: boolean;

  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router) {
  }


  ngOnInit() {
    const sortType = {
      sort_type: 'likes',
      list_size: this.listSize,
    };
    this.registerService.getAllDreams(sortType).subscribe(data => {
        this.dreams = data.dreams;
        if(this.dreams.length>=this.listSize){
          this.moreTen = true;
        }else {
          this.moreTen = false;
        }
      }, error => {
        console.warn('no ok');
      }
    );
  }

  like() {
    if (this.liked == true)
      this.liked = false;
    else
      this.liked = true;
  }


  sortLikes() {
    const sortType = {
      sort_type: 'likes',
      list_size: this.listSize,
    };
    this.registerService.getAllDreams(sortType).subscribe(data => {
        this.dreams = data.dreams;
      }, error => {
        console.warn('no ok');
      }
    );
    this.dataSort = false;
    this.likesSort = true;
    this.yourSort = false;
  }

  sortData() {
    const sortType = {
      sort_type: 'create_time',
      list_size: this.listSize,
    };
    this.registerService.getAllDreams(sortType).subscribe(data => {
        this.dreams = data.dreams;
      }, error => {
        console.warn('no ok');
      }
    );
    this.dataSort = true;
    this.likesSort = false;
    this.yourSort = false;
  }

  sortYour() {
    this.yourSort = true;
    this.likesSort = false;
    this.dataSort = false;
  }

  moreDreams() {
    this.listSize+=10;
    const sortType = {
      sort_type: 'likes',
      list_size: this.listSize,
    };
    this.registerService.getAllDreams(sortType).subscribe(data => {
        this.dreams = data.dreams;
        if(this.dreams.length>=this.listSize){
          this.moreTen = true;
        }else {
          this.moreTen = false;
        }
      }, error => {
        console.warn('no ok');
      }
    );
  }
}
