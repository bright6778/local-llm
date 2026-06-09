/*******************************************
 Test Name  : PIN Tries Exceeded Check - Matching Currency
 Card Image : PBOC-PSO-039
 Reference  : VCPS 2CE.027.00.00
 Card Conf  : [Application Currency Code] 
              [Card Transaction Qualifier] 
              [Card Additional Process] 
                - Byte 1 bit 4 = 1 'PIN Tries Exceeded Check Supported'             
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
              PIN Try Counter = 0
 *******************************************/


include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-027');
print('\n* Power on the Card(ATR)');
reset();

Terminal_Transaction_Qualifiers = '00000000'
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

select_PBOC();
assertSW('9000');
response = send_GPO(CVN);
assertSW('9000');

response = send_GetData('9F17');
assertSW('9000');
value_9F17 = lookup_BER_TLV(response, '9F17', RETURN_VALUE);

for(i=0; i<value_9F17; i++){
	send_Verify('80', TEST_PLAIN_PIN_INVALID);	
}

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

response = send_GPO(CVN);
assertSW('9000');

valuse_77 = lookup_BER_TLV(response, "77", RETURN_VALUE);
if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(Track2_Equivalent_Data == "") error("Track 2 Equivalent Data doesn't exist");

//checkIAD('07010103A0400001', '', 8);
//parse_IAD(Issuer_Application_Data);
//check_IAD(Issuer_Application_Data, 'A04000');

if(AC == "") error("Application Cryptogram doesn't exist");
assertEquals(lookup_BER_TLV(valuse_77, "5F34", RETURN_VALUE), "01") 

print("[User Check] Compare and verify the card response data for the tags '9F6C', '82', '57' and '5F34' with the card image personalization data");
validate_AC(AC);

pinUnblock();

function pinUnblock(){
	init(CT_PORT, CT_READER);	
	print('\n* PIN Unblock');
	print("***********************CAUTION!!!************************");
	print("Please remove active card and insert contact card");
	print("*********************************************************");	
	pause();
	reset();
	
	Terminal_Transaction_Qualifiers = '00000000';
	
	select_PBOC();
	//assertSW('6283');

	send_GPO('831F015601000000000000015642616E6B436172645465737443656E7465722020');
	assertSW('9000');

	send_GEN_AC_1(ARQC, TEST_CDOL1);
	assertSW('9000');

	send_ExternalAuth();
	assertSW('9000');

	send_AppUnblock();
	assertSW('9000');
	
	init(CL_PORT, CL_READER);		
	print("***********************CAUTION!!!************************");
	print("Please remove active card and insert contactless card");
	print("*********************************************************");	
	pause();
	reset();
}
