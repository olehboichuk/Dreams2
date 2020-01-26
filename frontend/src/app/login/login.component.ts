import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material";
import {Authentificationrequest} from "../models/authentificationrequest";
import {Router} from "@angular/router";
import {MessageService} from "../services/message.service";
import * as moment from "moment";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('passwordComponentWithConfirmation', {static: true})

  loginForm: FormGroup;
  public loading = false;
  matcher = new MyErrorStateMatcher();
  hidePassword= true;

  constructor(private loginService: MessageService, private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.do_login();
  }

  public do_login(): void {
    const user = <Authentificationrequest>{
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };
    this.loading = true;
    this.loginForm.controls['email'].disable();
    this.loginForm.controls['password'].disable();
    this.loginService.login(user)
      .subscribe(data => {
          const expiresAt = moment().add(data.expiresIn, 'second');
          localStorage.setItem('id_token', data.token);
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
          this.router.navigate(['/']);
        },
        error => {
          console.warn('LOGIN DOESN`T WORK');
          this.loading = false;
          this.loginForm.controls['email'].enable();
          this.loginForm.controls['password'].enable();
        });
  }


}
