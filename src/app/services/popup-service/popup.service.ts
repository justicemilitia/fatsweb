import { Injectable } from "@angular/core";
import swal from "src/../node_modules/sweetalert";
import { BaseService } from '../base.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../error-service/error.service';

@Injectable({
  providedIn: "root"
})
export class PopupService {
  constructor(private errorService: ErrorService) {

  }

  ShowHello() {
    swal("Selam canım :)", "", "success");
  }


  ShowAlertPopup(message: string) {
    swal(message, "", "warning");
  }

  ShowSuccessPopup(message: string) {
    swal({
      title: "İşlem Başarılı",
      text: message,
      icon: "success"
    });
  }

  ShowErrorPopup(error: HttpErrorResponse) {
    swal({
      title: "İşlem Başarısız",
      text: error.statusText,
      icon: "warning"
    }).then(() => {
      this.errorService.errorManager(error);
    })
  }

  ShowMenuAuthorizePopup() {
    swal({
      title: "Menü için yetkiniz bulunmamaktadır!",
      text: "",
      icon: "warning"
    })
  }

  ShowQuestionPopupForDelete(callback) {
    swal({
      title: "Silmek istediğinize emin misiniz?",
      text: "Bu işlem geri alınamaz.",
      icon: "warning",
      buttons: ['Vazgeç', 'Sil'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete == true) {
          callback();
        }
      });
  }

  ShowQuestionPopupForUpdate(callBack) {
    swal({
      title: "Bu kaydı güncellemek istediğinize emin misiniz?",
      text: "Bu işlem geri alınamaz.",
      icon: "warning",
      buttons: ['Vazgeç', 'Güncelle'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          callBack(true);
        } else {
          callBack(false);
        }
      });
  }
}