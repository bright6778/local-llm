/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 013)
 Objective  : A VLP card increments the VLP Available Funds by the Amount Authorized
when the VLP transaction is declined.A VLP card decrements VLP Available Funds during Initiate Application
Processing.
*******************************************/

print('\n* Test Case : VLP013');

//constant
TEST_PDOL_DATA_ECindicator0 = "831F99990000000000020001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000020001569988776655443322110099887766554433221100";
TEST_CDOL1_DATA =                       "0000000002000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA =                   "30300000000002000000000000000156000000000001560001251647210011223344";




include("_PBOC_COMMON.js");

print("\n* Transaction 1");

print('\n* Test Case : CLN001');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');

print("\n* Transaction 2");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA);
assertSW('9000');

check_CVR("03940000");

print("\n* Transaction 3");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');

check_CVR("03A40000");

send_GEN_AC_2(TC, TEST_CDOL2_Y3);
assertSW('9000');

check_CVR("03650000");

print("\n* Transaction 4");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA);
assertSW('9000');

check_CVR("03A48000");

print("\n* Transaction 5");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');

check_CVR("0364A000");