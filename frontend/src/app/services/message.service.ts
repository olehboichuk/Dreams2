import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Authentificationrequest} from "../models/authentificationrequest";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private logInURL = 'http://localhost:5000/users/login';

  constructor(private http: HttpClient) { }

  login(user: Authentificationrequest){
    return this.http.post(this.logInURL, user);
  }

}
