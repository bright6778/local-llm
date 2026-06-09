/*******************************************
 Test Name  : Optional Application Label in Directory Entry
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CA.006.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-PPSE-006-2CA.006.00.00.js');

print('\n* Power on the Card(ATR)');
reset();

PPSEresponse = select_PPSE();
assertSW('9000');

//6F : FCI Template
// 84 : DF name of PPSE
// A5 : FCI Proprietary Template
//  BF0C : FCI Issuer Discretionary Data
//   61 : Template (??찾아보자)
//    4F : DF name
//    50 : Application Label
//    87 : Application Priority Indicator

value_6F   = lookup_BER_TLV(PPSEresponse, "6F", RETURN_VALUE);
check_PPSE_data(value_6F, "84", "", "");
check_PPSE_data(value_6F, "A5", "", "");

value_A5   = lookup_BER_TLV(value_6F, "A5", RETURN_VALUE);
check_PPSE_data(value_A5, "BF0C", "", "");

value_BC0C = lookup_BER_TLV(value_A5, "BF0C", RETURN_VALUE);
check_PPSE_data(value_BC0C, "61", "", "");

value_61   = lookup_BER_TLV(value_BC0C, "61", RETURN_VALUE);
check_PPSE_data(value_61, "50", "", "");


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

