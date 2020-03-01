import {Component, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
  private _authService: MessageService;


  constructor(private authService: MessageService, private router: Router) {
    this._authService = authService;
  }



  ngOnInit() {

  }
}
