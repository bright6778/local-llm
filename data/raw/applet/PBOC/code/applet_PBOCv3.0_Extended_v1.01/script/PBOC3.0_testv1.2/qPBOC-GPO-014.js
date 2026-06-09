/*******************************************
 Test Name  : CheckAmountAuthorizedIs0
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.027.00.00
 Card Conf  : [MSD] supported
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-014');

print('\n* Power on the Card(ATR)');
reset();

print("\n* Case 01: Online capable reader requesting online cryptogram");
select_PBOC();
assertSW('9000');

Amount_Authorised = '000000000000';
Terminal_Transaction_Qualifiers = '00000000';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

send_GPO(CVN);
assertSW('9000');

var tags = new Array();
tags[0] = '82';
tags[1] = '9F36';
tags[2] = '57';
tags[3] = '9F10';
tags[4] = '9F26';
check_tags_in_response(response, tags);
	
var no_tags = new Array();
tags[0] = '94';
check_no_tags_in_response(response, no_tags);
	
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A00000');

print("\n* Case 02: Offline only reader");
select_PBOC();
assertSW('9000');

Amount_Authorised = '000000000000';
Terminal_Transaction_Qualifiers = '00000000';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

send_GPO(CVN);
assertSW('9000');

var tags = new Array();
tags[0] = '82';
tags[1] = '9F36';
tags[2] = '57';
tags[3] = '9F10';
tags[4] = '9F26';
check_tags_in_response(response, tags);
	
var no_tags = new Array();
tags[0] = '94';
check_no_tags_in_response(response, no_tags);
	
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

print("\n* Case 03: Offline capable reader");	
select_PBOC();
assertSW('9000');

Amount_Authorised = '000000000000';
Terminal_Transaction_Qualifiers = '00000000';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('9000');

var tags = new Array();
tags[0] = '82';
tags[1] = '9F36';
tags[2] = '57';
tags[3] = '9F10';
tags[4] = '9F26';
check_tags_in_response(response, tags);
	
var no_tags = new Array();
tags[0] = '94';
check_no_tags_in_response(response, no_tags);
	
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');