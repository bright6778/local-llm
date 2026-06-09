/*******************************************
 Test Name  : Non matching contactless transadction path
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.010.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-CTH-001-2CD.010.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

Terminal_Transaction_Qualifiers = "00000000";
GPOresponse = send_GPO(CVN);
assertSW("6700");