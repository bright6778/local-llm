/*******************************************
 Test Name  : Card Authentication Related Data
 Card Image : PBOC-PSO-040
 Reference  : VCPS 2CD.013.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-REQ-001-2CO.001.00.00');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

GPO = send_GPO(CVN);
assertSW('9000');


Read_Record();

//if(CARD == "") error("Card Authentication Related Data('9F69') in AFL should be present");

validate_SDAD_forfDDA(SDAD);
