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

  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router) {
  }

  ngOnInit() {
    const sortType = {
      sort_type: 'likes',
    };
    // this.registerService.getAllDreams(sortType).subscribe(data => {
    //   console.log('ok');
    //   }, error => {
    //   console.warn('no ok');
    //   }
    // );
  }

  like() {
    if (this.liked == true)
      this.liked = false;
    else
      this.liked = true;
  }
}
