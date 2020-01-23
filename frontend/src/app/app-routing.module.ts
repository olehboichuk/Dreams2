import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {DreamFormComponent} from "./dream-form/dream-form.component";
import {LoginComponent} from "./login/login.component";
import {MainPageComponent} from "./main-page/main-page.component";


const routes: Routes = [
  {path: 'register', component: SignUpComponent},
  {path: 'dream-register', component: DreamFormComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: MainPageComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
