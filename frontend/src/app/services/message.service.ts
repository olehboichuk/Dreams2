import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Authentificationrequest} from "../models/authentificationrequest";
import {Token} from "../models/token";
import {Registration} from "../models/registration";
import {Dreamregister} from "../models/dreamregister";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private logInURL = 'http://localhost:5000/users/login';
  private signInURL = 'http://localhost:5000/users/register';
  private dreamRegURL = 'http://localhost:5000/users/dream-register';
  private dreamsURL = 'http://localhost:5000/users/home';
  private logoutURL = 'http://localhost:5000/logout';
  public _logInUser = false;

  constructor(private http: HttpClient) {
  }

  login(user: Authentificationrequest) {
    return this.http.post<Token>(this.logInURL, user);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this._logInUser = false;
  }

  register(user: Registration) {
    return this.http.post<Token>(this.signInURL, user);
  }

  dreamRegister(dream: Dreamregister) {
    return this.http.post(this.dreamRegURL, dream);
  }

  getAllDreams(likes: { sort_type: string }) {
    return this.http.post(this.dreamsURL, likes);
  }

  isLoggedIn() {
    return moment(new Date().toUTCString()).isBefore(this.getExpiration());
  }

  getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

  logoutUser() {
    this.http.get(this.logoutURL);
    this._logInUser = false;
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
