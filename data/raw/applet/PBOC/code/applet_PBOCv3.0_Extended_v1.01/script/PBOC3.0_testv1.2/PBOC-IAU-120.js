/*******************************************
 Test Name  : Issuer Authentication (IAU 120)
 Objective  : Verify the Card rejects an EXTERNAL AUTHENTICATE command when
the Card is blocked

@visa 테스트 가이드로 만들었지만  pboc 테스트 기반이라, 6E00,6D00이 맞음
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : IAU 120');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
select('315041592E5359532E4444463031');
send_GPO(TEST_PDOL_DATA);
assertSW('6D00');
send_GEN_AC_1(ARQC, TEST_CDOL1);
send_ExternalAuth();
assertSW('6E00');