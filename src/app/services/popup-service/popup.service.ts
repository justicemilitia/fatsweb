import { Injectable } from "@angular/core";
import swal from "src/../node_modules/sweetalert";

@Injectable({
  providedIn: "root"
})
export class PopupService {
  constructor() {}

  ShowHello() {
    swal("Selam canım :)", "", "success");
  }

  ShowSuccessPopup() {
    swal({
      title: "İşlem Başarılı!",
      text: "",
      icon: "success"
    });
  }
  
  ShowQuestionPopupForDelete(){
    swal({
      title: "Silmek istediğinize emin misiniz?",
      text: "Bu işlem geri alınamaz.",
      icon: "warning",
      buttons: ['Vazgeç', 'Sil'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Başarıyla silindi!", {
          icon: "success",
        });
      } else {
        swal("İşlem iptal edildi!");
      }
    });
  }
  ShowQuestionPopupForUpdate(){
    swal({
      title: "Bu kaydı güncellemek istediğinize emin misiniz?",
      text: "Bu işlem geri alınamaz.",
      icon: "warning",
      buttons: ['Vazgeç', 'Güncelle'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Başarıyla silindi!", {
          icon: "success",
        });
      } else {
        swal("İşlem iptal edildi!");
      }
    }); 
  }
}
