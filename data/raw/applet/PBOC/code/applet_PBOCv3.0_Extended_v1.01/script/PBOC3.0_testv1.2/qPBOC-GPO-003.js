/*******************************************
 Test Name  : GPOresponseForOnlineQPBOC-ConditionalData
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.015.00.00
 Card Conf  : [Application PAN Sequence Number] & 
              [Card Transaction Qualifiers] supported
 Condition  : LT sends a SELECT command on PPSE
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-003');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('9000');

var tags = new Array();
tags[0] = '82';
tags[1] = '9F36';
tags[2] = '57';
tags[3] = '9F10';
tags[4] = '9F26';
tags[5] = '5F34';
tags[6] = '9F6C';

check_tags_in_response(response, tags);
