/*******************************************
 Test Name  : WithQPBOCpath
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.009.00.00
 Card Conf  : N/A
 Condition  : LT sends a SELECT command on PPSE
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CTH-003');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('9000');

