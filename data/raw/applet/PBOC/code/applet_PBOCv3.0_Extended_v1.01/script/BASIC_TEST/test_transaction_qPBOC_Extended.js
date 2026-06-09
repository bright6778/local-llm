include("_PBOC_COMMON.js");
reset();

send_select(AID_PPSE);
assertSW('9000');
send_select();
assertSW("9000");


send_read_capp("C8",Record_In_19[1].substr(0,4), true);
assertSW("9000");

DOL_DATA['9F66'] = '20100080';
DOL_DATA['DF60'] ='01';
DOL_DATA['9F02'] = '000000000000';
send_gpo();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"35"+random(53);
send_update_capp("C8",Record_In_19[1],CAPP_KEY_19[1]);

read_afl();


