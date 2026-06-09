include("_PBOC_COMMON.js");

print('\n* Test Case : FON007');

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
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

print("\n* Transaction 5");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

print("\n* Transaction 6");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

print("\n* Transaction 7");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

print("\n* Transaction 8");
reset();
select_PBOC();
print("CVR1 : "+ CVR );
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
print("CVR2 : "+ CVR );
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
print("CVR3 : "+ CVR );
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
print("CVR4 : "+ CVR );
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);

assertSW('9000');
check_CID('00');
check_CVR('03258000');