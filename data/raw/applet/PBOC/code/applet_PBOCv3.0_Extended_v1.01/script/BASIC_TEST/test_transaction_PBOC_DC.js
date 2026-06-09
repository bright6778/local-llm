include('_PBOC_COMMON.js'); 

print('**********************************************************');
print('**********************************************************');
print('*               DEBIT / CREDIT');
print('**********************************************************');
print('**********************************************************\n');


print('**********************************************************');
print('*               Offline Transaction');
print('**********************************************************');
reset();

send_select();
assertSW('9000');

DOL_DATA['9F66'] = 'F6000000';
send_gpo();
assertSW('9000');

read_afl();

parse_SDA();

if((parseInt(CARD_DATA['82'].substring(0, 2), 16) & 0x20) == 0x20){
	send_internal_auth();
	if(validateDDA){
		assertSW('9000');
	}
}

send_gen_ac((parseInt(CARD_DATA['82'].substring(0, 2), 16) & 0x02) == 0x02? '50' : '40', CDOL1);
assertSW('9000');


print('**********************************************************');
print('*               Online Transaction');
print('**********************************************************');
reset();

send_select();
assertSW('9000');

DOL_DATA['9F66'] = 'F6000000';
send_gpo();
assertSW('9000');

read_afl();

var rec = send_read_record(1, 1);

send_verify('1234', false);
var supportPIN = true;
if(getSW() == '6A81'){
	print('* - PIN is not supported!!!');
	supportPIN = false;
}
else{
	assertSW('9000');

	if(validateDDA){
		send_get_challenge();
		assertSW('9000');

		send_verify('1234', true);
		assertSW('9000');
	}
}


send_gen_ac('80'); // 1st GenAC
assertSW('9000');

send_external_auth('3030');
assertSW('9000');

send_gen_ac('40'); // 2nd GenAC 
assertSW('9000');

send_app_block();
assertSW('9000');

send_app_unblock();
assertSW('9000');

send_get_data('9F58');
assertSW('9000');

send_put_data('9F58', CARD_DATA['9F58']);
assertSW('9000');

if(rec != null){
	send_update_record(1, 1, rec);
	assertSW('9000');
}

if(supportPIN){
	send_pin_unblock();
	assertSW('9000');

	send_pin_change('1234');
	assertSW('9000');
}





