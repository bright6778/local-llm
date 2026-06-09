include("_PBOC_COMMON.js");

print('\n* Test Case : CBS010');

// Transaction 1
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

// Transaction 2
print("\n* Transaction 2");
reset();
select_PBOC();
send_GPO(TEST_PDOL_DATA);
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(ARQC, TEST_CDOL1);
send_ExternalAuth();
send_CardBlock();
assertSW('9000');

// Transaction 3
print("\n* Transaction 3");
reset();
select_PSE();
assertSW('6A81');
select_PBOC();
assertSW('6A81');