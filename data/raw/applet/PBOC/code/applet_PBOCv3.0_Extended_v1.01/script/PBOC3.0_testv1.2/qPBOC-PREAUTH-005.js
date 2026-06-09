/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE46-005');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');
/*
Terminal_Transaction_Qualifiers = '40000000';

include("pboc_CLN001_new.js");

Record_In_19[1]="00017D"+random(125);
print("Record_In_19[1]="+Record_In_19[1]);
AppendRecord("C8",Record_In_19[1],Ini_key_19,CAPP_KEY_19[1]);
assertSW("9000");

Record_In_1E[1]=random(128);
print("Record_In_1E[1]="+Record_In_1E[1]);
AppendRecord("F0",Record_In_1E[1],Ini_key_1E,CAPP_KEY_1E[1]);
assertSW("9000");
*/

print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '20000000';
CAPP_ID_DF60='01';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

Record_Out_1E[1]=send('00B201F400');
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);
assertSW("6986");

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
assertSW("9000");

Record_In_19[1]="6677"+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);
assertSW("6A83");

print("\n* ******************************");
print("\n* Transaction 4");
print("\n* ******************************");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("E8",Record_In_19[1],CAPP_KEY_19[1]);
assertSW("6A82");

print("\n* ******************************");
print("\n* Transaction 5");
print("\n* ******************************");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

Record_Out_1E[1]=send('00B201F400');
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_1E[1]=random(127);
UpdateCappDataCache("F0",Record_In_1E[1],CAPP_KEY_1E[1]);
assertSW("6700");

print("\n* ******************************");
print("\n* Transaction 6");
print("\n* ******************************");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ReadCappData("C8",Record_In_19[1].substr(0,4));
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"7C"+random(124);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);
assertSW("6700");

print("\n* ******************************");
print("\n* Transaction 7");
print("\n* ******************************");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ATC=send('80CA9F3600');
ATC=ATC.substr(6,4);

Record_In_16[1]="00017D"+random(125);
print("Record_In_16[1]="+Record_In_16[1]);
AppendRecord("B0",Record_In_16[1],Ini_key_16,CAPP_KEY_16[1]);
assertSW("9000");

Record_In_16[2]="00017D"+random(125);
print("Record_In_16[2]="+Record_In_16[2]);
AppendRecord("B0",Record_In_16[2],Ini_key_16,CAPP_KEY_16[2]);
assertSW("9000");

Record_In_16[3]=random(128);
print("Record_In_16[3]="+Record_In_16[3]);
AppendRecord("B0",Record_In_16[3],Ini_key_16,CAPP_KEY_16[3]);
assertSW("6A84");