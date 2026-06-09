reset();

send('00A4040007A000000333010100');
auth();

var seq = 0;
// DGI 9104 : GPO Response Data for Contact
data = TLV('82',   '5C00') // Application Interchange Profile
	 + TLV('94',   '08010100100105001801010120010100') // Application File Locator
store('00', '9104', data);

// DGI 9105
data = TLV('82',   '5C00') // Application Interchange Profile
	 + TLV('94',   '0801010010010100280205001801010120010100') // Application File Locator
store('00', '9105', data);

// DGI 9203
data = TLV('82',   '7800') // Application Interchange Profile
	 + TLV('94',   '08010100100205001802020118040400') // Application File Locator
store('00', '9203', data);

// DGI 9204
data = TLV('82',   '7800') // Application Interchange Profile
	 + TLV('94',   '08010100280205001802020118040400') // Application File Locator
store('00', '9204', data);

// DGI 9207 : GPO Response Data for Contactless
data = TLV('82',   '7000') // Application Interchange Profile
	 + TLV('9F10', '07010103000000010A01') // Issuer Application Data (IAD)
	 + TLV('94',   '1003050018030300') // Application File Locator
store('00', '9207', data);

// DGI 9208
data = TLV('82',   '7000') // Application Interchange Profile
	 + TLV('94',   '280305001801010118030300') // Application File Locator
	 + TLV('9F10', '07010103000000040A01') // Issuer Application Data (IAD)
store('00', '9208', data);

// DGI 0101
data = TLV('70',   
		   TLV('57',   '6228000100001117D30122010123456789') // Track 2 Equivalent Data
		 + TLV('9F1F', '30313032303330343035303630373038303930413042') // Track 1 Discretionary Data
		 + TLV('5F20', '46554C4C2046554E4354494F4E414C') // Cardholder Name
		 + TLV('9F63', '11223344556677880000000000000000') // Offline Counter Initial Value
		)
store('00', '0101', data);

// DGI 0201
data = TLV('70',   
		   TLV('8E',   '0000000000000000410342035E0343031F00') // CVM List
		 + TLV('9F0D', 'F020040000') // Issuer Action Code - Default
		 + TLV('9F0E', '0050880000') // Issuer Action Code - Denial
		 + TLV('9F0F', 'F020049800') // Issuer Action Code - Online
		 + TLV('5F34', '01') // PAN Sequence Number
		)
store('00', '0201', data);

// DGI 0202
data = TLV('70',   
		   TLV('5F30', '0201') // Service Code
		 + TLV('9F07', 'FFC0') // Application Usage Controle
		 + TLV('9F08', '0030') // Application Version Number
		 + TLV('9F42', '0156') // Application Currency Code
		 + TLV('5F28', '0156') // Issuer Country Code
		 + TLV('8C',   '9F02069F03069F1A0295055F2A029A039F21039C019F3704') // CDOL1
		 + TLV('8D',   '8A029F02069F03069F1A0295055F2A029A039F21039C019F3704') // CDOL2
		 + TLV('9F49', '9F3704') // DDOL
		 + TLV('8F',   '80') // Certification Authority Public Key Index
		 + TLV('9F32', '03') // Issuer Public Key Exponent
		 + TLV('92',   '8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B') // Issuer Public Key Remainder
		 + TLV('9F47', '010001') // ICC Public Key Exponent
		 + TLV('9F48', '518B0EA3ABA9343F1778545FFB49EE840BBCEA457DBAABBFD755BA0F943A08A59CFFB6066B4084767599') // ICC Public Key Remainder
		)
store('00', '0202', data);

// DGI 0203
data = TLV('70',   
		   TLV('90',   '229103A5E3120F2D2862091176AA2BD4E24D69E7EEF7B9195C91EA0088AECFF47EDFA0BEEF7C391DF3B05F717DCC06FFC8EEFF90BA14212B8A52AD48B33277B2E230D40B3E76DC59778926F1D8739E106CD741DE06A7423DFBA25E02F12E543D13D1B471806526024981B7D26B4BF6E5558604CCC289F59E8A802F45FB3D9E67') // Issuer Public Key Certificate
		 + TLV('8F',   '80') // Certification Authority Public Key Index
		 + TLV('9F32', '03') // Issuer Public Key Exponent
		 + TLV('92',   '8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B') // Issuer Public Key Remainder
		)
store('00', '0203', data);

