import * as CryptoJS from 'crypto-js';
import { CRYPTO_KEY } from './service-values';

export const encryptUsingAES256 = (content: string) => {
    let _key = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
    let _iv = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
    let encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(content), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

    return encrypted.toString();
}

export const decryptUsingAES256 = (content: string) => {
    let _key = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
    let _iv = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);

    let decrypted = CryptoJS.AES.decrypt(
        content, _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

    return decrypted.toString(CryptoJS.enc.Utf8);
}