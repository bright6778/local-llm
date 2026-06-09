include("_PBOC_COMMON.js");

print('\n* Test Case : ABL007');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_CLN001_26A2.js");

print("\n* Transaction 3");
include("pboc_CLN001_26A3.js");

print("\n* Transaction 4");
reset();
select(pboc_aid);
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');
send_AppBlock();
assertSW('9000');

print("\n* Transaction 5");
reset();
select(pboc2_aid);
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');
send_AppBlock();
assertSW('9000');

print("\n* Transaction 6");
reset();
select(pboc_aid);
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_AppUnblock();
assertSW('9000');

print("\n* Transaction 7");
reset();
select(pboc_aid);
assertSW('9000');

print("\n* Transaction 8");
reset();
select(pboc2_aid);
assertSW('6283');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_AppUnblock();
assertSW('9000');