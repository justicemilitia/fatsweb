import { IData } from '../models/interfaces/IData';


export class TreeGridTableMethods {

    public static getValue(data: IData, column: string[]) {
        let item = null;
        column.forEach(e => {
            if (!item)
                item = data[e];
            else
                item = item[e];
        });
        return (item ? item : '');
    }

    public static doSearch(obj: IData, filter: any): boolean {
        let keys = Object.keys(filter);
        for (let ii = 0; ii < keys.length; ii++) {
            let key = keys[ii];
            let val = this.getValue(obj, key.split(','));
            if (typeof val === "string") {
                if (!this.filterText(val, filter[key]))
                    return false;
            } else if (typeof val === "number") {
                if (!this.filterText(val.toString(), filter[key]))
                    return false;
            }
            else if (!val && filter[key] && filter[key].length > 0)
                return false;

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

        if (!search || search == "%" || search == "%%")
            return true;

        if (source === null)
            return false;

        source = source.trim();
        search = search.trim();

        if (!search || search == "%" || search == "%%")
            return true;

        if (source === null)
            return false;

        source = source.toLocaleLowerCase();
        search = search.toLocaleLowerCase();

        if (search.startsWith("%") && search.endsWith("%")) {
            return source.includes(search.substring(1, search.length - 1));
        }

        if (search.startsWith("%")) {
            return source.endsWith(search.substring(1, search.length));
        }

        if (search.endsWith("%")) {
            return source.startsWith(search.substring(0, search.length - 1));
        }

        return source == search;
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