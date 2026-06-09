include('pboc_reset.js');

var seq = 0;
// DGI 9104 : GPO Response Data for Contact
/*
* SFI : 1  Record Number : 1
* SFI : 2  Record Number : 1
* SFI : 2  Record Number : 2
* SFI : 2  Record Number : 3
* SFI : 2  Record Number : 4
* SFI : 3  Record Number : 1 (include SDA)
* SFI : 4  Record Number : 1
* SFI : 4  Record Number : 2
* SFI : 4  Record Number : 3
*/
data = TLV('82',   '5C00') // Application Interchange Profile
	 + TLV('94',   '08010100 10010400 18010101 20010300') // Application File Locator
store('00', '9104', data);

// DGI 9203
/*
* SFI : 1  Record Number : 1
* SFI : 2  Record Number : 2
* SFI : 2  Record Number : 3
* SFI : 2  Record Number : 4
* SFI : 3  Record Number : 2 (include SDA)
* SFI : 3  Record Number : 4
* SFI : 3  Record Number : 5
* SFI : 3  Record Number : 6
*/
data = TLV('82',   '7800') // Application Interchange Profile
	 + TLV('94',   '08010100 10020400 18020201 18040600') // Application File Locator
store('00', '9203', data);

// DGI 9207 : GPO Response Data for Contactless
/*
* SFI : 2  Record Number : 3
* SFI : 2  Record Number : 4
* SFI : 2  Record Number : 5
* SFI : 2  Record Number : 6
* SFI : 3  Record Number : 3
*/
data = TLV('82',   '7000') // Application Interchange Profile
	 + TLV('9F10', '07010103000000010A01') // Issuer Application Data (IAD)
	 + TLV('94',   '10030600 18030300') // Application File Locator
store('00', '9207', data);

// DGI 0101 - DC, EC
data = TLV('70',   
		   TLV('57',   '6228000100001117D30122010123456789') // Track 2 Equivalent Data
		 + TLV('9F1F', '30313032303330343035303630373038303930413042') // Track 1 Discretionary Data
		 + TLV('5F20', '46554C4C2046554E4354494F4E414C') // Cardholder Name
		 + TLV('9F63', '11223344556677880000000000000000') // Offline Counter Initial Value
		)
store('00', '0101', data);

// DGI 0201 - DC
data = TLV('70',   
		   TLV('8E',   '0000000000000000410342035E0343031F00') // CVM List
		 + TLV('9F0D', 'F020040000') // Issuer Action Code - Default
		 + TLV('9F0E', '0050880000') // Issuer Action Code - Denial
		 + TLV('9F0F', 'F020049800') // Issuer Action Code - Online
		 + TLV('5F34', '01') // PAN Sequence Number
		)
store('00', '0201', data);

// DGI 0202 - DC, EC
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
		 + TLV('9F48', 'DA7D9ED0CB4FB9A1182967B17314701AC51969D44B85798C8ECE039CD0C11714E9CC19EB') // ICC Public Key Remainder
		)
store('00', '0202', data);

// DGI 0203 - DC, EC, qPBOC
data = TLV('70',   
		   TLV('90',   '229103A5E3120F2D2862091176AA2BD4E24D69E7EEF7B9195C91EA0088AECFF47EDFA0BEEF7C391DF3B05F717DCC06FFC8EEFF90BA14212B8A52AD48B33277B2E230D40B3E76DC59778926F1D8739E106CD741DE06A7423DFBA25E02F12E543D13D1B471806526024981B7D26B4BF6E5558604CCC289F59E8A802F45FB3D9E67') // Issuer Public Key Certificate
		 + TLV('8F',   '80') // Certification Authority Public Key Index
		 + TLV('9F32', '03') // Issuer Public Key Exponent
		 + TLV('92',   '8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B') // Issuer Public Key Remainder
		)
store('00', '0203', data);

// DGI 0204 - DC, EC, qPBOC
data = TLV('70',   
		   TLV('5A',   '6228000100001117') // Application Primary Account Number
		 + TLV('5F24', '301231') // Application Expiration Date
		 + TLV('5F25', '950701') // Application Effective Date
		 + TLV('9F08', '0030') // Application Version Number
		 + TLV('5F28', '0156') // Issuer Country Code
		 + TLV('9F0D', '7C70B80800') // Issuer Action Code - Default
		 + TLV('9F0E', '7C70B80800') // Issuer Action Code - Denial
		 + TLV('9F0F', '0000000000') // Issuer Action Code - Online
		 + TLV('9F47', '010001') // ICC Public Key Exponent
		 + TLV('9F48', '518B0EA3ABA9343F1778545FFB49EE840BBCEA457DBAABBFD755BA0F943A08A59CFFB6066B4084767599') // ICC Public Key Remainder
		)
store('00', '0204', data);

// DGI 0205 - qPBOC
data = TLV('70',   
		   TLV('9F46',   '1C2AC662801523E1584B22DBE2C6AE270723D897FB197B70C5DABAF990D19637C2956021339706266E4EC3127C738A656024254507C81217CD84843DCE6D6583D162E4D4B11936F24887797F3E3ABB3A66C0FD2454C487C8FD00F51389612D83B7D048AC99565399D75C219668A6DA4130BF17A8BC3B779F4D790170A72172C7') // ICC Public Key Certificate
		)
