include("_PBOC_COMMON.js");

print('\n* Test Case : CRM052');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');

response = send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

if(response.substring(0, 2) == '80'){
	var length_80 = parseInt(lookup_BER_TLV(response, "80", RETURN_LENGTH), 16);
	if(length_80 < parseInt('12', 16) || length_80 > parseInt('22', 16))
		error("Invalid length of tag 80"); 		
} else if(response.substring(0, 2) == '77') {
	var length_77 = parseInt(lookup_BER_TLV(response, "77", RETURN_LENGTH), 16);
	if(length_77 < parseInt('1D', 16) || length_77 > parseInt('28', 16))
		error("Invalid length of tag 77"); 
}		