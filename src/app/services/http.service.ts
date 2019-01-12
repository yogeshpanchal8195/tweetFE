import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { LoginModel } from '../models/loginModel';
import { SignUpModel } from '../models/signupModel';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class HttpService {

  userData: SignUpModel;
  userDataObs: Observable<any>;
  userDataBs: BehaviorSubject<any>;

  favs:Array<any>;
  favsObs:Observable<Array<any>>;
  favsBS:BehaviorSubject<Array<any>>;


  constructor(private http: HttpClient) {
    this.userData = new SignUpModel();
    this.userDataBs = new BehaviorSubject<SignUpModel>(this.userData);
    this.userDataObs = this.userDataBs.asObservable();

    this.favs=undefined;
    this.favsBS= new BehaviorSubject(this.favs);
    this.favsObs= this.favsBS.asObservable(); 
  }

  updateUserData(data: SignUpModel) {
    this.userData = data;
    this.userDataBs.next(Object.assign({}, this.userData));
  }

  updateFavs(data){
    this.favs= data;
    this.favsBS.next(this.favs); 
  }

  login(url: string, data: LoginModel, token: string, callback, error) {
    let headerData = new HttpHeaders();
    if (token) {
      headerData = headerData.append('x-auth-token', token);
    }
    this.http.post(url, data, { headers: headerData, observe: 'response' }).subscribe((response: HttpResponse<any>) => {
      if (response) {
        if (response.body) {
          callback(response.body);
          this.updateUserData(response.body);
        }
      }
    }, (err) => {
      console.log(err.error);
      error(err.error);
    })
  }

  signUp(url: string, data: SignUpModel, callback, error) {
    this.http.post(url, data, { observe: 'response' }).subscribe((response: HttpResponse<any>) => {
      if (response) {
        if (response.body) {
          callback(response.body);
          this.updateUserData(response.body);
        }
      }
    }, (err) => {
      console.log(err.error);
      error(err.error)
    })
  }

  fetchData(url: string, data: Object, callback, error) {
    let httpParams = new HttpParams();
    Object.keys(data).forEach(function (key) {
      httpParams = httpParams.append(key, data[key]);
    });

    this.http.get(url, { observe: 'response', params: httpParams }).subscribe((response: HttpResponse<any>) => {
      if (response) {
        if (response.body) {
          callback(response.body);
          this.updateUserData(response.body);
        }
      }
    }, (err) => {
      console.log(err.error);
      error(err.error)
    })
  }

  favouriteData(url: string, data: Object, callback, error) {
    this.http.post(url, data).subscribe((response: HttpResponse<any>) => {
      if (response) {
          callback(response);
      }
    }, (err) => {
      console.log(err.error);
      error(err.error)
    })
  }

  favouritesList(url: string, callback, error) {
    this.http.get(url).subscribe((response: HttpResponse<any>) => {
      if (response) {
          callback(response);
      }
    }, (err) => {
      console.log(err.error);
      error(err.error)
    })
  }



}
