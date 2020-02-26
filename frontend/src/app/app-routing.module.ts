import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {DreamFormComponent} from "./dream-form/dream-form.component";
import {LoginComponent} from "./login/login.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {SendMailComponent} from "./send-mail/send-mail.component";
import {VerificationComponent} from "./verification/verification.component";
import {TestComponent} from "./test/test.component";


const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'dream-register', component: DreamFormComponent},
  {path: 'user-profile/:userId', component: UserProfileComponent},
  {path: 'reset-password/:resetToken', component: ResetPasswordComponent},
  {path: 'forgot-password', component: SendMailComponent},
  {path: 'verification', component: VerificationComponent},
  {path: 'hello', component: TestComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
