import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import modal from '@salesforce/resourceUrl/modal';
import AMOUNT from "@salesforce/schema/Opportunity.Amount";
import CG from "@salesforce/schema/Opportunity.CurrentGenerators__c";
import { loadStyle } from "lightning/platformResourceLoader";
import { getRecord , getFieldValue} from 'lightning/uiRecordApi';

export default class MultipleRecordActions extends NavigationMixin (LightningElement) {

    @api recordId;
    COTEFC;
    tt;
    OpportVal;
    
    @wire(getRecord,{recordId: "$recordId", fields: [AMOUNT, CG]})
    fetchOpportunityRecordDetails({error,data}){
        if (!error && data){
            this.OpportVal = data;
            this.COTEFC = this.OpportVal.fields.Amount.value;
            this.tt = this.OpportVal.fields.CurrentGenerators__c.value;
            console.log(this.COTEFC);
        }

    }
    
    connectedCallback(){
        Promise.all([loadStyle(this, modal)])
    }

    openOpportunityRecord(){
        this[NavigationMixin.Navigate]({
            type : 'standard__recordPage',
            attributes: {
                recordId: "0065j00000Zahl1AAB",
                actionName: 'view'
            }
        });
    }

    openYoutube(){
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes: {
                url : 'https://www.youtube.com/'
            }
        });
    }

    openGoogle(){
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes: {
                url : 'https://www.google.com/'+this.tt
            }
        });
    }
}