// DGI 0204
data = TLV('70',   
		   TLV('9F46', '1C2AC662801523E1584B22DBE2C6AE270723D897FB197B70C5DABAF990D19637C2956021339706266E4EC3127C738A656024254507C81217CD84843DCE6D6583D162E4D4B11936F24887797F3E3ABB3A66C0FD2454C487C8FD00F51389612D83B7D048AC99565399D75C219668A6DA4130BF17A8BC3B779F4D790170A72172C7') // ICC Public Key Certificate
		 + TLV('9F0D', '7C70B80800') // Issuer Action Code - Default
		 + TLV('9F0E', '7C70B80800') // Issuer Action Code - Denial
		 + TLV('9F0F', '0000000000') // Issuer Action Code - Online
		 + TLV('9F47', '010001') // ICC Public Key Exponent
		 + TLV('9F48', '518B0EA3ABA9343F1778545FFB49EE840BBCEA457DBAABBFD755BA0F943A08A59CFFB6066B4084767599') // ICC Public Key Remainder
		)
store('00', '0204', data);

// DGI 0205
data = TLV('70',   
		   TLV('93',   '229103A5E3120F2D2862091176AA2BD4E24D69E7EEF7B9195C91EA0088AECFF47EDFA0BEEF7C391DF3B05F717DCC06FFC8EEFF90BA14212B8A52AD48B33277B2E230D40B3E76DC59778926F1D8739E106CD741DE06A7423DFBA25E02F12E543D13D1B471806526024981B7D26B4BF6E5558604CCC289F59E8A802F45FB3D9E67') // Signed Static Application Data
		 + TLV('5A',   '6228000100001117') // Application Primary Account Number
		 + TLV('5F24', '301231') // Application Expiration Date
		 + TLV('5F25', '950701') // Application Effective Date
		 + TLV('9F08', '0030') // Application Version Number
		 + TLV('5F28', '0156') // Issuer Country Code
		)
store('00', '0205', data);

// DGI 0301
data = TLV('70',   
		   TLV('5A',   '6228000100001117') // Application Primary Account Number
		 + TLV('5F24', '301231') // Application Expiration Date
		 + TLV('5F25', '950701') // Application Effective Date
		 + TLV('9F08', '0030') // Application Version Number
		)
store('00', '0301', data);

// DGI 0302
data = TLV('70',   
		   TLV('5A',   '6228000100001117') // Application Primary Account Number
		 + TLV('5F24', '301231') // Application Expiration Date
		 + TLV('9F07', 'FFC0') // Application Usage Controle
		 + TLV('8E',   '00000000000000000100') // CVM List
		 + TLV('9F0D', '7C70B80800') // Issuer Action Code - Default
		 + TLV('9F0E', '7C70B80800') // Issuer Action Code - Denial
		 + TLV('9F0F', '0000000000') // Issuer Action Code - Online
		 + TLV('5F28', '0156') // Issuer Country Code
		)
store('00', '0302', data);

// DGI 0303
data = TLV('70',   
		   TLV('9F74', '454343313131')
		 + TLV('9F69', '0100000000300000') // Card Authentication Related Data
		)
store('00', '0303', data);

// DGI 0304
data = TLV('70',   
		   TLV('9F74', '454343313131')
		)
store('00', '0304', data);

// DGI 0401
data = TLV('70',   
		   TLV('9F14', '03') // Lower Consecutive Offline Limit
		 + TLV('9F23', '07') // Upper Consecutive Offline Limit
		)
store('00', '0401', data);

// DGI 0502
data = TLV('70',   
		   TLV('5F30', '0201') // Service Code
		 + TLV('9F07', 'FFC0') // Application Usage Controle
		 + TLV('9F08', '0030') // Application Version Number
		 + TLV('9F42', '0156') // Application Currency Code
		 + TLV('5F28', '0156') // Issuer Country Code
		 + TLV('8C',   '9F02069F03069F1A0295055F2A029A039F21039C019F3704') // CDOL1
		 + TLV('8D',   '8A029F02069F03069F1A0295055F2A029A039F21039C019F3704') // CDOL2
		 + TLV('9F49', '9F3704') // DDOL
		)
store('00', '0502', data);

// DGI 0503
data = TLV('70',   
		   TLV('90',   '12622800011220000001040011409F483BF2CC71C5093728318061E3F768EA7C170F82DD8C4B979FBD8C76A129F93FB5746E96F5E49B987FFB521E473B25E1B017C30BE3FC638BA14D5FA4AADC1673DF81BF5CC82AABB7CF3C9165EDEEA2EC0CCC56AB19F1661E012CD33D4BFBEC55A88990EB25B4A4058C8E4B11C1F9EA2055E403CA76AC8A991DE80A35BED348') // Issuer Public Key Certificate
		 + TLV('8F',   '57') // Certification Authority Public Key Index
		)
