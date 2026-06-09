/*******************************************
 Test Name  : GPO Command - Terminal Tranasction Qualifiers RFU bits
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.004.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-GPO-003-2CD.004.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');


//////////////////// Case 01 ////////////////////
print("\n* Case 01 : Terminal Transaction Qualifier RFU bits value set to '0'");
Terminal_Transaction_Qualifiers = "28000000";
send_GPO(CVN);
assertSW("9000");


//////////////////// Case 02 ////////////////////
print("\n* Case 02 : Terminal Transaction Qualifier RFU bits value set to '1'");
Terminal_Transaction_Qualifiers = "293FFFFF";
send_GPO(CVN);
assertSW("9000");