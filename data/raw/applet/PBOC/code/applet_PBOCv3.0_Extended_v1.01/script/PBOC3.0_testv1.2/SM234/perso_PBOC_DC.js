include("pboc_reset_Native.js");

send('00A4040007A000000333010100');
auth();

var seq = 0;
// DGI 9104 : GPO Response Data for Contact
data = '82   02 7D00' // Application Interchange Profile
	 + '94   10 08010100100105001801010120010100' // Application File Locator
store('00', '9104', data, false);

// DGI 0101
data = '57   11 6228000100001117D30122010123456789' // Track 2 Equivalent Data
	 + '9F1F 16 30313032303330343035303630373038303930413042' // Track 1 Discretionary Data
	 + '5F20 0F 46554C4C2046554E4354494F4E414C' // Cardholder Name
	 + '9F63 10 11223344556677880000000000000000' // Offline Counter Initial Value
store('00', '0101', data, true);

// DGI 0201
data = '8E   12 0000000000000000410342035E0343031F00' // CVM List
	 + '9F0D 05 F020040000' // Issuer Action Code - Default
	 + '9F0E 05 0050880000' // Issuer Action Code - Denial
	 + '9F0F 05 F020049800' // Issuer Action Code - Online
	 + '5F34 01 01' // PAN Sequence Number
store('00', '0201', data, true);

// DGI 0202
data = '5F30 02 0201' // Service Code
	 + '9F07 02 FFC0' // Application Usage Controle
	 + '9F08 02 0030' // Application Version Number
	 + '9F42 02 0156' // Application Currency Code
	 + '5F28 02 0156' // Issuer Country Code
	 + '8C   18 9F02069F03069F1A0295055F2A029A039F21039C019F3704' // CDOL1
	 + '8D   1A 8A029F02069F03069F1A0295055F2A029A039F21039C019F3704' // CDOL2
	 + '9F49 03 9F3704' // DDOL
	 + '8F   01 80' // Certification Authority Public Key Index
	 + '9F32 01 03' // Issuer Public Key Exponent
	 + '92   24 8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B' // Issuer Public Key Remainder
	 + '9F47 03 010001' // ICC Public Key Exponent
	 + '9F48 24 DA7D9ED0CB4FB9A1182967B17314701AC51969D44B85798C8ECE039CD0C11714E9CC19EB' // ICC Public Key Remainder
store('00', '0202', data, true);

// DGI 0203
data = '90   8180 229103A5E3120F2D2862091176AA2BD4E24D69E7EEF7B9195C91EA0088AECFF47EDFA0BEEF7C391DF3B05F717DCC06FFC8EEFF90BA14212B8A52AD48B33277B2E230D40B3E76DC59778926F1D8739E106CD741DE06A7423DFBA25E02F12E543D13D1B471806526024981B7D26B4BF6E5558604CCC289F59E8A802F45FB3D9E67' // Issuer Public Key Certificate
	 + '8F   01 80' // Certification Authority Public Key Index
	 + '9F32 01 03' // Issuer Public Key Exponent
	 + '92   24 8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B' // Issuer Public Key Remainder
store('00', '0203', data, true);

// DGI 0204
data = '9F46 8180 AD9CEC598E3E2E832842951C834D5E5D802A35C484D46466E62BB9DB3AAD937FE5585CA5017503E6EF72E5A37FC648E4F52B5531139B1358A785B3AE7EDD4E8612C0A9DAFD4F723344D81FE97E753F3C7E026DE1FBEE5741D085A886BC7BD4CC4AA72AD4E444EC29142AF0CADD0DD99A05A946514A9A367D0424ECD69C47A973' // ICC Public Key Certificate
	 + '9F0D 05 7C70B80800' // Issuer Action Code - Default
	 + '9F0E 05 7C70B80800' // Issuer Action Code - Denial
	 + '9F0F 05 0000000000' // Issuer Action Code - Online
	 + '9F47 03 010001' // ICC Public Key Exponent
	 + '9F48 2A 518B0EA3ABA9343F1778545FFB49EE840BBCEA457DBAABBFD755BA0F943A08A59CFFB6066B4084767599' // ICC Public Key Remainder
store('00', '0204', data, true);

// DGI 0205
data = '93   8180 04520EAA68D912ED24DA2A000B0837E51FB76E53A7715C20AFFE8FE1ED2D6D6B5E82BDC27A3031EEB42A768F30AD68C33CB40F8AF1716D49507C764A2215F6CE0B36D0E4B1FACFF912610E8C876AA0AF8464A733A3C854608FF46E22CD5F21DB1E8E831DB19D959ACF2225CBB71A8D63A0F9E4CB1E6B18E9EE43B437DE405289' // Signed Static Application Data
store('00', '0205', data, true);

// DGI 0301
data = '5A   08 6228000100001117' // Application Primary Account Number
	 + '5F24 03 301231' // Application Expiration Date
	 + '5F25 03 950701' // Application Effective Date
	 + '9F08 02 0030' // Application Version Number
store('00', '0301', data, true);

// DGI 0401
data = '9F14 01 03' // Lower Consecutive Offline Limit
	 + '9F23 01 07' // Upper Consecutive Offline Limit
store('00', '0401', data, true);

// DGI 8000 : DES key(s)
data = '112233440066778811223344550077888B4F854F0831FBF2635A212E4DDDB92A11220044556677881122330055667788'
store('60', '8000', data, false);

