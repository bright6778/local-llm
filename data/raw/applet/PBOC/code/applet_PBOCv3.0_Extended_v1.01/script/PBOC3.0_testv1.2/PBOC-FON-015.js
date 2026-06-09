include("_PBOC_COMMON.js");

print('\n* Test Case : FON015');

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
send_ExternalAuth_Invalid();
assertSW('6300');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');

send_GEN_AC_2(TC, TEST_CDOL2_Y3);
assertSW('9000');
check_CID('00');
check_CVR('03259800');