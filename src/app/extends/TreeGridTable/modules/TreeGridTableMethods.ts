import { IData } from '../models/interfaces/IData';


export class TreeGridTableMethods {

    public static doSearch(obj: IData, filter: any): boolean {
        let keys = Object.keys(filter);
        for (let ii = 0; ii < keys.length; ii++) {
            let key = keys[ii];
            if (typeof obj[key] === "string") {
                if (!this.filterText(obj[key], filter[key]))
                    return false;
            } else if (!obj[key] && filter[key] && filter[key].length > 0)
                return false;

        }
        return true;
    }

    public static doOrder(a: any, b: any) {
        switch (typeof (a !== null ? a : b)) {
            case "string":
                return this.doStringOrder(a, b);
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

    public static doStringOrder(a: any, b: any) {
        return (<string>(a ? a : '')).localeCompare(b ? b : '');
    }

    //#endregion

}