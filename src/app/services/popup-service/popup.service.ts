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


  ShowAlertPopup(message: string) {
    //swal(message, "", "warning");
    this.alertSerivce.pushDanger(this.languageService.getValue(message));
  }

  ShowWarningPopup(message: string) {
    this.alertSerivce.pushWarning(this.languageService.getValue(message), this.languageService.getValue("Warning!"));
  }

  ShowSuccessPopup(message: string) {
    /*swal({
      title: "İşlem Başarılı",
      text: message,
      icon: "success"
    });*/
    this.alertSerivce.pushSuccess(this.languageService.getValue(message));
  }

  ShowErrorPopup(error: HttpErrorResponse) {
    this.alertSerivce.pushDanger(this.languageService.getValue(error.statusText));
    this.errorService.errorManager(error);
  }

  ShowDeletePopup(error: HttpErrorResponse, barcodes: string[]) {
    swal({
      title: barcodes + (barcodes.length > 1 ? " kodları sistemde kullanıldığı için silinemez!" : " kodu sistemde kullanıldığı için silinemez!"),
      text: " ",
      icon: "warning"
    });
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
      title: "{{getLanguageValue('Are_you_sure_you_want_to_update_the_record')}}",
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

  ShowQuestionPopupForDepreciation(callBack) {
    swal({
      title: "Amortismanları hesaplamak istediğinize emin misiniz?",
      text: "Seçili demirbaşların amortismanı hesaplanacaktır.",
      icon: "warning",
      buttons: ['Vazgeç', 'Hesapla'],
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

  ShowQuestionPopup(message, callBack) {
    swal({
      title: message,
      text: "Bu işlem geri alınamaz.",
      icon: "warning",
      buttons: ['Vazgeç', 'Onayla'],
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
      title: "{{getLanguageValue('Are_you_sure_you_want_to_update_the_record')}}",
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

  ShowQuestionPopupForLocationUpdate(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçili demirbaşın lokasyon bilgisi değiştirilecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForDepartmentUpdate(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçili demirbaşın departman bilgisi değiştirilecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForFirmUpdate(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçili demirbaşın şirket bilgisi değiştirilecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForBarcodeUpdate(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçili demirbaşın barkod bilgisi değiştirilecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForDebitUpdate(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçili demirbaşın zimmet bilgisi değiştirilecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForDebitDelete(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçili demirbaşın zimmet bilgisi silinecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForDeleteWithoutUndo(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Bu işlem geri alınamaz. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForChangeRelationhip(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçimi yapılan demirbaşlar ilgili demirbaş ile ilişkilendirilecektir. İşlemi onaylıyor musunuz?",
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

  ShowQuestionPopupForBreakRelationship(callBack) {
    swal({
      title: this.languageService.getValue("Warning!"),
      text: "Seçimi yapılan demirbaşların ilişkisi koparılacaktır. İşlemi onaylıyor musunuz?",
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


  ShowQuestionPopupForRelationalFixedAsset() {
    swal(
      this.languageService.getValue("Warning!"),
      "Seçilen demirbaşların ilişkisi bulunmadığı için işlem gerçekleştirilemedi!",
      "warning"
    )
  }

}
