export default class Morris {
    label: string;
    value: number;
    color: string;
}


export const ColorizeMorrisses = function (ms: Morris[], isReversed: boolean) {
    ms.forEach((e: Morris, i: number) => {
        
        if (isReversed == true)
            i = ms.length - i - 1;

        switch (i) {
            case 0:
                e.color = '#e67300';
                break;
            case 1:
                e.color = '#560bd0';
                break;
            case 2:
                e.color = '#314d83';
                break;
            case 3:
                e.color = '#007bff';
                break;
            case 4:
                e.color = '#0cc';
                break;
            case 5:
                e.color = '#20c149';
                break;
            case 6:
                e.color = '#2bb719';
                break;
            case 7:
                e.color = '#74de00';
                break;
            case 8:
                e.color = '#f7c456';
                break;
            case 9:
                e.color = '#fcb214';
                break;
        }
    })
}