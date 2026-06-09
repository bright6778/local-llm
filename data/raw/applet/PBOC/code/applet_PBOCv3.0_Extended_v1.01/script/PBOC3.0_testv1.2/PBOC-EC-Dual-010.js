/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 010)
 Objective  : EC online transaction can reset the pin counter


*******************************************/
include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 010');

print("\n* Transaction 1");
print('\n* Test Case : CLN001');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');

print("\n* Transaction 2");
reset();
select_PBOC();
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN_INVALID);
send_Verify('80', TEST_PLAIN_PIN_INVALID);

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
check_CID('80');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');
check_CID('40');
check_CVR("03640000");

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN_INVALID);
assertSW('63C2'); // 63C0
