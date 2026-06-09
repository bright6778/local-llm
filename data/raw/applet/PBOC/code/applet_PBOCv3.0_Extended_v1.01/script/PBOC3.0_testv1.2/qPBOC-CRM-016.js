/*******************************************
 Test Name  : Card requests signature when CVM required by online capable reader
 Card Image : PBOC-PSO-042-(for qPBOC-CRM-016,017)
 Reference  : VCPS 2CE.016.00.00
 Card Conf  : [Application Currency Code]
              [Card CVM Limit]
              [Card Transaction Qualifier] 
                - Byte 1 bit 6 = 1 'Go Online if Offline Data Authentication Fails and Reader is online capable'
                - Byte 1 bit 5 = 1 'Terminate if Offline Data Authentication Fails and Reader supports contact VSDC'
			  [Card Additional Process] 
			  	- Byte 1 bit 8 = 1 'Low Value Check Supported'
			  	- Byte 1 bit 4 = 1 'PIN Tries Exceeded Check Supported'
			  	- Byte 1 bit 2 = 1 'Card Prefers Contact VSDC for online]
			  	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  	- Byte 3 bit 8 = 1 'Online PIN supported for matching currency'
			  	- Byte 3 bit 7 = 1 'Online PIN supported for non-matching currency'		  	
                - Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                - Byte 3 bit 5 = 1 'Signature supported'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-016');


print('\n* Power on the Card(ATR)');
reset();


/////////////////////// CASE 01 ///////////////////////////
print('\n* Case 01: Matching currency and Amount, Authorized is greater than the Card CVM Limit');
print("\n* Transaction 1");
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

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);

response = send_GPO(CVN);
assertSW('9000');

//checkIAD("07010103A0200001", "", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A02000');

value_77 = lookup_BER_TLV(response, "77", RETURN_VALUE);
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);
if((CTQ_BYTE1 & BIT_MASK_7) == 0) error("The Card Transaction Qualifier byte 1 bit 7 shall be '1'.");

print("[User View] Verify Card Transaction Qualifiers (¡®9F6C¡¯) byte 1 bits 6 and 5 are remain unchanged");


/////////////////////// CASE 02 ///////////////////////////
print('\n* Case 02: CVM Required by card for non-matching currency');
print("\n* Transaction 1");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Transaction_Currency_Code = Transaction_Currency_Code_Diff;

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);

response = send_GPO(CVN);
assertSW('9000');

//checkIAD("07010103A0000001", "", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A00000');

value_77 = lookup_BER_TLV(response, "77", RETURN_VALUE);
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);
if((CTQ_BYTE1 & BIT_MASK_7) == 0) error("The Card Transaction Qualifier byte 1 bit 7 shall be '1'.");

print("[User View] Verify Card Transaction Qualifiers (¡®9F6C¡¯) byte 1 bits 6 and 5 are remain unchanged");


/////////////////////// CASE 03 ///////////////////////////
print('\n* Case 03: CTQ bits reset');
print("\n* Transaction 1");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Transaction_Qualifiers = '00000000';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('9000');

//checkIAD("0701010390000001", "", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '000000');

value_77 = lookup_BER_TLV(response, "77", RETURN_VALUE);
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);
if((CTQ_BYTE1 & BIT_MASK_7) == BIT_MASK_7) error("The Card Transaction Qualifier byte 1 bit 7 shall be '0'.");

print("[User View] Verify Card Transaction Qualifiers (¡®9F6C¡¯) byte 1 bits 6 and 5 are remain unchanged");

