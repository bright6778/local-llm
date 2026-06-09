/*******************************************
 Test Name  : PUT DATA on the Consecutive Transaction Limit (International) (PLI 001)
 Objective  : PUT DATA command to the Consecutive Transaction Limit (International)
with a valid MAC is successful following an online approval.

*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-007.js");

var TEST_CDOL_CURRENCY_INTER = '0000000010000000000000000156000000000008410001251647210011223344';

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");
send_PutData("9F53", "03");
assertSW('9000');

check_CID("40");
check_CVR("03640000");



print("\n* Transaction 3");
include("pboc_CLN001.js");


print("\n* Transaction 4");

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
//send_GEN_AC_1(TC, TEST_CDOL1);
send_GEN_AC_1(TC, TEST_CDOL_CURRENCY_INTER);
assertSW('9000');
check_CID("40");
check_CVR("03940000");

print("\n* Transaction 5");
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
//send_GEN_AC_1(TC, TEST_CDOL1);
send_GEN_AC_1(TC, TEST_CDOL_CURRENCY_INTER);
assertSW('9000');
check_CID("40");
check_CVR("03940000");

print("\n* Transaction 6");
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
//send_GEN_AC_1(TC, TEST_CDOL1);
send_GEN_AC_1(TC, TEST_CDOL_CURRENCY_INTER);
assertSW('9000');

check_CID("40");
check_CVR("03940000");

print("\n* Transaction 7");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

send_GEN_AC_1(TC, TEST_CDOL_CURRENCY_INTER);
assertSW('9000');
check_CID("80");
check_CVR("03A42000");

send_ExternalAuth();
assertSW('9000');

send_GEN_AC_2(TC, TEST_CDOL2_INTER);
assertSW("9000");
check_CID("40");
check_CVR("03642000");

send_PutData("9F53", "05");
assertSW('9000');
