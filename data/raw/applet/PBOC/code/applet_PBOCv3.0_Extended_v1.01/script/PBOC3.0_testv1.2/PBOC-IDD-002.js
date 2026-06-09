/*******************************************
 Test Name  : Issuer Discretionary Data (IDD) (IDD 002)
 Objective  : The Issuer Discretionary Data not returned when an online transaction is
requested, but then forced to decline by the Card.

transaction 2에서 CVR 값 상이 

test cvr : 03864000
my   cvr : 03840000
* Check CVR......Failed !


*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-003_forIDD.js");


TEST_PDOL_DATA_ECindicator0 = "831F99990000000000020001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000020001569988776655443322110099887766554433221100";
TEST_CDOL1_DATA =                       "0000000002000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA =                   "30300000000002000000000000000156000000000001560001251647210011223344";


print('\n* Test Case : IDD 002');

print("\n* Transaction 1");
print('\n* Test Case : CLN001');
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

print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send('0020008008241235FFFFFFFFFF');
assertSW('9000');
send('0020008008241235FFFFFFFFFF');
assertSW('9000');
send('0020008008241235FFFFFFFFFF');
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000')

check_CVR("03864000");



print("\n* Transaction 3");
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000')
check_CVR("03804000");
send_ExternalAuth();
assertSW('9000');
send_PinUnblock();
assertSW('9000');

