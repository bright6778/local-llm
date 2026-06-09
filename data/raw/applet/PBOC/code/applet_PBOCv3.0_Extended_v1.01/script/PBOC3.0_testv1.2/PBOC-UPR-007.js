/*******************************************
 Test Name  : Update Record command (UPR 007)
 Objective  : Perform an UPDATE RECORD command on the LCOL without a MAC after
online approval. Issuer Authentication was successfully performed.

Before = 03
After = 03
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print("\n* Transaction 1");
include("pboc_CLN001.js");


print("\n* Transaction 2");
reset();
select_PBOC();
assertSW("9000");

response1 = send_ReadRecord(parseInt('04', 16), parseInt(1,16));
print("\n* response :::::: " + response1);

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
send_UpdateRecord_noMAC(parseInt('04', 16), parseInt(1,16),'04');

print("\n* Transaction 3");
include("pboc_CLN001.js");


response2 = send_ReadRecord(parseInt('04', 16), parseInt(1,16));
print("\n* response :::::: " + response2);

if( response1 != response2 ) error('no MAC is Success');
