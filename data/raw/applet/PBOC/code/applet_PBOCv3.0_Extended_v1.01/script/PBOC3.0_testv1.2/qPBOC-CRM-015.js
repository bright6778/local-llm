/*******************************************
 Test Name  : Card requests signature for decline qPBOC transaction (CVM required by Card)
 Card Image : PBOC-PSO-043
 Reference  : VCPS 2CE.015.00.00
 Card Conf  : [Application Currency Code]
              [Card CVM Limit]
              [Card Transaction Qualifier] 
                - Byte 1 bit 6 = 1 'Go Online if Offline Data Authentication Fails and Reader is online capable'
                - Byte 1 bit 5 = 1 'Terminate if Offline Data Authentication Fails and Reader supports contact VSDC'
			  [Card Additional Process] 
			  	- Byte 1 bit 8 = 1 'Low Value Check Supported'
			  	- Byte 1 bit 4 = 1 'PIN Tries Exceeded Check Supported'			  	
                - Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                - Byte 3 bit 5 = 1 'Signature supported'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-015');

print('\n* Power on the Card(ATR)');
reset();

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

////////////////////////// Case 01 //////////////////////////////
print('\n* Case 01: Matching cruurency and Amount, Authorized is greater than the Card CVM Limit');
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Card_CVM_Limit = send_GetData('9F6B');
assertSW('9000');
Card_CVM_Limit = lookup_BER_TLV(Card_CVM_Limit, '9F6B', RETURN_VALUE);
Amount_Authorised =  to_hex(to_val(Card_CVM_Limit) + 100);
while(Amount_Authorised.length < 12) Amount_Authorised = "0" + Amount_Authorised;

print("\nCard_CVM_Limit    : "+Card_CVM_Limit);
print("Amount Authorized : "+Amount_Authorised+'\n');
print("available funds : "+send_GetData('9F79'));

response = send_GPO(CVN);
assertSW('9000');

//checkIAD('0701010380200001','', 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '802000');

value_77 = lookup_BER_TLV(response, '77', RETURN_VALUE);
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);
if((CTQ_BYTE1 & BIT_MASK_7) == 0)
	error("The Card Transaction Qualifier byte 1 bit 7 shall be '1'.");
print("[User View] Verify Card Transaction Qualifiers (¡®9F6C¡¯) byte 1 bits 6 and 5 are remain unchanged");

//pause();

/////////////////////////// Case 02 //////////////////////////////
print('\n* Case 02: CVM Required by card for non-matching currency');
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Transaction_Currency_Code = Transaction_Currency_Code_Diff;
Amount_Authorised = "000010000000";

print("CVN :" + CVN);
response = send_GPO(CVN);
assertSW('9000');

//checkIAD('0701010380000001', 8)
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '800000');

value_77 = lookup_BER_TLV(response, '77', RETURN_VALUE);
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);
if((CTQ_BYTE1 & BIT_MASK_7) == 0)
	error("The Card Transaction Qualifier byte 1 bit 7 shall be '1'.");
print("[User View] Verify Card Transaction Qualifiers (¡®9F6C¡¯) byte 1 bits 6 and 5 are remain unchanged");

/////////////////////////// Case 03 //////////////////////////////
print('\n* Case 03: CTQ bits reset');
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

response = send_GPO(CVN);
assertSW('9000');

//checkIAD('0701010390000001', '', 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

value_77 = lookup_BER_TLV(response, '77', RETURN_VALUE);
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);
if((CTQ_BYTE1 & BIT_MASK_7) == BIT_MASK_7)
	error("The Card Transaction Qualifier byte 1 bit 7 shall be '0'.");
if((CTQ_BYTE1 & BIT_MASK_8) == BIT_MASK_8)
	error("The Card Transaction Qualifier byte 1 bit 8 shall be '0'.");

print("[User View] Verify Card Transaction Qualifiers (¡®9F6C¡¯) byte 1 bits 6 and 5 are remain unchanged");


