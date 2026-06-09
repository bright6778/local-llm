/*******************************************
 Test Name  : Issuer Authentication (IAU 110)
 Objective  : Verify the Card rejects an EXTERNAL AUTHENTICATE command when
the Card is blocked

// card block 나중에 테스트 
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");
include("pboc_CardBlockTest.js");

print('\n* Test Case : IAU 110');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
select(pse_aid);
assertSW('6A81');
//select_PBOC();
//assertSW('6A81');
send_GPO(TEST_PDOL_DATA);
send_GEN_AC_1(ARQC, TEST_CDOL1);
send_ExternalAuth();
assertSW('6A81');