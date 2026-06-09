/*******************************************
 Test Name  : Terminate qPBOC transaction - non-matching currency
 Card Image : PBOC-PSE-041 
 Reference  : VCPS 2CE.005.00.00
 Card Conf  : [CAP] byte 3 bit 5 = 1 'Signature supported'
                    byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                    byte 3 bit 7 = 1 'Online PIN Supported for non-matching currency'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-005');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('6985');



