/*******************************************
 Test Name  : CheckGPO[ConditionalData]inOffline
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.032.00.00
 Card Conf  : [Application PAN Sequence Number] &
              [Card Transaction Qualifiers] personalized
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-019');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

response = send_GPO(CVN);
assertSW('9000');

var tags = new Array();
tags[0] = '82';
tags[1] = '94';
tags[2] = '9F36';
tags[3] = '57';
tags[4] = '9F10';
tags[5] = '9F26';

check_tags_in_response(response, tags);

validate_AC(AC);
