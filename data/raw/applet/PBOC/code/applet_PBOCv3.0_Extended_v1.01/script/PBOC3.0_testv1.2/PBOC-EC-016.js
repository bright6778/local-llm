/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 016)
 Objective  : The Card accepts a PUT DATA & GET DATA commands on the VLP Single
Transaction Limit.
*******************************************/

print('\n* Test Case : VLP016');

include("_PBOC_COMMON.js");

//constant
TEST_PDOL_DATA_ECindicator0 = "831F99990000000000020001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000020001569988776655443322110099887766554433221100";
TEST_CDOL1_DATA 						=	"0000000002000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA 						= "30300000000002000000000000000156000000000001560001251647210011223344";


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
send_PutData('9F79','000000000500');

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');

var response = send_GetData('9F78');

if (response != '9F7806000000000300') error ('GetData is error');
     
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');
send_PutData('9F78','000000000100');
assertSW('9000');


check_CID("40");
check_CVR("03640010");

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
var response = send_GetData('9F78');
 if (response != '9F7806000000000100') error ('GetData is error');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');
send_PutData('9F78','000000000300');

check_CID("40");
check_CVR("03640010");