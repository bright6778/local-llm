/*******************************************
 Test Name  : Verify Command 
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CP.004.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-UNDOC-004-2CP.004.00.00');

print('\n* Power on the Card(ATR)');
reset();

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

print("\n* Case 01 : ");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
send_GetChallenge();
send_Verify("80", TEST_PLAIN_PIN);
SW = getSW();
if(SW == "9000") error("SW shall be different form '9000' for VERIFY command");


print("\n* Case 02 : ");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
GPOresponse = send_GPO(CVN);
assertSW("9000");
send_Verify("80", TEST_PLAIN_PIN); 
SW = getSW();
if(SW == "9000") error("SW shall be different form '9000' for VERIFY command");

