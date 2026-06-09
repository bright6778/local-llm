var pse_package = 'A00000000316';
var pse_module  = 'A0000000031650';

var package_aid = 'A00000033301';
var applet_aid = 'A0000003330101';
var AID = 'A0000003330101';

var pse_package_aid = 'A00000033301';
var pse_applet_aid = 'A0000003330101';


// DGI definition
var ARR_DGI = new Array();
ARR_DGI['8000'] = 'DES key(s)';
ARR_DGI['9000'] = 'DES key check values';
ARR_DGI['8400'] = 'DES key(s) - SM algorithm';
ARR_DGI['9400'] = 'DES key check values - SM algorithm';
ARR_DGI['8001'] = 'Alternate UDK for dCVV';
ARR_DGI['8010'] = 'Offline PIN Block';
ARR_DGI['9010'] = 'PIN Related Data';
ARR_DGI['9102'] = 'SELECT Response (Common)';
ARR_DGI['9103'] = 'SELECT Response (Contactless)';
ARR_DGI['9104'] = 'GPO Response Data for Debit/Credit';
ARR_DGI['9105'] = 'GPO Response Data for Debit/Credit - SM algorithm';
ARR_DGI['9203'] = 'GPO Response Data for E-Cash';
ARR_DGI['9204'] = 'GPO Response Data for E-Cash - SM algorithm';
ARR_DGI['9207'] = 'GPO Response Data for qPBOC';
ARR_DGI['9208'] = 'GPO Response Data for qPBOC - SM algorithm';
ARR_DGI['8101'] = 'ICC Private Key Exponent (DDA)';
ARR_DGI['8103'] = 'ICC Key Modulus (DDA)';
ARR_DGI['8201'] = 'ICC Key CRT constant 1/q mod p';
ARR_DGI['8202'] = 'ICC Key CRT constant d mod (q - 1)';
ARR_DGI['8203'] = 'ICC Key CRT constant d mod (p - 1)';
ARR_DGI['8204'] = 'ICC Key CRT constant prime factor q';
ARR_DGI['8205'] = 'ICC Key CRT constant prime factor p';
ARR_DGI['8501'] = 'SM2 Private Key';
ARR_DGI['8502'] = 'SM2 Public Key';
ARR_DGI['9200'] = 'Issuer application data';
ARR_DGI['9201'] = 'Issuer application data - SM algorithm';
ARR_DGI['0D01'] = 'Internal data for payment system';
ARR_DGI['0E01'] = 'Internal data for application';
ARR_DGI['A001'] = 'Contactless Low-Value Extend Application Extend File';
ARR_DGI['8020'] = 'Extend Application File Open Key data';
ARR_DGI['9020'] = 'Extend Application File Open Key check values';

