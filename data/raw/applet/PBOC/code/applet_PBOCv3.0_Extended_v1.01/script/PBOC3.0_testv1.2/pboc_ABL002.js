include("_PBOC_COMMON.js");

print('\n* Test Case : ABL001');

print("\n* Transaction 1");
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

print("\n* Transaction 2");
reset();
select(pboc2_aid);
assertSW('9000');

print("\n* Transaction 3");
reset();
select(pboc3_aid);
assertSW('9000');
