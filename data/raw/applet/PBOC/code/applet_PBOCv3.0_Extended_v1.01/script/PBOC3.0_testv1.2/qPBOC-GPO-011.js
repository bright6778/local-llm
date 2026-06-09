/*******************************************
 Test Name  : CheckNotSupportCDA
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.024.00.00
 Card Conf  : [CDA] not supported
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-011');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

send_GPO(CVN);
assertSW('9000');

AIP_BYTE1 = parseInt(AIP.substring(0,2), 16);
if((AIP_BYTE1 & BIT_MASK_2) == BIT_MASK_2)
	error("AIP byte 1 bit 2 shall be '0'.");