store('00', '0503', data);

// DGI 0504
data = TLV('70',   
		   TLV('9F46', '146228000100001117FFFF122000000104000440C3AC12B81B9D175936B5BF72BB8FE3A2266BC013B2E94F5837F16AA1C01AA7323B75626AB64D02AED20CC6F440841F10EE6873BCBEA3F41D6869D0FEADD711547817D243286F51A55694D3C728191F067A6C194B4B20C558A97565C5B9BFDB46D2E53C0F5DDC7C808BD0DB8C770DCA9B6F626BF5ECE8EA98EA7F758783CAF310') // ICC Public Key Certificate
		 + TLV('9F0D', '7C70B80800') // Issuer Action Code - Default
		 + TLV('9F0E', '7C70B80800') // Issuer Action Code - Denial
		 + TLV('9F0F', '0000000000') // Issuer Action Code - Online
		)
store('00', '0504', data);

// DGI 0505
data = TLV('70',   
		   TLV('93',   '13DAC197C8713D8B0670C48847895875D6B153C3539172A493B51C6966F4048560FAD07290AF31A0B14D9759197E3BAFA805A5E3FFCCCA036B783B32076CD713C30C5F') // Signed Static Application Data
		 + TLV('5A',   '6228000100001117') // Application Primary Account Number
		 + TLV('5F24', '301231') // Application Expiration Date
		 + TLV('5F25', '950701') // Application Effective Date
		 + TLV('9F08', '0030') // Application Version Number
		 + TLV('5F28', '0156') // Issuer Country Code
		)
store('00', '0505', data);

// DGI 8000 : DES key(s)
data = '112233440066778811223344550077888B4F854F0831FBF2635A212E4DDDB92A11220044556677881122330055667788';
store('60', '8000', data);

// DGI 9000 : DES key check values
data = '97DCB0CE4E2CB37DF3';
store('60', '9000', data);

// DGI 8400
data = '112233440066778811223344550077888B4F854F0831FBF2635A212E4DDDB92A11220044556677881122330055667788';
store('60', '8400', data);

// DGI 9400
data = '97DCB0CE4E2CB37DF3';
store('60', '9400', data);

// DGI 8010 : Offline PIN Block
data = '241234FFFFFFFFFF';
store('60', '8010', data);

// DGI 9010 : PIN Related Data
data = '0303';
store('00', '9010', data);

// DGI 8201 : ICC Key CRT constant 1/q mod p
data = '0EB41A42801F08D5C16EE593800E16C42894639D1D16FCD366FE4D80A4154B15FB25AC5C24D7607848B55F022230FE4FAD4913AD526CB928A762F183625D775B8000000000000000';
store('60', '8201', data);

// DGI 8202 : ICC Key CRT constant d mod (q - 1)
data = '5A2479BF4799F5A9EF236387F9341203C5091A5B08245F33560DF43EEB6592F73A8F0FC5026B8EBFAA60D1BD76F43F02B2A33ABB40357C0FB9E92568AE02CCB98000000000000000';
store('60', '8202', data);

// DGI 8203 : ICC Key CRT constant d mod (p - 1)
data = '3D25ADCD0731EDEBBF3F5B4EFDC13C4DE5D00AFE3CFAA2D9F00B8EED81E36AF8CCC566E050BCA1DEF2CADEAC38F492589A6FD5E7D9D32F3D1758FE0E1E2335418000000000000000';
store('60', '8203', data);

// DGI 8204 : ICC Key CRT constant prime factor q
data = 'C1960C87E0333FCBB1C2BBEB787019D6080B33C8F5039C2BD55CC1D247398AA5DBD47FA4E1FF85F425D214B4B32A341E72C1F9FF6765D1155963BEC02E8958D98000000000000000';
store('60', '8204', data);

// DGI 8205 : ICC Key CRT constant prime factor p
data = 'D0BAD286ED4E1CBE6CED5391A9696ED58F317E4A52D0E37C755C01225F676AB712A15D1B953BD67FB8DFB610655965352583B46B260E481661DF74FE85C20AC18000000000000000';
store('60', '8205', data);

// DGI 8501
data = '4EFF3E9B796688F38E006DEB21E101C01028903A06023AC5AAB8635F8E307A538000000000000000';
store('60', '8501', data);

