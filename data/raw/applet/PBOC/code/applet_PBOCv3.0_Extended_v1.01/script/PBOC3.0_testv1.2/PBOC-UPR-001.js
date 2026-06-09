/*******************************************
 Test Name  : Update Record command (UPR 001)
 Objective  : UPDATE RECORD command is successful with a valid MAC for a successful
online approval.
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");
print("\PBOC-UPR-001");
print("\n* Transaction 1");
include("pboc_CLN001.js");


print("\n* Transaction 2");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
send_UpdateRecord(parseInt('04', 16), parseInt(1,16),'02');
assertSW('9000');

print("\n* Transaction 3");
include("pboc_CLN001.js");

response = send_ReadRecord(parseInt('04', 16), parseInt(1,16));
print("\n* response :::::: " + response);

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
send_UpdateRecord(parseInt('04', 16), parseInt(1,16),'03');
assertSW('9000');

//send('04DC01241270089F1401029F230107');
//assertSW('9000');