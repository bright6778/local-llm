/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE47-002');
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

print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '20000000';
CAPP_ID_DF60='02';
Amount_Authorised = '000000060000';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);

ReadAFL();

if (Value_9F5D!="000000040000"){
		error("Available Funds is not correct");
}

print("\n* ******************************");
print("\n* Transaction 3");
print("\n* ******************************");
CAPP_ID_DF60='01';
Amount_Authorised = '000000080000';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);

ReadAFL();

if (Value_9F5D!="000000000000"){
		error("Available Funds is not correct");
}
Value_DF63=send('80CADF6300');
Value_DF63=Value_DF63.substr(6,12);
if (Value_DF63!="000000040000"){
		error("DF63 is not correct");
}

print("\n* ******************************");
print("\n* Transaction 4");
print("\n* ******************************");
CAPP_ID_DF60='03';
Amount_Authorised = '000000030000';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);

ReadAFL();

if (Value_9F5D!="000000000000"){
		error("Available Funds is not correct");
}
Value_DF63=send('80CADF6300');
Value_DF63=Value_DF63.substr(6,12);
if (Value_DF63!="000000010000"){
		error("DF63 is not correct");
}