// TAG defination
var ARR_TAG = new Array();
ARR_TAG['70'] = 'Record Template';
ARR_TAG['61'] = 'Application Template';
ARR_TAG['4F'] = 'Application Identifier';
ARR_TAG['50'] = 'Application Label'; 
ARR_TAG['57'] = 'Track 2 Equivalent Data';
ARR_TAG['5A'] = 'Application Primary Account Number'; 
ARR_TAG['5F20'] = 'Cardholder Name';
ARR_TAG['5F24'] = 'Application Expiration Date';
ARR_TAG['5F25'] = 'Application Effective Date'; 
ARR_TAG['5F28'] = 'Issuer Country Code';
ARR_TAG['5F30'] = 'Service Code'; 
ARR_TAG['5F34'] = 'PAN Sequence Number';
ARR_TAG['5F55'] = 'Issuer Country Code (alpha2 format)';
ARR_TAG['5F56'] = 'Issuer Country Code (alpha3 format)';
ARR_TAG['5F2D'] = 'Language Preference'; 
ARR_TAG['82'] = 'Application Interchange Profile';
ARR_TAG['87'] = 'Application Priority Indicator'; 
ARR_TAG['88'] = 'SFI'; 
ARR_TAG['8C'] = 'CDOL1'; 
ARR_TAG['8D'] = 'CDOL2';
ARR_TAG['8E'] = 'CVM List'; 
ARR_TAG['8F'] = 'Certification Authority Public Key Index';
ARR_TAG['90'] = 'Issuer Public Key Certificate'; 
ARR_TAG['92'] = 'Issuer Public Key Remainder';
ARR_TAG['93'] = 'Signed Static Application Data'; 
ARR_TAG['94'] = 'Application File Locator';
ARR_TAG['A5'] = 'FCI Proprietary Template';
ARR_TAG['9F07'] = 'Application Usage Control'; 
ARR_TAG['9F08'] = 'Application Version Number';
ARR_TAG['9F0D'] = 'Issuer Action Code - Default';
ARR_TAG['9F0E'] = 'Issuer Action Code - Denial';
ARR_TAG['9F0F'] = 'Issuer Action Code - Online';
ARR_TAG['9F10'] = 'Issuer Application Data (IAD)';
ARR_TAG['9F11'] = 'Issuer Code Table Index';
ARR_TAG['9F12'] = 'Application Preferred Name';
ARR_TAG['9F13'] = 'Last Online ATC Register';
ARR_TAG['9F14'] = 'Lower Consecutive Offline Limit'; 
ARR_TAG['9F17'] = 'PIN Try Counter';
ARR_TAG['9F1F'] = 'Track 1 Discretionary Data';
ARR_TAG['9F23'] = 'Upper Consecutive Offline Limit';
ARR_TAG['9F2D'] = 'ICC PIN Encipherment Public Key Certificate';
ARR_TAG['9F2E'] = 'ICC PIN Encipherment Public Key Exponent';
ARR_TAG['9F2F'] = 'ICC PIN Encipherment Public Key Remainder';
ARR_TAG['9F32'] = 'Issuer Public Key Exponent'; 
ARR_TAG['9F36'] = 'ATC';
ARR_TAG['9F38'] = 'PDOL';
ARR_TAG['9F42'] = 'Application Currency Code';
ARR_TAG['9F76'] = 'Secondary Application Currency Code';
ARR_TAG['9F44'] = 'Application Currency Exponent';
ARR_TAG['9F46'] = 'ICC Public Key Certificate'; 
ARR_TAG['9F47'] = 'ICC Public Key Exponent';
ARR_TAG['9F48'] = 'ICC Public Key Remainder'; 
ARR_TAG['9F49'] = 'DDOL';
ARR_TAG['9F4A'] = 'Static Data Authentication Tag List'; 
ARR_TAG['9F4D'] = 'Log Entry';
ARR_TAG['DF4D'] = 'Log Entry - EC';
ARR_TAG['9F4F'] = 'Log Format';
ARR_TAG['DF4F'] = 'Log Format- EC';
ARR_TAG['9F51'] = 'Application Currency Code';
ARR_TAG['9F52'] = 'Application Default Action (ADA)';
ARR_TAG['9F53'] = 'Consecutive Transaction Counter International Limit (CTCIL)';
ARR_TAG['9F54'] = 'Cumulative Total Transaction Amount Limit (CTTAL)';
ARR_TAG['9F56'] = 'Issuer Authentication Indicator';
ARR_TAG['9F57'] = 'Issuer Country Code';
ARR_TAG['9F58'] = 'Consecutive Transaction Counter Limit (CTCL)';
ARR_TAG['9F59'] = 'Consecutive Transaction Counter Upper Limit (CTCUL)';
ARR_TAG['9F5C'] = 'Cumulative Total Transaction Amount Upper Limit (CTTAUL)';
ARR_TAG['9F5D'] = 'Available Offline Spending Amount';
ARR_TAG['9F5E'] = 'Consecutive Transaction International Upper Limit (CTIUL)';
ARR_TAG['9F63'] = 'Offline Counter Initial Value';
ARR_TAG['9F68'] = 'Card Additional Processes';
ARR_TAG['9F6B'] = 'Card CVM Limit';
ARR_TAG['9F6C'] = 'Card Transaction Qualifiers';
ARR_TAG['9F6D'] = 'EC Balance Reset Threshold';
ARR_TAG['9F6E'] = 'Form Factor Indicator';
ARR_TAG['9F69'] = 'Card Authentication Related Data';
ARR_TAG['9F72'] = 'Consecutive Transaction Counter International Country Limit (CTCICL)';
ARR_TAG['9F73'] = 'Currency Conversion Parameters';
ARR_TAG['9F74'] = 'EC Balance Issuer Authorization Code';
ARR_TAG['9F75'] = 'CTTA Limit (Dual Currency)';
ARR_TAG['9F77'] = 'EC Balance Limit';
ARR_TAG['9F78'] = 'EC Balance Single Transaction Limit';
ARR_TAG['9F79'] = 'EC Balance';
ARR_TAG['9F7C'] = 'Customer Exclusive Data';
ARR_TAG['BF0C'] = 'FCI Issuer Discretionary Data';
ARR_TAG['DF61'] = 'CAPP Purchase Application Identifier';
ARR_TAG['DF71'] = 'Application Currency Code - Secondary';
ARR_TAG['DF72'] = 'Card CVM Limit - EC';
ARR_TAG['DF76'] = 'EC Balance Reset Threshold - Secondary';
ARR_TAG['DF77'] = 'EC Balance Limit - Secondary';
ARR_TAG['DF78'] = 'EC Balance Single Transaction Limit - Secondary';
ARR_TAG['DF79'] = 'EC Balance - Secondary';
ARR_TAG['9F24'] = 'Payment Account Reference';



