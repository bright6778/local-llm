/*******************************************
 Test Name  : PBOC E-Cash Dual Currency (EC 003)
 Objective  : When the terminal support EC, but terminal currency is different with card currency and E-Cash dual currency the card processes 
              and the same as D/C currency '0000'
              the transaction as D/C.
              
              9F75 Cumulative Total Transaction Amount Limit (Dual Currency) is not personalized 
              so. Velocity Checking  Total Consecutive Offline International Transaction (based on currency) will be set in D/C transaction
check_CVR("03642000");
*******************************************/
include("_PBOC_COMMON.js");

print('\n* Test Case : EC-Dual 003');

print("\n* Transaction 1");
print('\n* Test Case : CLN001');
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

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
reponse = send_GPO(TEST_PDOL_DATA_EC_TERMINAL_SUPPORT_OTHER_CUARRY);
assertSW('9000');
var AIP = response.substr(4,4);
if(AIP != '7C00')
 error('the transaction is not DC');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA_DCurency);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA_DCurency);
assertSW('9000');
check_CVR("03642000");