store('00', '0205', data);

// DGI 0206 - qPBOC
data = TLV('70',   
		   TLV('93',   '322D27960C996558B01F00805AAA5BA0DC92FAF10A4E8201047BC3E139FA47F0006D725606A05BE40764A6E67421D4D2DCE94465066468576F662D1F93B3254C031291EF169C5FB9BB43D3EBBB127AC4D8111BEA01F36DA2A0E0F38D2A26F911D0CA13AB32F2719C502E3A74E278179D8A458CAFA8284F73A014FF2B4C3CD51C') // Signed Static Application Data
		)
store('00', '0206', data);

// DGI 0301 - DC
data = TLV('70',   
		   TLV('5A',   '6228000100001117') // Application Primary Account Number
		 + TLV('5F24', '301231') // Application Expiration Date
		 + TLV('5F25', '950701') // Application Effective Date
		 + TLV('9F08', '0030') // Application Version Number
		)
store('00', '0301', data);

// DGI 0302 - EC
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

// DGI 0303 - qPBOC
data = TLV('70',   
		   TLV('9F74', '454343313131')
		 + TLV('9F69', '0100000000300000') // Card Authentication Related Data
		)
store('00', '0303', data);

// DGI 0304 - EC
data = TLV('70',   
		   TLV('9F74', '454343313131')
		)
store('00', '0304', data);

// DGI 0305 - EC
data = TLV('70',   
		   TLV('9F46',   '4AC9D14A8668176A0ED3CBFD93F187F14746FCC92BCD7472237AADAB8605A6AC00B595833257FFBA9C103CF278252F50EF4043AB09A3C3C872E0A567428F921B110FFD38D0B3C2BC00C564366E401B1C00B6126B55EC2689FAA3EFCB489250AA1C52145773D508BC347E1BA947B12950B1385FCAE0BF9C7196A4ACFC43F7360C') // ICC Public Key Certificate
		)
store('00', '0305', data);

// DGI 0306 - EC
data = TLV('70',   
		   TLV('93',   '93CC94E0EE577FB0288DF3797FF2A4E460B1D44B092239E70B335D71E31E02C4AA4527AC0B952E1D8F990E24BE4F58138749CB87FB1596E801F390CC5BC07C0C5B6123F065B34746B60D6B98BBE5ACE703E9F49B856576E8E0C56C76060CCD7E883165AD36A38325854AB7C0948D0C0A874A4A25AD5C92DA38365FE237D37043') // Signed Static Application Data
		)
store('00', '0306', data);

// DGI 0401 - DC
data = TLV('70',   
		   TLV('9F14', '03') // Lower Consecutive Offline Limit
		 + TLV('9F23', '07') // Upper Consecutive Offline Limit
		)
store('00', '0401', data);

// DGI 0402 - DC
data = TLV('70',   
		   TLV('9F46',   'AD9CEC598E3E2E832842951C834D5E5D802A35C484D46466E62BB9DB3AAD937FE5585CA5017503E6EF72E5A37FC648E4F52B5531139B1358A785B3AE7EDD4E8612C0A9DAFD4F723344D81FE97E753F3C7E026DE1FBEE5741D085A886BC7BD4CC4AA72AD4E444EC29142AF0CADD0DD99A05A946514A9A367D0424ECD69C47A973') // ICC Public Key Certificate
		)
store('00', '0402', data);

// DGI 0403 - DC
data = TLV('70',   
		   TLV('93',   '04520EAA68D912ED24DA2A000B0837E51FB76E53A7715C20AFFE8FE1ED2D6D6B5E82BDC27A3031EEB42A768F30AD68C33CB40F8AF1716D49507C764A2215F6CE0B36D0E4B1FACFF912610E8C876AA0AF8464A733A3C854608FF46E22CD5F21DB1E8E831DB19D959ACF2225CBB71A8D63A0F9E4CB1E6B18E9EE43B437DE405289') // Signed Static Application Data
		)
store('00', '0403', data);

// DGI 8000 : DES key(s)
data = '112233440066778811223344550077888B4F854F0831FBF2635A212E4DDDB92A11220044556677881122330055667788';
store('60', '8000', data);

// DGI 8010 : Offline PIN Block
data = '241234FFFFFFFFFF';
store('60', '8010', data);

// DGI 9000 : DES key check values
data = '97DCB0CE4E2CB37DF3';
store('60', '9000', data);

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
	 + TLV('9F68', '41102000') // Card Additional Processes
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
		 + TLV('9F38', '9F1A029F7A019F02065F2A029F4E14') // PDOL
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
		 + TLV('9F38', '9F66049F02069F03069F1A0295055F2A029A039C019F3704') // PDOL
		 + TLV('BF0C',  // FCI Issuer Discretionary Data
			   TLV('9F4D', '0B0A') // Log Entry
			 + TLV('DF4D', '0C0A')
			)
		)
store('00', '9103', data);

// DGI 9200
data = TLV('9F10', '07010103000000010A01') // Issuer Application Data (IAD)
store('80', '9200', data);

include('PSE_perso.js');
include('PPSE_perso.js');

