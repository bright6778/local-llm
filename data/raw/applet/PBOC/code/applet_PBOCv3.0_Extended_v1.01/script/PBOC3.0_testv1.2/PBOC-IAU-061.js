/*******************************************
 Test Name  : Issuer Authentication (IAU 061)
 Objective  : The Card rejects a second EXTERNAL AUTHENTICATE command with a
correct ARPC, and sets the Issuer Authentication Failure Indicator.


*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : IAU 061');

print("\n* Transaction 1");
include("pboc_CLN001.js");


print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000')


check_CID("80");
check_CVR("03A40000");


send_ExternalAuth();
assertSW('9000');
send_ExternalAuth();
assertSW('6985');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');

check_CID("00");
check_CVR("032C0000"); // spec 과 다름 fail 났으면, 2바이트 4번째 bit 1로 설치해야 되므로, 2C 결과가 맞는것으로 판단됨.


print("\n* Transaction 3");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

check_CID("80");
check_CVR("03A48800");


send_ExternalAuth();
send_GEN_AC_2(TC, TEST_CDOL2);

check_CID("40");
check_CVR("03648800");
