/*******************************************
 Test Name  : qPBOC Online transaction(No CVM Required) - Non-matching currency
 Card Image : PBOC-PSO-041
 Reference  : VCPS 2CE.009.00.00
 Card Conf  : [Application Currency Code]
              [Card Transaction Qualifiers]
              [Card Additional Processes] 
                - Byte 1 bit 3 = 0 'Offline Transaction in non-matching currency'
                - Byte 3 bit 5 = 1 'Signature Supported'
                - Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                - Byte 3 bit 7 = 1 'Online PIN Supported for non-matching currency'                 
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-009');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

response = send_GPO(CVN);
assertSW('9000');

assertEquals(response.substring(0, 2), '77');
reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(Track2_Equivalent_Data == "") error("Track 2 Equivalent Data doesn't exist");

//checkIAD("07010103A0000001", "07011103A0000001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A00000');

if(AC == "") error("Application Cryptogram doesn't exist");

assertEquals(lookup_BER_TLV(reponse, "5F34", RETURN_VALUE), "01");

validate_AC(AC);