import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employers } from '../models/Empoyers';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css']
  
})
export class EmployersComponent implements OnInit {

  constructor(private http:HttpClient) { }

  employers:Employers[]=[];
  ngOnInit() {
   
    this.getEmployers().subscribe(data=>{
      this.employers=data
    })

  }
  getEmployers()
  {
    return this.http.get<Employers[]>("http://localhost:11889/api/Employee/GetEmployeesSP")
  }
}
