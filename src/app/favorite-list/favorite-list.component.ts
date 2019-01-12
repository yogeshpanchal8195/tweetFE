import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit {

  constructor(
    private httpService: HttpService
  ) { }

  favIdsArray:Array<any>=[];

  ngOnInit() {

    this.httpService.favsObs.subscribe((data)=>{
      if(data){
      this.favIdsArray=data;
      }
    })

    this.httpService.favouritesList("http://localhost:8080/data/favouritesList", (response) => {
      if (response) {
        console.log(response);
        this.favIdsArray=[];
        response.forEach(element => {
          this.favIdsArray.push(element.favourite);
        });
        this.httpService.updateFavs(this.favIdsArray);
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

}
