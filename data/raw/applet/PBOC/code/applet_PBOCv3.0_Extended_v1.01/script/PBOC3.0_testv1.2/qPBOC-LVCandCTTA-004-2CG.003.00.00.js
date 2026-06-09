/*******************************************
 Test Name  : qVSDC Low Value AND CTTA Check - Online processing 
 Card Image : PBOC-PSE-035-(for LVCandCTTA)
 Reference  : VCPS 2CG.003.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support']			 	 
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [VLP reset Threshold '9F6D'] 
			  [Cumulative Transaction Total Amount Limit '9F54'] personalize
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCandCTTA-004-2CG.003.00.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

Amount_Authorised = "000000007000";

GPOresponse = send_GPO(CVN);
assertSW('9000');

send_GetData('9F79');
assertSW('9000');
send_GetData('9F6D');
assertSW('9000');
send_GetData('9F77');
assertSW('9000');
send_GetData('9F68');
assertSW('9000');

//qPBOC에서는 Upper limit이 발급되어 있으면 CTTAL은 사용되지 않음 -> CTTALU만 사용
//CTTAL = lookup_BER_TLV(send_GetData('9F54'), '9F54', RETURN_VALUE);
CTTALU = lookup_BER_TLV(send_GetData('9F5C'), '9F5C', RETURN_VALUE); 
assertSW('9000');

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(AC == "") error("Application Cryptogram doesn't exist");
if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
checkIAD("07010103A0200001", "07011103A0200001", 8);

AOSA = lookup_BER_TLV(value_77, "9F5D", RETURN_VALUE);

validate_AC(AC);

//assertEquals(AOSA, CTTAL);
assertEquals(AOSA, CTTALU);

