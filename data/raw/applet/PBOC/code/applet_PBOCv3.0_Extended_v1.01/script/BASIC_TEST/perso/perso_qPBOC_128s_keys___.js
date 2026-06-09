include('RSA_KEYS.js');
include('_Make_Certification.js');

//var rsakeylength = 512 ;
//var rsakeylength = 640 ;
//var rsakeylength = 768 ;
//var rsakeylength = 896 ;
//var rsakeylength = 1024;
//var rsakeylength = 1152;
//var rsakeylength = 1280;
//var rsakeylength = 1408;
//var rsakeylength = 1536;
//var rsakeylength = 1664;
//var rsakeylength = 1792;
//var rsakeylength = 1920;
var rsakeylength = 1976;

print('************************************************************************');
print('************************************************************************');
print('					RSA KEY TEST : ' + rsakeylength + ' bits');
print('************************************************************************');
print('************************************************************************');


var ca_public_key = {
		modulus : 'A127DBE5F2A92819E6621B99A04F89153EF6D76FC7EB46008626D181C719842656262110BF755B6810DA874A257BB815E43F0C7E30EEB8F10D32B606C086BF71554842F4DCB59830BF86C1163EB84015068F083A9BCD65124B1696F937A118BEF1C192AD892F9334617C99AF9E13B089C48A709B3361E5DF4F791BB1CC04417A78D7B90A22EBC6138519CB8F1C2948163614DF4A6E6F162D709380E65BB547D41ABF44A2E6ACAEAABD08C430EF242E5D9945A83CC356ED82DD3BCC7CB11C710C89181820235CDD53D4AC4B8952024A5DAADEDBCA05A056A7C6B2FF46BCA306FC958EE4118C1085159A3E3619B5926605AE9DB3AC5AD229BD',
		exponent_d : '65FC157B25DFCAD2E92AF91075951FC964394E091D5954C98C1C10C5B23C0197493983FF574A6B782602454FB4FCE0786A234442AFB0C3353906F88EB9540CDF29FB3AF43EA06519A47B20C2751AA0E32D6D62E5C4276D68F03FF176F1AF6F3B973ECB162B15027149A8529202D5AF08E06A43ECD3CD866D959BACDC0C348E61AFA29374DE7EA0E0DDDD67DF17D2B65E39101F451DB1AF331DF1F1004D13A5770F7A52484FDB8F705623829A62458EC080EE40D45D2A1A3B3989F501A5132E6B08C66D9AC977ADAEC77031E73F79FA520107B84B1828F06C732E715EB494F1632652CD20EF25E81B84DFEBD6881BE1354B108E8A1AE2F1C1',
		exponent_e : '010001',
}

var issuer_public_key = {
		modulus : 'BE41AACA0C6A8B8938FE69E1564640985B0CCA43B034CE1D62C8E3E777912047F1523AA797612175207CDA361152EC984BDFBB3C3B57476014D84F3949A151CCC71B20F8682B68331D55AA702082B5815BF9EFC278B95A970C1486DDE544B197E4329A9894376684B708185DBE91D343AC6D35CFD4BDB46A0984020011085272F2F4286294A130723600253270FF4A59BADBB0956ED5D28AF817F1E7D103253EEF2548F36689A7A25A60D2BDE2CAF5C9F1B3F583FD15344750A97E08713A31E54EFEE41B025F9C5AD64A313793C66C00D7867FEAB1F73EAC3DAAFF10F54AFE269D55BCCA7AC1AB3E69776204043062520578309C2E98184D',
		exponent_d : '7ED671DC084707B0D0A99BEB8ED98065920886D7CACDDEBE41DB429A4FB615854B8C271A64EB6BA36AFDE6CEB637486587EA7CD2D23A2F95633ADF7B866B8BDDDA1215FAF01CF022138E71A015AC7900E7FBF52C507B91BA080DAF3E98D8766542CC671062CF99ADCF5ABAE929B68CD7C848CE8A8DD3CD9C0658015439986990A2421D4443678B12BABAE019B2779D6C535BA1DC856914576EE91BCEB4A71EE302D919C252B3BC3F4EC7722EE15408945D293A5890E79B3F084FCFA71C6FCB9BCEB31D32E695193AC7B9BD0EE03A8FBEB8236C7DF505E3B0D64C9A1C23B4BBEFD6EA9432BA6A0A0C2EA5C4541F71980E511FB2A513C89313',
		exponent_e : '03',
}


