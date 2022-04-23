import { LightningElement, api } from 'lwc';
import CASE from "@salesforce/schema/case";
import saveRecord from '@salesforce/apex/casecreationhandler.createcasemethod';
import { NavigationMixin } from 'lightning/navigation';  
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions'; 
//import modal from '@salesforce/resourceUrl/modal';
//import { loadStyle } from "lightning/platformResourceLoader"; 
const MAX_FILE_SIZE = 100000000; //10mb  

export default class Casecreationlwccomponent extends NavigationMixin(LightningElement) {

    objApi=CASE;

    priorityVal;
    descriptionVal;
    subjectVal;
    contextleadingtoFaultVal;
    uploadimagesCANlogsVal;
    currentphysicallocationofproductVal;
    serialNumberVal;
    milesDrivenVal;
    romeoPartnumberVal;
    cyclesutilizedVal;
    quantityVal;
    statusVal;
    originVal;

    uploadedFiles = []; file; fileContents; fileReader; content; fileName 
    /*
    connectedCallback(){
        Promise.all([loadStyle(this, modal)])
    }
    */
    priorityValHan(event){this.priorityVal = event.target.value;}
    descriptionValHan(event){this.descriptionVal = event.target.value;}
    subjectValHan(event){this.subjectVal = event.target.value;}
    contextleadingtoFaultValHan(event){this.contextleadingtoFaultVal = event.target.value;}
    uploadimagesCANlogsVaLHan(event){this.uploadimagesCANlogsVal = event.target.value;}
    currentphysicallocationofproductValHan(event){this.currentphysicallocationofproductVal = event.target.value;}
    serialNumberValHan(event){this.serialNumberVal = event.target.value;}
    milesDrivenValHan(event){this.milesDrivenVal = event.target.value;}
    romeoPartnumberValHan(event){this.romeoPartnumberVal = event.target.value;}
    cyclesutilizedValHan(event){this.cyclesutilizedVal = event.target.value;}
    quantityValHan(event){this.quantityVal = event.target.value;}
    statusValHan(event){this.statusVal = event.target.value;}
    originValHan(event){this.originVal = event.target.value;}
    
    //===============================================================c/caseCreationcomponent

    handleCancel(event){ 
        this.dispatchEvent(new CloseActionScreenEvent());    
    }
    
    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
            field.reset();
            });
        }
    }
    

    onFileUpload(event) {  
        if (event.target.files.length > 0) {  
          this.uploadedFiles = event.target.files;  
          this.fileName = event.target.files[0].name;  
          this.file = this.uploadedFiles[0];  
          if (this.file.size > this.MAX_FILE_SIZE) {  
            alert("File Size Can not exceed" + MAX_FILE_SIZE);  
          }  
        }  
      }  
      saveCase() {  
        this.fileReader = new FileReader();  
        this.fileReader.onloadend = (() => {  
          this.fileContents = this.fileReader.result;  
          let base64 = 'base64,';  
          this.content = this.fileContents.indexOf(base64) + base64.length;  
          this.fileContents = this.fileContents.substring(this.content);  
          this.saveRecord();  
        });  
        this.fileReader.readAsDataURL(this.file);  
      }  
      saveRecord() {  
        var con = {  
          'sobjectType': 'case',  
          'Priority': this.priorityVal,
          'Description': this.descriptionVal,
          'Subject': this.subjectVal,
          'Context_leading_to_Fault__c': this.contextleadingtoFaultVal,
          'Upload_images_CAN_logs__c': this.uploadimagesCANlogsVal,
          'Current_physical_location_of_product__c': this.currentphysicallocationofproductVal,
          'Serial_Number_s__c': this.serialNumberVal,
          'Miles_Driven__c': this.milesDrivenVal,
          'Romeo_Partnumber__c': this.romeoPartnumberVal,
          'Cycles_utilized__c': this.cyclesutilizedVal,
          'Quantity__c': this.quantityVal,
          'Status': this.statusVal,
          'Origin': this.originVal
        }  
        console.log(con);
        saveRecord({  
          caseRec: con, 
          file: encodeURIComponent(this.fileContents),  
          fileName: this.fileName  
        })  
          .then(conId => {  
            console.log(conId);
            if (conId) {  
              this.dispatchEvent(  
                new ShowToastEvent({  
                  title: 'Success',  
                  variant: 'success',  
                  message: 'Contact Successfully created',  
                }),  
              );  
              this[NavigationMixin.Navigate]({  
                type: 'standard__recordPage',  
                attributes: {  
                  recordId: conId,  
                  objectApiName: 'Case',
                  actionName: 'view'  
                },  
              });  
            }  
          }).catch(error => {  
            console.log('error ', error);  
          });  
      } 
  

}