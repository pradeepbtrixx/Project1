@isTest
public class casecreationhandlerTest {
      public static testMethod void validatecasecreation() {
          
          Product2 prod = new Product2(name='TestProduct');
          insert prod;
          
          String csvAsString= EncodingUtil.urlEncode('Unit Test Attachment Body','UTF-8');
          string FileNameVal = 'TestFile';
          
          case testcase = new case();
          testcase.Subject = 'Test subject';
          testcase.Priority = 'Minor';
          testcase.Description = 'Test Description';
          testcase.Context_leading_to_Fault__c = 'Tesr Content';
          testcase.Support_Type__c = 'RMA';
          testcase.Product_Type__c = 'Other';
          testcase.ProductId = prod.Id;
          testcase.Serial_Number_s__c = 'S92992';
          testcase.Romeo_Partnumber__c = '28828';
          testcase.Customer_Vehicle_Number__c = '7373';
          testcase.Current_physical_location_of_product__c = '3663';
          testcase.Miles_Driven__c = 828;
          testcase.Cycles_utilized__c = 737;
          testcase.Quantity__c = 2;
          
          Test.startTest();
          string validresponse = casecreationhandler.createcasemethod(testcase, csvAsString, FileNameVal);
          system.assertEquals(validresponse.length(), 18);
          system.assertEquals(true, ![SELECT Id FROM ContentVersion WHERE FirstPublishLocationId=:validresponse].isEmpty());
          Test.stopTest();
    }
    
    public static testMethod void falsevalidatecasecreation(){
          
          String csvAsString= EncodingUtil.urlEncode('Unit Test Attachment Body','UTF-8');
          string FileNameVal = 'TestFile';
          case testcase = new case();
        
          Test.startTest();
          string falseresponse = casecreationhandler.createcasemethod(testcase, csvAsString, FileNameVal);
          system.assertEquals(null, falseresponse);
          Test.stopTest();
    }
}