/**
 * Get day of week. 
 * @param culture tr / en
 */
export const GetWeekDaysShort = (culture: string): string[] => {
    switch (culture) {
        case 'en':
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        default:
            return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    }
}

/**
 * Get month of years
 * @param culture tr / en 
 */
export const GetMonthOfYearsShort = (culture: string): string[] => {
    switch (culture) {
        case 'en':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        default:
            return ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
    }
}

/**
 * Get day of week. 
 * @param culture tr / en
 */
export const GetWeekDaysLong = (culture: string): string[] => {
    switch (culture) {
        case 'en':
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        default:
            return ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    }
}

/**
 * Get month of years
 * @param culture tr / en 
 */
export const GetMonthOfYearsLong = (culture: string): string[] => {
    switch (culture) {
        case 'en':
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        default:
            return ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    }
}

/**
 * Get Day of week from day of year ()
 * @param value day of year
 * @param culture language / tr/ en
 */
export const GetDayOfWeekFromDayOfYear = (value: number, culture: string): string => {
    while (value < 0)
        value = 7 + value;
    return GetWeekDaysLong(culture)[value];
}