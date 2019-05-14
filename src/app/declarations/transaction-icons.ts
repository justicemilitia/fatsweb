export class TransactionIcon {
    key: number;
    backClass: string;
    fontSize: string;
    fontIcon: string;

    constructor(_key: number, _backClass: string, _fontSize: string, _fontIcon: string) {
        this.key = _key;
        this.backClass = _backClass;
        this.fontSize = _fontSize;
        this.fontIcon = _fontIcon;
    }

}

export enum TransactionTypes {
    ASKIYAALMA = 1,
    ASKIDANALMA = 2,
    DEMIRBAS_CIKIS_ISLEMI = 3,
    ASKIYA_ALINAN_ISLEMI_GERI_ALMA = 4,
    LOST = 5,
    CHANGE_FIRM_FROM_FIXEDASSET = 6,
    UNDO_LOST = 7,
    CHANGE_LOCATION_FROM_FIXEDASSE = 9,
    CHANGE_DEPARTMENT_FROM_FIXEDAS = 10,
    CHANGE_SUPPLIER_COMPANY_FROM_F = 11,
    CHANGE_INSURANCE_COMPANY_FROM_ = 12,
    CHANGE_GUARANTEE_START_DATE_FR = 13,
    CHANGE_GUARANTEE_END_DATE_FROM = 14,
    CHANGE_STATUS_FROM_FIXEDASSET = 15,
    CHANGE_CARD_BRAND_FROM_FIXEDAS = 16,
    CHANGE_CARD_MODEL_FROM_FIXEDAS = 17,
    CHANGE_EXPENSE_CENTER_FROM_FIX = 18,
    CHANGE_INVOICE_DATE_FROM_FIXED = 19,
    CHANGE_INVOICE_NUMBER_FROM_FIX = 20,
    CHANGE_DEBIT = 21,
    DELETE_DEBIT = 22,
    ADD_DEBIT = 23,
    CHANGE_BARCODE = 24,
    UPDATE_BARCODE_NAME = 25,
    CREATE_FIXEDASSET = 26,
    UPDATE_FIXEDASSET = 28,
    RELEATE_FIXEDASSET = 29,
    NEW_SUPPLIER_ADDED = 32,
    NEW_AGREEMENT_ADDED = 33,
    NEW_BRAND_ADDED = 35,
    NEW_MODEL_ADDED = 36,
    NEW_LOCATION_ADDED = 39,
    NEW_DEPARTMENT_ADDED = 40,
    NEW_STATU_ADDED = 41,
    STATUS_UPDATED = 43,
    LOCATION_UPDATED = 44,
    DEPARTMENT_UPDATED = 45,
    BRAND_UPDATED = 46,
    MODEL_UPDATED = 47,
    SUPPLIER_UPDATED = 48,
    NEW_EXPENSE_CENTER_ADDED = 49,
    EXPENSE_CENTER_UPDATED = 50,
    FIXED_ASSET_ACTIVED = 51,
    ACTIVATION_DATE_UPDATED = 53,
    NEW_ROLE_ADDED = 54,
    ROLE_UPDATED = 55,
    CHECKOUT_REASONS_ADDED = 56,
    CHECKOUT_REASONS_UPDATED = 57,
    NEW_USER_ADDED = 58,
    NEW_COMPANY_ADDED = 61,
    REMOVE_FIXED_ASSET = 63,
    DEPARTMENT_REMOVED = 64,
    LOCATION_REMOVED = 65,
    CHANGE_LOCATION_ACTIVATON_STAT = 66,
    CHANGE_SERIAL_NUMBER_FROM_FIXE = 67,
    CHANGE_CARD_CATEGORY_ID_FROM_F = 68,
    CHANGE_CARD_ID_FROM_FIXEDASSET = 69,
    CHANGE_CARD_NAME_FROM_FIXEDASS = 70,
    CHANGE_CARD_PROPERTY_NAME_FROM = 71,
    CHANGE_PROPERTY_DETAIL_VALUE_F = 72,
    CHANGE_PRICE_FROM_FIXEDASSET = 73,
    CHANGE_CURRENCY_ID_FROM_FIXEDA = 74,
    CHANGE_IS_ACTIVE_FROM_FIXEDASS = 75,
    CHANGE_ACTIVATION_DATE_FROM_FI = 76,
    CHANGE_RECEIP_DATE_FROM_FIXEDA = 77,
    BREAK_RELEATE_FIXEDASSET = 78,
    COLLECTIVE_TRANSACTIONS = 79,
    UPDATE_DEPRECIATION = 82
}

