import { Pipe, PipeTransform } from '@angular/core'
import { IData } from '../models/interfaces/IData';



@Pipe({ name: 'toPage' })

export class TreeGridTablePage implements PipeTransform {

    transform(value: IData[], currentPage: number, perInPage: number): IData[] {
        
        perInPage = Number(perInPage);
        
        if (perInPage == -1)
            return value;

        let data: IData[] = [];
        let startIndex = currentPage * perInPage - perInPage;
        let counter = 0;

        for (let ii = 0; ii < value.length; ii++) {

            /* Eğer eklediğimiz miktar ekleyeceğimiz sayıya ulaştıysa döngüden çıkıyoruz */
            if (counter == startIndex + perInPage) {
                ii = value.length;
                continue;
            }

            /* Eğer miktar az ise ve parenti yok ise sayacı bir arttırıyoruz. Amacı childları saymayı önlemek */
            if (counter < startIndex) {

                if (!value[ii].getParentId()) {
                    counter++;
                    continue;
                } else {
                    continue;
                }

            /* Parent idsi olmayanları atarken sayacı 1 arttırıyoruz. Childları basarken ise sayacı arttırmıyoruz. */
            } else if (counter < startIndex + perInPage) {

                data.push(value[ii]);
                if (!value[ii].getParentId())
                    counter++;
                continue;
            }
        }

        return data;
    }

}