function TLV(tag, data){
	len = data.replace(/(\s*)/g,'').length/2;
	return tag + (len > 0x7F ? '81' + toHex(len) : toHex(len)) + data;
}


var tab_61 = '';
function store(P1, DGI, data){
	print('\n[DGI ' + DGI  + ']'+ (ARR_DGI[DGI] == undefined ? '' : '  ' + ARR_DGI[DGI]));
	len = data.replace(/(\s*)/g,'').length/2;
	totallen = len+3;
	if((parseInt(P1, 16) & 0x60) == 0x60 && len % 8 == 0){
		print('* Original Data: ' + data);
		data = encrypt_data(data);
	}
	tab_61 = '';
	parseTLV('', data);
	var chainingdata = '';
	if(data.length > 504){		
		chainingdata = data.substring(504);
		data = data.substring(0, 504);
		totallen = data.length/2 + 3;
	}
	send('80E2' + P1 + toHex(seq++) + toHex(totallen) + DGI + toHex(len) + data);	
	if(chainingdata != ''){
		send('80E2' + P1 + toHex(seq++) + toHex(chainingdata.length/2) + chainingdata);
		chainingdata = '';
	}
	assertSW('9000');
}

function parseTLV(tab, str){
	str = str.replace(/(\s*)/g,''); //remove space
	if(checkTLV(str)){
		var max = str.length;
		for(var i = 0; i < max; ) {
			var tag = str.substring(i, i+=(((parseInt(str.substring(i, i + 2), 16) & 0x1F) == 0x1F) ? 4 : 2));
			var len = str.substring(i, i += 2);
			if(len == '81') len = str.substring(i, i += 2);
			var value = str.substring(i, i += parseInt(len, 16) * 2);
		
			if((parseInt(tag.substring(0, 2), 16) & 0x20) == 0x20){//template tag
				if(tag == '61'){
					if(tab_61 == ''){
						tab_61 = tab;
					}
					else{
						tab = tab_61;
					}
				}
				var tag_len = '* ' + tab + tag + (tag.length == 2 ? '   ' : ' ') + len;
				print(tag_len + (ARR_TAG[tag] == undefined ? '' : '  ' + ARR_TAG[tag]));
				tab = '';
				for(var k = 0; k < tag_len.length; k++) tab += ' ';
				parseTLV(tab, value);
			}
			else{
				print('* ' + tab + tag + (tag.length == 2 ? '   ' : ' ') + len + ' ' + value + (ARR_TAG[tag] == undefined ? '' : '  ' + ARR_TAG[tag]));
			}
			if(ARR_TAG[tag] == undefined){
				print('- undefined tag:' + tag);
				pause();
			}
		}
		
	}
}

function checkTLV(str){
	var max = str.length;
	for (var i = 0; i < max;) {
		if(i + 2 > max) return false;
		var idx = ((parseInt(str.substring(i, i + 2), 16) & 0x1F) == 0x1F) ? 4: 2;
		if(i + idx > max) return false;
		i += idx;
		if(i + 2 > max) return false;
		var len = str.substring(i, i += 2);
		if (len == '81') {
			if(i + 2 > max) return false;
			len = str.substring(i, i += 2);
		}
		idx = parseInt(len, 16) << 1;
		if(i + idx > max) return false;
		 i += idx;
	}	
	return true; 	
}
