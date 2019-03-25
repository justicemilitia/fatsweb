import { Injectable } from "@angular/core";
import swal from "src/../node_modules/sweetalert";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../error-service/error.service';
import { LanguageService } from '../language-service/language.service';

@Injectable({
  providedIn: "root"
})
export class PopupService {

  constructor(private errorService: ErrorService, private languageService: LanguageService) {

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
      text: this.languageService.getValue(error.statusText),
      icon: "warning"
    }).then(() => {
      this.errorService.errorManager(error);
    });
  }

  ShowMenuAuthorizePopup(ok) {
    swal({
      title: "Menü için yetkiniz bulunmamaktadır!",
      text: "",
      icon: "warning"
    }).then(() => {
      ok()
    });
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

  ShowQuestionPopupForOperation(callBack){
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

  ShowQuestionPopupForFoundFixedAsset(callBack){
    swal({
      title: "Seçili demirbaşlar 'Demirbaş Listesine eklenecektir' ?",
      text: "İşlemi onaylıyor musunuz ?",
      icon: "warning",
      buttons: ['Hayır', 'Evet'],
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