var icc_public_key ;
if(rsakeylength == 512 ){ icc_public_key = ISS_KEY_512; }
if(rsakeylength == 640 ){ icc_public_key = ISS_KEY_640; }
if(rsakeylength == 768 ){ icc_public_key = ISS_KEY_768; }
if(rsakeylength == 896 ){ icc_public_key = ISS_KEY_896; }
if(rsakeylength == 1024){ icc_public_key = ISS_KEY_1024; }
if(rsakeylength == 1152){ icc_public_key = ISS_KEY_1152; }
if(rsakeylength == 1280){ icc_public_key = ISS_KEY_1280; }
if(rsakeylength == 1408){ icc_public_key = ISS_KEY_1408; }
if(rsakeylength == 1536){ icc_public_key = ISS_KEY_1536; }
if(rsakeylength == 1664){ icc_public_key = ISS_KEY_1664; }
if(rsakeylength == 1792){ icc_public_key = ISS_KEY_1792; }
if(rsakeylength == 1920){ icc_public_key = ISS_KEY_1920; }
if(rsakeylength == 1976){ icc_public_key = ISS_KEY_1976; }

/*'9104'*/static_data[0] = '5A0862280001000011175F24033012315F25039507019F08020030';
/*'9203'*/static_data[1] = '5A0860748412300000205F34010157136074841230000020D49126209630000000000F9F080200025F24034912315F25031504019F0702FFFC5F280203568E0E000000000000000042035E031F03DF34060000001000009F0D0500000000009F0E0500000000009F0F0500000000008C249F02069F03069F1A0295055F2A029A039C019F37049F35019F34039F21039F1C089F4C088D0991108A0295059F3704';
/*'9207'*/static_data[2] = '';

make_pk_cert(ISSUER_PK_CERT_FORMAT, issuer_public_key, ca_public_key, static_data);
make_pk_cert(ICC_PK_CERT_FORMAT, icc_public_key, issuer_public_key, static_data);
make_SSAD(issuer_public_key, static_data);

include('pboc_reset.js');


var seq = 0;
// DGI 9104 : GPO Response Data for Contact
/*
* SFI : 1  Record Number : 1
* SFI : 2  Record Number : 1
* SFI : 2  Record Number : 2
* SFI : 2  Record Number : 3
* SFI : 2  Record Number : 4
* SFI : 2  Record Number : 7
* SFI : 3  Record Number : 1 (include SDA)
* SFI : 4  Record Number : 1
* SFI : 4  Record Number : 2
* SFI : 4  Record Number : 3
*/
data = TLV('82',   '7C00') // Application Interchange Profile
	 + TLV('94',   '08010100 10010400 10070700 18010101 20010300') // Application File Locator
store('00', '9104', data);

// DGI 9203 GPO Response Data (Low-value Payment Path)
/*
* SFI : 1  Record Number : 1
* SFI : 2  Record Number : 2
* SFI : 2  Record Number : 3
* SFI : 2  Record Number : 4
* SFI : 2  Record Number : 7
* SFI : 3  Record Number : 2 (include SDA)
* SFI : 3  Record Number : 4
* SFI : 3  Record Number : 5
* SFI : 3  Record Number : 6
*/
data = TLV('82',   '7800') // Application Interchange Profile
	 + TLV('94',   '08010100 10020400 10070700 18020201 18040600') // Application File Locator
store('00', '9203', data);

