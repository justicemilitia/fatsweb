import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import{} from 'bootstrap'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authservice: AuthenticationService) { }

  loginUser: any = {};
  
  ngOnInit() {
  }

  Login() {
    this.authservice.Login(this.loginUser);
  }
}
