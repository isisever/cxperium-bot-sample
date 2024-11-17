// Node modules.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';

import * as dotenv from 'dotenv';
import NebimV3Helper from '../../../../helpers/NebimV3Helper';
import { haversineDistance } from '../../../../helpers/HelperFunctions';
dotenv.config();

export default class extends ServiceWhatsappBaseDialog implements IDialog {
    nebimV3Helper: NebimV3Helper;
	constructor(data: TBaseDialogCtor) {
		super(data);
        this.nebimV3Helper = new NebimV3Helper(data);
	}

	async runDialog(): Promise<void> {
        if(this.conversation.isWaitAction('WaitLocation')) {
            await this.findMyNearbyStores()
            return
        }

        if(this.activity.value.id == '#STORES') {
            await this.sendButtonMessage(
                '🏪 Mağazalarımız'
                ,''
                ,'Size en yakın mağazamızı bulmak için hangi işlemi yapmak istersiniz?'
                ,[
                    {
                        'id': '#SHARE_LOCATION',
                        'title': '📍 Konum Paylaş',
                    },
                    {
                        'id': '#FIND_STORES',
                        'title': '🔍 İl ilçe seçimi',
                    }
                ]
            );
        }else if(this.activity.value.id == '#SHARE_LOCATION') {
            await this.sendLocationRequest(await this.getLocalizationText('share_location_to_me'));
            await this.conversation.addWaitAction('WaitLocation');
        }else if(this.activity.value.id == '#FIND_STORES') {

        }

	}
    
    async findMyNearbyStores() {

        if(!this.conversation.getCache('latitude')){
            this.conversation.setCache('latitude', this.activity.location.latitude);
        }

        if(!this.conversation.getCache('longitude')){
            this.conversation.setCache('longitude', this.activity.location.longitude);
        }

        const storeLocationsResponse = await this.nebimV3Helper.getStoreLocations();
        const storeLocations = await storeLocationsResponse.json();
        const storesWithDistance = storeLocations.map((store: any) => {
            const distance = haversineDistance(
                Number(this.conversation.getCache('latitude')),
                Number(this.conversation.getCache('longitude')),
                Number(store.Enlem),
                Number(store.Boylam)
            );
            return {
                ...store,
                distance: distance
            };
        });
    
        const validStoresWithDistance = storesWithDistance.filter((store: any) => store.Enlem && store.Boylam);

        validStoresWithDistance.sort((a: any, b: any) => a.distance - b.distance);
        
    
        let storeCount = this.conversation.getCache('storeCount') || 0;
        const selection = this.activity.value.id;
        
        if( selection != '#YES_STORE' && selection != '#NO_STORE') {
            await this.sendMessage('İşte size en yakın mağazamız');
            await this.sendLocationMessage(validStoresWithDistance[storeCount].Enlem, validStoresWithDistance[storeCount].Boylam, validStoresWithDistance[storeCount]['Mağaza Adı'], validStoresWithDistance[storeCount]['Adres']);
           
        }
        
        if (selection == '#YES_STORE') {
            await this.sendMessage('Sizi menüye yönlendiriyorum.');
            await this.sendMessage('Lütfen bekleyiniz...');
            await this.conversation.removeWaitAction();
            await this.conversation.resetConversation();
            await this.services.dialog.runWithIntentName(this, 'CXPerium.Dialogs.WhatsApp.WelcomeDialog');
            return;
        } else if (selection == '#NO_STORE') {
            // storeCount değerini artır ve güncelle
            storeCount += 1;
            this.conversation.setCache('storeCount', storeCount);
            await this.sendMessage('Size en yakın bir diğer mağazamız.');
            
            console.log(validStoresWithDistance[storeCount].Enlem, validStoresWithDistance[storeCount].Boylam, validStoresWithDistance[storeCount]['Mağaza Adı'], validStoresWithDistance[storeCount]['Adres'])

            await this.sendLocationMessage(validStoresWithDistance[storeCount].Enlem, validStoresWithDistance[storeCount].Boylam, validStoresWithDistance[storeCount]['Mağaza Adı'], validStoresWithDistance[storeCount]['Adres']);
          
        }

        await this.sendButtonMessage(
            'İşlem seçiniz',
            '',
            'İlettiğimiz mağaza sizin için yeterli mi?',
            [
                {
                    'id': '#YES_STORE',
                    'title': '✅ Evet Yeterli',
                },
                {
                    'id': '#NO_STORE',
                    'title': '⏭️Başka Mağaza Getir',
                }
            ]
        );
    }
}
