/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 015)
 Objective  : Verify the Card accepts a PUT DATA command on the VLP Funds Limit.


*******************************************/

print('\n* Test Case : VLP015');

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

if(AIP != '5C00') error('AIP is error');


var a = send_GetData('9F77');


if (a != '9F7706000000000500') error('getdata is error');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');
send_PutData('9F77','000000000600');


print("\n* Transaction 2");
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
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA);
assertSW('9000');

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

print("\n* Transaction 5");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA);
assertSW('9000');


print("\n* Transaction 6");
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
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');
send_PutData('9F0F','000000000600');

check_CVR("03642000");
