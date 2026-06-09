/*******************************************
 Test Name  : qPBOC Offline Transaction - 1024 bits ICC PK certificate
 Card Image : PBOC-PSO-032
 Reference  : VCPS 2CM.002.00.00
 Card Conf  : AIP shell support fDDA
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-FDDA-001-2CM.002.00.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

// fDDA01
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('9000');

var tags = new Array();
tags[0] = '82';
tags[1] = '94';
tags[2] = '9F36';
tags[3] = '9F26';
tags[4] = '9F10';
tags[5] = '57';
tags[6] = '9F4B'; // SDAD retured in GPO
tags[7] = '9F6C';
check_tags_in_response(response, tags);

parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

validate_AC(AC);

var IC_PK_MODULUS_1024 = 'B828D7D0131A42A9FF63041DB16306639646E436367526638355881B831E7FAF33AE61EF6FC6E8961F4D6988A7F7A95FE9AC065E9A0C39595867DFE2ABFF9FA2C7876422AD5A40DEE4443EA7E019C32C9F6E172870CD7CA675AE705CA9148221506DA849DDA38A1B5701DDC554297F457A25A9FE5FAC2008B5D2FCA1C5BC281F';
check_fDDA(response, IC_PK_MODULUS_1024);