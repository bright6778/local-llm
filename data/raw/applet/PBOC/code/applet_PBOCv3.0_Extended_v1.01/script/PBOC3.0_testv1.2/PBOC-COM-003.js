include("_PBOC_COMMON.js");

var COM003_Result;
var COM003_ATC;
var test;

print('\n* Test Case : COM003');

print("\n* Transaction 1");
include("pboc_CLN001.js");
COM003_ATC = ATC;

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
COM003_Result = send_GEN_AC_1(ARQC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');

//Result Check
assertEquals(COM003_Result.substring(0, 2), '77');
assertEquals(COM003_Result.substring(2, 6), '8198');

COM003_Result = lookup_BER_TLV(COM003_Result, '77', RETURN_VALUE);
assertEquals(lookup_BER_TLV(COM003_Result, "9F27", RETURN_LENGTH), '01');
assertEquals(lookup_BER_TLV(COM003_Result, "9F27", RETURN_VALUE), '80');
assertEquals(lookup_BER_TLV(COM003_Result, "9F36", RETURN_LENGTH), '02');
assertEquals(toHex(toByte(lookup_BER_TLV(COM003_Result, "9F36", RETURN_VALUE))), toHex(toByte(COM003_ATC) + 1));
assertEquals(lookup_BER_TLV(COM003_Result, "9F4B", RETURN_LENGTH), '80');
assertEquals(lookup_BER_TLV(COM003_Result, "9F10", RETURN_LENGTH), '08');
assertEquals(lookup_BER_TLV(COM003_Result, "9F10", RETURN_VALUE), '07010103A4000201');

send_ExternalAuth();
assertSW('9000');
COM003_Result = send_GEN_AC_2(TC | CDA_sign_requested, TEST_CDOL2);
assertSW('9000');

//Result Check
assertEquals(COM003_Result.substring(0, 2), '77');
assertEquals(COM003_Result.substring(2, 6), '8198');

COM003_Result = lookup_BER_TLV(COM003_Result, '77', RETURN_VALUE);
assertEquals(lookup_BER_TLV(COM003_Result, "9F27", RETURN_LENGTH), '01');
assertEquals(lookup_BER_TLV(COM003_Result, "9F27", RETURN_VALUE), '40');
assertEquals(lookup_BER_TLV(COM003_Result, "9F36", RETURN_LENGTH), '02');
assertEquals(toHex(toByte(lookup_BER_TLV(COM003_Result, "9F36", RETURN_VALUE))), toHex(toByte(COM003_ATC) + 1));
assertEquals(lookup_BER_TLV(COM003_Result, "9F4B", RETURN_LENGTH), '80');
assertEquals(lookup_BER_TLV(COM003_Result, "9F10", RETURN_LENGTH), '08');
assertEquals(lookup_BER_TLV(COM003_Result, "9F10", RETURN_VALUE), '0701010364000201');