include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-032-2CN.004.00.00.js');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

VLP_Funds_prior = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

var GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_Funds_after = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(AC  == "") error("Application Cryptogram doesn't exist");

//checkIAD("0701010390000001","0701110390000001",8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

validate_AC(AC);

var tags = new Array();
tags[0] = '9F4B'; // SDAD
tags[1] = '82';
tags[2] = '94';
tags[3] = '9F36';
tags[4] = '57';
tags[5] = '9F10';
tags[6] = '9F26';
tags[7] = '9F6C';

check_tags_in_response(GPOresponse, tags);

if(parseInt(VLP_Funds_after, 10) != parseInt(VLP_Funds_prior, 10) - parseInt(Amount_Authorised, 10))
	error("\n Failed verify that VLP Available Funds (after GPO command) = [VLP Available Funds (prior to GPO)] - [Amount, Authorised]");
else
	print("\n Succuss verify that VLP Available Funds (after GPO command) = [VLP Available Funds (prior to GPO)] - [Amount, Authorised]");