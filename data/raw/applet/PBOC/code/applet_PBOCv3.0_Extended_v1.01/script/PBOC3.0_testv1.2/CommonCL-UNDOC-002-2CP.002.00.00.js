/*******************************************
 Test Name  : INTERNAL AUTHENTICATE Command
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CP.002.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-UNDOC-002-2CP.002.00.00');

print('\n* Power on the Card(ATR)');
reset();

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

print("\n* Case 01 : ");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
send("0088000004" + DDOL_Data + "00"); //Internal Authentication
SW = getSW();
if(SW == "9000") error("SW shall be dfferent from '9000' for INTERNAL AUTHENTICATE command");

print("\n* Case 02 : ");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
GPOresponse = send_GPO(CVN);
assertSW("9000");
send("0088000004" + DDOL_Data + "00"); //Internal Authentication 
SW = getSW();
if(SW == "9000") error("SW shall be dfferent from '9000' for INTERNAL AUTHENTICATE command");
