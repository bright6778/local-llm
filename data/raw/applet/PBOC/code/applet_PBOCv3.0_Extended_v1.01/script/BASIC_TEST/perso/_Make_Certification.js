include('_Make_Certification_data.js');

var IWANTCLEANLOG = false;

var ca_public_key = {
		modulus : 'BEED0D6A8DAC95071540856B8F130385BFFFA8451F15E1676EDEDDF1ABBFFDE4B96E6EBD5145F314DB606F44BD848CB38DC500431C6A82B0A70DCCD5BCB6E6A9149CFB8EB53F52AAD47D12A800C55D79FCEFF7485699AB612FF334158B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B',
		exponent_d : '7F48B39C5E730E04B8D5AE47B4B757AE7FFFC5836A0E9644F49493F6727FFE987B9EF47E362EA20DE7959F8329030877B3D8AAD7684701CB1A0933392879EF1A3A8F57A9DB892F4CE780FD0E31857CE78DE1C545D607F7298755AE0A6636915DF002C05B210E9D372ABDF21C24E8CBD49D0DC9BA32DCC55B6B021A859AF32F1B',
		exponent_e : '03',
}

var issuer_public_key = {
		modulus : 'BE41AACA0C6A8B8938FE69E1564640985B0CCA43B034CE1D62C8E3E777912047F1523AA797612175207CDA361152EC984BDFBB3C3B57476014D84F3949A151CCC71B20F8682B68331D55AA702082B5815BF9EFC278B95A970C1486DDE544B197E4329A9894376684B708185DBE91D343AC6D35CFD4BDB46A0984020011085272F2F4286294A130723600253270FF4A59BADBB0956ED5D28AF817F1E7D103253EEF2548F36689A7A25A60D2BDE2CAF5C9F1B3F583FD15344750A97E08713A31E54EFEE41B025F9C5AD64A313793C66C00D7867FEAB1F73EAC3DAAFF10F54AFE269D55BCCA7AC1AB3E69776204043062520578309C2E98184D',
		exponent_d : '7ED671DC084707B0D0A99BEB8ED98065920886D7CACDDEBE41DB429A4FB615854B8C271A64EB6BA36AFDE6CEB637486587EA7CD2D23A2F95633ADF7B866B8BDDDA1215FAF01CF022138E71A015AC7900E7FBF52C507B91BA080DAF3E98D8766542CC671062CF99ADCF5ABAE929B68CD7C848CE8A8DD3CD9C0658015439986990A2421D4443678B12BABAE019B2779D6C535BA1DC856914576EE91BCEB4A71EE302D919C252B3BC3F4EC7722EE15408945D293A5890E79B3F084FCFA71C6FCB9BCEB31D32E695193AC7B9BD0EE03A8FBEB8236C7DF505E3B0D64C9A1C23B4BBEFD6EA9432BA6A0A0C2EA5C4541F71980E511FB2A513C89313',
		exponent_e : '03',
}

