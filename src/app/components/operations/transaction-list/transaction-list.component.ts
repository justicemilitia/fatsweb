import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { TransactionLog } from 'src/app/models/TransactionLog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent extends BaseComponent implements OnInit {

  public dataTable: TreeGridTable = new TreeGridTable(
    "transactionloglist",
    [
      {
        columnDisplayName: "Eski Barkod",
        columnName: ["ExistingBarcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Barkod",
        columnName: ["NewBarcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Eski Departman",
        columnName: ["FromDepartment"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Departman",
        columnName: ["ToDepartment"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Eski Lokasyon",
        columnName: ["FromLocation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Lokasyon",
        columnName: ["ToLocation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Statü",
        columnName: ["FromStatus"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Statü",
        columnName: ["ToStatus"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },
      {
        columnDisplayName: "Hareket Tipi",
        columnName: ["TransactionDescription"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },
      {
        columnDisplayName: "İlişkinin Koparıldığı Demirbaş",
        columnName: ["FromParentInventory"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "İlişkilendirilen Demirbaş",
        columnName: ["ToParentInverntory"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Firma",
        columnName: ["FromFirm"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Firma",
        columnName: ["ToFirm"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      
      {
        columnDisplayName: "Eski Personel",
        columnName: ["FromUserId"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Personel",
        columnName: ["ToUserId"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Şirket",
        columnName: ["FromCompany"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Şirket",
        columnName: ["ToCompany"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Sigorta Şirketi",
        columnName: ["FromInsuranceCompany"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Sigorta Şirketi",
        columnName: ["ToInsuranceCompany"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Demirbaş Kategorisi",
        columnName: ["FromFixedAssetCardCategory"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Demirbaş Kategorisi",
        columnName: ["ToFixedAssetCardCategory"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Demirbaş Kartı",
        columnName: ["FromFixedAssetCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Demirbaş Kartı",
        columnName: ["ToFixedAssetCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Fiyat",
        columnName: ["FromPrice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Fiyat",
        columnName: ["ToPrice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Makbuz Tarihi",
        columnName: ["FromReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Makbuz Tarihi",
        columnName: ["ToReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Seri Numarası",
        columnName: ["FromSerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Seri Numarası",
        columnName: ["ToSerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Marka",
        columnName: ["FromBrand"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Marka",
        columnName: ["ToBrand"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Fatura Numarası",
        columnName: ["FromInvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Fatura Numarası",
        columnName: ["ToInvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },      {
        columnDisplayName: "Eski Fatura Tarihi",
        columnName: ["FromInvoiceDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Fatura Tarihi",
        columnName: ["ToInvoiceDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },
      {
        columnDisplayName: "Eski Garanti Başlangıç Tarihi",
        columnName: ["FromGuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Garanti Başlangıç Tarihi",
        columnName: ["ToGuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },
      {
        columnDisplayName: "Eski Garanti Bitiş Tarihi",
        columnName: ["FromGuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Yeni Garanti Bitiş Tarihi",
        columnName: ["ToGuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      },
      {
        columnDisplayName: "Aktiflik Durumu",
        columnName: ["FixedAssetIsActive"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Aktifleştirme Tarihi",
        columnName: ["FixedAssetActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",  
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(protected baseService: BaseService) { 
    super(baseService);
  }


  ngOnInit() {
  }

  LoadTransactionList(data:NgForm){

    
   //this.baseService.transactionService.GetTransactionLogList(transaction,()=>{},()=>{})
  }

}
