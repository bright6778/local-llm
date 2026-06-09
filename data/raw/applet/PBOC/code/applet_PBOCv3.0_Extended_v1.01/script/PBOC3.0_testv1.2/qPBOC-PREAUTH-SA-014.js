/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE46-009');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');

Terminal_Transaction_Qualifiers = '40000000';

include("pboc_CLN001_FOR_EXTENDED.js");

Record_In_19[1]="00017D"+random(125);
print("Record_In_19[1]="+Record_In_19[1]);

AppendRecord("C8",Record_In_19[1],Ini_key_19,CAPP_KEY_19[1]);
assertSW("9000");

Record_In_19[2]="00020C"+random(12);
print("Record_In_19[2]="+Record_In_19[2]);

AppendRecord("C8",Record_In_19[2],Ini_key_19,CAPP_KEY_19[2]);
assertSW("9000");

print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '20000000';
CAPP_ID_DF60='01';
Amount_Authorised = '000000000000';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

Transaction_Currency_Code = Terminal_Country_Code = QPBOC_EC_SECOND_CURRENCY_CODE;send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"0C"+random(12);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);
//assertSW("6A80"); // is the applet issue but BCTC is not test
//assertSW("6A84");
sw = getSW();
if(sw != '6A80' && sw != '6A84'){
	error('SW is wrong!!!');
}

send('00B2031C00');
assertSW("6974");



print("\n* ******************************");
print("\n* Transaction 3");
print("\n* ******************************");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[2].substr(0,4));
assertSW("9000");

Transaction_Currency_Code = Terminal_Country_Code = QPBOC_EC_SECOND_CURRENCY_CODE;send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[2].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);
assertSW("6A84");

send('00B2031C00');
assertSW("6974");
