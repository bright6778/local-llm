include('_PERSO_CONF.js');
reset();

// PSE
select('A0');
auth();

send('80E40000104F0E315041592E5359532E444446303100');
data = toHex(pse_package_aid.length/2) + pse_package_aid + toHex(pse_applet_aid.length/2) + pse_applet_aid + "0E315041592E5359532E4444463031010002C90000";
send("80E60C00" + toHex(data.length/2) + data);
send('00A404000E315041592E5359532E444446303100');
auth();

var seq = 0;
// DGI 0101
data = TLV('70',   
						   TLV('61',   
							   TLV('4F',   'A0000003330101') // Application Identifier
							 + TLV('50',   '50424F4320437265646974') // Application Label
							)
						 + TLV('61',   
							   TLV('4F',   'A0000003330102') // Application Identifier
							 + TLV('50',   '50424F4320437265646974') // Application Label
							)
						 + TLV('61',   
							   TLV('4F',   'A0000003330103') // Application Identifier
							 + TLV('50',   '50424F4320437265646974') // Application Label
							)
						)
store('00', '0101', data);

// DGI 9102 : SELECT Response (Common)
data = TLV('A5',   
						   TLV('88',   '01')
						)
store('80', '9102', data);

