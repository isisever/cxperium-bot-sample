// ? Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import { MAIN_MENU_LIST_ARG } from '../../constants';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog(): Promise<void> {
		const welcome = await this.sendListMessage.call(this, ...MAIN_MENU_LIST_ARG);
		console.log(welcome);
	}
}