// DGI 8010 : Offline PIN Block
data = '241234FFFFFFFFFF'
store('60', '8010', data, false);

// DGI 9000 : DES key check values
data = '97DCB0CE4E2CB37DF3'
store('60', '9000', data, false);

// DGI 9010 : PIN Related Data
data = '0303'
store('00', '9010', data, false);

// DGI 8201 : ICC Key CRT constant 1/q mod p
data = '0EB41A42801F08D5C16EE593800E16C42894639D1D16FCD366FE4D80A4154B15FB25AC5C24D7607848B55F022230FE4FAD4913AD526CB928A762F183625D775B8000000000000000'
store('60', '8201', data, false);

// DGI 8202 : ICC Key CRT constant d mod (q - 1)
data = '5A2479BF4799F5A9EF236387F9341203C5091A5B08245F33560DF43EEB6592F73A8F0FC5026B8EBFAA60D1BD76F43F02B2A33ABB40357C0FB9E92568AE02CCB98000000000000000'
store('60', '8202', data, false);

// DGI 8203 : ICC Key CRT constant d mod (p - 1)
data = '3D25ADCD0731EDEBBF3F5B4EFDC13C4DE5D00AFE3CFAA2D9F00B8EED81E36AF8CCC566E050BCA1DEF2CADEAC38F492589A6FD5E7D9D32F3D1758FE0E1E2335418000000000000000'
store('60', '8203', data, false);

// DGI 8204 : ICC Key CRT constant prime factor q
data = 'C1960C87E0333FCBB1C2BBEB787019D6080B33C8F5039C2BD55CC1D247398AA5DBD47FA4E1FF85F425D214B4B32A341E72C1F9FF6765D1155963BEC02E8958D98000000000000000'
store('60', '8204', data, false);

// DGI 8205 : ICC Key CRT constant prime factor p
data = 'D0BAD286ED4E1CBE6CED5391A9696ED58F317E4A52D0E37C755C01225F676AB712A15D1B953BD67FB8DFB610655965352583B46B260E481661DF74FE85C20AC18000000000000000'
store('60', '8205', data, false);

// DGI 0D01
data = '9F58 01 03' // Consecutive Transaction Counter Limit (CTCL)
	 + '9F59 01 07' // Consecutive Transaction Counter Upper Limit (CTCUL)
	 + '9F73 04 20000175' // Currency Conversion Parameters
	 + '9F4F 19 9A039F21039F02069F03069F1A025F2A029F4E149C019F3602' // Log Format
	 + '9F75 06 000000010000' // CTTA Limit (Dual Currency)
	 + '9F53 01 05' // Consecutive Transaction Counter International Limit (CTCIL)
	 + '9F72 01 00' // Consecutive Transaction Counter International Country Limit (CTCICL)
store('00', '0D01', data, false);

// DGI 0E01
data = '9F51 02 0156' // Application Currency Code
	 + '9F52 02 A200' // Application Default Action (ADA)
	 + '9F56 01 80' // Issuer Authentication Indicator
	 + '9F57 02 0156' // Issuer Country Code
	 + '9F36 02 0000'
	 + '9F13 02 0000'
	 + '5F34 01 01' // PAN Sequence Number
	 + '9F76 02 0000'
store('00', '0E01', data, false);

send('Selecttheapplicationresponsedata');
// DGI 9102 : SELECT Response (Common)
data = 'A5   42'
	 + '50   0B 50424F4320437265646974' // Application Label
	 + '87   01 01' // Application Priority Indicator
	 + '5F2D 08 7A68656E66726465' // Laguage Preference
	 + '9F11 01 01' // Issuer Code Table Index
	 + '9F12 0F 4341524420494D4147452030303232'
	 + '9F38 06 9F33039F4E14' // PDOL
	 + 'BF0C 05' // FCI Issuer Discretionary Data
	 + '9F4D 02 0B0A' // Log Entry
store('00', '9102', data, false);

// DGI 9103 : SELECT Response (Contactless)
data = 'A5   5D'
	 + '50   0B 50424F4320437265646974' // Application Label
	 + '87   01 01' // Application Priority Indicator
	 + '5F2D 08 7A68656E66726465' // Laguage Preference
	 + '9F11 01 01' // Issuer Code Table Index
	 + '9F12 0F 4341524420494D4147452030303232'
	 + '9F38 21 9F66049F02069F03069F1A0295055F2A029A039C019F37049F33039F4E149F7A01' // PDOL
	 + 'BF0C 05' // FCI Issuer Discretionary Data
	 + '9F4D 02 0B0A' // Log Entry
store('00', '9103', data, false);

// DGI 9200
data = '9F10 08 0701010300000001' // Issuer Application Data (IAD)
store('80', '9200', data, false);


function store(P1, DGI, data, isRec){
	data = data.replace(/(\s*)/g,'');
	len = data.length/2;
	if(isRec){
		data = '70' + (len > 0x7F ? '81' + toHex(len) : toHex(len)) + data;
		len = data.length/2;
	}
	if((parseInt(P1, 16) & 0x60) == 0x60 && len % 8 == 0) data = encrypt_data(data);
	send('80E2' + P1 + toHex(seq++) + toHex(len+3) + DGI + toHex(len) + data);
	assertSW('9000');
}



include("perso_PSE.js");

