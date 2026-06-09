/*******************************************
 Test Name  : Conditional API in Directory Entry (Application Priority Indicator)
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CA.008.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-PPSE-008-2CA.008.00.00.js');

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
value_A5   = lookup_BER_TLV(value_6F, "A5", RETURN_VALUE);
value_BC0C = lookup_BER_TLV(value_A5, "BF0C", RETURN_VALUE);
value_61   = lookup_BER_TLV(value_BC0C, "61", RETURN_VALUE);

API = lookup_BER_TLV(value_61, "87", RETURN_VALUE);

if(API.substring(0,1) != 0) error("Application Priority Indicator Byte 1 bits 8-5 should '0000'.");

