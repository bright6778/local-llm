include("_PBOC_COMMON.js");


print('\n* Test Case : FON023');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

send_GEN_AC_1(ARQC, TEST_CDOL1_INTER);
assertSW('9000');
check_CID('80');
check_CVR('03A43000');

send_GEN_AC_2(AAC, TEST_CDOL2_Z3_INTER);
assertSW('9000');
check_CID('08');
check_CVR('03253000');