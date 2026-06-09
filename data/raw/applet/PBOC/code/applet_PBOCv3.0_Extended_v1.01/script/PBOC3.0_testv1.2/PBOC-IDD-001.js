/*******************************************
 Test Name  : Issuer Discretionary Data (IDD) (IDD 001)
 Objective  : The Issuer Discretionary Data is only returned in the first GENERATE AC of
a transaction attempts to go online.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : IDD 001');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);

assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000')

validate_IAD_MAC(Issuer_Application_Data);

send_ExternalAuth();
assertSW('9000');

send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");

check_CVR("03640000");

print("\n* Transaction 3");
include("pboc_ApprovedOffline.js");

check_CVR("03940000");

print("\n* Transaction 4");
include("pboc_DeclinedOffline.js");
check_CVR("03840000");


/* T - 80AE8000200000000010000000000000000156000000000001560001251647210011223344
C - 8013800002C949020FD8AFE21907010103A40000019000

T - 80AE8000200000000010000000000000000156000000000001560001251647210011223344
C - 8013800002C949020FD8AFE21907010103A40000019000

//IDD = IDD.substring(4,IDD.length); 
print("*** IDD : " + IDD);
if(IDD.length != "") error('data is error');
// validate_IAD_MAC(IDD);
*/