import { LightningElement , wire} from 'lwc';
import accountWithOppValuesmeth from '@salesforce/apex/accountWithOppValues.accountWithOppValuesmeth';

export default class TreeListViewComponent extends LightningElement {
    
    gridData = [];

    @wire(accountWithOppValuesmeth)
    accountWithOppValuesmethResult({data, error}){
        if(data){
            console.log(data);
            this.gridData = data.map(item=>{
                const {Opportunities, ...accounts} = item
                return {...accounts,"_children":Opportunities}
            })
        
        }
        if(error){
            console.log(error);
        }
    }

    gridColumns=[
        {
            label:'Name',
            fieldName:'Name',
            type:'text'
        }, 
        {
            label:'Type',
            fieldName:'Type',
            type:'text'
        },   
        {
            label:'Account Wesite',
            fieldName:'Website',
            type:'url',
            typeAttributes:{
                target:'_blank'
            }
        },     
    ]

}