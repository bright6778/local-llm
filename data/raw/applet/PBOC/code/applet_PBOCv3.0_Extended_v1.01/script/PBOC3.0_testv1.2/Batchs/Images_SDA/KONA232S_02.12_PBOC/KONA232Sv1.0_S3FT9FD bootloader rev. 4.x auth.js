var RND_PCD = '1122334455667788';
var K_PCD = '404142434445464748494A4B4C4D4E4F';
// var Kseed = '239AB9CB282DAF66231DC5A4DF6BFBAE'; //default Kseed
var Kseed = '4B4F4E41323332530001C739663E94BB';	//customer Kseed

// Kenc, Kmac Derivation code
// Todo
var Kenc = DerivationKey(Kseed, 'enc');	//'AB94FDECF2674FDFB9B391F85D7F76F2'
var Kmac = DerivationKey(Kseed, 'mac'); //'7962D9ECE03D1ACD4C76089DCE131543'

print('Kenc \t\t: ' + Kenc);
print('Kmac \t\t: ' + Kmac);
reset();

// get challenge
var RND_PICC = send('0084000008');
assertSW('9000');

var S = RND_PCD + RND_PICC + K_PCD;

var E_PCD = tdes_cbc(S, Kenc);
var M_PCD = create_mac(E_PCD+'8000000000000000', Kmac);
var CDATA = E_PCD + M_PCD;

// send('0017000010'+Kseed);
send('0017000000');
assertSW('9000');

var RCV_DATA = send('0019000028'+CDATA);
//var RCV_DATA = sendWithMAC('0019000028'+CDATA);
assertSW('9000');

var R_dec = tdes_cbc_dec(RCV_DATA, Kenc);
var RCV_RND_PICC = R_dec.substr(0,16).toUpperCase();
var RCV_RND_PCD = R_dec.substr(16,16).toUpperCase();
var K_PICC = R_dec.substr(32,32).toUpperCase();
if(RND_PCD != RCV_RND_PCD)
	error('different RND.PCD');
print('RND.PICC\t\t: ' + RCV_RND_PICC);
print('RND.PCD\t\t: ' + RCV_RND_PCD);
print('K.PICC\t\t: ' + K_PICC);
var Kseed1 = xor(K_PCD, K_PICC);
print('Kseed1\t\t: ' + Kseed1);

var KSenc = DerivationKey(Kseed1, 'enc');
var KSmac = DerivationKey(Kseed1, 'mac');

print('KSenc\t\t: ' + KSenc);
print('KSmac\t\t: ' + KSmac);

KSenc = '4B4F4E41323332530002C739663E94BB'; // User defined encryption key.



/****************************************************************/
/*						Function define							*/
/****************************************************************/

function DerivationKey(seed, type){
	var enc, mac;
	switch(type){
	case 'enc':
		enc = OddParity(messageDigest_SHA1(seed + '00000001').substr(0,32));
		return enc;
	case 'mac':
		mac = OddParity(messageDigest_SHA1(seed + '00000002').substr(0,32));
		return mac;
	default:
		error('wrong parameter: type is \'enc\' or \'mac\'');
	}
}


function OddParity(a){
	var Parity = '';
	for(j = 0 ; j < 16; j++){
		tmp = parseInt('0x'+a.substr(j*2, 2));
		cnt = 0;
		for(i = 0 ; i < 7 ; i++){
			if(tmp&(0x80>>i))
				cnt++;
		}
		if(cnt%2)
			tmp &= 0xFE;
		else
			tmp |= 0x01;
		tmp = tmp.toString(16).toUpperCase();
		if(tmp.length == 1){
			tmp = '0' + tmp;
		}
		Parity += tmp;
	}
	return Parity;
}