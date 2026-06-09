/*******************************************
 Test Name  : qVSDC Low Value or CTTA Check - Offline processing (Decline transaction)
 Card Image : PBOC-PSE-035-(for LVCorCTTA)
 Reference  : VCPS 2CG.003.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 6 = 1 'Low Value AND CTTA Check Support']			 	 
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'  
 			  [CTTAL '9F54'] personalized
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCorCTTA-005-2CG.003.00.00');

print('\n* Power on the Card(ATR)');
reset();

//////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : Amount, Authorised > VLP Available Funds");
select_PBOC();
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

Amount_Authorised = '000000004500';

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

//////////////////////// Case 02 ////////////////////////////
print("\n* Case 02 : Amount, Authorised + CTTA > CTTAL");
reset();
select_PBOC();
assertSW('9000');

CTTAL = lookup_BER_TLV(send_GetData('9F54'), '9F54', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

Amount_Authorised = '000000004500';

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