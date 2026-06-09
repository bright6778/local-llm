/*******************************************
 Test Name  : qVSDC Low Value AND CTTA Check - Online processing (Decline Transaction) 
 Card Image : PBOC-PSO-035-(for qPBOC-LVCandCTTA-005, 006)
 Reference  : VCPS 2CG.004.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support']			 	 
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [VLP reset Threshold '9F6D'] 
			  [Cumulative Transaction Total Amount Limit '9F54'] 
			  [Cumulative Transaction Total Amount Limit '9F5C'] personalize
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCandCTTA-005-2CG.004.00.00');

print('\n* Power on the Card(ATR)');
reset();
print('\n* Case 01: Amount, Authorised (1850) > VLP Available Funds');
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Amount_Authorised = '000000001850';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

send_GPO(CVN);
assertSW('9000');

Read_Record();

print('\n* Case 02: [Amount, Authorised + CTTA ] (750) > CTTAL');
select_PBOC();
assertSW('9000');

Amount_Authorised = '000000008000';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(AC == "")  error("Application Cryptogram doesn't exist");
if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
checkIAD("0701010380200001", "0701110380200001", 8)

AOSA = lookup_BER_TLV(value_77, "9F5D", RETURN_VALUE);
if(AOSA == "") error("Available Offline Spending Amount doesn't exist");

validate_AC(AC);

if(VLP_Funds == AOSA) error("failed verify Available Offline Spending Amount received in GPO is not same as the VLP Available Funds returned for the GET DATA tag 9F79");

assertEquals(AOSA, "000000008000");

