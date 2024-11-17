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
        await this.sendLocationRequest(await this.getLocalizationText('share_location_to_me'));
        await this.conversation.addWaitAction('WaitLocation');
	}
    
    async findMyNearbyStores() {
        console.log(this.activity.location.latitude, this.activity.location.longitude);
        const storeLocationsResponse = await this.nebimV3Helper.getStoreLocations();
        const storeLocations = await storeLocationsResponse.json();
        const storesWithDistance = storeLocations.map((store: any) => {
            const distance = haversineDistance(
                Number(this.activity.location.latitude),
                Number(this.activity.location.longitude),
                Number(store.Enlem),
                Number(store.Boylam)
            );
            return {
                ...store,
                distance: distance
            };
        });

        storesWithDistance.sort((a: any, b: any) => a.distance - b.distance);
        await this.sendMessage('İşte size en yakın mağazlarımız');

        await storesWithDistance.slice(0, 5).forEach(async (store: any) => {
            const sendStore = await this.sendLocationMessage(store.Enlem, store.Boylam, store['Mağaza Adı'], store['Adres']);
            console.log(sendStore);
        });
        
        await this.sendMessage('Sizi menüye yönlendiriyorum.');
        await this.sendMessage('Lütfen bekleyiniz.');
        

        await this.conversation.removeWaitAction();
        await this.conversation.resetConversation();

        await this.services.dialog.runWithIntentName(this,'CXPerium.Dialogs.WhatsApp.WelcomeDialog');

    }
}
