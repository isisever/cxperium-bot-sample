// Node modules.
import {
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from 'cxperium-bot-engine';
import * as fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const {
    NEBIM_INTEGRATOR_URL,
    NEBIM_INTEGRATOR_TOKEN
} = process.env;

export default class NebimV3Helper extends ServiceWhatsappBaseDialog {
    constructor(data: TBaseDialogCtor) {
        super(data);
    }

    public async getStoreLocations() {
        return await fetch (
            `${NEBIM_INTEGRATOR_URL}/IntegratorService/RunProc/${NEBIM_INTEGRATOR_TOKEN}`,
            {
                method: 'POST',
                headers: { 
                    'content-type': 'application/json; charset=utf-8',
                 },
                body: JSON.stringify({
                    "ProcName": "sp_RPA_GetWarehouseMapLocation",
                    "Parameters": [
                        {
                            "Name": "StoreDescription",
                            "Value": ""
                        }
                    ]  
                })
            }
        )
    }

    public async getOrdersByPhoneNumber(phoneNumber: string) {
        return await fetch (
            `${NEBIM_INTEGRATOR_URL}/IntegratorService/RunProc/${NEBIM_INTEGRATOR_TOKEN}`,
            {
                method: 'POST',
                headers: { 
                    'content-type': 'application/json; charset=utf-8',
                 },
                body: JSON.stringify({
                    "ProcName": "sp_RPA_GetOrdersByPhoneNumber",
                    "Parameters": [
                        {
                            "Name": "PhoneNumber",
                            "Value": phoneNumber
                        }
                    ]  
                })
            }
        )    
    }
}