/*******************************************
 Test Name  : Issuer Discretionary Data (IDD) (IDD 005)
 Objective  : The Issuer Discretionary Data provides an accurate accounting of both the
VLP Available Funds and Cumulative Total Transaction Amount.
*******************************************/

include("_PBOC_COMMON.js");

//constant
TEST_PDOL_DATA_ECindicator0 = "831F99990000000000020001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000020001569988776655443322110099887766554433221100";
TEST_CDOL1_DATA =                       "0000000002000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA =                   "30300000000002000000000000000156000000000001560001251647210011223344";

print('\n* Test Case : IDD 005');

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
print('\n* Power on the Card(ATR)');
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
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA);
assertSW('9000');


check_CVR("03940000");


print("\n* Transaction 4");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA);
assertSW('9000');


check_CVR("03940000");

print("\n* Transaction 5");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000')
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');

check_CVR("03642000"); //pboc 에서는 3번째 바이트 00