/*******************************************
 Test Name  : qVSDC Prepaid for Low Value AND CTTA Check - Offline processing (Delcine Transaction) 
 Card Image : PBOC-PSO-035-(for LVCandCTTAprepaid with CTTAUL)
 Reference  : VCPS 2CI.001.01.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support'
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			 	- Byte 2 bit 8 = 1 'Prepaid Supported'					 	 
			 	- Byte 2 bit 7 = 1 'Transaction in non-matching currency are not allowed'
			  [Cumulative Transaction Total Amount Limit '9F54']
			  [Cumulative Transaction Total Amount Upper Limit '9F5C'] personalize                          
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCandCTTAprepaid-002-2CI.001.01.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');

//////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : Amount, Authorised(3000) => CTTA(3000)");
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

Amount_Authorised = '000000003000';

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

//////////////////////// Case 02 ////////////////////////////
print("\n* Case 02 : Amount, Authorised(3000) => CTTA(6000)");
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

Amount_Authorised = '000000003000';

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

//////////////////////// Case 03 ////////////////////////////
print("\n* Case 03 : Amount, Authorised(3000) => CTTA(9000) > CTTAUL(8000)");
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

Amount_Authorised = '000000003000';

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
	
	checkIAD("0701010380200001", "0701110380200001", 8);
		
	validate_AC(AC);	
};
