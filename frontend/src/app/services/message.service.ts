import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Authentificationrequest} from "../models/authentificationrequest";
import {Token} from "../models/token";
import {Registration} from "../models/registration";
import {Dreamregister} from "../models/dreamregister";
import * as moment from "moment";
import {Dreams} from "../models/dreams";
import {Profile} from "../models/profile";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private logInURL = 'http://localhost:5000/users/login';
  private signInURL = 'http://localhost:5000/users/register';
  private dreamRegURL = 'http://localhost:5000/users/dream-register';
  private dreamsURL = 'http://localhost:5000/users/home';
  private dreamsLogenedURL = 'http://localhost:5000/users/user/home';
  private logoutURL = 'http://localhost:5000/logout';
  private profileURL = 'http://localhost:5000/profile/';
  private likeURL = 'http://localhost:5000/users/user/like';

  public _logInUser = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  profile(id: string) {
    return this.http.get<{ profile: Profile }>(this.profileURL + id);
  }

  login(user: Authentificationrequest) {
    return this.http.post<Token>(this.logInURL, user);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("dream_created");
    this._logInUser = false;
    this.router.navigate(['/login']);
  }

  register(user: Registration) {
    return this.http.post<Token>(this.signInURL, user);
  }

  dreamRegister(dream: Dreamregister) {
    return this.http.post(this.dreamRegURL, dream);
  }

  getAllDreams(sortType: { sort_type: string, list_size: number }) {
    return this.http.post<{ dreams: Dreams[] }>(this.dreamsURL, sortType);
  }

  getAllLoginedDreams(sortType: { sort_type: string, list_size: number }) {
    return this.http.post<{ dreams: Dreams[] }>(this.dreamsLogenedURL, sortType);
  }

  isLoggedIn() {
    if (!moment(new Date().toUTCString()).isBefore(this.getExpiration()) && localStorage.getItem("id_token")) {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("dream_created");
    }
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

  like(like: { _id: string, action: string }) {
    return this.http.post(this.likeURL, like);
  }

}
