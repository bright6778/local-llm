/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 05)
 Objective  : A EC card processes a transaction as D/C when Amount Authorized > EC SINGLE TRANSACTION LIMIT.

*******************************************/
include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 005');

print("\n* Transaction 1");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');
send_PutData('DF78','000000040000');
assertSW('9000');

print("\n* Transaction 2");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
var AIP = response.substr(4,4);
if(AIP != '7C00')
 error('the transaction is not DC');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');

check_CVR("03642010");