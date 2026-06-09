/*
 * Card Image 0035
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
var perso_CAP="41002000"//9F68 Card Additional Process
var perso_CTQ="3000"//9F6B Card Transaction Qualifiers
var isd_aid = 'A000000003000000';

var keydata;
var encrypted_keydata;
var sequence = 0;




include("pboc_reset.js");

reset();
print('****************************************************************');
print('* Card Image 0035 : ');
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
send('80E200' + String(toHex(sequence)) + '1C 9207 19'+
              '82 02' + perso_AIP_QPBOC + // EC(VLP) AIP
              '94 08  20020400 18010101'+ // VLP AFL
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
            '57   13 6228000100001117D301220101234512399991'+ /* Track 2 Equivalent Data */
                     
            '5F20 0F 46554C4C2046554E4354494F4E414C'+ /* Cardholder Name */
            '9F1F 16 30313032303330343035303630373038303930413042'+ /* Track 1 Discretionary Data */
            '00');
assertSW('9000');
sequence = sequence + 1;



// SFI 2 Record 1
// DGI 0201 : tag 90
send('80E200' + String(toHex(sequence)) + '89 0201 86 70 8183'+
              '90 8180'+IPK_Certificate+'00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 2
// DGI 0202 : tag 8F, 92, 9F32
send('80E200' + String(toHex(sequence)) + '32 0202 2F 70 2D'+
            '8F   01 80'+ /* Certificate Authority Public Key Index */
            '92   24 8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B' +
            '9F32 01 03'+ /* IPK Exponent */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 3
// DGI 0203 : tag 93 (Signed Static Application Data)
lenSAD = (SAD.length)/2;
send('80E200' + String(toHex(sequence)) + '89 0203 86 70 8183 93 8180'+SAD+'00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 4
// DGI 0204 : tag 9F46
send('80E200' + String(toHex(sequence)) + '8A 0204 87 70 8184'+
            '9F46 8180 875F85F08A89F4B500FA8C1A55407D88322710E3B885390D945422A73A0AB876F4C4FBC9C49C3083F38C9EFE6C7B21F6541050BF11642A28329C65D8831C80CC0D753D412112800FF2FA12ECC83B318A26EE44E313BD5D1C45C806787387DB91D259D75D350F9CD18B34C635A94EF343A2E88F8A4162D83BC900EA2CF5592820' + /* ICC Public Key Certificate */
            			
            '00');
assertSW('9000');
sequence = sequence + 1;


// SFI 2 Record 5
send('80E200' + String(toHex(sequence)) + '3E 0205 3B 70 39'+
            '9F47 03 010001'+ /* ICC Public Key Exponent */
            '9F48 2A 518B0EA3ABA9343F1778545FFB49EE84' +  /* ICC Public Key Remainder */
            				'0BBCEA457DBAABBFD755BA0F943A08A5' +
            				'9CFFB6066B4084767599' +
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

send('80E200' + String(toHex(sequence)) + 'CB 0402 C8 70 81C5'+          
            '90   8180 229103A5E3120F2D2862091176AA2BD4E24D69E7EEF7B9195C91EA0088AECFF47EDFA0BEEF7C391DF3B05F717DCC06FFC8EEFF90BA14212B8A52AD48B33277B2E230D40B3E76DC59778926F1D8739E106CD741DE06A7423DFBA25E02F12E543D13D1B471806526024981B7D26B4BF6E5558604CCC289F59E8A802F45FB3D9E67'+ 
            '8F   01 80'+ 
            '92   24 8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B'+ 
            '9F32 01 03'+ 
            '5F24 03 301231'+ 
            '5F25 03 950701'+ 
            '9F74 06 454343313131'+
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 4 Record 3
// DGI 0203 : tag 93 (Signed Static Application Data)
lenSAD = (SAD.length)/2;
send('80E200' + String(toHex(sequence)) + '89 0403 86 70 8183 93 8180'+SAD+'00');
assertSW('9000');
sequence = sequence + 1;
;

// SFI 4 Record 4
send('80E200' + String(toHex(sequence)) + 'C3 0404 C0 70 81BD'+
	    '9F46 8180 875F85F08A89F4B500FA8C1A55407D88322710E3B885390D945422A73A0AB876F4C4FBC9C49C3083F38C9EFE6C7B21F6541050BF11642A28329C65D8831C80CC0D753D412112800FF2FA12ECC83B318A26EE44E313BD5D1C45C806787387DB91D259D75D350F9CD18B34C635A94EF343A2E88F8A4162D83BC900EA2CF5592820' + /* ICC Public Key Certificate */
            					
            '9F47 03 010001'+ /* ICC Public Key Exponent */
            '9F48 2A 518B0EA3ABA9343F1778545FFB49EE84' +  /* ICC Public Key Remainder */
            				'0BBCEA457DBAABBFD755BA0F943A08A5' +
            				'9CFFB6066B4084767599' +
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
// DGI 9200 : tag 9F10
send('80E200' + String(toHex(sequence)) + '10 9200 0D'+
            '9F10 0A 07010103000000010A01'+
            '00');
assertSW('9000');
sequence = sequence + 1;


send('80E200' + String(toHex(sequence)) + '0c 9401 09'+
          
            '9F5D 06 00 00 00 00 00 01'+     /* EC Reset Threshold */ 
            '00');
assertSW('9000');
sequence = sequence + 1;

// Optional/conditional tags, retrievable via Get Data Command
// DGI 0D01 : tag 9F58, 9F59, 9F53, 9F54, 9F72, 9F4F
send('80E200' + String(toHex(sequence)) + '5C 0D01 59'+
            '9F58 01' + perso_LCOL + /* Lower Consecutive Offline Limit (Card Velocity Checking) */
            '9F59 01' + perso_UCOL + /* Upper Consecutive Offline Limit (Card Velocity Checking) */
            '9F53 01 05'+ /* Consecutive Transaction Limit, International */
            '9F54 06 000000007000'+ /* Cumulative Total Transaction Amount Limit */
			 /*'9F5C 06 000000011000' +    Cumulative Total Transaction Amount Upper Limit */	
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
send('80E200' + String(toHex(sequence)) + '38 0E01 35'+
            '9F51 02 0156'+     /* Application Currency Code */
            '9F52 02'+ perso_ADA + /* Application Default Action (ADA) */
            '9F56 01'+ perso_IAI +       /* Issuer Authentication Indicator */
            '9F57 02 0156' +    /* Issuer Country Code */
            '9F76 02 0000'+     /* Secondary Application Currency Code */
            //'57   13 6228000100001117D301220101234512399991'+

            //'5F20 0F 46554C4C2046554E4354494F4E414C'+ /* Cardholder Name */
			'9F67 01 31'+ /* MSD offset*/
            '9F6C 02'+perso_CTQ+/* Card Transaction Qualifiers  */
            '9F6B 06 00 00 00 00 11 00'+/*Card CVM Limit*/
            '9F68 04'+perso_CAP+/* Card Additional Process*/    
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

print('\n* Select Command Response Data CL');
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
'0EB41A42801F08D5C16EE593800E16C42894639D1D16FCD366FE4D80A4154B15FB25AC5C24D7607848B55F022230FE4FAD4913AD526CB928A762F183625D775B';


encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '4B'+
            '8201' + /* DGI */
            '48' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;


// store CRT constant d mod (q-1)
keydata =
'5A2479BF4799F5A9EF236387F9341203C5091A5B08245F33560DF43EEB6592F73A8F0FC5026B8EBFAA60D1BD76F43F02B2A33ABB40357C0FB9E92568AE02CCB9';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '4B'+
            '8202' + /* DGI */
            '48' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;



// store CRT constant d mod (p-1)
keydata =
'3D25ADCD0731EDEBBF3F5B4EFDC13C4DE5D00AFE3CFAA2D9F00B8EED81E36AF8CCC566E050BCA1DEF2CADEAC38F492589A6FD5E7D9D32F3D1758FE0E1E233541'; 

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '4B'+
            '8203' + /* DGI */
            '48' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;





// store CRT constant  q
keydata =
'C1960C87E0333FCBB1C2BBEB787019D6080B33C8F5039C2BD55CC1D247398AA5DBD47FA4E1FF85F425D214B4B32A341E72C1F9FF6765D1155963BEC02E8958D9';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '4B'+
            '8204' + /* DGI */
            '48' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;


// store CRT constant  p
keydata =
'D0BAD286ED4E1CBE6CED5391A9696ED58F317E4A52D0E37C755C01225F676AB712A15D1B953BD67FB8DFB610655965352583B46B260E481661DF74FE85C20AC1';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '4B'+
            '8205' + /* DGI */
            '48' + /* Encrypted KEYDATA Length */
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

