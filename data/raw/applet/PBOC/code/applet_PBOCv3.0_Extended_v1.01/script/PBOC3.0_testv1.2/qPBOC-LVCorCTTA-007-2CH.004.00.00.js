/*******************************************
 Test Name  : qVSDC Low Value or CTTA Check - Offline approval 
 Card Image : PBOC-PSE-035-(for LVCandCTTA)
 Reference  : VCPS 2CG.004.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support']			 	 
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [VLP reset Threshold '9F6D'] 
			  [Cumulative Transaction Total Amount Limit '9F54'] personalize              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCorCTTA-001-2CG.004.00.00');

//////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : Amount, Authorised < EC Balance");
reset();
select_PBOC();
assertSW('9000');

CTTAL = lookup_BER_TLV(send_GetData('9F54'), '9F54', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

Amount_Authorised = '000000001000';

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

check_result(GPOresponse);

function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
	
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	
	checkIAD("0701010390000001", "0701110390000001", 8);
		
	validate_AC(AC);
};
