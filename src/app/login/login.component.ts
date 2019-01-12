import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { LoginModel } from '../models/loginModel';
import { SignUpModel } from '../models/signupModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup:FormGroup;
  signUpFormGroup:FormGroup;
  errmsg:string

  constructor(
    private fb:FormBuilder,
    private httpService:HttpService,
    private router:Router
  ) { }

  ngOnInit() {
    this.loginFormGroup =this.fb.group({
      email:["",[Validators.required,Validators.minLength(3),Validators.email]],
      password:["",[Validators.required]]
    })
    this.signUpFormGroup=this.fb.group({
      name:["",[Validators.required]],
      email:["",[Validators.required,Validators.email]],
      // password:["",[Validators.required]],
    })

    let token:string=sessionStorage.getItem('x-auth-token');
    if(token){
      this.httpService.login("loginurl",null,token,(data)=>{
        if(data){
          console.log(data);
        }
      },(err)=>{
        console.log(err);
        this.errmsg=err;
      })
    }
  }

  loginClick(){
    let data:LoginModel= new LoginModel();
    data = this.loginFormGroup.value; 
    this.httpService.login("http://localhost:8080/auth",data,null,(response)=>{
      if(response){
        this.errmsg=null;
        console.log(response);
        localStorage.setItem('auth-token',response.token);
        localStorage.setItem('user',response.name);
        this.router.navigate(['dashboard']);
        //set the token in sessionStorage
      }
    },(err)=>{
      if(err){
        console.log(err) 
        this.errmsg=err;       
      }
    })
  }

  signUpClick(){
    let data:SignUpModel = new SignUpModel();
    data = this.signUpFormGroup.value;
    this.httpService.signUp('http://localhost:8080/user',data,(response)=>{
      if(response){
        this.errmsg=null;
        console.log(response);
        alert("user Successfully saved and password is send to the registered mail Id");
        // localStorage.setItem('auth-token',response.token);
        this.router.navigate(['/']);        
        //set the token and login() with token
      }
    },(err)=>{
      console.log(err)
      this.errmsg=err;
    })
  }

  resetClick(form:FormGroup){
    form.reset();
  }
}
