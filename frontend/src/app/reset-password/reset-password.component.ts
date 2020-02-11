import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MustMatch, MyErrorStateMatcher} from "../sign-up/sign-up.component";
import {MessageService} from "../services/message.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  public loading = false;
  private password: string;
  public hidePassword = true;
  public hideConfirm = true;
  private resetToken: string;

  constructor(private formBuilder: FormBuilder, private registerService: MessageService, private router: Router, public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.do_reset();
  }

  private do_reset() {
    this.password = this.resetForm.get('password').value;
    this.loading = true;
    this.resetForm.controls['password'].disable();
    this.resetForm.controls['confirmPassword'].disable();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('resetToken')) {
        this.resetToken = paramMap.get('resetToken');
        let sendData = {
          password: this.password,
          token: this.resetToken
        }
        this.registerService.resetPassword(sendData)
          .subscribe(data => {
              console.log('success reset');
              this.router.navigate(['/login']);
            },
            error => {
              console.warn('RESET DOESN`T WORK');
              this.loading = false;
              this.resetForm.controls['email'].enable();
              this.resetForm.controls['confirmPassword'].enable();
            });

      }
    });
  }
}
