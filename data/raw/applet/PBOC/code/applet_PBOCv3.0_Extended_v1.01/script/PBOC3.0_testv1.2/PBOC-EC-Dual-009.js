/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 008)
 Objective  :A EC card processes a transaction as EC 
             when the PIN was fail but not exceed the limit  on a previous transaction.


*******************************************/
include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 009');

print("\n* Transaction 1");

print('\n* Test Case : CLN001');
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

print("\n* Transaction 2");
reset();
select_PBOC();
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN_INVALID);
send_Verify('80', TEST_PLAIN_PIN_INVALID);

//check_CID('80');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
var AIP = response.substr(4,4);
if(AIP != '7800')
 error('the transaction is not EC');
send_GEN_AC_1(TC, TEST_CDOL1_DATA_DUAL);
check_CID('40');
check_CVR("03900000");