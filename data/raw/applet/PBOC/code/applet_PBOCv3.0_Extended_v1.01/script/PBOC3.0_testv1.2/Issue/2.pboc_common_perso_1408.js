/*
 * Card Image 004
 */
var perso_appPreferredName = "4341524420494D4147452030303330"; //9F12
var perso_AIP = "7D00"; //82
var perso_ADA = "4130"; //9F52
var perso_IAI = "80"; //9F56
var perso_LCOL = "03"; //9F58
var perso_UCOL = "07"; //9F59
var perso_AIP_EC ="7C00"
var perso_AIP_QPBOC="7000"
var perso_AIP_MSD ="0080"
var perso_CAP="2400B000"//9F68 Card Additional Process
var perso_CTQ="3000"//9F6B Card Transaction Qualifiers
var isd_aid = 'A000000003000000';

var keydata;
var encrypted_keydata;
var sequence = 0;




include("pboc_reset.js");

reset();
print('****************************************************************');
print('* Card Image 0040 : ');
print('****************************************************************');

print('\n* External Authenticate and Initialize Update');
set_var('scp02');

print('\n* Select PBOC');
select(pboc_aid);

print('\n* External Authenticate and Initialize Update');
auth();

//Store data command start
print('\n* Get Processing Options Command Response Data');
// DGI 9207 (for QPBOC)    
send('80E200' + String(toHex(sequence)) + '20 9207 1D'+
              '82 02' + perso_AIP_QPBOC + // EC(VLP) AIP
              '94 0C  20020400 18010101 28020200'+ // VLP AFL
			   '9F10 08 0701010300000001'+
          '00' );
          assertSW('9000');                         
sequence = sequence + 1;
// DGI 9104 : tag 82, 94
send('80E200' + String(toHex(sequence)) + '19 9104 16'+
            '82 02' + perso_AIP + /* Application Interchange Profile (AIP) */
            '94 10 08010100 10010500 18010301 20010100'+ /* Application File List (AFL) */
            '00');
assertSW('9000');
sequence = sequence + 1;


// DGI 9203 (for EC)
    
send('80E200' + String(toHex(sequence)) + '19 9203 16'+
              '82 02'+ perso_AIP_EC+/* EC(VLP) AIP*/
              '94 10 08010100 10010500 18010201 28010100'+ /* EC(VLP) AIP*/
         '00');
assertSW('9000');                        
sequence = sequence + 1; 

// DGI 9206 (for MSD)    
send('80E200' + String(toHex(sequence)) + '0D 9206 0A'+
              '82 02' + perso_AIP_MSD+ // EC(VLP) AIP
              '94 04 08010100'+ // VLP AFL
          '00' );  
assertSW('9000');                      
sequence = sequence + 1; 


              
             