var icc_public_key = {
		modulus : '97CF8BAD30CAE0F9A89285454DDDE967AAFBCD4BC0B78F29ECB1005286F15F6D7532A9C476607C73FF7424316DFC741894AA52EDBAF909719C7B53448343B45CF2F00A8ABFB78CEEBE848933AAED97DBE84F0730F34FB1AA1528D3D6EC75B73252A30D0C717518BE36458ADD0FBF854C65497F3F54084154B60F51561361EE8E85F742A54005524CB00FEBC334276E0E63DAD86C079A9A3DF5DD32BECADE1AB2B71F5F0A0E95A4000D01F1044A578AAD92E9FDE92E3C6AA3DCD4913DFA5552537E7DE75E241FAED455D76CB8FCAFEED3FD6DAB24D7A9C32852F866C751D7710F494A0DF11B67FAECDD87A9A4E2CC44F6F27E46E3C0CCCD0F',
		exponent_d : '194D41F232CC7AD446C3163637A4FC3BF1D4A2374AC94286FCC82AB86BD2E53CE8DDC6F613BABF68AA935B5D9254BE0418C70DD249D42C3D9A148DE0C08B48BA287D57171FF3ECD2751616DDF1D243F9FC0D2BDD7DE29D9C58DC234E7CBE49330DC5D78212E8D975090B9724D7F540E210E1953538AC0AE373AD3838C182F8DACD16829DD30E9698B309007E068BC76C44A7CE2113D6C7CEC6AC1B6FD27E53BF0082EB33AEBE02DC15B7942018420E0584224EBC6C49BDC0A9EF42210E363751AAC6F01165A57ED7DA3F9DFC1BEABBE6CBEE4F7253C7D3137996368D10E99D1FC187F6270856194E53E38E0CAD1439B9EA2CBEA4EE9077B3',
		exponent_e : '03',		
		key_data_qp : '474B5A7EFC099D5B9E6D80AFDD7C04814A6A804414338B966AF7D0C4B92049552085A96B74CC61D06E77618540C240A7E5593AFBD00148F6939D1CA5451511D31CB09128247E3D3ECA9E49871CFB6C6614B070C7ADEE4AFFD2E62A3746D71132B6B6FE1CCC32BFAF836D87A01743E6BCB4E2C9F1FE67696EB226BB0E',
		key_data_dq : '85375BB6639CD4222ECB460784875888D23D798FCBBD7F7C363A212210890AF7E874CDA23CDC28B99DEEAC7747121C51031BEFD6EB9BD14B963229A4C7E8A38E9221605FA12C250B363C324DE7EDEEF44176C8032ED0D5CC6406833A4F5BA09E3A921E78D65BE8F9E4BCF21DB595677BB57368EFB5DB83F0462C1B0F',
		key_data_dp : '81A8B53D6C034DD4AFA896737A09ED568BADB21E0EDFD8477F7C7BCC2359FE72AA25F52E3B2D147E5B7D0AC3156633DC22C0DF3165CC47B382247BC5CE3D5F6BDBE94E915D615F98A09846E03DA336EBF75392444A69B3D831F607E8019BC9B26301B867A9B59D0AB6DAA546E3E17C14D8193377EDC5B0BE801A8EDB',
		key_data_q : 'C7D30991956B3E334630E90B46CB04CD3B5C3657B19C3F3A515731B318CD9073DCAF34735B4A3D166CE602B2EA9B2A7984A9E7C26169B9F1614B3E772BDCF555DB32108F71C23790D15A4B74DBE4E66E62322C04C63940B29609C4D7770970ED57DB2DB54189DD76D71B6B2C90601B39902D1D6790C945E869422897',
		key_data_p : 'C27D0FDC2204F4BF077CE1AD370EE401D1848B2D164FC46B3F3AB9B23506FDABFF38EFC558C39EBD893B9024A0194DCA34214ECA18B26B8D4336B9A8B55C0F21C9DDF5DA0C120F64F0E46A505C74D261F2FD5B666F9E8DC44AF10BDC0269AE8B9482949B7E906B901247F7EA55D23A1F4425CD33E4A8891DC027D649',
}

/*'9104'*/afl_value[0] = '080202011001040018010100';
/*'9203'*/afl_value[1] = '080101011001020018030400';
/*'9207'*/afl_value[2] = '080202011001040018020200'; 

//checkStaticData(afl_value);

/*'9104'*/static_data[0] = '5A0860748412300000205F34010157136074841230000020D49126209630000000000F5F2013525550415920434152442F494D414745203031';
/*'9203'*/static_data[1] = '5A0860748412300000205F34010157136074841230000020D49126209630000000000F5F2013525550415920434152442F494D414745203031';
/*'9207'*/static_data[2] = '5A0860748412300000205F34010157136074841230000020D49126209630000000000F9F080200025F24034912315F25031504019F0702FFFC5F280203568E0E000000000000000042035E031F03DF34060000001000009F0D0500000000009F0E0500000000009F0F0500000000008C249F02069F03069F1A0295055F2A029A039C019F37049F35019F34039F21039F1C089F4C088D0991108A0295059F3704';

//make_pk_cert(ISSUER_PK_CERT_FORMAT, issuer_public_key, ca_public_key, static_data);
//make_pk_cert(ICC_PK_CERT_FORMAT, icc_public_key, issuer_public_key, static_data);
//make_SSAD(issuer_public_key, static_data);

//printResult();


function checkStaticData(AFL){
	
	var num_cnt = 0;
	var num_data = new Array(); 
	var records_data = new Array(); 
	
	for(var k = 0; k < AFL.length; k++){
		var SAD = '';
		printlog('\n'+DGI[k]);
		for(i = 0 ; i < AFL[k].length; i += 8)
		{			
			recordRange = AFL[k].substring(i, i + 8);
			SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
			startRecordNumber = parseInt(recordRange.substring(2,4), 16);
			endRecordNumber = parseInt(recordRange.substring(4,6), 16);
			SADRecordNumber = parseInt(recordRange.substring(6,8), 16);
			cnt_SAD = 0;
			
			if(SADRecordNumber != 0){
				printlog('SADRecordNumber ' + SADRecordNumber);
			}
			
			for(j = startRecordNumber; j <= endRecordNumber; j++)
			{
				var save = 'SFI ' + SFI + ' record ' + j;
				
				if(records_data[save] != undefined){
					records_data[save] += ', ' + DGI[k];
				}else{
					records_data[save] = DGI[k] + '';
					num_data[num_cnt] = save;
					num_cnt++;
				}
				
				if(SADRecordNumber != 0 && cnt_SAD < SADRecordNumber){
					printlog(save + ' STATIC DATA');					
				}else{
				//	printlog(save);
				}
			}
			
		}		
		
	}
	printlog('');
	
	for(var k = 0; k < num_cnt; k++){
		printlog(num_data[k] + ' : ' + records_data[num_data[k]]);
	}
	
}

