include('_PBOC_COMMON.js');

reset();

send_Select();

ATC = send('80CA9F3600').substring(6, 10);
//expected_AC();


DOL_DATA['9F66'] = '20000000';
DOL_DATA['DF69'] = '00';
send_GPO();

ReadAFL();

parse_fDDA();

function expected_AC(){
	ATC = '00' + toHex(parseInt(ATC, 16) + 1);
	//var src = '00000000010000000000000001560000000000015600012500123456787000' +ATC + '03900000800000';
	var src = '0000000001000000000000001560000000000015600012500123456787000' +ATC + '039000008000000000000000000000'; // CVN10
	var src = '00000000010012345678' +ATC + '90800000'; // CVN11
	print('--- src: ' +src);
  	AC = ftdesMAC_SM(src, getSK_SM(UDK)).toUpperCase();
	print('---- AC: ' + AC);

}
