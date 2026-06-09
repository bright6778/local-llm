/*******************************************
 Test Name  : GET CHALLENGE Command
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CP.001.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-UNDOC-001-2CP.001.00.00');

print('\n* Power on the Card(ATR)');
reset();

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

print("\n* Case 01 : ");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
response = send_GetChallenge();
SW = response.substring(response.length-4, response.length); 
if(SW == "9000") error("SW shall be form '9000' for GET CHALLENGE command");

print("\n* Case 02 : ");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');
GPOresponse = send_GPO(CVN);
assertSW("9000");
response = send_GetChallenge();
SW = response.substring(response.length-4, response.length); 
if(SW == "9000") error("SW shall be form '9000' for GET CHALLENGE command");
