import { LightningElement, track, wire, api } from "lwc";
import getIGTypes from "@salesforce/apex/IronGuidePIMController.getIGTypes";
import getIGMakes from "@salesforce/apex/IronGuidePIMController.getIGMakes";
import getIGModels from "@salesforce/apex/IronGuidePIMController.getIGModels";
import getModelYears from "@salesforce/apex/IronGuidePIMController.getModelYears";
import getIGRegions from "@salesforce/apex/IronGuidePIMController.getIGRegions";
import getIGStates from "@salesforce/apex/IronGuidePIMController.getIGStates";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import REGION_FIELD from "@salesforce/schema/Trade_In__c.Region__c";
import IG_STATE_FIELD from "@salesforce/schema/Trade_In__c.IG_State__c";
import TRADE_IN_OBJECT from "@salesforce/schema/Trade_In__c";

export default class TradeInDataCaptureComponent extends LightningElement {

  @track _typeCode;
  @track _make;
  @track _model;
  @track _year;
  @track _region;
  @track _engineHours;
  @track _state;
  @track
  makeOptions = [];
  @track
  modelOptions = [];
  @track
  yearOptions = [];
  typeOptions = [];
  @track
  regionOptions = [];
  @track
  stateOptions = [];
  @track
  showSpinner = false;
  searchData;
  //label = 'Model';
  @track val = '';
  @track make = '';
  @track makeLabel='';
 // region = 'Northcentral US';
  //makeRegionVal = ''
  @track region = 'Northcentral US';

  @wire (getObjectInfo, {objectApiName: TRADE_IN_OBJECT})
  objectInfo;
//Commented by Revathi for Issue Id - Region

 /*@wire(getPicklistValues,{recordTypeId: '$objectInfo.data.defaultRecordTypeId',fieldApiName: REGION_FIELD})
  getRegionPicklistValues({error,data}){
    if (!error && data && data.values){
      this.regionOptions = data.values;
    }
  }
*/
showModelDropDown(event) {
  event.currentTarget.classList.toggle("slds-is-open");
}

showMakeDropDown(event){
  event.currentTarget.classList.toggle("slds-is-open");
}

// makeRegion(event){
//   this.makeRegionVal = event.target.value;
//   if(this.makeRegionVal == " " ){
//     this.makeRegionVal = 'Northcentral US';
//   }
// }

searchMakeValue(event){
  this.makeLabel = event.target.value;
  console.log('value  ' + this.makeLabel);
 // this.getMakeOptions(this.make)
  let change = 0;
  let searchKey = '';
  if(this.makeLabel){
    searchKey = this.makeLabel.toLowerCase();
  }
debugger;
  if(this.makeOptions[this.makeOptions.length -1].value === -1){
      this.makeOptions.pop();
  }
  if (this.makeLabel === "") {
    this.makeOptions.forEach(option => {
      option.visible = true;
    });
    return ;
   }
   this.makeOptions.forEach(option => {
    debugger;
    let label = option.label.toLowerCase();
    if (label.startsWith(searchKey)) {
      option.visible = true;
      change++;
    } else {
      option.visible = false;
    }
  });
  if (change === 0) {
    this.makeOptions.push ({value: -1, label: "No results found", visible: true})
  }
}
searchValue(event){
   this.val = event.target.value;
   let changed = 0;
   // This is used to display when no records are found.
   if (this.modelOptions[this.modelOptions.length - 1].value === -1) {
    this.modelOptions.pop();
   }
   if (this.val === "") {
    this.modelOptions.forEach(option => {
      option.visible = true;
    });
    return ;
   }
    this.modelOptions.forEach(option => {
      if (option.label.startsWith(this.val)) {
        option.visible = true;
        changed++;
      } else {
        option.visible = false;
      }
    });
    if (changed === 0) {
      this.modelOptions.push ({value: -1, label: "No results found", visible: true})
    }
  console.log('Values are in Search : ' +val);
  console.log(this.modelOptions);

  //console.log('Hello :', this.typeCode, this.make);

  //let result =this.getModelOptions(this.typeCode,this.make);
  //console.log('The Result : ' + result);
  //this._model;

}  async connectedCallback() {
    this.getTypeOptions();
  }

