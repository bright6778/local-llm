/*******************************************
 Test Name  : Terminate qPBOC transaction - Reader required CVM
 Card Image : PBOC-PSO-037
 Reference  : VCPS 2CE.004.00.00
 Card Conf  : [CAP] byte 3 bit 5 = 0 'Signature not supported'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

//image 37 is CVN 17 CAP Byte3 bit5 0
//image 33 is CVN 10 CAP Byte3 bit5 0


print('\n* Test Case : qPBOC-CRM-004');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2); //Signature supported
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4); //Contactless qVSDC supported
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6); //Reader is offline only
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7); //Reader Required CVM

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
response = send_GPO(CVN);
assertSW('6985');