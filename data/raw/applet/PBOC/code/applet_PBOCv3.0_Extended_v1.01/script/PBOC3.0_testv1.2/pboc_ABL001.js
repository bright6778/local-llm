include("_PBOC_COMMON.js");

print('\n* Test Case : ABL001');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_CLN001_26A2.js");

print("\n* Transaction 3");
include("pboc_CLN001_26A3.js");

print("\n* Transaction 4");
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

print("\n* Transaction 5");
reset();
select(pboc2_aid);
assertSW('6283');

print("\n* Transaction 6");
reset();
select(pboc3_aid);
assertSW('6283');
