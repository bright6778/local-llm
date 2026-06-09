include("_PBOC_COMMON.js");

var COM007_Result;

print('\n* Test Case : COM007');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
send_AppBlock();
assertSW('9000');
store_ATC();

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('6283');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');

check_CID("00");
check_ATC();
check_CVR("03840010");

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('6283');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');

assertEquals(CID, '00');
assertEquals(CVR, '03840010');

send_ExternalAuth();
assertSW('9000');
send_AppUnblock();
assertSW('9000');