  async getTypeOptions(){
    try{
      this.showSpinner = true;
      let response = await getIGTypes();
      console.log(response);
      if (response){
        this.typeOptions = Object.entries(response).map(([value,label])=>({value,label}));
      }
    }catch (e) {
      console.error(e);
    }finally {
      this.showSpinner = false;
    }
  }

  async getMakeOptions(typeCode){
    try{

      this.showSpinner = true;
      let response = await getIGMakes({typeCode});
      if (response) {
        console.log("Response : ", response)
        this.makeOptions = Object.entries(response).map(([value,label])=>({value,label,visible:true}));
        console.log("Make options 0 : ", this.makeOptions)
      }
    }catch (e){
      console.error(e);
    }finally {
      this.showSpinner = false;
    }
  }

  async getModelOptions(typeCode,makeCode){
    console.log('He : ', typeCode,makeCode, await getIGModels({typeCode,makeCode}));
    try{
      this.showSpinner = true;
      let response = await getIGModels({typeCode,makeCode});
      console.log('Response :' + response);
      if (response) {
         //this.modelOptions = response.map(model=>({value: model,label: model}))
        this.modelOptions = Object.entries(response).map(([value, label]) => ({value, label, visible: true}));
       // console.log('MODEL OPTIONS FROM JS');
       // console.log(this.modelOptions);
      };
    }catch(e){
        console.error(e);
    }finally {
      this.showSpinner = false;
    }
  }

  async getYearOptions(typeCode,makeCode,modelName){
    try{
      this.showSpinner = true;
      let response = await getModelYears({typeCode,makeCode,modelName});
      if (response) this.yearOptions = [...response.map(year=>({value: year,label: year}))];
    }catch(e){
        console.error(e);
    }finally {
      this.showSpinner = false;
    }
  }
  //Added for Issues Region map
  async getRegionOptions(typeCode,makeCode,modelName){
    try{
      this.showSpinner = true;
      let response = await getIGRegions({typeCode,makeCode,modelName});
      if (response){
        this.regionOptions = Object.entries(response).map(([value,label])=>({value,label}));
        //console.log("Region Value : ", +JSON.stringify(regionOptions, null, 2));
      }
    }catch (e) {
      console.error(e);
    }finally {
      this.showSpinner = false;
    }
  }

  handleMakeSelection(event){
debugger;
    let makeVal = event.currentTarget.getAttribute("data-key");
    let makeLbl = event.currentTarget.getAttribute("data-label");
    this.makeLabel = makeLbl;
    this.make = makeVal;
    this._make = makeVal;

       this._model = "";
        this.modelOptions = [];
        this._year = "";
        this.yearOptions = [];
        //Added for Issue Id - Region
        this._region = "";
        this.regionOptions = [];
        this._state = "";
        this.stateOptions = [];
        //Endc
        console.log("Make selection l: ", this._typeCode, makeVal)
        this.getModelOptions(this._typeCode,makeVal)
        
  }

  handleModelSelection(event){
   let testvar = event.currentTarget.getAttribute("data-key");
   this.val = testvar;
   
   this._model = testvar;
        this._year = "";
        this.yearOptions = [];
        //Added for Issue Id - Region
        this._region = "";
        this.regionOptions = [];
        this._state = "";
        this.stateOptions = [];
        this.getRegionOptions(this._typeCode,this._make,this._model);
        //console.log('this._typeCode,this._make,val'+this._typeCode,this._make,val);
        //End
        this.getYearOptions(this._typeCode,this._make,this._model);

  }

  async getStateOptions(regionCode){
    try{
      //console.log('getStateOptions called');
      this.showSpinner = true;
      let response = await getIGStates({regionCode});
      if (response) this.stateOptions = response.map(state=>({value: state,label: state}));
    }catch (e){
      console.error(e);
    }finally {
      this.showSpinner = false;
    }
  }

 

