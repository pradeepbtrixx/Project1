import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import modal from '@salesforce/resourceUrl/modal';
import { loadStyle } from "lightning/platformResourceLoader";


export default class MultipleRecordActions extends NavigationMixin (LightningElement) {

    @api recordId;
    COTEFC = '767';
    PCI;
    /*
    @wire(getRecord,{recordId: '$recordId', fields: [CTOHTAXEXEMPTFORM,PRIMARY_CONTACT_ID]})
    fetchOpportunityRecordDetails({error,data}){
        if (!error && data){
            this.COTEFC = data.fields.CT_OH_Tax_Exempt_Form__c.value;
            this.PCI = data.fields.Primary_Contact_Id__c.value;
        }
    }
    */
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
                url : 'https://www.google.com/'+this.COTEFC
            }
        });
    }
}