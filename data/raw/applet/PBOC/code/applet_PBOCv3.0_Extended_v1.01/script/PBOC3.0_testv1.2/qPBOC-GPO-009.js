/*******************************************
 Test Name  : CheckSupportDDA
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.022.00.00
 Card Conf  : [fDDA] supported
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-009');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

response = send_GPO(CVN);
assertSW('9000');

if (AIP == '7000')
	print('\n AIP is correct!!');
else
	print('\n AIP is incorrect!!');