  onInputChange(e){
    console.log('Hello', e.detail.val);
    let val = e.detail.value;
    switch (e.currentTarget.dataset.elemId){
      case 'type': {
        console.log('type changed : ', val);
        this._typeCode = val;
        this._make = "";
        
        this.makeOptions = [];
        this._model = "";
        this.modelOptions = [];
        this._year = "";
        this.yearOptions = [];
        //Added for Issue Id - Region
        this._region = "";
        this.regionOptions = [];
        this._state = "";
        this.stateOptions = [];
        //End
        this.getMakeOptions(val)
        break;
      }
      case 'make': {
        console.log('Make:'+val);
        this._make = val;
        this._model = "";
        this.modelOptions = [];
        this._year = "";
        this.yearOptions = [];
        //Added for Issue Id - Region
        this._region = "";
        this.regionOptions = [];
        this._state = "";
        this.stateOptions = [];
        //End
        this.getModelOptions(this._typeCode,val)
        break;
      }
      case 'model': {
        this._model = val;
        this._year = "";
        this.yearOptions = [];
        //Added for Issue Id - Region
        this._region = "";
        this.regionOptions = [];
        this._state = "";
        this.stateOptions = [];
        this.getRegionOptions(this._typeCode,this._make,val);
        //console.log('this._typeCode,this._make,val'+this._typeCode,this._make,val);
        //End
        this.getYearOptions(this._typeCode,this._make,val);
        break;
      }
      case 'year': {
        this._year = val;
        break;
      }
      case 'region': {
        this._region = val;
         //Added for Region - State Map
         this._state = "";
         this.stateOptions = [];
         this.getStateOptions(val);
         //console.log('this.Region'+ val);
         //End
        break;
      }
      case 'state':{
        this._state = val;
        break;
      }

      case 'hours': {
        this._engineHours = val;
        break;
      }
      default: break;
    }
    this.publishComponentState();
  }

  publishComponentState(){
    let typeDescription = this.typeOptions.find(item => item.value === this._typeCode) && this.typeOptions.find(item => item.value === this._typeCode).label;
    let makeDescription = this.makeOptions.find(item => item.value === this._make) && this.makeOptions.find(item => item.value === this._make).label;
    this.dispatchEvent(new CustomEvent('componentstatechange',{
      detail: {
        typeDescription: typeDescription,
        typeCode: this._typeCode,
        makeDescription: makeDescription,
        makeCode: this._make,
        model: this._model,
        year: this._year,
        regionCode: this._region,
        state: this._state,
        engineHours: this._engineHours
      }
    }))
  }

  @api
  checkValidity(){
    let elementsToValidate = this.template.querySelectorAll('[data-elem-id]');
    let allComponentsValid = true;
    for (const element of elementsToValidate) {
      allComponentsValid = allComponentsValid && element.checkValidity();
      if (!element.checkValidity()) element.reportValidity();
    }
    return allComponentsValid;
  }


  get typeCode() {
    return this._typeCode;
  }

  @api
  set typeCode(value) {
    this._typeCode = value;
  }

  get make() {
    return this._make;
  }

  @api
  set make(value) {
    this._make = value;
  }

  get model() {
    return this._model;
  }

  @api
  set model(value) {
    this._model = value;
  }
  get year() {
    return this._year;
  }
  @api
  set year(value) {
    this._year = value;
    this.loadAllPicklistOptions();
  }

  async loadAllPicklistOptions(){
    await this.getTypeOptions();
    await this.getMakeOptions(this.typeCode);
    await this.getModelOptions(this.typeCode,this.make);
    await this.getYearOptions(this.typeCode,this.make,this.model);
    //Added for Issues - Region
    //console.log('Initial'+ this.typeCode+this.make+this.model);
    await this.getRegionOptions(this.typeCode,this.make,this.model);
    //console.log('Initial'+ this.region);
    await this.getStateOptions(this.region);
    //end
  }

  get region() {
    return this._region;
  }

  @api
  set region(value) {
    this._region = value;
  }
  get state() {
    return this._state;
  }

  @api
  set state(value) {
    this._state = value;
  }
  get engineHours() {
    return this._engineHours;
  }
  
  @api
  set engineHours(value) {
    //console.log('Sett:_engineHours:'+value);
    this._engineHours = value;
  }
  get noYearOptionsAvailable(){
    return Array.isArray(this.yearOptions) && this.yearOptions.length === 1 && this.yearOptions.map(({value})  => String(value)).includes('0');
  }
}