/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE46-003');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');
/*
Terminal_Transaction_Qualifiers = '40000000';

include("pboc_CLN001_new.js");

Record_In_19[1]="00017D"+random(125);
print("Record_In_19[1]="+Record_In_19[1]);
Record_In_19[2]="00027D"+random(125);
print("Record_In_19[2]="+Record_In_19[2]);

AppendRecord("C8",Record_In_19[1],Ini_key_19,CAPP_KEY_19[1]);
assertSW("9000");
AppendRecord("C8",Record_In_19[2],Ini_key_19,CAPP_KEY_19[2]);
assertSW("9000");
*/
print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '20000000';
CAPP_ID_DF60='02';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

Record_Out_19[1]=ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);

ReadAFL();

print("\n* ******************************");
print("\n* Transaction 3");
print("\n* ******************************");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("6972");

print("\n* ******************************");
print("\n* Transaction 4");
print("\n* ******************************");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[2].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[2]=Record_In_19[2].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[2],CAPP_KEY_19[2]);

ReadAFL();

print("\n* ******************************");
print("\n* Transaction 5");
print("\n* ******************************");
CAPP_ID_DF60='03';
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


print("\n* ******************************");
print("\n* Transaction 6");
print("\n* ******************************");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[2].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[2]=Record_In_19[2].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[2],CAPP_KEY_19[2]);

ReadAFL();
