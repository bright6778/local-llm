/*******************************************
 Test Name  : CheckNotSupportMSD
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.026.00.00
 Card Conf  : [MSD] supported
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-013');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

send_GPO(CVN);
assertSW('9000');

AIP_BYTE2 = parseInt(AIP.substring(2,4), 16);
if((AIP_BYTE2 & BIT_MASK_8) == BIT_MASK_8)
	error("AIP byte 2 bit 8 (MSD supported) shall be '0'.");

