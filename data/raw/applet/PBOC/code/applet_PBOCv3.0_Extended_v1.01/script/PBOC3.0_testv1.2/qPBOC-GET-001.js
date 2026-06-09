/*******************************************
 Test Name  : GetDataADA
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.001.00.00
 Card Conf  : [ADA] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-001');

print('\n* Power on the Card(ATR)');
reset();

print("\n* Transaction 1");
select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

response = send_GetData('9F52');
assertSW('9000');


//assertEquals(response.substr(4, 2), "04");                //기존
if(lookup_BER_TLV(response, '9F52', RETURN_LENGTH) != '02') //수정 2013.02.21. ysnam
	error("ADA length of qPBOC should be 2"); //may be


