import { describe } from "node:test";

const MAIN_MENU_LIST = [
    {
		id: '#TRACKING_ORDER',
		title: '📦 Sipariş Takibi',
		description: 'Siparişinizle ilgili bilgi alın',
	},
    {
		id: '#PRODUCT_OPERATIONS',
		title: '🥾 Ürün İşlemleri',
		description: 'Ürün iade değişim işlemleri hakkında bilgi alın',
	},
	{
		id: '#SUPPORT_REQUEST',
		title: '🖋 Destek Talepleri',
		description: 'Destek talebi oluşturun veya sorgulayın',
	},
	{
		id: '#STORES',
		title: '🏪 Mağazalarımız',
		description: 'Size en yakın mağazamızı bulun',
	},
    {
		id: '#FAQ',
		title: '❓ SSS',
		description: 'Sıkça Sorulan Sorular',
	},
]

export const MAIN_MENU_LIST_ARG: any = [
	'SPX Dijital Asistan',
	'',
	'Merhaba ben SPX Dijital Asistanınız. Lütfen yapmak istediğiniz işlemi seçiniz.',
	'Menü',
	MAIN_MENU_LIST,
];
