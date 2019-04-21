import { IData } from '../models/interfaces/IData';
import { IColumn } from '../models/interfaces/IColumn';


export class TreeGridTableMethods {

    public static getValue(data: IData, column: string[]) {
        let item = null;
        column.forEach(e => {
            if (!item)
                item = data[e];
            else
                item = item[e];
        });
        return (item != null ? item : null);
    }

    public static doSearch(obj: IData, filter: any, columns: IColumn[]): boolean {
        let keys = Object.keys(filter);
        for (let ii = 0; ii < keys.length; ii++) {
            let key = keys[ii];

            /* Filter for selected items */
            if (key == "isChecked") {
                return filter[key] == true ? obj[key] == filter[key] : true;
            }

            /* Filter for the rest */
            let val = null;

            if (key.startsWith('|')) {
                val = columns.find(x => x.columnName[0] == key).formatter(obj);
            } else {
                val = this.getValue(obj, key.split(','));
            }

            switch (typeof val) {
                case "string":
                    if (!this.filterText(val, filter[key]))
                        return false;
                    break;
                case "number":
                    if (!this.filterText(val.toString(), filter[key]))
                        return false;
                    break;
                case "boolean":
                    if (filter[key] == true && obj[key] != filter[key])
                        return false;
                    break;
                default:
                    if (!val) {
                        if (typeof filter[key] == "boolean" && filter[key] == false) {
                            return true;
                        }
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    public static doOrder(a: any, b: any): number {
        switch (typeof (a !== null ? a : b)) {
            case "string":
                return this.doStringOrder(a, b);
            case "number":
                return this.doNumberOrder(a, b);
            default:
                return 0;
        }
    }

    //#region Filters

    private static filterText(source: string, search: string): boolean {

        if (!search)
            return true;

        //if (search == "%" || search == "%%")
        //    return true;

        //if (source === null)
        //    return false;

        //source = source.trim();
        //search = search.trim();

        //if (!search || search == "%" || search == "%%")
        //    return true;

        if (source === null)
            return false;

        source = source.toLocaleLowerCase();
        search = search.toLocaleLowerCase();

        return source.includes(search.substring(1, search.length - 1));
        
        //if (search.startsWith("%") && search.endsWith("%")) {
        //    return source.includes(search.substring(1, search.length - 1));
        //}

        //if (search.startsWith("%")) {
        //    return source.endsWith(search.substring(1, search.length));
        //}

        //if (search.endsWith("%")) {
        //    return source.startsWith(search.substring(0, search.length - 1));
        //}

        //return source == search;
    }

    //#endregion

    //#region Orders

    public static doStringOrder(a: any, b: any): number {
        return (<string>(a ? a : '')).localeCompare(b ? b : '');
    }

    public static doNumberOrder(a: any, b: any): number {
        return (a ? a : 0) > (b ? b : 0) ? 1 : (a ? a : 0) < (b ? b : 0) ? -1 : 0;
    }

    //#endregion

}