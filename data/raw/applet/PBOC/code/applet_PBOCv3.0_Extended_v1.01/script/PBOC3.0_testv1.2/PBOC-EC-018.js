/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 018)
 Objective  : A VLP transaction is not processed for a New Card.


test cvr : 03641000
my   cvr : 03640000
* Check CVR......FAIL [at _PBOC_COMMON.js (963, 0)]
Failed !

*******************************************/

print('\n* Test Case : VLP018');

include("_PBOC_COMMON.js");

TEST_PDOL_DATA_ECindicator0 = "831F99990000000000020001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000020001569988776655443322110099887766554433221100";
TEST_CDOL1_DATA 						=	"0000000002000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA 						= "30300000000002000000000000000156000000000001560001251647210011223344";

print("\n* Transaction 1");

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
send_GEN_AC_2(TC, TEST_CDOL2_DATA );
assertSW('9000');

check_CVR("03640000");