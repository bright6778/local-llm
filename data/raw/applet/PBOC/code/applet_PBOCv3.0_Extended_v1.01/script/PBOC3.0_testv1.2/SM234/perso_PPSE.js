reset();

// PPSE
send('00A4040008A00000000300000000');
auth();

send('80E60C002406A0000003330107A00000033301010E325041592E5359532E4444463031010002C90000');
send('00A404000E325041592E5359532E444446303100');
auth();

var seq = 0;
// DGI 9102 : SELECT Response (Common)
data = TLV('A5',   
						   TLV('BF0C',  // FCI Issuer Discretionary Data
							   TLV('61',   
								   TLV('4F',   'A0000003330101') // Application Identifier
								 + TLV('50',   '50424F4320437265646974') // Application Label
								 + TLV('87',   '01') // Application Priority Indicator
								)
							)
						)
store('80', '9102', data);

function TLV(tag, data){
	len = data.replace(/(\s*)/g,'').length/2;
	return tag + (len > 0x7F ? '81' + toHex(len) : toHex(len)) + data;
}

function store(P1, DGI, data){
	len = data.replace(/(\s*)/g,'').length/2;
	if((parseInt(P1, 16) & 0x60) == 0x60 && len % 8 == 0) data = encrypt_data(data);
	send('80E2' + P1 + toHex(seq++) + toHex(len+3) + DGI + toHex(len) + data);
	assertSW('9000');
}


