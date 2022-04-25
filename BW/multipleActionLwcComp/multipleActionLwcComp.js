import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import modal from '@salesforce/resourceUrl/modalOpp';
import { loadStyle } from "lightning/platformResourceLoader";
import { getRecord , getFieldValue} from 'lightning/uiRecordApi';
import CTPURCHASEORDER  from "@salesforce/schema/Opportunity.CT_Purchase_Order__c";
import CTPURCHASEQUERY  from "@salesforce/schema/Opportunity.CT_PO_QueryID__c";
import PRIMARYCONTACTID  from "@salesforce/schema/Opportunity.Primary_Contact_Id__c";
import OWNERID  from "@salesforce/schema/Opportunity.OwnerId";
import SERVERURL  from "@salesforce/schema/Opportunity.Server_Url__c";
import CTSALESQUOTE  from "@salesforce/schema/Opportunity.CT_Sales_Quote__c";
import CTOHTAXEXEMPTFORM  from "@salesforce/schema/Opportunity.CT_OH_Tax_Exempt_Form__c";
import CTPDIPPPAUTHFORM  from "@salesforce/schema/Opportunity.CT_PDI_PPP_Auth_Form__c";


export default class MultipleActionLwcComp extends NavigationMixin (LightningElement){

    @api recordId;

    ctPurchaseOrder;
    ctPurchaseQuery;
    primaryContactId;
    ownerIdVal;
    serverUrl;
    ctSalesQuote;
    ctOhTaxExemptionForm;
    ctPdiPppAuthForm;

    opporRes;
    
    connectedCallback(){
        Promise.all([loadStyle(this, modal)])
    }
    
    @wire(getRecord,{recordId: "$recordId", fields: [CTPURCHASEORDER, CTPURCHASEQUERY, PRIMARYCONTACTID, OWNERID, SERVERURL, CTSALESQUOTE, CTOHTAXEXEMPTFORM, CTPDIPPPAUTHFORM]})
    fetchOpportunityRecordDetails({error,data}){
        if (!error && data){
            this.opporRes = data;
            this.ctPurchaseOrder = this.opporRes.fields.CT_Purchase_Order__c.value;
            this.ctPurchaseQuery = this.opporRes.fields.CT_PO_QueryID__c.value;
            this.primaryContactId = this.opporRes.fields.Primary_Contact_Id__c.value;
            this.ownerIdVal = this.opporRes.fields.OwnerId.value;
            this.serverUrl = this.opporRes.fields.Server_Url__c.value;
            this.ctSalesQuote = this.opporRes.fields.CT_Sales_Quote__c.value;
            this.ctOhTaxExemptionForm = this.opporRes.fields.CT_OH_Tax_Exempt_Form__c.value;
            this.ctPdiPppAuthForm = this.opporRes.fields.CT_PDI_PPP_Auth_Form__c.value;
        }
    }
    
    generateSalesQuoteHan(){
        console.log(`https://composer.congamerge.com?serverUrl=${this.serverUrl}&id=${this.recordId}&TemplateID=${this.ctSalesQuote}&APDF=1&CSVisible=1&SC0=1&SC1=Attachments&FP0=1&DefaultPDF=1`);
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes: {
                url : `https://composer.congamerge.com?serverUrl=${this.serverUrl}&id=${this.recordId}&TemplateID=${this.ctSalesQuote}&APDF=1&CSVisible=1&SC0=1&SC1=Attachments&FP0=1&DefaultPDF=1`
            }
        });
    }

    generatePurchaseOrderHan(){
        console.log('CLICKED');
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes: {
                url : 'https://composer.congamerge.com?serverUrl='
                +this.serverUrl+
                '&id='+this.recordId+
                '&TemplateID='+this.ctPurchaseOrder+
                '&QueryID='+this.ctPurchaseQuery+
                '&APDF=1&CSVisible=1&CSRoutingType=SERIAL&CSEmailSubject=BWPurchaseOrder&CSEmailMessage=PleasesignthePO&CSRecipient1='
                +this.primaryContactId+
                '&csRole1=SIGNER&CSRecipient2='
                +this.ownerIdVal+
                '&csRole2=SIGNER&SC0=0&FP0=1&DefaultPDF=1'
            }
        });
    }

    generateOhTaxExemptFormHan(){
        console.log(`https://composer.congamerge.com?serverUrl=${this.serverUrl}&id=${this.recordId}&TemplateID=${this.ctOhTaxExemptionForm}&APDF=1&CSVisible=1&CSRoutingType=SERIAL&CSEmailSubject=BWOHTaxExemptForm&CSEmailMessage=PleasesigntheOHTaxExemptForm&CSRecipient1=${this.primaryContactId}&csRole1=SIGNER&SC0=0&FP0=1&DefaultPDF=1`);
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes: {
                url : `https://composer.congamerge.com?serverUrl=${this.serverUrl}&id=${this.recordId}&TemplateID=${this.ctOhTaxExemptionForm}&APDF=1&CSVisible=1&CSRoutingType=SERIAL&CSEmailSubject=BWOHTaxExemptForm&CSEmailMessage=PleasesigntheOHTaxExemptForm&CSRecipient1=${this.primaryContactId}&csRole1=SIGNER&SC0=0&FP0=1&DefaultPDF=1`
            }
        });
    }

    generatePdiPppAuthFormHan(){
        console.log(`https://composer.congamerge.com?serverUrl=${this.serverUrl}&id=${this.recordId}&TemplateID=${this.ctPdiPppAuthForm}&APDF=1&CSVisible=1&CSRoutingType=SERIAL&CSEmailSubject=BWPDI_PPP&CSEmailMessage=PleasesignthePDI_PPP&CSRecipient1=${this.primaryContactId}&csRole1=SIGNER&CSRecipient2=${this.ownerIdVal}&csRole2=SIGNER&SC0=0&FP0=1&DefaultPDF=1`);
        this[NavigationMixin.Navigate]({
            type : 'standard__webPage',
            attributes: {
                url : `https://composer.congamerge.com?serverUrl=${this.serverUrl}&id=${this.recordId}&TemplateID=${this.ctPdiPppAuthForm}&APDF=1&CSVisible=1&CSRoutingType=SERIAL&CSEmailSubject=BWPDI_PPP&CSEmailMessage=PleasesignthePDI_PPP&CSRecipient1=${this.primaryContactId}&csRole1=SIGNER&CSRecipient2=${this.ownerIdVal}&csRole2=SIGNER&SC0=0&FP0=1&DefaultPDF=1`
            }
        });
    }


}