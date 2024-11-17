
// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import AkinonHelper from '../../../../helpers/AkinonHelper';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	AkinonHelper: AkinonHelper;
	constructor(data: TBaseDialogCtor) {
		super(data);
		this.AkinonHelper = new AkinonHelper(data);
	}

	async runDialog(): Promise<void> {
		
		if(this.conversation.isWaitAction('orderNumber')){
			await this.getOrderDetails();
			return;
		}

		await this.sendMessage('Lütfen sipariş numaranızı giriniz.');
		this.conversation.addWaitAction('orderNumber');
	}

	async getOrderDetails() {
		const jp = require('jsonpath');
		const orderNumber = this.activity.text;
		const orderPKresult = await this.AkinonHelper.returnOrderPK(orderNumber);
		const orderPK = jp.query(orderPKresult, '$.results[*].order.pk');
		console.log("orderPK: ", orderPK[0]);
		const orderDetailed = await this.AkinonHelper.getOrderDetailed(orderPK[0]);
		console.log(orderDetailed);
		const status = jp.query(orderDetailed, '$.results[*].status');
		const statusText = await this.AkinonHelper.STATUS_LIST[status[0]];
		const trackingUrl = jp.query(orderDetailed, '$.results[*].tracking_url');
		if( trackingUrl[0] !== null){
			await this.sendMessage(`*${orderNumber}*  Nolu Siparişinizin son durumu: *${statusText}* olarak gözükmektedir.\n\nSiparişinizin Kargo Takip Linki: ${trackingUrl[0]}`);
		}else{
			await this.sendMessage(`*${orderNumber}* Nolu Siparişizin son durumu: *${statusText}*\n olarak gözükmektedir.`);
		}
		
		this.conversation.removeWaitAction();
		this.conversation.resetConversation();
		await this.sendMessage('Sizi ana menüye yönlendiriyorum. Lütfen bekleyiniz.')
		await this.services.dialog.runWithIntentName(this, 'CXPerium.Dialogs.WhatsApp.WelcomeDialog');
	}
}