//new make_pk_cert(ISSUER_PK_CERT_FORMAT, issuer_public_key, ca_public_key, static_data);

function make_pk_cert(par_cert_format, target_pk, key_pk, static_data){	
	this.Application_PAN       = '6228000100001117';  	
	
	this.Cert_Expiration_Date  = '1230';  
	this.Cert_Serial_Num       = '000001';
	this.Hash_Algo_Indicator   = '01';
	this.PK_Algo_Indicator     = '01';
	this.Static_Data           = static_data; 

	
	var Cert_Format           = par_cert_format;  
	var Issuer_Identifier     = '';  
	
	var PK_Len                = toHex(target_pk.modulus.length/2);
	var PK_Exponent_Len       = toHex(target_pk.exponent_e.length/2);
	
	var PK                    = '';
	var PK_Remainder          = '';	
	
	var PK_Exponent           = target_pk.exponent_e;    

	var keynameSTR = '';
	if(Cert_Format == ISSUER_PK_CERT_FORMAT){
		printlog('\n******************************************************');
		printlog('* - Make Issuer PK Certification ');
		printlog('******************************************************');
		
		Issuer_Identifier     = this.Application_PAN.substring(3,9) + 'FF'; 
		
		var temp_length = key_pk.modulus.length/2 - 36;
		if(temp_length < target_pk.modulus.length/2){
				PK           = target_pk.modulus.substring(0, temp_length * 2);
				PK_Remainder = target_pk.modulus.substring(temp_length * 2);
		}else{
				PK = target_pk.modulus;
				for(var i = 0; i< (temp_length - target_pk.modulus.length/2); i++){
						PK += 'BB';
				}
		}
		keynameSTR = 'Issuer';
		
		result[ISSUER_EXPONENT] = target_pk.exponent_e;
		result[ISSUER_PUBLIC_KEY_REMAINDER] = PK_Remainder;
		
		var temp = new Array();
		temp[0] = '';
		this.Static_Data           = temp; 
			
	}else if(Cert_Format == ICC_PK_CERT_FORMAT){
		printlog('\n******************************************************');
		printlog('* - Make ICC PK Certification ');
		printlog('******************************************************');
		
		if(this.Application_PAN.length/2 > 10){
			Issuer_Identifier     = this.Application_PAN.substring(0,10);
		}else{
			Issuer_Identifier     = this.Application_PAN; 			
			for(var i = 0; i< (10 - this.Application_PAN.length/2); i++){
					Issuer_Identifier += 'FF';
			}		
		}	
		
		var temp_length = key_pk.modulus.length/2 - 42;
		if(temp_length < target_pk.modulus.length/2){
				PK           = target_pk.modulus.substring(0, temp_length * 2);
				PK_Remainder = target_pk.modulus.substring(temp_length * 2);
		}else{
				PK = target_pk.modulus;
				for(var i = 0; i< (temp_length - target_pk.modulus.length/2); i++){
						PK += 'BB';
				}
		}
		
		keynameSTR = 'ICC   ';
	
		result[ICC_PUBLIC_KEY_REMAINDER] = PK_Remainder;
		result[ICC_EXPONENT] = target_pk.exponent_e;
		
	}else{
		return;	
	}
	
	for(var i = 0; i < Static_Data.length; i++){
		
		if(Cert_Format == ICC_PK_CERT_FORMAT){
				if(i==0){
				printlog('\n******************************************************');
				printlog('* - This is for 9104');
				printlog('******************************************************');
			}else if(i==1){
				printlog('\n******************************************************');
				printlog('* - This is for 9203');
				printlog('******************************************************');
			}else if(i==2){
				printlog('\n******************************************************');
				printlog('* - This is for 9203');
				printlog('******************************************************');
			}
		}
		
		
		printlog("* - Recoverd Data Header\t\t\t\t\t: " 					+ RECOVERED_DATA_HEADER);
		printlog("* - Certificate Format\t\t\t\t\t\t: " 					+ Cert_Format);
		printlog("* - Application PAN\t\t\t\t\t\t\t: "						+ Issuer_Identifier);
		printlog("* - Certificate Expiration Date\t\t\t\t: "			+ this.Cert_Expiration_Date);
		printlog("* - Certificate Serial Number\t\t\t\t: "				+ this.Cert_Serial_Num);
		printlog("* - Hash Algorithm Indicator\t\t\t\t: "				+ this.Hash_Algo_Indicator);
		printlog("* - " + keynameSTR + " Public Key Algorithm Indicator\t: "	+ this.PK_Algo_Indicator);
		printlog("* - " + keynameSTR + " Public Key Length\t\t\t\t: "					+ PK_Len);
		printlog("* - " + keynameSTR + " Public Key Exponent Length\t\t: "		+ PK_Exponent_Len);
		printlog("* - " + keynameSTR + " Public Key(or part)\t\t\t\t: "				+ PK);
		printlog("* - " + keynameSTR + " Public Key Remainder\t\t\t\t: "				+ PK_Remainder);
		printlog("* - " + keynameSTR + " Public Key Exponent\t\t\t\t: "				+ PK_Exponent);
		
		if(Cert_Format == ICC_PK_CERT_FORMAT){
			printlog("* - Static Data to be Authenticated\t\t\t: "		+ this.Static_Data[i]);	
		}
		printlog("* - Recoverd Data Trailder\t\t\t\t\t: " 					+ RECOVERED_DATA_TRAILDER);
		
		
		var hash_Result = '';	
		
		var msg_data = 	Cert_Format +
									Issuer_Identifier + 
									this.Cert_Expiration_Date + 
									this.Cert_Serial_Num +
									this.Hash_Algo_Indicator +
									this.PK_Algo_Indicator + 
									PK_Len + 
									PK_Exponent_Len + 
									PK;
									
		this.dohash = function(){
				var msg_data_for_Hash = msg_data + 
																PK_Remainder + 
																PK_Exponent;	
				
				if(Cert_Format == ICC_PK_CERT_FORMAT){
					msg_data_for_Hash += this.Static_Data[i];
				}										
				hash_Result = messageDigest_SHA1(msg_data_for_Hash).toUpperCase();				
				
				printlog('\n*------------------------------------------------');
				printlog('* - Make hash');
				printlog('*------------------------------------------------');
				printlog('* - input\t\t: ' + msg_data_for_Hash);
				printlog('* - hash result\t: ' + hash_Result);
				printlog('*------------------------------------------------');
				
				return hash_Result;
		}
		
		this.domake = function(){
			this.dohash();		
			var plain_cert = RECOVERED_DATA_HEADER + msg_data + hash_Result + RECOVERED_DATA_TRAILDER;
			
			var cert = encRSAwithPrivateKey(plain_cert, key_pk.modulus, key_pk.exponent_d);
					
			printlog('\n*------------------------------------------------');
			printlog('* - Make Certification');
			printlog('*------------------------------------------------');
			printlog('* - input\t\t\t: ' + plain_cert);
			printlog('* - key modulus\t\t: ' + key_pk.modulus);
			printlog('* - key exponent d\t: ' + key_pk.exponent_d);
			printlog('* - certification\t: ' + cert);
			printlog('*------------------------------------------------');
		
			return cert;
		}
		
		var cert = this.domake();			
		printlog('******************************************************');
		
		if(Cert_Format == ISSUER_PK_CERT_FORMAT){
			result[ISSUER_CERT] = cert;
		}else{
			if(i==0){
				result[ICC_CERT_9104] = cert;
			}else if(i==1){
				result[ICC_CERT_9203] = cert;
			}else if(i==2){
				result[ICC_CERT_9207] = cert;
			}
		}			
	}	
			
	return cert;
}

