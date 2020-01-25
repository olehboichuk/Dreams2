import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LabelType, Options} from "ng5-slider";
import {Authentificationrequest} from "../models/authentificationrequest";
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";
import {Dreamregister} from "../models/dreamregister";

@Component({
  selector: 'app-dream-form',
  templateUrl: './dream-form.component.html',
  styleUrls: ['./dream-form.component.scss']
})
export class DreamFormComponent implements OnInit {
  public loading = false;
  value: number = 10000;
  dreamForm: FormGroup;

  options: Options = {
    floor: 0,
    step: 100,
    ceil: 20000,
    getPointerColor: (value: number): string => {
      return '#000000';
    },
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "кіко?: $" + value;
        default:
          return '$' + value;
      }
    }
  };


  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router,) {
  }

  ngOnInit() {
    this.dreamForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  onSubmit() {
    this.do_registerDream();
  }

  public do_registerDream(): void {
    const dream = <Dreamregister>{
      title: this.dreamForm.get('title').value,
      description: this.dreamForm.get('description').value,
      price: this.dreamForm.get('price').value
    };
    this.loading = true;
    this.dreamForm.controls['title'].disable();
    this.dreamForm.controls['description'].disable();
    this.dreamForm.controls['price'].disable();
    this.registerService.dreamRegister(dream)
      .subscribe(data => {
          console.log('success');
          this.router.navigate(['/home']);
        },
        error => {
          console.warn('Dreamregister DOESN`T WORK');
          this.loading = false;
          this.dreamForm.controls['title'].enable();
          this.dreamForm.controls['description'].enable();
          this.dreamForm.controls['price'].enable();
        });
  }

}