// DGI 8502
data = 'C3AC12B81B9D175936B5BF72BB8FE3A2266BC013B2E94F5837F16AA1C01AA7323B75626AB64D02AED20CC6F440841F10EE6873BCBEA3F41D6869D0FEADD711548000000000000000';
store('60', '8502', data);

// DGI 0D01
data = TLV('9F58', '03') // Consecutive Transaction Counter Limit (CTCL)
	 + TLV('9F59', '07') // Consecutive Transaction Counter Upper Limit (CTCUL)
	 + TLV('9F73', '20000175') // Currency Conversion Parameters
	 + TLV('9F4F', '9A039F21039F02069F03069F1A025F2A029F4E149C019F3602') // Log Format
	 + TLV('9F54', '000000007000') // Cumulative Total Transaction Amount Limit (CTTAL)
	 + TLV('9F75', '000000010000') // CTTA Limit (Dual Currency)
	 + TLV('DF4F', '9A039F21039F1A029F4E149C019F3602')
	 + TLV('9F77', '000000015000') // VLP Funds Limit
	 + TLV('9F78', '000000001000') // VLP Single Transaction Limit
	 + TLV('9F79', '000000010000') // VLP Available Funds
	 + TLV('9F6D', '000000001500') // VLP Reset Threshold
	 + TLV('9F6B', '000000001100') // Card CVM Limit
	 + TLV('9F6C', '3000') // Card Transaction Qualifiers
	 + TLV('9F53', '03') // Consecutive Transaction Counter International Limit (CTCIL)
	 + TLV('9F72', '00') // Consecutive Transaction Counter International Country Limit (CTCICL)
	 + TLV('9F5D', '000000000001') // Available Offline Spending Amount
	 + TLV('9F68', '81102000') // Card Additional Processes
store('00', '0D01', data);

// DGI 0E01
data = TLV('9F51', '0156') // Application Currency Code
	 + TLV('9F52', '8240') // Application Default Action (ADA)
	 + TLV('9F56', '80') // Issuer Authentication Indicator
	 + TLV('9F57', '0156') // Issuer Country Code
	 + TLV('9F36', '0000')
	 + TLV('9F13', '0000')
	 + TLV('5F34', '01') // PAN Sequence Number
	 + TLV('9F76', '0000')
	 + TLV('DF71', '0344')
	 + TLV('DF79', '000000020000')
	 + TLV('DF77', '000000030000')
	 + TLV('DF78', '000000002000')
	 + TLV('DF76', '000000003000')
	 + TLV('DF72', '000000000500')
store('00', '0E01', data);

// DGI 9102 : SELECT Response (Common)
data = TLV('A5',   
		   TLV('50',   '50424F4320437265646974') // Application Label
		 + TLV('87',   '01') // Application Priority Indicator
		 + TLV('5F2D', '7A68656E66726465') // Laguage Preference
		 + TLV('9F11', '01') // Issuer Code Table Index
		 + TLV('9F12', '4341524420494D4147452030303031')
		 + TLV('9F38', '9F1A029F7A019F02065F2A029F4E14DF6901') // PDOL
		 + TLV('BF0C',  // FCI Issuer Discretionary Data
			   TLV('9F4D', '0B0A') // Log Entry
			 + TLV('DF4D', '0C0A')
			)
		)
store('00', '9102', data);

// DGI 9103 : SELECT Response (Contactless)
data = TLV('A5',   
		   TLV('50',   '50424F4320437265646974') // Application Label
		 + TLV('87',   '01') // Application Priority Indicator
		 + TLV('5F2D', '7A68656E66726465') // Laguage Preference
		 + TLV('9F11', '01') // Issuer Code Table Index
		 + TLV('9F12', '4341524420494D4147452030303031')
		 + TLV('9F38', '9F66049F02069F03069F1A0295055F2A029A039C019F3704DF6901') // PDOL
		 + TLV('BF0C',  // FCI Issuer Discretionary Data
			   TLV('9F4D', '0B0A') // Log Entry
			 + TLV('DF4D', '0C0A')
			)
		)
store('00', '9103', data);

// DGI 9200
data = TLV('9F10', '07010103000000010A01') // Issuer Application Data (IAD)
store('00', '9200', data);

// DGI 9201
data = TLV('9F10', '07010103000000040A01') // Issuer Application Data (IAD)
store('80', '9201', data);


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



include("perso_PSE.js");
include("perso_PPSE.js");