//make_SSAD(issuer_public_key,  Static_Data);
function make_SSAD(issuer_public_key, Static_Data){	
	printlog('\n******************************************************');
	printlog('* - Make Signed Static Application Data');
	printlog('******************************************************');
		
	var Signed_Data_Format          = '03';
	this.Hash_Algo_Indicator        = '01';
	this.Data_Authentication_Code   = 'DAC1';                    
	var Pad_Pattern                 = '';       
	
	this.Static_Data = Static_Data;                           

	for(var i = 0; i< (issuer_public_key.modulus.length/2 - 26); i++){
			Pad_Pattern += 'BB';
	}

	for(var i = 0; i < Static_Data.length; i++){
		
		if(i==0){
			printlog('\n******************************************************');
			printlog('* - This is for 9104');
			printlog('******************************************************');
		}else if(i==1){
			printlog('\n******************************************************');
			printlog('* - This is for 9203');
			printlog('******************************************************');
		}else if(i==2){
			printlog('\n******************************************************');
			printlog('* - This is for 9207');
			printlog('******************************************************');
		}	
	 	
	 	printlog("* - Recoverd Data Header\t\t\t: " 					+ RECOVERED_DATA_HEADER);
		printlog("* - Signed Data Format\t\t\t\t: " 					+ Signed_Data_Format);
		printlog("* - Hash Algorithm Indicator\t\t: "				+ this.Hash_Algo_Indicator);
		printlog("* - Data Authentication Code\t\t: "				+ this.Data_Authentication_Code);
		printlog("* - Pad Pattern\t\t\t\t\t\t: "							+ Pad_Pattern);
		printlog("* - Static Data to be Authenticated\t: "		+ this.Static_Data[i]);	
		
	  
	  var msg_data = Signed_Data_Format +
	  								this.Hash_Algo_Indicator + 
	  								this.Data_Authentication_Code +
	  								Pad_Pattern;
	  								
	  this.dohash = function(){
				if(this.Static_Data[i] == undefined){
	  			this.Static_Data[i] = '';
	  		}
	  		var msg_data_for_Hash = msg_data + this.Static_Data[i];	
	  		
				hash_Result = messageDigest_SHA1(msg_data_for_Hash).toUpperCase();				
				
				printlog('\n*------------------------------------------------');
				printlog('* - Make hash');
				printlog('*------------------------------------------------');
				printlog('* - input\t\t: ' + msg_data_for_Hash);
				printlog('* - hash result\t: ' + hash_Result);
				printlog('*------------------------------------------------');
				
				return hash_Result;
		}
		
		
		this.domake = function(){
			this.dohash();		
			var plain_cert = RECOVERED_DATA_HEADER + msg_data + hash_Result + RECOVERED_DATA_TRAILDER;
			
			var cert = encRSAwithPrivateKey(plain_cert, issuer_public_key.modulus, issuer_public_key.exponent_d);
					
			printlog('\n*------------------------------------------------');
			printlog('* - Make SSAD');
			printlog('*------------------------------------------------');
			printlog('* - input\t\t\t: ' + plain_cert);
			printlog('* - key modulus\t\t: ' + issuer_public_key.modulus);
			printlog('* - key exponent d\t: ' + issuer_public_key.exponent_d);
			printlog('* - SSAD\t\t\t: ' + cert);
			printlog('*------------------------------------------------');
		
			return cert;
		}
		
		var cert = this.domake();			
		printlog('******************************************************');
		if(i==0){
			result[SAD_9104] = cert;
		}else if(i==1){
			result[SAD_9203] = cert;
		}else if(i==2){
			result[SAD_9207] = cert;
		}
		
	}
	
	return cert;
}





