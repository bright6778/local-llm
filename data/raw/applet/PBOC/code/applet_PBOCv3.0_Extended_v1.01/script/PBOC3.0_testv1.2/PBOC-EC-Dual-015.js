/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 015)
 Objective  : Verify the Card accepts a PUT DATA&GET DATA command on the EC DUAL BALANCE Limit & EC DUAL BALANCE .

*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 015');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);

send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');
send_PutData('DF79','000000300000');
//assertSW('6985');
sw = getSW();
if(sw != '6985' && sw != '6A80'){
		error('SW is wrong!!!');
}

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_NOT_SUPPORT_DUAL);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DUAL);
assertSW('9000');
check_CVR('03A42018');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DUAL);
assertSW('9000');
send_PutData('DF77','000000300000');
assertSW('9000');
send_PutData('DF79','000000300000');
assertSW('9000');
check_CVR('03642018');

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_DUAL);
assertSW('9000');
var AIP = response.substr(4,4);
if(AIP != '7800')
 error('the transaction is not EC');
var EC_DUAL_CURRENCY_BALANCE =send_GetData('DF79').substr(6,12);
if(EC_DUAL_CURRENCY_BALANCE != '000000300000')
 error('PUT DATA EC DUAL CURRENCY BALANCE IS FAILD');

var EC_DUAL_CURRENCY_BALANCE_LIMIT =send_GetData('DF77').substr(6,12);
if(EC_DUAL_CURRENCY_BALANCE_LIMIT != '000000300000')
 error('PUT DATA EC DUAL CURRENCY BALANCE IS FAILD');

send_GEN_AC_1(TC, TEST_CDOL1_DATA_DUAL);
check_CVR('03900000');
