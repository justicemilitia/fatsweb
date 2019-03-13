import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_FIXED_ASSET
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAsset } from "src/app/models/FixedAsset";

@Injectable({
  providedIn: "root"
})
export class FixedAssetService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetFixedAsset(success, failed) {
    this.httpclient
      .post(SERVICE_URL + GET_FIXED_ASSET, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssets: FixedAsset[] = [];
            (<FixedAsset[]>response.ResultObject).forEach(e => {
              let fa: FixedAsset = new FixedAsset();
              Object.assign(fa, e);
              fixedAssets.push(fa);
            });
            success(fixedAssets, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetList():FixedAsset[] {
    let items = [
      {
        $id: "724",
        FixedAssetId: 19,
        FixedAssetParentId: null,
        FixedAssetCardId: 3,
        FixedAssetCardModelId: 1,
        FixedAssetCardBrandId: 1,
        Barcode: "223",
        SerialNumber: "1",
        StatusId: 1,
        FirmId: 1,
        CompanyId: 1,
        Price: 1,
        HasMaintanence: null,
        ReceiptDate: null,
        CurrencyId: 1,
        ExpenseCenterId: null,
        InvoiceNo: "11221",
        InvoiceDate: "2018-02-14T00:00:00",
        WillDepreciationBeCalculated: null,
        DepreciationCalculationTypeID: null,
        DepreciationPeriod: null,
        Ifrsprice: null,
        WillIfrsbeCalculated: null,
        Ifrsperiod: null,
        HasInflationIndexation: null,
        GuaranteeStartDate: null,
        GuaranteeEndDate: null,
        ActivationDate: "2018-02-14T00:00:00",
        CreationDate: "0001-01-01T00:00:00",
        CreatorId: 0,
        ModifiedDate: null,
        ModifierId: null,
        IsSuspended: null,
        IsLost: null,
        IsActive: true,
        IsValid: true,
        Currency: null,
        ExpenseCenter: null,
        FixedAssetCard: {
          $id: "725",
          FixedAssetCardCode: "FA00000",
          FixedAssetCardId: 3,
          Name: "Masa",
          FixedAssetCardCategoryId: 3,
          FixedAssetCardPropertyId: 14,
          Description: "asdfghj",
          CreationDate: "0001-01-01T00:00:00",
          CreatorId: 0,
          ModifiedDate: null,
          ModifiedId: null,
          IsValid: false,
          FixedAssetCardCategory: null,
          FixedAssetCardProperty: {
            $id: "726",
            FixedAssetCardPropertyCode: "14",
            FixedAssetCardPropertyId: 14,
            FixedAssetTypeId: 1,
            Name: "Telefon Renkleri",
            CreationDate: "0001-01-01T00:00:00",
            CreatorId: null,
            ModifiedDate: null,
            ModifierId: null,
            IsValid: false,
            FixedAssetType: {
              $id: "727",
              FixedAssteTypeId: 1,
              Name: "Metin",
              FixedAssetCardProperties: []
            },
            FixedAssetCards: [],
            FixedAssetPropertValues: [],
            FixedAssetPropertyDetails: []
          },
          FixedAssets: []
        },
        FixedAssetCardModel: {
          $id: "728",
          FixedAssetCardModelCode: "M001",
          FixedAssetCardModelId: 1,
          FixedAssetCardBrandId: 1,
          Name: "Kalite Modeli",
          CreationDate: null,
          CreatorId: null,
          ModifiedDate: null,
          ModifierId: null,
          IsValid: true,
          FixedAssetCardBrand: {
            $id: "729",
            FixedAssetCardBrandCode: "1",
            FixedAssetCardBrandId: 1,
            Name: "Kalite",
            CreationDate: null,
            CreatorId: null,
            ModifiedDate: null,
            ModifierId: null,
            IsValid: true,
            FixedAssetsCardModels: []
          },
          FixedAssets: []
        },
        Status: null,
        DepreciationIfrs: [],
        Depreciations: [],
        FixedAssetFiles: [],
        FixedAssetUsers: [],
        Maintanences: []
      }
    ];

    let _items:FixedAsset[] = [];

    items.forEach(e=> {
      let item = new FixedAsset();
      Object.assign(item,e);
      _items.push(item);
    })

    return _items;

  }
}
