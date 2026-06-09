/*******************************************
 Test Name  : FCI Template (Dedicated File(DF) Name ('84'))
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CA.001.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-PPSE-001-2CA.001.00.00.js');

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

value_6F = lookup_BER_TLV(PPSEresponse, "6F", RETURN_VALUE);

check_PPSE_data(value_6F, "84", "0E", "325041592E5359532E4444463031") 

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

