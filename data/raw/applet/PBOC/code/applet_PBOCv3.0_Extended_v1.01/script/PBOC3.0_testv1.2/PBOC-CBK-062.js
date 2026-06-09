include("_PBOC_COMMON.js");

print('\n* Test Case : CBK062');

// preparation
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

// card block (long MAC length)
send("8416000009" + "112233445566778899");

assertSW('6700');