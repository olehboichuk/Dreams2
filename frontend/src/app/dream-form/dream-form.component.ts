import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LabelType, Options} from "ng5-slider";

@Component({
  selector: 'app-dream-form',
  templateUrl: './dream-form.component.html',
  styleUrls: ['./dream-form.component.scss']
})
export class DreamFormComponent implements OnInit {
  value: number =10000;
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
  myForm: FormGroup;
  loading: false;

  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      about: ['', Validators.required],
      buggete: ['', Validators.required],

    });
  }

}
