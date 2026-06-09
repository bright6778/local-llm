/*******************************************
 Test Name  : qVSDC Low Value Check - Offline approval
 Card Image : PBOC-PSO-037-(for qPBOC-LVC-004, 008)
 Reference  : VCPS 2CF.008.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 8 = 1 'Low Value Check Support'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [Available Offline Spending Amount '9F5D'] personalize
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVC-008');

print('\n* Power on the Card(ATR)');
reset();

//////////////////////////// case 01 /////////////////////////////
print("\n* Case 01: Amount, Authorised (10) < VLP Available Funds and < VLP Single Transaction Limit");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
VLP_prior = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

Amount_Authorised = "000000001000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_after = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
check_result();

checkIAD("0701010390000001", "0701110390000001", 8)

//if(SDAD == "" || SDAD == null) error("Signed Dynamic Application Data doesn't exist");
//if(SDAD.length != 288) error("failed verify '9F4B' tag length is coded in two bytes ('81 80')");
//validate_SDAD_forfDDA(SDAD);

if(parseInt(VLP_after, 10) != parseInt(VLP_prior, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify that VLP Available Funds received for GET DATA (after GPO command) = VLP Available Funds received for GET DATA (prior to GPO) - Amount, Authorised");


//////////////////////////// case 02 /////////////////////////////
print("\n* Case 02: Amount, Authorised (1790) </= VLP Available Funds and < VLP Single Transaction Limit");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
VLP_prior = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

Amount_Authorised = "000000001000"; //Image에 맞게 조절한 값
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_after = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

check_result();

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);

checkIAD("0701010390000001", "0701110390000001", 8)

//if(SDAD == "") error("Signed Dynamic Application Data doesn't exist");
//if(SDAD.length != 288) error("failed verify '9F4B' tag length is coded in two bytes ('81 80')");
//validate_SDAD_forfDDA(SDAD);

if(parseInt(VLP_after, 10) != parseInt(VLP_prior, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify that VLP Available Funds received for GET DATA (after GPO command) = VLP Available Funds received for GET DATA (prior to GPO) - Amount, Authorised");


//////////////////////////// case 03 /////////////////////////////
print("\n* Case 03: Amount, Authorised (10) < VLP Available Funds and < VLP Single Transaction Limit");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
VLP_prior = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

Amount_Authorised = "000000001000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_after = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

check_result();
value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);

checkIAD("0701010380200001", "0701110380200001", 8)

if(lookup_BER_TLV(value_77, "5F34", RETURN_VALUE) == "") error("Application PAN Sequence Number doesn't exist");
if(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE) == "") error("Card Transaction Qualifier doesn't exist");

assertEquals(VLP_after, "000000000000");


function check_result(){
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	
	validate_AC(AC);
	print("[User Check] Compare and verify the card response data for the tags '57' with the card image personalization data");
	//pause();
}

