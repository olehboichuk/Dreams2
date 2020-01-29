import {Component, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Dreams} from "../models/dreams";
import {Profile} from "../models/profile";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  liked = false;
  private speakerId: string;
  private profile: Profile;

  constructor(private registerService: MessageService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.speakerId = paramMap.get('userId');
        this.registerService.profile(this.speakerId).subscribe(res => {
          this.profile = res.profile;
        },error => {
          console.warn('hui');
        });
      }
    });
  }

  like() {

  }
}
