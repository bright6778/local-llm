/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 001)
 Objective  : Successfully process a EC transaction as EC Terminal Support Indicator = '01'.
*******************************************/
include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 001');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA);
assertSW('9000');
check_CVR("03641000");

print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL );
assertSW('9000');
var AIP = response.substr(4,4);
print(AIP);
if(AIP != '7800')
 error('the transaction is not EC');
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1_DATA_DUAL);
assertSW('9000')
check_CVR("03900000");
