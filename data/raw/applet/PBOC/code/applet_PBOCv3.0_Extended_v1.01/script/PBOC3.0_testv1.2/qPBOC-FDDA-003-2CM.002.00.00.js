/*******************************************
 Test Name  : qPBOC Offline Transaction - 1408 bits ICC PK certificate
 Card Image : PBOC-PSO-047
 Reference  : VCPS 2CM.004.00.00
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

// fDDA00
Terminal_Transaction_Qualifiers = '00000000';
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
tags[6] = '9F6C';
check_tags_in_response(response, tags);

parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

validate_AC(AC);

var IC_PK_MODULUS_1408 = 'A41B6711CAA8094D64452D3EC2A199939C7423DAB2F579C802ECDE783F34DCCD1E495CB705AB74D0104EA3FE389EB257141FB674F419A418EDC894A972E4697DFB82617929A4298BF36E563009964DB5E1B351C32FE3FA0ED4AB7C7E3745E59DF40EE847B16E573196DECF4B9FA0953727633CB30A2807AF8FAD75B1CBB3BAC9423ED0765715AE83BF5BB436738AC650AC991DB606E56644E9CCFC6A7035434D7D425C5FBF474799E09F79E31472FBF3';
check_fDDA(response, IC_PK_MODULUS_1408);