import { LightningElement, api } from 'lwc';
import CASE from "@salesforce/schema/case";
import saveRecord from '@salesforce/apex/casecreationhandler.createcasemethod';
import { NavigationMixin } from 'lightning/navigation';  
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import modal from '@salesforce/resourceUrl/modal';
import { loadStyle } from "lightning/platformResourceLoader"; 
const MAX_FILE_SIZE = 100000000; //10mb  

export default class CaseCreationcomponent extends NavigationMixin(LightningElement) {


    objApi=CASE;

    statusVal;
    originVal;
    subjectVal;
    reasonVal;    

    uploadedFiles = []; file; fileContents; fileReader; content; fileName 

    connectedCallback(){
        Promise.all([loadStyle(this, modal)])
    }

    statushand(event){
        this.statusVal = event.target.value;
    }
    originhand(event){
        this.originVal = event.target.value;
    }
    subjecthand(event){
        this.subjectVal = event.target.value;
    }
    reasonhand(event){
        this.reasonVal = event.target.value;
    }

    //===============================================================c/caseCreationcomponent

    handleCancel(event){ 
        this.handleReset();
        window.history.back();       
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
          'Status': this.statusVal,  
          'Origin': this.originVal,  
          'Subject': this.subjectVal,  
          'Reason': this.reasonVal  
        }  
        saveRecord({  
          caseRec: con, 
          file: encodeURIComponent(this.fileContents),  
          fileName: this.fileName  
        })  
          .then(conId => {  
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