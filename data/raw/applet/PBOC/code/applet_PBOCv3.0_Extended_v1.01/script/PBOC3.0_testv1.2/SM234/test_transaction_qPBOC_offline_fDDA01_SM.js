include('_PBOC_COMMON.js');

reset();

send_Select();

ATC = send('80CA9F3600').substring(6, 10);
//expected_AC();


DOL_DATA['9F66'] = '26000080';
DOL_DATA['DF69'] = '01';
send_GPO();

ReadAFL();

parse_fDDA();

function expected_AC(){
	ATC = '00' + toHex(parseInt(ATC, 16) + 1);
	//var src = '00000000010000000000000001560000000000015600012500123456787000' +ATC + '03900000800000';
	var src = '00000000010000000000000001560000000000015600012500123456787000' +ATC + '039000008000000000000000000000';
	print('--- src: ' +src);
  	AC = ftdesMAC_SM(src, getSK_SM(UDK)).toUpperCase();
	print('---- AC: ' + AC);

}
