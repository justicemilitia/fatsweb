import { Country } from './Country';

export class City {
    CityId: number;
    CountryId: number;
    Name: string;
    Country: Country = new Country();

}