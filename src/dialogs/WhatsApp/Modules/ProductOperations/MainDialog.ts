// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog(): Promise<void> {
		await this.sendMessage('Bu menü yapım aşamasındadır. Lütfen daha sonra tekrar deneyiniz.');
        await this.services.dialog.runWithIntentName(
            this,
            'CXPerium.Dialogs.WhatsApp.WelcomeDialog'
        )
	}
}