export const GetTransactionIcon = (icon: number): TransactionIcon => {
    switch (icon) {
        case TransactionTypes.ASKIYAALMA:
            return new TransactionIcon(icon, "bg-purple", "15px", "fas fa-level-up-alt");
        case TransactionTypes.ASKIDANALMA:
            return new TransactionIcon(icon, "bg-purple", "15px", "fas fa-level-down-alt");
        case TransactionTypes.DEMIRBAS_CIKIS_ISLEMI:
            return new TransactionIcon(icon, "bg-danger", "15px", "fas fa-minus-circle");
        case TransactionTypes.ASKIYA_ALINAN_ISLEMI_GERI_ALMA:
            return new TransactionIcon(icon, "bg-purple", "15px", "fas fa-level-down-alt");
        case TransactionTypes.LOST:
            return new TransactionIcon(icon, "bg-orange", "15px", "fas fa-search-minus");
        case TransactionTypes.CHANGE_FIRM_FROM_FIXEDASSET:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-building");
        case TransactionTypes.UNDO_LOST:
            return new TransactionIcon(icon, "bg-orange", "15px", "fas fa-search-plus");
        case TransactionTypes.CHANGE_LOCATION_FROM_FIXEDASSE:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-map-marker-alt");
        case TransactionTypes.CHANGE_DEPARTMENT_FROM_FIXEDAS:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-sitemap");
        case TransactionTypes.CHANGE_SUPPLIER_COMPANY_FROM_F:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-building");
        case TransactionTypes.CHANGE_INSURANCE_COMPANY_FROM_:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-building");
        case TransactionTypes.CHANGE_GUARANTEE_START_DATE_FR:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_GUARANTEE_END_DATE_FROM:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_STATUS_FROM_FIXEDASSET:
            return new TransactionIcon(icon, "bg-warning", "15px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_CARD_BRAND_FROM_FIXEDAS:
            return new TransactionIcon(icon, "bg-info", "15px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_CARD_MODEL_FROM_FIXEDAS:
            return new TransactionIcon(icon, "bg-info", "15px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_EXPENSE_CENTER_FROM_FIX:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_INVOICE_DATE_FROM_FIXED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_INVOICE_NUMBER_FROM_FIX:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.CHANGE_DEBIT:
            return new TransactionIcon(icon, "bg-darkblue", "15px", "fas fa-user-edit");
        case TransactionTypes.DELETE_DEBIT:
            return new TransactionIcon(icon, "bg-danger", "15px", "fas fa-user-minus");
        case TransactionTypes.ADD_DEBIT:
            return new TransactionIcon(icon, "bg-darkblue", "15px", "fas fa-user-edit");
        case TransactionTypes.CHANGE_BARCODE:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-digital-tachograph");
        case TransactionTypes.UPDATE_BARCODE_NAME:
            return new TransactionIcon(icon, "bg-primary", "15px", "fas fa-digital-tachograph");
        case TransactionTypes.CREATE_FIXEDASSET:
            return new TransactionIcon(icon, "bg-success", "15px", "fas fa-plus-circle");
        case TransactionTypes.UPDATE_FIXEDASSET:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.RELEATE_FIXEDASSET:
            return new TransactionIcon(icon, "bg-pink", "15px", "fas fa-link");
        case TransactionTypes.NEW_SUPPLIER_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_AGREEMENT_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_BRAND_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_MODEL_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_LOCATION_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_DEPARTMENT_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_STATU_ADDED:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.STATUS_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.LOCATION_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.DEPARTMENT_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.BRAND_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.MODEL_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.SUPPLIER_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.NEW_EXPENSE_CENTER_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.EXPENSE_CENTER_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.FIXED_ASSET_ACTIVED:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.ACTIVATION_DATE_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.NEW_ROLE_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.ROLE_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.CHECKOUT_REASONS_ADDED:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHECKOUT_REASONS_UPDATED:
            return new TransactionIcon(icon, "bg-info", "20px", "typcn typcn-tick-outline");
        case TransactionTypes.NEW_USER_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.NEW_COMPANY_ADDED:
            return new TransactionIcon(icon, "bg-success", "20px", "typcn icon-default typcn-plus-outline");
        case TransactionTypes.REMOVE_FIXED_ASSET:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.DEPARTMENT_REMOVED:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.LOCATION_REMOVED:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_LOCATION_ACTIVATON_STAT:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_SERIAL_NUMBER_FROM_FIXE:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_CARD_CATEGORY_ID_FROM_F:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_CARD_ID_FROM_FIXEDASSET:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_CARD_NAME_FROM_FIXEDASS:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_CARD_PROPERTY_NAME_FROM:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_PROPERTY_DETAIL_VALUE_F:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_PRICE_FROM_FIXEDASSET:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_CURRENCY_ID_FROM_FIXEDA:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_IS_ACTIVE_FROM_FIXEDASS:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_ACTIVATION_DATE_FROM_FI:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.CHANGE_RECEIP_DATE_FROM_FIXEDA:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
        case TransactionTypes.BREAK_RELEATE_FIXEDASSET:
            return new TransactionIcon(icon, "bg-pink", "15px", "fas fa-unlink");
        case TransactionTypes.COLLECTIVE_TRANSACTIONS:
            return new TransactionIcon(icon, "bg-rose", "15px", "fas fa-retweet");
        case TransactionTypes.UPDATE_DEPRECIATION:
        return new TransactionIcon(icon, "bg-midnightblue", "15px", "typcn icon-default typcn-chart-line-outline");  
        default:
            return new TransactionIcon(icon, "bg-purple", "20px", "typcn typcn-arrow-forward-outline");
    }
}