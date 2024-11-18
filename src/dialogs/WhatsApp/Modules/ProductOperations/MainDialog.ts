// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import NebimV3Helper from '../../../../helpers/NebimV3Helper';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	NebimV3Helper: NebimV3Helper;
	constructor(data: TBaseDialogCtor) {
		super(data);
		this.NebimV3Helper = new NebimV3Helper(data);
	}

	async runDialog(): Promise<void> {
		if(this.conversation.isWaitAction('parameter')){
			await this.getIsReturnStatus();
			return;
		}

		await this.sendMessage('Lütfen *Sipariş Numaranızı* veya size göndermiş olduğumuz faturanızda yer alan *E-Fatura Numaranızı* giriniz.');
		this.conversation.addWaitAction('parameter');
	}

	async getIsReturnStatus() {

		const parameter = this.activity.text;

		const NebimV3Status = await this.NebimV3Helper.getIsReturnStatus(parameter);
		const IsReturnStatus = await NebimV3Status.json()
		console.log();
		if(IsReturnStatus[0]["İade İçin Son Gün"] == "Alınabilir"){
			await this.sendMessage(`*${parameter}* Nolu Siparişinizin iade işlemi alınabilir durumdadır. İade işlemi için sitemizde yer alan https://spx.com.tr/kargo-iade bölümündeki adımları takip edebilirsiniz.`);
		}else{
			await this.sendMessage(`*${parameter}* Nolu Siparişinizin durumu iade alınamaz olarak gözükmektedir.`);
		}
		this.conversation.removeWaitAction();
		this.conversation.resetConversation();
		await this.sendMessage('Sizi ana menüye yönlendiriyorum. Lütfen bekleyiniz.')
		await this.services.dialog.runWithIntentName(this, 'CXPerium.Dialogs.WhatsApp.WelcomeDialog');
	}
}
