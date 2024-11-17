// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
	// IMessageEvent,
} from 'cxperium-bot-engine';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	// IMessageEvent interface implementation OPTIONAL
	// onFileReceived(messageObject: any): void;
	// onChatGPTMessage(messageObject: TIntentPrediction): void;
	// onDialogflowMessage(messageObject: TIntentPrediction): void;
	// onDidNotUnderstand(): void;
	// onSessionTimeout?(): void;
	// onClosingOfLiveChat?(): void;

	async runDialog(): Promise<void> {
		//* if you want to finish entry throw this error.
		console.log('object');
		const ticketIdRegex = /#TICKET_[a-zA-Z0-9]+/g;
		console.log(ticketIdRegex.test(this.activity.value.id));
		console.log(this.activity.value.id);
		// throw new Error('end');
	}
}
