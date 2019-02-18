import { Injectable } from '@angular/core';
import swal from 'src/../node_modules/sweetalert';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

constructor() { }

ShowHello(){
   swal("Selam canım :)","", "success");
}

}
