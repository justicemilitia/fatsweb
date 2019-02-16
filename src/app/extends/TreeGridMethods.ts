import { IData } from '../models/interfaces/IData';

export class TreeGridMethods {
    
    public static doSearch(obj:IData,filter:any):boolean {
        let keys = Object.keys(filter);
        for(let ii = 0; ii < keys.length;ii++) {
            let key = keys[ii];
            if (typeof obj[key] === "string")
            {
                if (!this.filterText(obj[key],filter[key]))
                    return false;
            }
        
        }
        return true;
    }

    //#region Filters

    private static filterText(source:string,search:string):boolean {
        
        if (!search || search == "%" || search == "%%")
            return true;

        if (!source)
            return false;

        source = source.trim();
        search = search.trim();

        source = source.toLowerCase();
        search = search.toLowerCase();

        if (search.startsWith("%") && search.endsWith("%")) {
            return source.includes(search.substring(1,search.length-1));
        }

        if (search.startsWith("%")){
            return source.endsWith(search.substring(1,search.length));
        }
        
        if (search.endsWith("%")) {
            return source.startsWith(search.substring(0,search.length-1));
        }

        return source == search;
    }

    //#endregion

}