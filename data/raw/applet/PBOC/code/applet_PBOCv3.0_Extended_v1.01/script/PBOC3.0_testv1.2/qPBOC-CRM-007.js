/*******************************************
 Test Name  : qPBOC Offline transaction - non-matching currency (offline Signature check)
 Card Image : PBOC-PSO-041
 Reference  : VCPS 2CE.007.00.00
 Card Conf  : [CAP] byte 3 bit 5 = 1 'Signature supported'
                    byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                    byte 3 bit 7 = 1 'Online PIN Supported for non-matching currency'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-007');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Transaction_Currency_Code = Transaction_Currency_Code_Diff;
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GetData('9F68');
assertSW('9000');
assertEquals(response, '9F680400007000');
Amount_Authorised = '000000000001';

response = send_GPO(CVN);
assertSW('9000');
reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

checkIAD("0701010380000001", "0701010380000001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '800000');

assertEquals(lookup_BER_TLV(response, "9F6C", RETURN_VALUE), "4000");
