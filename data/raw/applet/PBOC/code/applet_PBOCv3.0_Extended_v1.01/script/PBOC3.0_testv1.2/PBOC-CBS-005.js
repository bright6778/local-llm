include("_PBOC_COMMON.js");

print('\n* Test Case : CBS005');

// Transaction 1
print("\n* Transaction 1");
include("pboc_CLN001.js");

// Transaction 2
print("\n* Transaction 2");
reset();
select_PBOC();
send_GPO(TEST_PDOL_DATA);
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(ARQC, TEST_CDOL1);
send_ExternalAuth_Invalid();
send_GEN_AC_2(TC, TEST_CDOL2);
send_CardBlock();
assertSW('6985');

// Transaction 3
print("\n* Transaction 3");
reset();
select_PSE();
assertSW('9000');
select_PBOC();
assertSW('9000');