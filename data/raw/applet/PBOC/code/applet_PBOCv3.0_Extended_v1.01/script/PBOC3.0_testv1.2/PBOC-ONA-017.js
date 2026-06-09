include("_PBOC_COMMON.js");

print('\n* Test Case : ONA017');

print("\n* Transaction 1");
include("pboc_CLN001.js");

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

check_CID('80');
check_CVR('03A40000');

// invalid ARPC & ARC '3135'
send_ExternalAuth_ARC_InvalidARPC('3135');
send_GEN_AC_2(TC, '31350000000010000000000000000156000000000001560001251647210011223344');
assertSW('9000');

check_CID('00');
check_CVR('032C0000');