print('\n* Data Elements Stored in Records');
// SFI 1 Record 1
// DGI 0101 : tag  57, 5F20, 9F1F
send('80E200' + String(toHex(sequence)) + '45 0101 42 70 40'+
            '57   13 6228000100001117D101220101234512399991'+ /* Track 2 Equivalent Data */
                     
            '5F20 0F 46554C4C2046554E4354494F4E414C'+ /* Cardholder Name */
            '9F1F 16 30313032303330343035303630373038303930413042'+ /* Track 1 Discretionary Data */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 1 Record 2
// DGI 0102 : tag 57, 9F1F
send('80E200' + String(toHex(sequence)) + '31 0102 2E 70 2C'+
            '57   11 6228000100001117D10122010123456789'+ /* Track 2 Equivalent Data */
            '9F1F 16 30313032303330343035303630373038303930413042'+ /* Track 1 Discretionary Data */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 1
// DGI 0201 : tag 9
IPK_Certificate = "20D823AC76B24F62306F96B5CBD9C9410CA17C09477F6088FC505CDC8809349E53AADA77670C4E456E3913E72A655AA631DF1B2DF859D219D2127DFEF4DDD2B6D9B285FA2A68B25F29BD695D116C6168C2A49DC05F1985A3B40EAA10C99A2E86BCEF48EB8F903AF6158B4777467C7B0D5B4DF00A4E8948E8A1798BC5F506B367ECE6242C3AA930C27AC844A5811FBE4B30BBF38536F1B9B0261DB3D05DD67C72";
send('80E200' + String(toHex(sequence)) + 'A9 0201 A6 70 81A3'+
              '90 81A0'+IPK_Certificate+'00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 2
// DGI 0202 : tag 8F, 92, 9F32
send('80E200' + String(toHex(sequence)) + '34 0202 31 70 2F'+
            '8F   01 82'+ /* Certificate Authority Public Key Index */
            '92   24 6CD351B30C6009D372508AE881C89BC9D4FBA67750FD288326552439227FAEA00E9336D5' +
            '9F32 03 010001'+ /* IPK Exponent */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 3
// DGI 0203 : tag 93 (Signed Static Application Data)
SAD ="79944B323A42532BD2EF0E5503CB37E7A87958046B9E93BD45AF233515E4050360222CF918F1BAF7671C4230596AF3D79598E2DC3BDB7C534730BCF2ED0E8A8C30EB5148D02C6DA40A42E51BF855AFCB66FEACBE283AE723EFD599FF8EEDE9C3706DA9AA883A14FB2D243F9D543A627847543B3BCA0105DDDDAB7670D851F0A2DB2011A9A2C472B55A11C18B686840E937DC45CCB9339EA7D86F3A303B02991D";
lenSAD = (SAD.length)/2;
send('80E200' + String(toHex(sequence)) + 'A9 0203 A6 70 81A3 93 81A0'+SAD+'00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 4
// DGI 0204 : tag 9F46
send('80E200' + String(toHex(sequence)) + 'AA 0204 A7 70 81A4'+
            '9F46 81A0 9936A5F9BE6E995EA35358AC869D66A227AF0BC7022723730667A7506C1E0D59F4FDCD1B1BC6D6447A778B71D54BA66222C1D5EE765A48BAE736F897B1D50C9DECF787580229053D71D6E03D2E5B6168D898677E0A7CE664102E9F6F2639B96E89C02B33B03964ADDC6D2FE26FAE30ABD940FE2D895303DA4E0B43318B8FD92E7FA97E000C5156D330E456DFD06A8D45E4AB137DB7834987FB2A93BA8C45B0B9' + /* ICC Public Key Certificate */
            '00');
assertSW('9000');
sequence = sequence + 1;


// SFI 2 Record 5
send('80E200' + String(toHex(sequence)) + '3E 0205 3B 70 39'+
            '9F47 03 010001'+ /* ICC Public Key Exponent */
            '9F48 2A CFD3E59E11E38C4BDCA2832F619951CAD777236D7CB77576C8E4C5F902F90F3849943D4C7D0F049479B9' +  /* ICC Public Key Remainder */
            '9F49 03 9F3704'+ /* DDOL */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 3 Record 1
// DGI 0301 : tag 5A
// this data is a signed application data
send('80E200' + String(toHex(sequence)) + '0F 0301 0C 70 0A'+
            '5A   08 6228000100001117'+ /* Application Primary Account Number (PAN) */
          
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 3 Record 2
// DGI 0302 : tag  5F34
// this data is a signed application data
send('80E200' + String(toHex(sequence)) + '09 0302 06 70 04'+            
            '5F34 01 01'+ /* Application PAN Sequence Number */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 3 Record 3
// DGI 0303 : tag 8C, 8D, 8E, 5F24, 5F25, 5F28, 5F30, 9F07, 9F08, 9F0D, 9F0E, 9F0F, 9F42
send('80E200' + String(toHex(sequence)) + '8D 0303 8A 70 8187'+
            '8C   18 9F02069F03069F1A0295055F2A029A039F21039C019F3704'+ /* CDOL1 */
            '8D   1A 8A029F02069F03069F1A0295055F2A029A039F21039C019F3704'+ /* CDOL2 */
            '8E   12 0000000000000000410342035E0343031F00'+ /* CVM List */
            '5F24 03 301231'+ /* Application Expiration Date */
            '5F25 03 950701'+ /* Application Effective Date */
            '5F28 02 0156'+ /* Issuer Country Code */
            '5F30 02 0201'+ /* Service Code */
            '9F07 02 FFC0'+ /* Application Usage Control */
            '9F08 02 0020'+ /* Application Version Number */
            '9F0D 05 F020040000'+ /* Issuer Action Code (IAC) Default */
            '9F0E 05 0050880000'+ /* IAC Denial */
            '9F0F 05 F020049800'+ /* IAC Online */
            '9F42 02 0156'+
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 4 Record 1
// DGI 0401 : tag 9F14, 9F23
send('80E200' + String(toHex(sequence)) + '0D 0401 0A 70 08'+
            '9F14 01 03'+ /* Lower Consecutive Offline Limit */
            '9F23 01 07'+ /* Upper Consecutive Offline Limit */
            '00');
assertSW('9000');
sequence = sequence + 1;


// SFI 4 Record 2
// DGI 0402 : 90 8F 92  9F32 5F24 5F25

send('80E200' + String(toHex(sequence)) + 'ED 0402 EA 70 81E7'+          
            '90   81A0 20D823AC76B24F62306F96B5CBD9C9410CA17C09477F6088FC505CDC8809349E53AADA77670C4E456E3913E72A655AA631DF1B2DF859D219D2127DFEF4DDD2B6D9B285FA2A68B25F29BD695D116C6168C2A49DC05F1985A3B40EAA10C99A2E86BCEF48EB8F903AF6158B4777467C7B0D5B4DF00A4E8948E8A1798BC5F506B367ECE6242C3AA930C27AC844A5811FBE4B30BBF38536F1B9B0261DB3D05DD67C72'+ 
            '8F   01 82'+ /* Certificate Authority Public Key Index */
            '92   24 6CD351B30C6009D372508AE881C89BC9D4FBA67750FD288326552439227FAEA00E9336D5' +
            '9F32 03 010001'+ /* IPK Exponent */
            '5F24 03 101231'+ 
            '5F25 03 950701'+ 
            '9F74 06 454343313131'+
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 4 Record 3
// DGI 0203 : tag 93 (Signed Static Application Data)
lenSAD = (SAD.length)/2;
send('80E200' + String(toHex(sequence)) + 'A9 0403 A6 70 81A3 93 81A0'+SAD+'00');
assertSW('9000');
sequence = sequence + 1;
;

// SFI 4 Record 4
send('80E200' + String(toHex(sequence)) + 'E3 0404 E0 70 81DD'+
	    '9F46 81A0 9936A5F9BE6E995EA35358AC869D66A227AF0BC7022723730667A7506C1E0D59F4FDCD1B1BC6D6447A778B71D54BA66222C1D5EE765A48BAE736F897B1D50C9DECF787580229053D71D6E03D2E5B6168D898677E0A7CE664102E9F6F2639B96E89C02B33B03964ADDC6D2FE26FAE30ABD940FE2D895303DA4E0B43318B8FD92E7FA97E000C5156D330E456DFD06A8D45E4AB137DB7834987FB2A93BA8C45B0B9' + /* ICC Public Key Certificate */
            				
            '9F47 03 010001'+ /* ICC Public Key Exponent */
            '9F48 2A CFD3E59E11E38C4BDCA2832F619951CAD777236D7CB77576C8E4C5F902F90F3849943D4C7D0F049479B9' +  /* ICC Public Key Remainder */
            				
            '9F49 03 9F3704'+ /* DDOL */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 5 Record 1 for VLP
// DGI 0501 : tag 8C, 8D, 8E, 5F24, 5F25, 5F28, 5F30, 9F07, 9F08, 9F0D, 9F0E, 9F0F, 9F42
send('80E200' + String(toHex(sequence)) + '8E 0501 8B 70 8188'+
            '8C   18 9F02069F03069F1A0295055F2A029A039F21039C019F3704'+ /* CDOL1 */
            '8D   1A 8A029F02069F03069F1A0295055F2A029A039F21039C019F3704'+ /* CDOL2 */
            '8E   0A 00000000000000000100' + // CVM for VLP
            '5F24 03 301231'+ /* Application Expiration Date */
            '5F25 03 950701'+ /* Application Effective Date */
            '5F28 02 0156'+ /* Issuer Country Code */
            '5F30 02 0201'+ /* Service Code */
            '9F07 02 FFC0'+ /* Application Usage Control */
            '9F08 02 0020'+ /* Application Version Number */
               '9F74 06 454343313131'+ // VLP Issuer Authorization Code
              '9F0D 05 7C70B80800'+   // IAC for VLP - Default
              '9F0E 05 7C70B80800'+   // IAC for VLP - Denial
              '9F0F 05 0000000000'+   // IAC for VLP - Online
            '9F42 02 0156'+
            '00');
assertSW('9000');
sequence = sequence + 1;

print('\n* Data Elements Not Stored in Records');
// Issuer Application Data
// DGI 9200 : tag 9F1
send('80E200' + String(toHex(sequence)) + '10 9200 0D'+
            '9F10 0A 07010103000000010A01'+
            '00');
assertSW('9000');
sequence = sequence + 1;


send('80E200' + String(toHex(sequence)) + '0c 9401 09'+
          
            '9F5D 06 00 00 00 00 00 01'+     /* EC Reset Threshold */ 
            '00');
assertSW('9000');
sequence = sequence + 1

// Optional/conditional tags, retrievable via Get Data Command
// DGI 0D01 : tag 9F58, 9F59, 9F53, 9F54, 9F72, 9F4F
send('80E200' + String(toHex(sequence)) + '65 0D01 62'+
            '9F58 01' + perso_LCOL + /* Lower Consecutive Offline Limit (Card Velocity Checking) */
            '9F59 01' + perso_UCOL + /* Upper Consecutive Offline Limit (Card Velocity Checking) */
            '9F53 01 05'+ /* Consecutive Transaction Limit, International */
            '9F54 06 000000005000'+ /* Cumulative Total Transaction Amount Limit */
			'9F5C 06 000000010200' +    /* Cumulative Total Transaction Amount Upper Limit */
            '9F72 01 00'+ /* Consecutive Transaction Limit, International (Country) */
            '9F4F 19 9A039F21039F02069F03069F1A025F2A029F4E149C019F3602'+ /* Log Format */
            '9F79 06 00 00 00 01 00 00 '+     /* EC Balance */       
            '9F77 06 00 00 00 01 50 00 '+     /* EC Balance Limit */ 
            '9F78 06 00 00 00 00 10 00'+     /* EC Single Transaction */
            '9F6D 06 00 00 00 00 15 00'+     /* EC Reset Threshold */ 
            '00');
assertSW('9000');
sequence = sequence + 1;

// Optional/conditional tags, not retrievable via command
// DGI 0E01 : tag 9F51, 9F52, 9F55, 9F56, 9F57, 9F76
//send('80 E2 00 09 25 0E01<p align="justify"></p> 22 9F51020840 9F520482400000 9F5501C0 9F560180 9F57020410 9F76020000 9F5D0101 00');
send('80E200' + String(toHex(sequence)) + '5F 0E01 5C'+
            '9F51 02 0156'+     /* Application Currency Code */
            '9F52 02'+ perso_ADA + /* Application Default Action (ADA) */
            '9F56 01'+ perso_IAI +       /* Issuer Authentication Indicator */
            '9F57 02 0156' +    /* Issuer Country Code */
            '9F76 02 0000'+     /* Secondary Application Currency Code */
            '57   13 6228000100001117D101220101234512399991'+
            
            '5F20 0F 46554C4C2046554E4354494F4E414C'+ /* Cardholder Name */
            '9F67 01 31'+ /* MSD offset*/
            '9F6C 02'+perso_CTQ+/* Card Transaction Qualifiers  */
            '9F6B 06 00 00 00 00 11 00'+/*Card CVM Limit*/
            '9F68 04'+perso_CAP+/* Card Additional Process*/   
            /*'9F13 01 01'+*/
            '5F34 01 01'+
             
            
          /*  '9F5D 01 01'+       /* Available Offline Spending Limit */
            '00');
assertSW('9000');
sequence = sequence + 1;


print('\n* Select Command Response Data');
// DGI 9102 : tag 50, 87, 5F2D, 9F38, 9F11, 9F12, BF0C
send('80E200' + String(toHex(sequence)) + '50 9102 4D'+
              'A5 4B'+ /* FCI Proprietary Template */
                '50   0B 50424F4320437265646974'+ /* Application Label */
                '87   01 01'+ /* Application Priority Indicator */
                '5F2D 08 7A68656E66726465'+ /* Language Preference */
                '9F38 0F 9F1A029F7A019F02065F2A029F4E14'+ /* PDOL. The tag '9F1A' is 'Terminal Country Code' */
                //'9F38 06 9F33039F4E14'+ /* PDOL. The tag '9F1A' is 'Terminal Country Code' */
                '9F11 01 01'+ /* Issuer Code Table Index */
                '9F12 0F'+perso_appPreferredName+ /* Application Preferred Name */
                'BF0C 05'+ /* FCI Issuer Discretionary Data */
                  '9F4D 02' + /* Log Entry Tag */
                    '0B 0A' +    /* SFI 12, 10 records */
                '00');
assertSW('9000');
sequence = sequence + 1;

print('\n* Select Command Response Data for CL');
// DGI 9103 : tag 50, 87, 5F2D, 9F38, 9F11, 9F12, BF0C
send('80E200' + String(toHex(sequence)) + '59 9103 56'+
              'A5 54'+ /* FCI Proprietary Template */
                '50   0B 50424F4320437265646974'+ /* Application Label */
                '87   01 01'+ /* Application Priority Indicator */
                '5F2D 08 7A68656E66726465'+ /* Language Preference */
                '9F38 18 9F66049F02069F03069F1A0295055F2A029A039C019F3704'+ /* PDOL. The tag '9F1A' is 'Terminal Country Code' */
                //'9F38 06 9F33039F4E14'+ /* PDOL. The tag '9F1A' is 'Terminal Country Code' */
                '9F11 01 01'+ /* Issuer Code Table Index */
                '9F12 0F'+perso_appPreferredName+ /* Application Preferred Name */
                'BF0C 05'+ /* FCI Issuer Discretionary Data */
                  '9F4D 02' + /* Log Entry Tag */
                    '0B 0A' +    /* SFI 12, 10 records */
                '00');
assertSW('9000');
sequence = sequence + 1;



print('\n* Alternate DES Keys DGI 8001');
var udk_msd = '62582ADDB9854F0831FBF2635A212E4D';
var encrypted_udk_msd = encrypt_data(udk_msd);

send('80E260'+String(toHex(sequence))+'13 8001 10' + encrypted_udk_msd);
assertSW('9000');
sequence = sequence + 1;





// store CRT constant 1/q mod p
keydata = 
'5D79200FF4EDEEE96AE5BC10342743D3C2EDED1E7FFE080D752405D52B7795E83622110496C9BC95929EC17C17A62982F8548ECFECF3A1C08636641BE02117F73F13EA4FB550CE12D3D24E302A03850102E9A1E56DDA033E';


encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '63'+
            '8201' + /* DGI */
            '60' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;


// store CRT constant d mod (q-1)
keydata =
'85DE59F25425734A2ABD98F48639A8EB2C0B78F94CD9AB844F3459D11BDAE6BC133C1432B756CE5F3FEE8BAC10359C7B758935461BD087F1610935E4AD884A9F47B03B4CC940CCEA9986F76D315A41E73C48797306D15833';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '63'+
            '8202' + /* DGI */
            '60' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;



// store CRT constant d mod (p-1)
keydata =
'9716BD6B024C493DBEEB811ED0F0D29DBD9E14CDA56245453D5B709BBD305C1BE836D02B7FDDB965840E6E26623C2AC7C8B3C8E3B4A1AA22DABC1D3FD5761B8BFFD0E801C3FE39DD0E2F161D5CE8BDBBAFDD7165CAF8665F'; 

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '63'+
            '8203' + /* DGI */
            '60' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;





// store CRT constant  q
keydata =
'C8CD86EB7E382CEF401C656EC9567D60C2113575F346814676CE86B9A9C85A1A1CDA1E4C1302358EDFE5D18218506AB9304DCFE929B8CBEA118DD0D7044C6FEEEB8858F32DE1335FE64A7323CA0762DADA6CB62C8A3A044D';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '63'+
            '8204' + /* DGI */
            '60' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;


// store CRT constant  p
keydata =
'E2A21C2083726DDC9E6141AE39693BEC9C6D1F34781367E7DC0928E99BC88A29DC5238413FCC96184615A539935A402BAD0DAD558EF27F34481A2BDFC0312951FFB95C02A5FD56CB9546A12C0B5D1C9987CC2A18B074998F';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '63'+
            '8205' + /* DGI */
            '60' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;
  
  
  
print('\n* PIN Data');
// Off-line PIN encrypted data
var pin_block = '241234FFFFFFFFFF';
var enc_pin = encrypt_data(pin_block);
send('80E260' + String(toHex(sequence)) + '0B 8010 08' + enc_pin + '00');
assertSW('9000');
sequence = sequence + 1;

//DGI : 9010 ( Pin Try Counter and Pin Try Limit)
send('80E200' + String(toHex(sequence)) + '05 9010 020303 00');
assertSW('9000');
sequence = sequence + 1;


print('\n* Key Data');

var udk = '11223344006677881122334455007788';
var mac = '8B4F854F0831FBF2635A212E4DDDB92A';
var enc = '11220044556677881122330055667788';

var encrypted_udk = encrypt_data(udk);
var encrypted_mac = encrypt_data(mac);
var encrypted_enc = encrypt_data(enc);

var udk_kcv = get_kcv(udk);
var mac_kcv = get_kcv(mac);
var enc_kcv = get_kcv(enc);

send('80E260' + String(toHex(sequence)) + '33 8000 30' + encrypted_udk + encrypted_mac + encrypted_enc);
assertSW('9000');
sequence = sequence + 1;

print('\n* Completion of Personalization');
// DGI 9000 : Key Check Value
send('80E280' + String(toHex(sequence)) + '0C 9000 09' + udk_kcv + mac_kcv + enc_kcv);
assertSW('9000');
sequence = sequence + 1;


include("PSE_perso.js");
include("PPSE_perso.js");

//inputDialog("카드 상태를 SECURED로 바꿈.");
//
//reset();
//select(isd_aid);
//auth();
//send('80F0800700'); // transition the Card Life Cycle to INITIALIZED
//assertSW('9000');
//send('80F0800F00'); // transition the Card Life Cycle to SECURED
//assertSW('9000');

