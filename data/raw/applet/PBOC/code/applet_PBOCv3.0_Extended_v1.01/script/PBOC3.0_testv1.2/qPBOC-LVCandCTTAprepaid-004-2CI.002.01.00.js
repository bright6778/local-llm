/*******************************************
 Test Name  : qVSDC Prepaid for Low Value AND CTTA Check - Offline approval 
 Card Image : PBOC-PSO-035-(for LVCandCTTA with CTTAUL)
 Reference  : VCPS 2CI.002.01.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support'
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			 	- Byte 2 bit 8 = 1 'Prepaid Supported'					 	 
			 	- Byte 2 bit 7 = 1 'Transaction in non-matching currency are not allowed'
			  [Cumulative Transaction Total Amount Limit '9F5C']
			  [Cumulative Transaction Total Amount Upper Limit '9F54'] personalized              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCandCTTAprepaid-004-2CI.002.01.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');

//////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : Amount, Authorised < VLP Available Funds");
select_PBOC();
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

Amount_Authorised = '000000000500';

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

check_result(GPOresponse);


//////////////////////// Case 02 ////////////////////////////
reset();
print("\n* Case 02 : Amount, Authorised + CTTA < CTTAL");
select_PBOC();
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

Amount_Authorised = '000000000500';

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