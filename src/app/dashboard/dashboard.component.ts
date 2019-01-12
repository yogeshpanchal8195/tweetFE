import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { SignUpModel } from '../models/signupModel';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { SearchDataModel } from '../models/searchdata';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }

  userObj: string;
  message: string;
  searchdata:SearchDataModel;
  from:Date
  statusModelArray:Array<any>=[];
  setFav:boolean
  favIdsArray:Array<any>=[];

  ngOnInit() {
    this.setFav=false;
    var token = localStorage.getItem('auth-token');

    // this.httpService.login("http://localhost:8080/auth", null, token, (response) => {
    //   if (response) {
    //     console.log(response);
    //     this.userObj = response;

    //   }
    // }, (err) => {
    //   console.log(err);
    // })

    if(token){
      this.userObj=localStorage.getItem('user');
    }
    
  }

  logout() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    this.router.navigate(['/'])
  }

  dataFn() {
    this.searchdata = new SearchDataModel();
    if(this.message && this.from){
      this.searchdata.text= this.message + " since:" + this.from;
    }else if (this.message){
      this.searchdata.text= this.message;
    }

    this.httpService.fetchData("http://localhost:8080/data/search", this.searchdata, (response) => {
      if (response) {
        console.log(response);
        if(response.statuses){
          this.statusModelArray=response.statuses;
        }else if(response.data){
          if(response.data.statuses){
          this.statusModelArray=response.data.statuses;
          }
        }
      }
    }, (err) => {
      console.log(err);
    })
  }

  favourite(data){
    this.httpService.favouriteData("http://localhost:8080/data/favourite", data, (response) => {
      if (response) {
        console.log(response);
        if(response.data){
          if(response.flag){
            this.favIdsArray.push(response.data.favourite);
          }
          else{
            let index=this.favIdsArray.findIndex( element => element.id == response.data._id );
            if(index != -1){
              this.favIdsArray.splice(index,1);
            }
          }
        this.httpService.updateFavs(this.favIdsArray);
        }
      }
    }, (err) => {
      console.log(err);
    })
  }

  favoriteList(){
    this.router.navigate(['/favourites']);    
    // this.setFav=true;
    // this.httpService.favouritesList("http://localhost:8080/data/favouritesList", (response) => {
    //   if (response) {
    //     console.log(response);
    //     this.favIdsArray=[];
    //     response.forEach(element => {
    //       this.favIdsArray.push(element.favourite);
    //     });
    //   }
    // }, (err) => {
    //   console.log(err);
    // })
  }



}
