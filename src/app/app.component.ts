import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from './services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'loginSignUp';

  constructor(
    private httpservice:HttpService,
    private router:Router
  ){}

  ngOnInit(){
    let token=localStorage.getItem('auth-token');
    console.log(token)
    if(token){
    console.log("token")

      this.httpservice.login('http://localhost:8080/auth',null,token,(data)=>{
        if(data){
          console.log(data);
          this.router.navigate(['dashboard'])
        }
        else{
          console.log(data);
          this.router.navigate(['/'])
        }
      },(err)=>{
        console.log(err);
      })
    }
    else{
    console.log("token1")

      this.router.navigate(['/'])
    }
  }
}
