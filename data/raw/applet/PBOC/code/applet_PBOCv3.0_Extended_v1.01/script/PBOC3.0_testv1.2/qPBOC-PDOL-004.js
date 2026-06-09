// Test Name  : qVSDC using Cryptogram 10
// Card Image : PBOC-PSO-031
// Reference  : VCPS 2CB.007.00.00
// Card Conf  : PDOL
// Condition  : LT sends a SELECT command on PPSE

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-PDOL-004');

print("\n* Transaction 1");
reset();

reponse = select_PBOC();
assertSW('9000');

var value_6F = lookup_BER_TLV(response, "6F", RETURN_VALUE);
var value_A5 = lookup_BER_TLV(value_6F, "A5", RETURN_VALUE);
var value_PDOL = lookup_BER_TLV(value_A5, "9F38", RETURN_VALUE);

print("-- PDOL ");
print("       Tag 9F66 : Terminal Transaction Qualifiers, Len : " + lookup_BER_TL(value_PDOL, "9F66", RETURN_LENGTH));
print("       Tag 9F02 : Amount, Authorized, Len : " + lookup_BER_TL(value_PDOL, "9F02", RETURN_LENGTH));
print("       Tag 9F03 : Amount, Other, Len : " + lookup_BER_TL(value_PDOL, "9F03", RETURN_LENGTH));
print("       Tag 9F1A : Terminal Country Code, Len : " + lookup_BER_TL(value_PDOL, "9F1A", RETURN_LENGTH));
print("       Tag 95 : Terminal Verification Results (TVR), Len : " + lookup_BER_TL(value_PDOL, "95", RETURN_LENGTH));
print("       Tag 5F2A : Transaction Currency Code, Len : " + lookup_BER_TL(value_PDOL, "5F2A", RETURN_LENGTH));
print("       Tag 9A : Transaction Date, Len : " + lookup_BER_TL(value_PDOL, "9A", RETURN_LENGTH));
print("       Tag 9C : Transaction Type, Len : " + lookup_BER_TL(value_PDOL, "9C", RETURN_LENGTH));
print("       Tag 9F37 : Unpredictable Number, Len : " + lookup_BER_TL(value_PDOL, "9F37", RETURN_LENGTH));

if(value_A5 == "" || lookup_BER_TLV(value_6F, "84", RETURN_VALUE) == 0)
	error("The template '6F' should include template 'A5'(FCI Proprietary Template) and tag '84'(DF name)");

if(lookup_BER_TLV(value_A5, "50", RETURN_VALUE) == "")
	error("The template 'A5' should include tag '50'(Application Label)");
if(lookup_BER_TLV(value_A5, "9F38", RETURN_VALUE) == "")
	error("The template '9F38' should include tag '9F38'(PDOL)");

if(lookup_BER_TL(value_PDOL, "9F66", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9F66'(Terminal Transaction Qualifiers)");
if(lookup_BER_TL(value_PDOL, "9F02", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9F02'(Amount, Authorized)");
if(lookup_BER_TL(value_PDOL, "9F03", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9F03'(Amount, Other)");
if(lookup_BER_TL(value_PDOL, "9F1A", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9F1A'(Terminal Country Code)");
if(lookup_BER_TL(value_PDOL, "95", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '95'(Terminal Verification Results)");
if(lookup_BER_TL(value_PDOL, "5F2A", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '5F2A'(Transaction Currency Code)");
if(lookup_BER_TL(value_PDOL, "9A", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9A'(Transaction Date)");
if(lookup_BER_TL(value_PDOL, "9C", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9C'Transaction Type)");
if(lookup_BER_TL(value_PDOL, "9F37", RETURN_LENGTH) == "")
	error("The tag '9F38' should include tag '9F37'(Unpredictable Number)");
