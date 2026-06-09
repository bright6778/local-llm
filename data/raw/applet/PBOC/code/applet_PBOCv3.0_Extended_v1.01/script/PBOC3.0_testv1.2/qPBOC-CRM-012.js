/*******************************************
 Test Name  : qPBOC Online transaction(CVM Required) - matching currency
 Card Image : PBOC-PSO-041
 Reference  : VCPS 2CE.012.00.00
 Card Conf  : [Application Currency Code]
              [Card Transaction Qualifiers]
              [Card Additional Processes] 
                - Byte 3 bit 5 = 1 'Signature supported'
                - Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                - Byte 3 bit 7 = 1 'Online PIN Supported for non-matching currency'                 
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-012');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');


Card_CVM_Limit = send_GetData('9F6B');
assertSW('9000');

Amount_Authorised =  parseInt(Card_CVM_Limit, 10) + 100 + "";
while(Amount_Authorised.length < 12) Amount_Authorised = "0" + Amount_Authorised;


BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

response = send_GPO(CVN);
assertSW('9000');

assertEquals(response.substring(0, 2), '77');
reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(Track2_Equivalent_Data == "") error("Track 2 Equivalent Data doesn't exist");

//checkIAD('07010103A0000001', '07011103A0000001', 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A00000');

if(AC == "") error("Application Cryptogram doesn't exist");

var value_77 = lookup_BER_TLV(response, "77", RETURN_VALUE);
assertEquals(lookup_BER_TLV(value_77, "5F34", RETURN_VALUE), "01");
CTQ_BYTE1 =  parseInt(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE).substring(0, 2), 16);

if((CTQ_BYTE1 & BIT_MASK_7) == 0)
	error("The Card Transaction Qualifier byte 1 bit 7 shall be '1'.");

validate_AC(AC);