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

		if ( this.conversation.isWaitAction('createTicket') ) {
			this.createTicket();
			return;
		}

		await this.sendMessage('📝 Talep oluşturma işlemi için size yardımcı olacağım, talebinizin konusu hakkında bilgi verebilir misiniz? Örneğin; _*incelemeye bıraktığım ürün*_');
		await this.conversation.addWaitAction('createTicket');
	}

	async createTicket() {
			if( this.conversation.getCache('ticketSubject') == '' || this.conversation.getCache('ticketSubject') == undefined || this.conversation.getCache('ticketSubject') == null) {
				const ticketSubject = this.activity.text;
				this.conversation.setCache('ticketSubject', ticketSubject);
				await this.sendMessage('Talep başlığınızı aldık. Şimdi talebizinizin detaylarını yazabilir misiniz? Örneğin; _*01/01/2024 tarihinde mağazanıza inceleme için bıraktığım ürünüm hakkında bilgi almak istiyorum, inceleme numaram 12345*_')
				this.conversation.setCache('ticketBody', ['']);
			}else{
				const message: string = this.activity.text;
				const ticketBody = this.conversation.getCache('ticketBody');
				if (this.activity.value.id != '#NO_FINISH_CREATE_TICKET') {
						await this.sendButtonMessage(
							'Talep oluşturulsun mu?',
							'',
							'Yazdığınız mesaj destek talebinizin içine eklenecektir. Başka eklemek istediğiniz birşey var mı? Eklemek istediğiniz birşey varsa yazmaya devam edebilirsiniz. ',
							[
								{
									'id': '#NO_FINISH_CREATE_TICKET',
									'title': 'Yorumu kaydet',
								}
							]
						)
				}
				this.conversation.setCache('ticketBody', [...ticketBody, message]);	
			}
		
			if (this.activity.value.id == '#NO_FINISH_CREATE_TICKET') {
				await this.sendMessage('Talebiniz oluşturuluyor lütfen bekleyin...');
				

				const subject: string = await this.conversation.getCache('ticketSubject');
				const ticketBody = await this.conversation.getCache('ticketBody');
				console.log(ticketBody);
				console.log(typeof ticketBody);
				const ticketBodyArray = Array.isArray(ticketBody) ? ticketBody : Object.values(ticketBody);
				const ticketBodyString: string = ticketBodyArray.join(' ');
				console.log(ticketBody,ticketBodyString);
				const ticket = await this.services.cxperium.ticket.create(
        		    subject
        		    ,this.contact._id
        		    ,ticketBodyString
        		    , ['67194598e57814b661aa2b8a']);
				console.log(ticket);
				await this.sendMessage('Talebiniz başarıyla oluşturuldu, ekiplerimiz sizlere kısa süre içerisinde talebinizle ilgili dönüş yapacaktır, talep durumunuzu menüden *🖋 Destek Talepleri* > *🔍 Talep Sorgula* adımından kontrol edebilirsiniz,  size yardımcı olmamızı istediğiniz diğer tüm konularımız için menüden devam edebilirsiniz.');

				await this.conversation.clearCache();
				await this.conversation.removeWaitAction();
				await this.conversation.resetConversation();
				await this.services.dialog.runWithIntentName(this, 'CXPerium.Dialogs.WhatsApp.WelcomeDialog');
			}
		}
}