// DGI 9207 : GPO Response Data for Contactless
/*
* SFI : 2  Record Number : 3
* SFI : 2  Record Number : 4
* SFI : 2  Record Number : 5
* SFI : 2  Record Number : 6
* SFI : 2  Record Number : 7
* SFI : 3  Record Number : 3
*/
data = TLV('82',   '7000') // Application Interchange Profile
	 + TLV('9F10', '07010103000000010A01') // Issuer Application Data (IAD)
	 + TLV('94',   '10030700 18030300') // Application File Locator
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
		 + TLV('8F',   'FF') // Certification Authority Public Key Index
		 + TLV('9F32', result[ISSUER_EXPONENT]) // Issuer Public Key Exponent
		 + TLV('92',   result[ISSUER_PUBLIC_KEY_REMAINDER]) // Issuer Public Key Remainder
		 + TLV('9F47', result[ICC_EXPONENT]) // ICC Public Key Exponent
		 + TLV('9F48', result[ICC_PUBLIC_KEY_REMAINDER]) // ICC Public Key Remainder
		)
store('00', '0202', data);

// DGI 0203 - DC, EC, qPBOC
data = TLV('70',   
		   TLV('8F',   'FF') // Certification Authority Public Key Index
		 + TLV('9F32', result[ISSUER_EXPONENT]) // Issuer Public Key Exponent
		 + TLV('92', result[ISSUER_PUBLIC_KEY_REMAINDER]) // Issuer Public Key Remainder
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
		 + TLV('9F47', result[ICC_EXPONENT]) // ICC Public Key Exponent
		 + TLV('9F48', result[ICC_PUBLIC_KEY_REMAINDER]) // ICC Public Key Remainder
		)
store('00', '0204', data);

// DGI 0205 - qPBOC
data = TLV('70',   
		   TLV('9F46', result[ICC_CERT_9207]) // ICC Public Key Certificate
		)
store('00', '0205', data);

// DGI 0206 - qPBOC
data = TLV('70',   
		   TLV('93', result[SAD_9207]) // Signed Static Application Data
		)
store('00', '0206', data);


// DGI 0207 - DC, EC, qPBOC
data = TLV('70',   
		   TLV('90',  result[ISSUER_CERT]) // Issuer Public Key Certificate
		)
store('00', '0207', data);

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
		   TLV('9F46', result[ICC_CERT_9203]) // ICC Public Key Certificate
		)
store('00', '0305', data);

// DGI 0306 - EC
data = TLV('70',   
		   TLV('93', result[SAD_9203]) // Signed Static Application Data
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
		   TLV('9F46', result[ICC_CERT_9104]) // ICC Public Key Certificate
		)
store('00', '0402', data);

// DGI 0403 - DC
data = TLV('70',   
		   TLV('93', result[SAD_9104]) // Signed Static Application Data
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
data = PAD_80(icc_public_key.key_data_qp);
store('60', '8201', data);

// DGI 8202 : ICC Key CRT constant d mod (q - 1)
data = PAD_80(icc_public_key.key_data_dq);
store('60', '8202', data);

// DGI 8203 : ICC Key CRT constant d mod (p - 1)
data = PAD_80(icc_public_key.key_data_dp);
store('60', '8203', data);

// DGI 8204 : ICC Key CRT constant prime factor q
data = PAD_80(icc_public_key.key_data_q);
store('60', '8204', data);

// DGI 8205 : ICC Key CRT constant prime factor p
data = PAD_80(icc_public_key.key_data_p);
store('60', '8205', data);

// DGI 0D01
data = TLV('9F58', '03') // Consecutive Transaction Counter Limit (CTCL)
	 + TLV('9F59', '07') // Consecutive Transaction Counter Upper Limit (CTCUL)
	 + TLV('9F73', '20000175') // Currency Conversion Parameters
	 + TLV('9F4F', '9A039F21039F02069F03069F1A025F2A029F4E149C019F3602') // Log Format
	 + TLV('9F54', '000000007000') // Cumulative Total Transaction Amount Limit (CTTAL)
	 + TLV('9F75', '000000010000') // CTTA Limit (Dual Currency)
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

//include('PSE_perso.js');
//include('PPSE_perso.js');

