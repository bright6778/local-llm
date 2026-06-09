/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 006)
 Objective  : A VLP card processes a transaction as VSDC when Transaction Currency
Code is not equal to Application Currency Code.

*******************************************/

print('\n* Test Case : VLP006');

include("_PBOC_COMMON.js");

print("\n* Transaction 1");
TEST_PDOL_DATA1 = "831F99990000000000020001569988776655443322110099887766554433221100";

print('\n* Test Case : CLN001');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

print("\n* Transaction 2");
TEST_PDOL_DATA1 = "831F99990100000000020001569988776655443322110099887766554433221100";
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA1);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

check_CVR("03640000");

