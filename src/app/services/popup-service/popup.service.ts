import { Injectable } from "@angular/core";
import swal from "src/../node_modules/sweetalert";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../error-service/error.service';
import { LanguageService } from '../language-service/language.service';
import { AlertInfoService } from 'src/app/extends/alert-infos/alert-infos-service/alert-info.service';

@Injectable({
  providedIn: "root"
})
export class PopupService {

  constructor(private errorService: ErrorService,
    private languageService: LanguageService,
    private alertSerivce: AlertInfoService) {

  }

  ShowHello() {
    swal("Selam canım :)", "", "success");
  }


  ShowAlertPopup(message: string) {
    //swal(message, "", "warning");
    this.alertSerivce.pushDanger(message);
  }

  ShowSuccessPopup(message: string) {
    /*swal({
      title: "İşlem Başarılı",
      text: message,
      icon: "success"
    });*/
    this.alertSerivce.pushSuccess(message);
  }

  ShowErrorPopup(error: HttpErrorResponse) {
    this.alertSerivce.pushDanger(this.languageService.getValue(error.statusText));
    this.errorService.errorManager(error);
  }

  ShowMenuAuthorizePopup(ok) {
    this.alertSerivce.pushDanger("Menü için yetkiniz bulunmamaktadır!");
    setTimeout(() => {
      ok()
    }, 2000);
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

  ShowQuestionPopupForOperation(callBack) {
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

  ShowQuestionPopupForFoundFixedAsset(callBack) {
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
