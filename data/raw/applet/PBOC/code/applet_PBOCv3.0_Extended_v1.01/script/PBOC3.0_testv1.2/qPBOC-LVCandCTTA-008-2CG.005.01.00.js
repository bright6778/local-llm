/*******************************************
 Test Name  : qVSDC Low Value AND CTTA Check - Offline processing 
 Card Image : PBOC-PSO-035-(for qPBOC-LVCandCTTA-007)
 Reference  : VCPS 2CG.005.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support']			 	 
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [VLP reset Threshold '9F6D'] 
			  [Cumulative Transaction Total Amount Limit '9F54'] personalize
			  [Cumulative Transaction Total Amount Upper Limit '9F5C'] personalize
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCandCTTA-007-2CG.005.00.00');
print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');


///////////////////////// case 01 //////////////////////////
print('\n* Case 01: Amount, Authorised > VLP Available Funds');
select_PBOC();
assertSW('9000');

VLP_Funds_1 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');
Amount_Authorised = '000000005500';

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

VLP_Funds_2 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

check_result(GPOresponse);
checkIAD("07010103A0200001","07011103A0200001",8)
assertEquals(VLP_Funds_1, VLP_Funds_2);


///////////////////////// case 02 //////////////////////////
print('\n* Case 02: Amount, Authorised > VLP Single Transaction Limit');
select_PBOC();
assertSW('9000');


VLP_Funds_1 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

VLP_Single_TX_Limit = lookup_BER_TLV(send_GetData('9F78'), '9F78', RETURN_VALUE);
assertSW('9000');
Amount_Authorised = '000000001500';

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

VLP_Funds_2 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

check_result(GPOresponse);
checkIAD("07010103A0200001","07011103A0200001",8)
assertEquals(VLP_Funds_1, VLP_Funds_2);


///////////////////////// case 03 //////////////////////////
print('\n* Case 03: Amount, Authorised < VLP Available Funds and < VLP Single Transaction Limit but [Amount, Authorised + CTTA] > CTTAL');
select_PBOC();
assertSW('9000');

VLP_Funds_1 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

AOSA  = lookup_BER_TLV(send_GetData('9F5D'), '9F5D', RETURN_VALUE);
CTTAL = lookup_BER_TLV(send_GetData('9F54'), '9F54', RETURN_VALUE);
CTTA  = parseInt(CTTAL, 10) - parseInt(AOSA, 10);

Amount_Authorised = '000000001100';

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

VLP_Funds_2 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

check_result(GPOresponse);
checkIAD("07010103A0200001","07011103A0200001",8)
assertEquals(VLP_Funds_1, VLP_Funds_2);

///////////////////////// case 04 //////////////////////////
print('\n* Case 04: Amount, Authorised < VLP Available Funds and < VLP Single Transaction Limit but [Amount, Authorised + CTTA] < CTTAL');
select_PBOC();
assertSW('9000');

VLP_Funds_1 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

AOSA  = lookup_BER_TLV(send_GetData('9F5D'), '9F5D', RETURN_VALUE);
CTTAL = lookup_BER_TLV(send_GetData('9F54'), '9F54', RETURN_VALUE);
CTTA  = parseInt(CTTAL, 10) - parseInt(AOSA, 10);

Amount_Authorised = '000000000500';

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

VLP_Funds_2 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');
send_GetData('9F77');
assertSW('9000');
send_GetData('9F68');
assertSW('9000');

check_result(GPOresponse);
checkIAD("0701010390000001","0701110390000001",8)
assertEquals('000000017500', '000000017500');

if(parseInt(VLP_Funds_2, 10) != parseInt(VLP_Funds_1, 10) - Amount_Authorised) 
	error("failed verify that VLP Available Funds (after GPO) = VLP Available Funds (prior to GPO) - Amount, Authorised ");

print("[User Check] Verify that CTTA = CTTA + Amount, Authorised");
print("[User Check] Verify that Available Offline Spending Amount = CTTAL - CTTA");	

function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
	
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	if(lookup_BER_TLV(value_77, "9F5D", RETURN_VALUE) == "") error("Available Offline Spending Amount doesn't exist");

	validate_AC(AC);
}