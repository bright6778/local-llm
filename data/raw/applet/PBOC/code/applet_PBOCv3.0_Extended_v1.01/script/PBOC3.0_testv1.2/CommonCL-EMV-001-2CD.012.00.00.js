/*******************************************
 Test Name  : AIP with length of 2 bytes
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.012.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-EMV-001-2CD.012.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW("9000");

if( AIP.length/2 != 2 ) error("Verify in GPO response, template '77' includes tag '82'(AIP) with 2 byte length");
