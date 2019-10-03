import { AlertInfoTypes } from '../models/enums/AlertInfoTypes';

export const getInfoTitle = (culture: string, alert: AlertInfoTypes) => {
    switch (culture) {
        case 'en':
         switch (alert) {
            case AlertInfoTypes.danger:
            return "Error!";
            case AlertInfoTypes.warning:     
            return "Warning!";
            case AlertInfoTypes.info:                
            return "Information!";
            case AlertInfoTypes.success:                     
            return "Successful!";
            default:
            return "";
            }

        default:
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
}