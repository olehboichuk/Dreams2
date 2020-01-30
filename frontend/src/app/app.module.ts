import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DreamFormComponent } from './dream-form/dream-form.component';
import { AppRoutingModule } from './app-routing.module';
import {MatFormFieldModule, MatInputModule} from "@angular/material";
import {Ng5SliderModule} from "ng5-slider";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { MainPageComponent } from './main-page/main-page.component';
import {AuthInterceptor} from "./services/AuthInterceptor";
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {NgxMatIntlTelInputModule} from "ngx-mat-intl-tel-input";
import {MatIconModule} from "@angular/material/icon";
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    DreamFormComponent,
    MainPageComponent,
    ToolBarComponent,
    UserProfileComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    Ng5SliderModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    NgxIntlTelInputModule,
    NgxMatIntlTelInputModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
