import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {Authentificationrequest} from "../models/authentificationrequest";
import {Registration} from "../models/registration";
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";
import * as moment from "moment";
import {SearchCountryField, TooltipLabel, CountryISO} from 'ngx-intl-tel-input';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})


export class SignUpComponent implements OnInit {
  @ViewChild('passwordComponentWithConfirmation', {static: true})
  registerForm: FormGroup;
  public loading = false;
  public password: string;
  matcher = new MyErrorStateMatcher();
  public hidePassword = true;
  public hideConfirm = true;


  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router) {
  }


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.do_register();
  }

  public do_register(): void {
    const user = <Registration>{
      first_name: this.registerForm.get('name').value,
      last_name: this.registerForm.get('surname').value,
      email: this.registerForm.get('email').value,
      phone_number: this.registerForm.get('phone').value,
      password: this.registerForm.get('password').value
    };
    this.loading = true;
    this.registerForm.controls['name'].disable();
    this.registerForm.controls['surname'].disable();
    this.registerForm.controls['email'].disable();
    this.registerForm.controls['phone'].disable();
    this.registerForm.controls['email'].disable();
    this.registerForm.controls['confirmPassword'].disable();
    this.registerService.register(user)
      .subscribe(data => {
          const expiresAt = moment.utc().add(data.expiresIn, 'second');
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
          localStorage.setItem('id_token', data.token);
          console.log('success');
          this.router.navigate(['/dream-register']);
        },
        error => {
          console.warn('REGISTRATION DOESN`T WORK');
          this.loading = false;
          this.registerForm.controls['name'].enable();
          this.registerForm.controls['surname'].enable();
          this.registerForm.controls['email'].enable();
          this.registerForm.controls['phone'].enable();
          this.registerForm.controls['email'].enable();
          this.registerForm.controls['confirmPassword'].enable();
        });
  }
}


export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mustMatch: true});
    } else {
      matchingControl.setErrors(null);
    }
  }
}
