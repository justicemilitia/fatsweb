export const keyOffset = 3;

export const encrypt = (value: string): string => {

    for (let ii = 0; ii < value.length; ii++) {

        let index = ii + keyOffset;
        if (index >= value.length)
            index -= value.length;

        let char = value.charAt(index);
        let targetChar = value.charAt(ii);

        value = setCharAt(value, ii, char);
        value = setCharAt(value, index, targetChar);
    }

    return value;
}


export const decrypt = (value: string): string => {

    for (let ii = value.length - 1; ii >= 0; ii--) {

        let index = ii - keyOffset;
        if (index < 0)
            index = Math.abs(index)-2;

        let char = value.charAt(index);
        let targetChar = value.charAt(ii);

        value = setCharAt(value, ii, char);
        value = setCharAt(value, index, targetChar);
    }

    return value;
}


function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}