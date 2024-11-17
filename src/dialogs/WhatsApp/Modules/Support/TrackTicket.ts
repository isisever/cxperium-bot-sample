// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import { convertTicketStatus, formatDate, getLatestComment } from '../../../../helpers/HelperFunctions';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}


	async runDialog(): Promise<void> {
		const ticketIdRegex = /#TICKET_[a-zA-Z0-9]+/g;
		const addCommentRegex = /#ADD_COMMENT_[a-zA-Z0-9]+/g;

		
		if(this.conversation.isWaitAction('addComment')){
			this.addCommentToTicket();
			return;
		}

		if ( this.activity.value.id == '#TRACK_TICKET') {
			const response = await this.services.cxperium.ticket.getAll();
			const tickets = response['data']['data'];
			if (tickets.length === 0) {
				await this.sendMessage('🔍 Sorguladığınız kriterlere uygun bir talep bulunamadı.');
			} else {
				
				const myTickets = [];
				tickets.forEach((ticket:any) => {
					if (ticket.contactId === this.contact._id) {
						myTickets.push(
							{
								id: '#TICKET_'+ticket._id,
								title: '📝 ' + ticket.subject,
								description: '📅 Oluşturulma Tarihi: ' + formatDate(ticket.createdAt) + '\n📌 Durum: ' + convertTicketStatus(ticket.status),
							}
						);
					}
				});

				await this.sendListMessage(
					'🔍 Sorguladığınız kriterlere uygun talepler:',
					'',
					'Lütfen detayları görmek istediğiniz talebi seçiniz.',
					'Taleplerim',
					myTickets
				)
			}
		} else if (ticketIdRegex.test(this.activity.value.id)) {
			const ticketID = this.activity.value.id.split('_')[1];
			const response = await this.services.cxperium.ticket.getAll();
			const tickets = response['data']['data'];

			const ticket = tickets.find((ticket: any) => ticket._id === ticketID);
			if (ticket) {
				const comments = ticket.comments;
				//console.log('Ticket: ', ticket);
				if (comments.length === 0) {

					await this.sendButtonMessage(
						'🔍 Belirtilen talep için henüz bir yanıt bulunmamaktadır',
						'',
						'📝 Yorum eklemek ister misiniz?.'
						,[
							{
								'id': '#ADD_COMMENT_'+ticket._id,
								'title': '📝 Yorum Ekle',
							},
							{
								'id': 'merhaba',
								'title': 'Ana menüye dön',
							}
						]
					);
				}else{
					const lastComment = getLatestComment(comments);
					await this.sendButtonMessage(
						'📝 Talep Detayları',
						'',
						'📅 Oluşturulma Tarihi: ' + formatDate(ticket.createdAt) + '\n' +
						'📌 Durum: *' + convertTicketStatus(ticket.status) + '*\n\n' +
						'📄 Son Yorum\n' + lastComment.message + '\n\n' +
						'📅 Yanıt Tarihi: ' + formatDate(lastComment.date) + '\n' 
						,[
							{
								'id': '#ADD_COMMENT_'+ticket._id,
								'title': '📝 Yorum Ekle',
							},
							{
								'id': 'merhaba',
								'title': 'Ana menüye dön',
							}
						]
					);
				}
				
			} else {
				await this.sendMessage('🔍 Belirtilen talep için henüz bir yanıt bulunmamaktadır.');
			}
		} else if (addCommentRegex.test(this.activity.value.id)) {
			const ticketID = this.activity.value.id.split('_')[2];
			await this.sendMessage('Lütfen eklemek istediğiniz yorumu yazınız.');
			await this.conversation.setCache('addComment', ticketID);
			await this.conversation.setCache('commentMessage', ['']);
			await this.conversation.addWaitAction('addComment');
		}
		
	}
	async addCommentToTicket(){
		const messages = await this.conversation.getCache('commentMessage');
		this.conversation.setCache('commentMessage', [...messages, this.activity.text]);

		if (this.activity.value.id == '#NO_FINISH_COMMENT') {
			await this.sendMessage('Yorumunuz kayıt ediliyor...');

			const ticketId: string = await this.conversation.getCache('addComment');
			const comment: string = await this.conversation.getCache('commentMessage');


			const commentArray = Array.isArray(comment) ? comment : Object.values(comment);
			const commentString: string = commentArray.join(' ');

			console.log('Ticket ID: ', ticketId, 'Comment: ', commentString);

			const ticketComment = await this.services.cxperium.ticket.comment(ticketId, commentString);
			console.log(ticketComment);
			await this.conversation.clearCache();
			await this.conversation.removeWaitAction();
			await this.conversation.resetConversation();
			await this.services.dialog.runWithIntentName(this, 'CXPerium.Dialogs.WhatsApp.WelcomeDialog');
		} else {
			await this.sendButtonMessage(
				'Yorumunuz kayıt edilsin mi?',
				'',
				'Yazdığınız mesaj destek talebinizin içine eklenecektir. Başka eklemek istediğiniz birşey var mı? ',
				[
					{
						'id': '#NO_FINISH_COMMENT',
						'title': 'Yorumu kaydet',
					}
				]
			)
		}
	}
}
