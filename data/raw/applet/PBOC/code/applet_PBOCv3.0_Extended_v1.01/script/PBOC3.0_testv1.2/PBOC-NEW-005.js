/*******************************************
 Test Name  : Read Other Application Data (NEW 005)
 Objective  :Verify for a new card, when If new card, transmit online in the ADA is
set, and Issuer Authentication is not performed as it is not supported, and
the transaction is declined online, that the Card does not update the LOATC.
Verify the Card request next transaction to go online and sets New card in
the CVR.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 005');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW("9000");


print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');


if(CVR.substring(2,3) != "A" || CVR.substring(4,6) & 0x10 != 0x00)
	error("* Check CVR ... FAIL");
else
	print("* Check CVR ... PASS");

check_CID("80");
check_CVR("03A41000");

