/*******************************************
 Test Name  : qVSDC - Online processing
 Card Image : PBOC-PSO-036-(for qPBOC-CRM-029)
 Reference  : VCPS 2CN.002.00.00
 Card Conf  : [Application Currency Code] 
              [Card Transaction Qualifier]
              [VLP Funds Limit]
              [VLP Single Transaction Limit]
              [VLP Available Funds] personalized            
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
              PIN Try Counter = 0
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-030-2CN.002.00.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

VLP_Single_TX_Limit = lookup_BER_TLV(send_GetData('9F78'), '9F78', RETURN_VALUE)
Amount_Authorised = parseInt(VLP_Single_TX_Limit, 10) + 100 + "";
Amount_Authorised = intToStr(Amount_Authorised, 6);

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

var response = send_GPO(CVN);
assertSW('9000');

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(AC  == "") error("Application Cryptogram doesn't exist");
if(Track2_Equivalent_Data  == "") error("Track 2 Equivalent Data doesn't exist");

//checkIAD("07010103A0200001","07011103A0200001",8)
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A02000');

validate_AC(AC);

var tags = new Array();
tags[0] = '82';
tags[1] = '9F36';
tags[2] = '57';
tags[3] = '9F10';
tags[4] = '9F26';
tags[5] = '9F63';
tags[6] = '5F34';
tags[7] = '9F6C';

check_tags_in_response(response, tags);