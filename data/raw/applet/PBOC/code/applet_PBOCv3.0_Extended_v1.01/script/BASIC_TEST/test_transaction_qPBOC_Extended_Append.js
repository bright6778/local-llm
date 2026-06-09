include("_PBOC_COMMON.js");
reset();
send_select();
assertSW('9000');


send_get_data('9F36');
assertSW("9000");

Record_In_19[1]="0001357D8D55F7F201515C5FE74E2FDFFC549E065461D019A2D72286F0C19E9068429AEDD710BFB230F072E8A569BD667F3E45B765BF6D8C";
print("Record_In_19[1]="+Record_In_19[1]);
Record_In_19[2]="000235"+random(53);
print("Record_In_19[2]="+Record_In_19[2]);
Record_In_19[3]="000335"+random(53);
print("Record_In_19[3]="+Record_In_19[3]);

send_append_record("c8",Record_In_19[1],Ini_key['C8'],CAPP_KEY_19[1]);
assertSW("9000");
send_append_record("c8",Record_In_19[2],Ini_key['C8'],CAPP_KEY_19[2]);
assertSW("9000");
send_append_record("c8",Record_In_19[3],Ini_key['C8'],CAPP_KEY_19[3]);
assertSW("9000");



Record_In_1E[1]=random(64);
print("Record_In_1E[1]="+Record_In_1E[1]);
send_append_record("F0",Record_In_1E[1],Ini_key['F0'],CAPP_KEY_1E[1]);
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

send_append_record("B8",Record_In_17[1],Ini_key['B8'],CAPP_KEY_17[1]);
assertSW("9000");
send_append_record("B8",Record_In_17[2],Ini_key['B8'],CAPP_KEY_17[2]);
assertSW("9000");
send_append_record("B8",Record_In_17[3],Ini_key['B8'],CAPP_KEY_17[3]);
assertSW("9000");
send_append_record("B8",Record_In_17[4],Ini_key['B8'],CAPP_KEY_17[4]);
assertSW("9000");
send_append_record("B8",Record_In_17[5],Ini_key['B8'],CAPP_KEY_17[5]);
assertSW("9000");
send_append_record("B8",Record_In_17[6],Ini_key['B8'],CAPP_KEY_17[6]);
assertSW("9000");
send_append_record("B8",Record_In_17[7],Ini_key['B8'],CAPP_KEY_17[7]);
assertSW("9000");


Record_In_15[1]="00017D"+random(125);
print("Record_In_15[1]="+Record_In_15[1]);
Record_In_15[2]="00027D"+random(125);
print("Record_In_15[2]="+Record_In_15[2]);
Record_In_15[3]="00037D"+random(125);
print("Record_In_15[3]="+Record_In_15[3]);
Record_In_15[4]="00047D"+random(125);
print("Record_In_15[4]="+Record_In_15[4]);

send_append_record("A8",Record_In_15[1],Ini_key['A8'],CAPP_KEY_15[1]);
assertSW("9000");
send_append_record("A8",Record_In_15[2],Ini_key['A8'],CAPP_KEY_15[2]);
assertSW("9000");
send_append_record("A8",Record_In_15[3],Ini_key['A8'],CAPP_KEY_15[3]);
assertSW("9000");
send_append_record("A8",Record_In_15[4],Ini_key['A8'],CAPP_KEY_15[4]);
assertSW("9000");

Record_In_16[1]="00017D"+random(125);
print("Record_In_16[1]="+Record_In_16[1]);
Record_In_16[2]="00027D"+random(125);
print("Record_In_16[2]="+Record_In_16[2]);

send_append_record("B0",Record_In_16[1],Ini_key['B0'],CAPP_KEY_16[1]);
assertSW("9000");
send_append_record("B0",Record_In_16[2],Ini_key['B0'],CAPP_KEY_16[2]);
assertSW("9000");

