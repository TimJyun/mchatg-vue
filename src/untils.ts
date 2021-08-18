
import CryptoJS from "crypto-js";
export default {
    hash: function (src: string): string {
        let salt = "iid783hv90xs85ghvb";
        let hash = CryptoJS.SHA256(src + salt);
        for (let i = 0; i < 20; i++) {
            hash = CryptoJS.SHA256(hash + salt);
        }
        return hash.toString();
    }
}