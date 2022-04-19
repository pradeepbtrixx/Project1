public with sharing class accountWithOppValues {
    @AuraEnabled(cacheable = true)
    public static List<Account> accountWithOppValuesmeth() {
        return [SELECT Id, Name, Website, Type, (SELECT Id, Name, Type FROM Opportunities) FROM Account LIMIT 5];
    }
}