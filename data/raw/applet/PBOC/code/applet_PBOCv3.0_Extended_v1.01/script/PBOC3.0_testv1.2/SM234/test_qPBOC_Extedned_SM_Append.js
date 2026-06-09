include('_PBOC_COMMON.js');

print('\n* ******************************');
print('\n* Transaction 1');
print('\n* ******************************');

reset();
send_Select();
assertSW('9000');


DOL_DATA['9F66'] = '26000080';
DOL_DATA['DF60'] = '01';
DOL_DATA['9F02'] = '000000000000';
DOL_DATA['DF69'] = '01';
send_GPO();

//ATC = send('80CA9F3600').substring(6,10);



Record_In_19[1]='000135'+random(53);
print('Record_In_19[1]='+Record_In_19[1]);
Record_In_19[2]='000235'+random(53);
print('Record_In_19[2]='+Record_In_19[2]);
Record_In_19[3]='000335'+random(53);
print('Record_In_19[3]='+Record_In_19[3]);


AppendRecord('C8',Record_In_19[1],Ini_key['C8'],CAPP_KEY_19[1], true);
assertSW('9000');
AppendRecord('C8',Record_In_19[2],Ini_key['C8'],CAPP_KEY_19[2], true);
assertSW('9000');
AppendRecord('C8',Record_In_19[3],Ini_key['C8'],CAPP_KEY_19[3], true);
assertSW('9000');



Record_In_1E[1]=random(64);
print('Record_In_1E[1]='+Record_In_1E[1]);
AppendRecord('F0',Record_In_1E[1],Ini_key['F0'],CAPP_KEY_1E[1], true);
assertSW('9000');

Record_In_17[1]='00017D'+random(125);
print('Record_In_17[1]='+Record_In_17[1]);
Record_In_17[2]='00027D'+random(125);
print('Record_In_17[2]='+Record_In_17[2]);
Record_In_17[3]='00037D'+random(125);
print('Record_In_17[3]='+Record_In_17[3]);
Record_In_17[4]='00047D'+random(125);
print('Record_In_17[4]='+Record_In_17[4]);
Record_In_17[5]='00057D'+random(125);
print('Record_In_17[5]='+Record_In_17[5]);
Record_In_17[6]='00067D'+random(125);
print('Record_In_17[6]='+Record_In_17[6]);
Record_In_17[7]='00077D'+random(125);
print('Record_In_17[7]='+Record_In_17[7]);

AppendRecord('B8',Record_In_17[1],Ini_key['B8'],CAPP_KEY_17[1], true);
assertSW('9000');
AppendRecord('B8',Record_In_17[2],Ini_key['B8'],CAPP_KEY_17[2], true);
assertSW('9000');
AppendRecord('B8',Record_In_17[3],Ini_key['B8'],CAPP_KEY_17[3], true);
assertSW('9000');
AppendRecord('B8',Record_In_17[4],Ini_key['B8'],CAPP_KEY_17[4], true);
assertSW('9000');
AppendRecord('B8',Record_In_17[5],Ini_key['B8'],CAPP_KEY_17[5], true);
assertSW('9000');
AppendRecord('B8',Record_In_17[6],Ini_key['B8'],CAPP_KEY_17[6], true);
assertSW('9000');
AppendRecord('B8',Record_In_17[7],Ini_key['B8'],CAPP_KEY_17[7], true);
assertSW('9000');


Record_In_15[1]='00017D'+random(125);
print('Record_In_15[1]='+Record_In_15[1]);
Record_In_15[2]='00027D'+random(125);
print('Record_In_15[2]='+Record_In_15[2]);
Record_In_15[3]='00037D'+random(125);
print('Record_In_15[3]='+Record_In_15[3]);
Record_In_15[4]='00047D'+random(125);
print('Record_In_15[4]='+Record_In_15[4]);

AppendRecord('A8',Record_In_15[1],Ini_key['A8'],CAPP_KEY_15[1], true);
assertSW('9000');
AppendRecord('A8',Record_In_15[2],Ini_key['A8'],CAPP_KEY_15[2], true);
assertSW('9000');
AppendRecord('A8',Record_In_15[3],Ini_key['A8'],CAPP_KEY_15[3], true);
assertSW('9000');
AppendRecord('A8',Record_In_15[4],Ini_key['A8'],CAPP_KEY_15[4], true);
assertSW('9000');

Record_In_16[1]='00017D'+random(125);
print('Record_In_16[1]='+Record_In_16[1]);
Record_In_16[2]='00027D'+random(125);
print('Record_In_16[2]='+Record_In_16[2]);

AppendRecord('B0',Record_In_16[1],Ini_key['B0'],CAPP_KEY_16[1], true);
assertSW('9000');
AppendRecord('B0',Record_In_16[2],Ini_key['B0'],CAPP_KEY_16[2], true);
assertSW('9000');

print('\n* ******************************');
print('\n* Transaction 2');
print('\n* ******************************');

send_Select(AID_PPSE);
assertSW('9000');
send_Select();
assertSW('9000');



for(var i=1;i<=4;i++)
	{ 
		Record_Out_15[i]=ReadCappData('A8',Record_In_15[i].substr(0,4));
    assertSW('9000');
		if (Record_Out_15[i]!=Record_In_15[i]){
			error('Read SFI=0x15 error');
		}
	}

for(i=1;i<=2;i++)
	{ 
		Record_Out_16[i]=ReadCappData('B0',Record_In_16[i].substr(0,4));
    assertSW('9000');
		if (Record_Out_16[i]!=Record_In_16[i]){
			error('Read SFI=0x16 error');
		}
	}

for(i=1;i<=3;i++)
	{ 
		Record_Out_17[i]=ReadCappData('B8',Record_In_17[i].substr(0,4));
    assertSW('9000');
		if (Record_Out_17[i]!=Record_In_17[i]){
			error('Read SFI=0x17 error');
		}
		Record_Out_19[i]=ReadCappData('C8',Record_In_19[i].substr(0,4));
    assertSW('9000');
		if (Record_Out_19[i]!=Record_In_19[i]){
			error('Read SFI=0x19 error');
		}
		
	}

DOL_DATA['9F66'] = '28000080';
DOL_DATA['DF60'] = '01';
DOL_DATA['9F02'] = '000000000000';
DOL_DATA['DF69'] = '01';
send_GPO();
assertSW('9000');

Record_In_19[3]=Record_In_19[3].substr(0,4)+'35'+random(53);
UpdateCappDataCache('C8',Record_In_19[3],CAPP_KEY_19[3]);

ReadAFL();


