import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Authentificationrequest} from "../models/authentificationrequest";
import {Token} from "../models/token";
import {Registration} from "../models/registration";
import {Dreamregister} from "../models/dreamregister";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private logInURL = 'http://localhost:5000/users/login';
  private signInURL = 'http://localhost:5000/users/register';
  private dreamRegURL = 'http://localhost:5000/users/dream-register';

  constructor(private http: HttpClient) {
  }

  login(user: Authentificationrequest) {
    return this.http.post<Token>(this.logInURL, user);
  }

  logout() {
    localStorage.removeItem("id_token");
  }

  register(user: Registration) {
    return this.http.post(this.signInURL, user);
  }

  dreamRegister(dream: Dreamregister) {
    return this.http.post(this.dreamRegURL, dream);
  }
}
