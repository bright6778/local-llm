include("_PBOC_COMMON.js");

var COM010_Response;

print('\n* Test Case : COM010');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

COM010_Response = send_GEN_AC_1(ARQC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');
COM010_Response = lookup_BER_TLV(COM010_Response, "77", RETURN_VALUE);
assertEquals('80', lookup_BER_TLV(COM010_Response, "9F4B", RETURN_LENGTH));
assertEquals('6A', decrypted_SDAD.substring(0, 2)); 
assertEquals('BC', decrypted_SDAD.substring(254, 256));
assertEquals('05', decrypted_SDAD.substring(2, 4));
check_CID('80');

COM010_Response = send_GEN_AC_2(TC | CDA_sign_requested, TEST_CDOL2);
assertSW('9000');
COM010_Response = lookup_BER_TLV(COM010_Response, "77", RETURN_VALUE);
assertEquals('80', lookup_BER_TLV(COM010_Response, "9F4B", RETURN_LENGTH));
assertEquals('6A', decrypted_SDAD.substring(0, 2)); 
assertEquals('BC', decrypted_SDAD.substring(254, 256));
assertEquals('05', decrypted_SDAD.substring(2, 4));
check_CID('40');




