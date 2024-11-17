// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import { FAQ_STORES, FAQ_ONLINE } from '../../../../helpers/HelperFunctions';
import { describe } from 'node:test';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}
    

	async runDialog(): Promise<void> {
        const regex = /FAQ_(STORES|ONLINE)_\d+/g;
        
        if (this.activity.value.id == '#FAQ') {
            const sendButtonMessage = await this.sendButtonMessage(
                'Sıkça Sorulan Sorular'
                ,''
                ,'Hangi konuda bilgi almak istersiniz?'
                ,[
                    {
                        id: '#FAQ_ONLINE',
                        title: 'Online Alışveriş',
                    },
                    {
                        id: '#FAQ_STORES',
                        title: 'Mağazadan Alışveriş',
                    }
                ]);
                console.log(sendButtonMessage);
        } else if ( this.activity.value.id == '#FAQ_ONLINE' ) {
            const questions = []
            const keys = Object.keys(FAQ_ONLINE);
            await keys.forEach(async (key) => {
                questions.push(
                    {
                        id: '#'+key,
                        title: 'Soru ' + key.split('_')[2],
                        description: FAQ_ONLINE[key].question,
                    }
                )
            });
            const sssmesaj = await this.sendListMessage('Sıkça Sorulan Sorular', '', 'Online alışveriş SSS', 'Sorular', questions);
            console.log(sssmesaj);

            
        } else if ( this.activity.value.id == '#FAQ_STORES' ) {
            const questions = []
            const keys = Object.keys(FAQ_STORES);
            await keys.forEach(async (key) => {
                questions.push(
                    {
                        id: '#'+key,
                        title: 'Soru ' + key.split('_')[2],
                        description: FAQ_STORES[key].question,
                    }
                )
            });

            const sssmesaj = await this.sendListMessage('Sıkça Sorulan Sorular', '', 'Mağazadan alışveriş SSS', 'Sorular', questions);
            console.log(sssmesaj);
        } 
        else if ( regex.test(this.activity.value.id) ) {
            const activity = this.activity.value.id.replace('#', '');
            if (activity.split('_')[1] == 'STORES') {
                const keys = Object.keys(FAQ_STORES);
                const key = keys.find(key => key === activity);
                await this.sendMessage(FAQ_STORES[key].answer); 
            }else if(activity.split('_')[1] == 'ONLINE') {
                const keys = Object.keys(FAQ_ONLINE);
                const key = keys.find(key => key === activity);
                await this.sendMessage(FAQ_ONLINE[key].answer);
            }
            await this.sendButtonMessage(
                    'Daha fazla sorunuz var mı?'
                    ,''
                    ,'Hangi konuda bilgi almak istersiniz?'
                    ,[
                        {
                            id: '#FAQ_ONLINE',
                            title: 'Online Alışveriş',
                        },
                        {
                            id: '#FAQ_STORES',
                            title: 'Mağazadan Alışveriş',
                        },
                        {
                            id: 'merhaba',
                            title: 'Ana Menü',
                        }
                    ]);

        }
		
	}
}