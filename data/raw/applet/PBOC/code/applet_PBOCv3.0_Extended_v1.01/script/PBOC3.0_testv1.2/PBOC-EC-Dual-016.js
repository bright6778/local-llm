/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 016)
 Objective  : 1.The Card accepts a PUT DATA & GET DATA commands on the EC DUAL SINGLE TRANSACTION LIMIT.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 016');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
var response = send_GetData('DF78');
 if (response != 'DF7806000000050000') error ('GetData is error');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
send_ExternalAuth();
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');
send_PutData('DF78','000000060000');
assertSW('9000');


print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
var AIP = response.substr(4,4);
if(AIP != '7800')
 error('the transaction is not DC');
var response = send_GetData('DF78');
 if (response != 'DF7806000000060000') error ('GetData is error');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
send_ExternalAuth();
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');
check_CID("40");
check_CVR("03640000");