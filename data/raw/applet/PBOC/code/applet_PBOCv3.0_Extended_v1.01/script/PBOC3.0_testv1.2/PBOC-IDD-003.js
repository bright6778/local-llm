/*******************************************
 Test Name  : Issuer Discretionary Data (IDD) (IDD 003)
 Objective  : The Issuer Discretionary Data is only returned in the first GENERATE AC of
a transaction attempts to go online.
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-029.js");


//constant
TEST_PDOL_DATA_ECindicator0 = "831F99990000000000100001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000100001569988776655443322110099887766554433221100";
TEST_CDOL1_DATA =                       "0000000010000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA =                   "30300000000010000000000000000156000000000001560001251647210011223344";

print('\n* Test Case : IDD 003');

print("\n* Transaction 1");
print('\n* Test Case : CLN001');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
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
send_GPO(TEST_PDOL_DATA);
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
send_GPO(TEST_PDOL_DATA);
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
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000')
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW("9000");

check_CVR("03640000");

