import {Component, OnInit, ViewChild} from '@angular/core';
import {ErrorStateMatcher} from "@angular/material/core";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MustMatch} from "../sign-up/sign-up.component";
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent implements OnInit {
  sendForm: FormGroup;
  public loading = false;
  public mail: string;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router) {
  }

  ngOnInit() {
    this.sendForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.do_sendMail();
  }

  private do_sendMail() {
    this.mail = this.sendForm.get('email').value;
    this.loading = true;
    this.sendForm.controls['email'].disable();
    let sendData = {
          email: this.mail
        };
    this.registerService.sendMail(sendData)
      .subscribe(data => {
          console.log('mail send success');
          this.router.navigate(['/verification']);
        },
        error => {
          console.warn('mail send DOESN`T WORK');
          this.loading = false;
          this.sendForm.controls['email'].enable();
        });
  }
}
