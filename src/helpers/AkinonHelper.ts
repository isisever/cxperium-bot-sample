// Node modules.
import {
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import * as fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const {
    AKINON_USER,
    AKINON_PASSWORD,
    AKINON_API_URL,
} = process.env;

export default class AkinonHelper extends ServiceWhatsappBaseDialog {
    constructor(data: TBaseDialogCtor) {
        super(data);
    }

    STATUS_LIST = {
        50: "İptal Bekliyor",
        100: "İptal Edildi",
        200: "Bekliyor",
        300: "Ödeme Bekliyor",
        350: "Onay Bekliyor",
        400: "Onaylanmış",
        450: "Hazırlanıyor",
        500: "Kargoya Verildi",
        510: "Kargolandı ve Bilgilendirildi",
        520: "Mağazada",
        540: "Teslimat Başarısız Oldu",
        544: "İnceleme Başlatıldı",
        545: "Onay Bekliyor",
        546: "Ödeme Bekliyor",
        547: "Ödeme Tamamlandı",
        550: "Teslim Edildi",
        600: "İade İşlemi",
    }

    async connectAkinon(){
        const url = `${AKINON_API_URL}auth/login/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: AKINON_USER,
                password: AKINON_PASSWORD,
            }),
        });
        const data = await response.json();
        return data.key;
    }

    async returnOrderPK(orderNumber: string){
        const token = await this.connectAkinon();
        const url = `${AKINON_API_URL}transactions/?order=${orderNumber}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });
        const data = await response.json();
        return data;
    }

    async getOrderDetailed(orderPK: string){
        const token = await this.connectAkinon();
        const url = `${AKINON_API_URL}order_items/detailed/?order=${orderPK}`;
        console.log("url: ", url);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        const data = await response.json();
        console.log(data);
        return data;
    }

}