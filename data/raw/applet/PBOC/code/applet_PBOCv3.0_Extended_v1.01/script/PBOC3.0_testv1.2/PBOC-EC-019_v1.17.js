/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 019)
 Objective  : An online approval does not reset the VLP Available Funds when the
associated ADA bit is set, the resetting of the VLP Available Funds is based
on a successful PUT DATA.

transaction2에서 에러

* Check CID......PASS

test cvr : 03A40010
my   cvr : 03A40000
* Check CVR......FAIL [at _PBOC_COMMON.js (963, 0)]
Failed !
*******************************************/

/*******************************************
 Test Name  : Visa Low-value Payment Feature (VLP 020)
 Objective  : An invalid PUT DATA command fails to update the VLP Available Funds
             when the associated ADA bit is set.

*******************************************/

print('\n* Test Case : VLP019');

include("_PBOC_COMMON.js");

TEST_PDOL_DATA_ECindicator0 = "831F99990000000000020001569988776655443322110099887766554433221100";
TEST_PDOL_DATA_ECindicator1 = "831F99990100000000020001569988776655443322110099887766554433221100";

// Amout Authorized: $2.00
TEST_CDOL1_DATA = "0000000002000000000000000156000000000001560001251647210011223344";
TEST_CDOL2_DATA = "30300000000002000000000000000156000000000001560001251647210011223344";

var EC_AIP = '5800';
var DC_AIP = '5C00';
var response;

//1. Cleaning the Card with EXTERNAL AUTHENTICATE - PUT DATA(EC balance limit)
print("\n* Transaction 1");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA );
assertSW('9000');

send_PutData('9F79','000000000300'); // EC Balance
assertSW('9000');
send_PutData('9F77','000000000500'); // EC Balance Limit
assertSW('9000');


//2. EC Transaction - TC
print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');

response = send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
if (response.substr(4, 4) != EC_AIP) error ('* VLP019 Error!!');

response = send_GetData('9F79')
assertSW('9000');
if (response.substr(6,12) != '000000000300') error ('* VLP019 Error!!');

send_GEN_AC_1(TC,TEST_CDOL1_DATA);
check_CID("40");
check_CVR("03900000"); //PBOC 와 VISA 스펙이 상이함 4번째 바이트가 00이 와야 되는것이 맞음


//3. Cleaning the Card with EXTERNAL AUTHENTICATE - PUT DATA(EC balance limit)
print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');

response = send_GPO(TEST_PDOL_DATA_ECindicator0);
assertSW('9000');
if (response.substr(4, 4) != DC_AIP) error ('* VLP019 Error!!');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA );
assertSW('9000');

send_PutData('9F79','000000000300'); // EC Balance
assertSW('9000');
send_PutData('9F77','000000000500'); // EC Balance Limit
assertSW('9000');


//4-1. EC Transaction - ARQC
print("\n* Transaction 4-1");
reset();
select_PBOC();
assertSW('9000');

response = send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
if (response.substr(4, 4) != EC_AIP) error ('* VLP019 Error!!');

send_GEN_AC_1(ARQC,TEST_CDOL1_DATA);
check_CID("80");
check_CVR("03A00000");
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA );
assertSW('9000');

response = send_GetData('9F79')
assertSW('9000');
if (response.substr(6,12) != '000000000300') error ('* VLP019 Error!!');

//4-2. EC Transaction - TC
print("\n* Transaction 4-2");
reset();
select_PBOC();
assertSW('9000');

response = send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
if (response.substr(4, 4) != EC_AIP) error ('* VLP019 Error!!');

send_GEN_AC_1(TC,TEST_CDOL1_DATA);
check_CID("40");
check_CVR("03900000"); //PBOC 와 VISA 스펙이 상이함 4번째 바이트가 00이 와야 되는것이 맞음

response = send_GetData('9F79')
assertSW('9000');
if (response.substr(6,12) != '000000000100') error ('* VLP019 Error!!');


//5. EC -> DC(ARQC)
print("\n* Transaction 5");
reset();
select_PBOC();
assertSW('9000');

response = send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
if (response.substr(4, 4) != DC_AIP) error ('* VLP019 Error!!');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1_DATA);
assertSW('9000');
check_CID("80");
//check_CVR("03A48020"); // ?? Test Plan 03A40000
check_CVR("03A40000");

send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2_DATA );
assertSW('9000');
check_CID("40");
//check_CVR("03648020"); // ?? Test Plan 03640000
check_CVR("03640000");

send_PutData('9F79','000000000300'); // EC Balance
assertSW('9000');


//6. EC Transaction - TC
print("\n* Transaction 6");
reset();
select_PBOC();
assertSW('9000');

response = send_GPO(TEST_PDOL_DATA_ECindicator1);
assertSW('9000');
if (response.substr(4, 4) != EC_AIP) error ('* VLP019 Error!!');

response = send_GetData('9F79')
assertSW('9000');
if (response.substr(6,12) != '000000000300') error ('* VLP019 Error!!');

send_GEN_AC_1(TC,TEST_CDOL1_DATA);
check_CID("40");
check_CVR("03900000"); //PBOC 와 VISA 스펙이 상이함 4번째 바이트가 00이 와야 되는것이 맞음
