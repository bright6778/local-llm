/* Application Block */

include("_PBOC_COMMON.js");

print("ABS014");

print("\n* Transaction 1");
include("pboc_CLN001.js");

print('\n* Transaction 2');
reset();

select_PBOC();
send_GPO(TEST_PDOL_DATA);
assertSW('6985');
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('6985');
send_ExternalAuth();
send_AppUnblock();
assertSW('6985');

print('\n* Transaction 3');
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('6283');
send_GPO(TEST_PDOL_DATA);
assertSW('6985');
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('6985');