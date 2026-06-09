/*******************************************
 Test Name  : OnlineOnlyqVSDCusingCrytogram17
 Card Image : PBOC-PSO-037
 Reference  : VCPS 2CB.004.00.00
 Card Conf  : Card contains PDOL for CVN 17
 Condition  : LT sends a SELECT command on PPSE
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-PDOL-001');

print("\n* Transaction 1");
reset();

var response = select_PBOC();
assertSW('9000');

var value_6F   = lookup_BER_TLV(response, "6F", RETURN_VALUE);
var value_A5   = lookup_BER_TLV(value_6F, "A5", RETURN_VALUE);
var value_PDOL = lookup_BER_TLV(value_A5, "9F38", RETURN_VALUE);

print("-- PDOL ");
print("       Tag 9F66 : Terminal Transaction Qualifiers, Len : " + lookup_BER_TL(value_PDOL, "9F66", RETURN_LENGTH));
print("       Tag 9F02 : Amount, Authorized, Len : " + lookup_BER_TL(value_PDOL, "9F02", RETURN_LENGTH));
print("       Tag 9F37 : Unpredictable Number, Len : " + lookup_BER_TL(value_PDOL, "9F37", RETURN_LENGTH));
print("       Tag 5F2A : Transaction Currency Code, Len : " + lookup_BER_TL(value_PDOL, "5F2A", RETURN_LENGTH));

//Verify the A5 tag [FCI Proprietary Template]
if(value_A5 == "" || lookup_BER_TLV(value_6F, "84", RETURN_VALUE) == 0)
	error("The template '6F' should include template 'A5'(FCI Proprietary Template) and tag '84'(DF name)");

//Verify the Mandatory tags
if(lookup_BER_TLV(value_A5, "50", RETURN_VALUE) == "")
	error("The template 'A5' should include tag '50'(Application Label)");
if(lookup_BER_TLV(value_A5, "9F38", RETURN_VALUE) == "")
	error("The template 'A5' should include tag '9F38'(PDOL)");
