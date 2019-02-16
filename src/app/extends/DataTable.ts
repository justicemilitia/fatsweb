export class DataTable {

    public static filter(source:string,search:string):boolean {
        
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

}