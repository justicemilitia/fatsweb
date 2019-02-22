import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

onFileSelected(event){
  console.log(event);
 } 

constructor() { }

}
