/*******************************************
 Test Name  : qVSDC Low Value Check - Offline approval
 Card Image : PBOC-PSO-037-(for qPBOC-LVC-004, 008)
 Reference  : VCPS 2CF.004.00.00
 Card Conf  : [Card Additional Process]
			 	- Byte 1 bit 8 = 1 'Low Value Check Support'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [Available Offline Spending Amount ' 9F5D] personalize	  	
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVC-004');

print('\n* Power on the Card(ATR)');
reset();

//////////////////////////// case 01 /////////////////////////////
print("\n* Case 01: Amount, Authorised (10) < VLP Available Funds and < VLP Single Transaction Limit");
select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

VLP_Funds_Before = lookup_BER_TLV(send_GetData('9F79'), "9F79", RETURN_VALUE);
assertSW('9000');

Amount_Authorised = "000000001000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_Funds_After = lookup_BER_TLV(send_GetData('9F79'), "9F79", RETURN_VALUE);
assertSW('9000');

checkIAD("0701010390000001", "0701110390000001", 8);	
check_result(GPOresponse);

assertEquals(parseInt(VLP_Funds_Before, 10), parseInt(VLP_Funds_After, 10)+parseInt(Amount_Authorised, 10));

//////////////////////////// case 02 /////////////////////////////
print("\n* Case 02: Amount, Authorised (1790) </= VLP Available Funds and < VLP Single Transaction Limit");
select_PBOC();
assertSW('9000');

Amount_Authorised = "000000001000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), "9F79", RETURN_VALUE);
assertSW('9000');

checkIAD("0701010390000001", "0701110390000001", 8);	
check_result(GPOresponse);
assertEquals(VLP_Funds, "000000000000");

//////////////////////////// case 03 /////////////////////////////
print("\n* Case 03: Amount, Authorised (10) < VLP Available Funds and < VLP Single Transaction Limit");
select_PBOC();
assertSW('9000');

Amount_Authorised = VLP_Funds_After;
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), "9F79", RETURN_VALUE);
assertSW('9000');

checkIAD("0701010380200001", "0701110380200001", 8);

assertEquals(VLP_Funds, "000000000000");

function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);

	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	if(AC == "") error("Application Cryptogram doesn't exist");
	if(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE) == "") error("Card Transaction Qualifier doesn't exist");	

	validate_AC(AC);
	print("[User Check] Compare and verify the card response data for the tags '9F6C', '82', '57' and '5F34' with the card image personalization data");	
}


