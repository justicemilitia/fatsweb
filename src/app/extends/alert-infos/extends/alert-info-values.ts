import { AlertInfoTypes } from '../models/enums/AlertInfoTypes';

export const getInfoTitle = (alert: AlertInfoTypes) => {
    switch (alert) {
        case AlertInfoTypes.danger:
        return "Hata!";
        case AlertInfoTypes.warning:     
        return "Uyarı!";
        case AlertInfoTypes.info:                
            return "Bilgilendirme!";
        case AlertInfoTypes.success:                     
        return "Başarılı!";
        default:
            return "";
    }
}