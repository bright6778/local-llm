/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE46-001');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');

Terminal_Transaction_Qualifiers = '40000000';

include("pboc_CLN001_FOR_EXTENDED.js");

Record_In_19[1]="00017D"+random(125);
print("Record_In_19[1]="+Record_In_19[1]);
Record_In_19[2]="00027D"+random(125);
print("Record_In_19[2]="+Record_In_19[2]);
Record_In_19[3]="00037D"+random(125);
print("Record_In_19[3]="+Record_In_19[3]);
Record_In_19[4]="00047D"+random(125);
print("Record_In_19[4]="+Record_In_19[4]);
Record_In_19[5]="00057D"+random(125);
print("Record_In_19[5]="+Record_In_19[5]);
Record_In_19[6]="00067D"+random(125);
print("Record_In_19[6]="+Record_In_19[6]);
Record_In_19[7]="00077D"+random(125);
print("Record_In_19[7]="+Record_In_19[7]);

AppendRecord("C8",Record_In_19[1],Ini_key_19,CAPP_KEY_19[1]);
assertSW("9000");
AppendRecord("C8",Record_In_19[2],Ini_key_19,CAPP_KEY_19[2]);
assertSW("9000");
AppendRecord("C8",Record_In_19[3],Ini_key_19,CAPP_KEY_19[3]);
assertSW("9000");
AppendRecord("C8",Record_In_19[4],Ini_key_19,CAPP_KEY_19[4]);
assertSW("9000");
AppendRecord("C8",Record_In_19[5],Ini_key_19,CAPP_KEY_19[5]);
assertSW("9000");
AppendRecord("C8",Record_In_19[6],Ini_key_19,CAPP_KEY_19[6]);
assertSW("9000");
AppendRecord("C8",Record_In_19[7],Ini_key_19,CAPP_KEY_19[7]);
assertSW("9000");


Record_In_1E[1]=random(128);
print("Record_In_1E[1]="+Record_In_1E[1]);
AppendRecord("F0",Record_In_1E[1],Ini_key_1E,CAPP_KEY_1E[1]);
assertSW("9000");

Record_In_17[1]="00017D"+random(125);
print("Record_In_17[1]="+Record_In_17[1]);
Record_In_17[2]="00027D"+random(125);
print("Record_In_17[2]="+Record_In_17[2]);
Record_In_17[3]="00037D"+random(125);
print("Record_In_17[3]="+Record_In_17[3]);
Record_In_17[4]="00047D"+random(125);
print("Record_In_17[4]="+Record_In_17[4]);
Record_In_17[5]="00057D"+random(125);
print("Record_In_17[5]="+Record_In_17[5]);
Record_In_17[6]="00067D"+random(125);
print("Record_In_17[6]="+Record_In_17[6]);
Record_In_17[7]="00077D"+random(125);
print("Record_In_17[7]="+Record_In_17[7]);

AppendRecord("B8",Record_In_17[1],Ini_key_17,CAPP_KEY_17[1]);
assertSW("9000");
AppendRecord("B8",Record_In_17[2],Ini_key_17,CAPP_KEY_17[2]);
assertSW("9000");
AppendRecord("B8",Record_In_17[3],Ini_key_17,CAPP_KEY_17[3]);
assertSW("9000");
AppendRecord("B8",Record_In_17[4],Ini_key_17,CAPP_KEY_17[4]);
assertSW("9000");
AppendRecord("B8",Record_In_17[5],Ini_key_17,CAPP_KEY_17[5]);
assertSW("9000");
AppendRecord("B8",Record_In_17[6],Ini_key_17,CAPP_KEY_17[6]);
assertSW("9000");
AppendRecord("B8",Record_In_17[7],Ini_key_17,CAPP_KEY_17[7]);
assertSW("9000");


Record_In_15[1]="00017D"+random(125);
print("Record_In_15[1]="+Record_In_15[1]);
Record_In_15[2]="00027D"+random(125);
print("Record_In_15[2]="+Record_In_15[2]);
Record_In_15[3]="00037D"+random(125);
print("Record_In_15[3]="+Record_In_15[3]);
Record_In_15[4]="00047D"+random(125);
print("Record_In_15[4]="+Record_In_15[4]);

AppendRecord("A8",Record_In_15[1],Ini_key_15,CAPP_KEY_15[1]);
assertSW("9000");
AppendRecord("A8",Record_In_15[2],Ini_key_15,CAPP_KEY_15[2]);
assertSW("9000");
AppendRecord("A8",Record_In_15[3],Ini_key_15,CAPP_KEY_15[3]);
assertSW("9000");
AppendRecord("A8",Record_In_15[4],Ini_key_15,CAPP_KEY_15[4]);
assertSW("9000");

Record_In_16[1]="00017D"+random(125);
print("Record_In_16[1]="+Record_In_16[1]);
Record_In_16[2]="00027D"+random(125);
print("Record_In_16[2]="+Record_In_16[2]);

AppendRecord("B0",Record_In_16[1],Ini_key_16,CAPP_KEY_16[1]);
assertSW("9000");
AppendRecord("B0",Record_In_16[2],Ini_key_16,CAPP_KEY_16[2]);
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

Record_Out_1E[1]=send('00B200F400');
assertSW("9000");
if (Record_Out_1E[1]!=Record_In_1E[1]){
	error("Read SFI=0x1E Record01 error");
}

for(var i=1;i<=4;i++)
	{ 
		Record_Out_15[i]=ReadCappData("A8",Record_In_15[i].substr(0,4));
    assertSW("9000");
		if (Record_Out_15[i]!=Record_In_15[i]){
			error("Read SFI=0x15 error");
		}
	}

for(i=1;i<=2;i++)
	{ 
		Record_Out_16[i]=ReadCappData("B0",Record_In_16[i].substr(0,4));
    assertSW("9000");
		if (Record_Out_16[i]!=Record_In_16[i]){
			error("Read SFI=0x16 error");
		}
	}

for(i=1;i<=7;i++)
	{ 
		Record_Out_17[i]=ReadCappData("B8",Record_In_17[i].substr(0,4));
    assertSW("9000");
		if (Record_Out_17[i]!=Record_In_17[i]){
			error("Read SFI=0x17 error");
		}
		Record_Out_19[i]=ReadCappData("C8",Record_In_19[i].substr(0,4));
    assertSW("9000");
		if (Record_Out_19[i]!=Record_In_19[i]){
			error("Read SFI=0x19 error");
		}
		
	}

Transaction_Currency_Code = Terminal_Country_Code = QPBOC_EC_SECOND_CURRENCY_CODE;send_GPO_new();
assertSW("9000");

Record_In_19[7]=Record_In_19[7].substr(0,4)+"7D"+random(125);
UpdateCappDataCache("C8",Record_In_19[7],CAPP_KEY_19[7]);

ReadAFL();