function printResult(){
	printlog('ICC_EXPONENT\t\t\t\t' 					+ result[ICC_EXPONENT]);                
	printlog('ISSUER_PUBLIC_KEY_REMAINDER\t' + result[ISSUER_PUBLIC_KEY_REMAINDER]); 
	printlog('ISSUER_EXPONENT\t\t\t\t'				+ result[ISSUER_EXPONENT]);            
	printlog('SAD_9104\t\t\t\t\t' 						+ result[SAD_9104]);                   
	printlog('SAD_9203\t\t\t\t\t' 						+ result[SAD_9203]);                   
	printlog('SAD_9207\t\t\t\t\t' 						+ result[SAD_9207]);                   
	printlog('ISSUER_CERT\t\t\t\t\t' 				+ result[ISSUER_CERT]);          
	printlog('ICC_PUBLIC_KEY_REMAINDER\t' 		+ result[ICC_PUBLIC_KEY_REMAINDER]);   
	printlog('ICC_CERT_9104\t\t\t\t' 				+ result[ICC_CERT_9104]);              
	printlog('ICC_CERT_9203\t\t\t\t' 				+ result[ICC_CERT_9203]);              
	printlog('ICC_CERT_9207\t\t\t\t' 				+ result[ICC_CERT_9207]);   
	
		
}

function printlog(str){
	if(!IWANTCLEANLOG){
		print(str);
	}
}


var zeros	= '0000000000000000';

function PAD_80(data){
	data = data + '80'
	var len = data.length/2;
	if(len % 8 != 0) data = data + zeros.substring(0, (8 - len % 8) * 2);
	return data; 
}

