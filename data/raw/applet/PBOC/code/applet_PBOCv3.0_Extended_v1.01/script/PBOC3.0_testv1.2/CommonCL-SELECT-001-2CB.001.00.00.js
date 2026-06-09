/*******************************************
 Test Name  : SELECT Command - PBOC contactless AID for CVN 01
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CB.001.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-SELECT-001-2CB.001.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

PBOCresponse = select_PBOC();
assertSW('9000');

value_6F   = lookup_BER_TLV(PBOCresponse, "6F", RETURN_VALUE);
check_PPSE_data(value_6F, "84", "", "");
check_PPSE_data(value_6F, "A5", "", "");

value_A5   = lookup_BER_TLV(value_6F, "A5", RETURN_VALUE);
check_PPSE_data(value_A5, "50", "", "");
check_PPSE_data(value_A5, "9F38", "", "");
check_PPSE_data(value_A5, "87", "", "");
check_PPSE_data(value_A5, "5F2D", "", "");

function check_PPSE_data(templete, tag, expected_length, expected_value){	
	value  = lookup_BER_TLV(templete, tag, RETURN_VALUE);
	length = lookup_BER_TLV(templete, tag, RETURN_LENGTH);
	
	print(tag+" : "+value);
	
	if(value  == "")   error("The "+tag+" shell be in PPSE response");
	if(expected_length != "")
		if(length != expected_length) error("Length of "+ tag + " shell be " + expected_length);
	if(expected_value != "")
		if(value  != expected_value)  error("The " + tag + " shell be " + expected_value);
}


