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
		//const ticket = await this.services.cxperium.ticket.create(
        //    'new ticket test2'
        //    ,this.contact._id
        //    , 'support test2'
        //    , ['67194598e57814b661aa2b8a']);
        const tickets = await this.services.cxperium.ticket.getAll();
        console.log(tickets['data']['data']);

        //const answer = await this.services.cxperium.ticket.lastAnswer('67194a69a779fb3ecfd870cd');
        //console.log(answer);

        const buttons = await this.sendButtonMessage(
            '🖋 Destek Talep İşlemleri'
            ,''
            ,'Lütfen yapmak istediğiniz işlemi seçiniz.',
            [
                {
                    'id': '#CREATE_TICKET',
                    'title': '📝 Talep Oluştur',
                },
                {
                    'id': '#TRACK_TICKET',
                    'title': '🔍 Talep Sorgula',
                }
            ]
        )
        console.log(buttons);
        

	}
}
