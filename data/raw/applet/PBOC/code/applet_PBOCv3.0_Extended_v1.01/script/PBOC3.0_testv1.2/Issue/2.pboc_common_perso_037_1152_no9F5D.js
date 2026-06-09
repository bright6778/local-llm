/*
 * Card Image 0037
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
var perso_CAP="83004000"//9F68 Card Additional Process
var perso_CTQ="3000"//9F6B Card Transaction Qualifiers
var isd_aid = 'A000000003000000';

var keydata;
var encrypted_keydata;
var sequence = 0;




include("pboc_reset.js");

reset();
print('****************************************************************');
print('* Card Image 0037 : ');
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
			   '9F10 08 0701110300000001'+
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
IPK_Certificate = "A3119EFDF07517755BC5078B11A4D9BACBB3D692A68FF7C9FC3B4B3CFAA414572203AF653870C65924B28EAC3571727513D3D15193966DD92D81B118499EE21A7CB0ED248C3CD0A87A348301FD563E61080C25644A8D3F7623190459452548D7EE81EBCF8AD792FED1681DD905EADA98F3AF7A596726ECBD5BB5A83F5155F8EFDEE46703FA4BA9BE9D35878874CB67A3"; 
send('80E200' + String(toHex(sequence)) + '99 0201 96 70 8193'+
              '90 8190'+IPK_Certificate+'00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 2
// DGI 0202 : tag 8F, 92, 9F32
send('80E200' + String(toHex(sequence)) + '34 0202 31 70 2F'+
            '8F   01 81'+ /* Certificate Authority Public Key Index */
            '92   24 3F27E50E9006C6F69DBD7BCCC7F283F7C5085CA6E0BB1F619F165665456D135E8ABC66EF' +
            '9F32 03 010001'+ /* IPK Exponent */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 3
// DGI 0203 : tag 93 (Signed Static Application Data)
SAD = "04FC8DA0935AA70354A9468E31A16DA0966F9F3F2A8E1B73B9857A470CE13913C7A7E7BC5AA8E098BE7684F11C976AFB42C2DC724130FD33EDF81FFDA0CF6E16FE66D0EA76575BC10BB4732B8081B7F4A0C76CA36EDD6E9DA79EEDE933988B1D05C10F043214223952589186479B3BFBE217583C643252A6FDDF00DB20A003D1F83B8BB313CFDD9B8A008354641C5CF8";
lenSAD = (SAD.length)/2;
send('80E200' + String(toHex(sequence)) + '99 0203 96 70 8193 93 8190'+SAD+'00');
assertSW('9000');
sequence = sequence + 1;

// SFI 2 Record 4
// DGI 0204 : tag 9F46
send('80E200' + String(toHex(sequence)) + '9A 0204 97 70 8194'+
            '9F46 8190 262843BF9BD6B68337135F019D5F3D0F0BE4647028E1CCD2330CA6DD76D0BE6FF16096C0C875E4998E61B46C6EB9B108F115548EEA88D0E55245F51DD827EE9EDB0AB281A5D8D22B4027724451928E738EF87CDE39BF422945925DFBF5A9BFC7A2FAAB9666262CDC312ED49549BB3BA8AD64342FF2606C0F986CB2D964C3119959E7ADD80CE4B9460DC2EA0AF9BE64D8' + /* ICC Public Key Certificate */
            '00');
assertSW('9000');
sequence = sequence + 1;


// SFI 2 Record 5
send('80E200' + String(toHex(sequence)) + '3E 0205 3B 70 39'+
            '9F47 03 010001'+ /* ICC Public Key Exponent */
            '9F48 2A E61D45C80EAE4F411022F35AD7B42DBA0971B204454128E5583CFB3FAF8BB091EB890B1CD82FB646123D' +  /* ICC Public Key Remainder */
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

send('80E200' + String(toHex(sequence)) + 'DD 0402 DA 70 81D7'+          
            '90   8190 A3119EFDF07517755BC5078B11A4D9BACBB3D692A68FF7C9FC3B4B3CFAA414572203AF653870C65924B28EAC3571727513D3D15193966DD92D81B118499EE21A7CB0ED248C3CD0A87A348301FD563E61080C25644A8D3F7623190459452548D7EE81EBCF8AD792FED1681DD905EADA98F3AF7A596726ECBD5BB5A83F5155F8EFDEE46703FA4BA9BE9D35878874CB67A3'+ 
			'8F   01 81'+ /* Certificate Authority Public Key Index */
            '92   24 3F27E50E9006C6F69DBD7BCCC7F283F7C5085CA6E0BB1F619F165665456D135E8ABC66EF' +
            '9F32 03 010001'+ 

            '5F24 03 101231'+ 
            '5F25 03 950701'+ 
            '9F74 06 454343313131'+
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 4 Record 3
// DGI 0203 : tag 93 (Signed Static Application Data)
lenSAD = (SAD.length)/2;
send('80E200' + String(toHex(sequence)) + '99 0403 96 70 8193 93 8190'+SAD+'00');
assertSW('9000');
sequence = sequence + 1;
;

// SFI 4 Record 4
send('80E200' + String(toHex(sequence)) + 'D3 0404 D0 70 81CD'+
	    '9F46 8190 262843BF9BD6B68337135F019D5F3D0F0BE4647028E1CCD2330CA6DD76D0BE6FF16096C0C875E4998E61B46C6EB9B108F115548EEA88D0E55245F51DD827EE9EDB0AB281A5D8D22B4027724451928E738EF87CDE39BF422945925DFBF5A9BFC7A2FAAB9666262CDC312ED49549BB3BA8AD64342FF2606C0F986CB2D964C3119959E7ADD80CE4B9460DC2EA0AF9BE64D8' + /* ICC Public Key Certificate */
            				
            '9F47 03 010001'+ /* ICC Public Key Exponent */
            '9F48 2A E61D45C80EAE4F411022F35AD7B42DBA0971B204454128E5583CFB3FAF8BB091EB890B1CD82FB646123D' +  /* ICC Public Key Remainder */
            			
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
          
            '9F5D 06 00 00 00 00 00 00'+     /* EC Reset Threshold */ 
            '00');
assertSW('9000');
sequence = sequence + 1;

// Optional/conditional tags, retrievable via Get Data Command
// DGI 0D01 : tag 9F58, 9F59, 9F53, 9F54, 9F72, 9F4F
send('80E200' + String(toHex(sequence)) + '5C 0D01 59'+
            '9F58 01' + perso_LCOL + /* Lower Consecutive Offline Limit (Card Velocity Checking) */
            '9F59 01' + perso_UCOL + /* Upper Consecutive Offline Limit (Card Velocity Checking) */
            '9F53 01 05'+ /* Consecutive Transaction Limit, International */
            '9F54 06 000000010000'+ /* Cumulative Total Transaction Amount Limit */
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
            '57   13 6228000100001117D301220101234512399991'+
            
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
send('80E200' + String(toHex(sequence)) + '4D 9103 4A'+
              'A5 48'+ /* FCI Proprietary Template */
                '50   0B 50424F4320437265646974'+ /* Application Label */
                '87   01 01'+ /* Application Priority Indicator */
                '5F2D 08 7A68656E66726465'+ /* Language Preference */
                '9F38 0C 9F66049F02069F37045F2A02'+ /* PDOL. The tag '9F1A' is 'Terminal Country Code' */
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
'320EDC3CE80DA0DB119DE0EAFFD94BB8D6D28D05402AACB066D16092048AFC19378E1E196F6D9477B92D5B62981E392E412C375E1D7BA28315D08E724554AFC1DCECDB87DD281D4A';


encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '53'+
            '8201' + /* DGI */
            '50' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;


// store CRT constant d mod (q-1)
keydata =
'C301583430DDF72521EC047FDAA99126FF542FEDCF4AD7E73F065FDBFCEE31E89118DE7A3B499E857AD8B4CB45767624FD95FD27A60443925ABBA96A9588842C38A0BA889154C773';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '53'+
            '8202' + /* DGI */
            '50' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;



// store CRT constant d mod (p-1)
keydata =
'25A164A64F83874F10FC11C7440B823C11C007ABD9CB17E33882DE780ABB1F877C1D7CC17AFC019D787AE9D45EC6BE14099A4070771DE4C3A6CFE335D17C530CD671E1BC836D25F1'; 

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '53'+
            '8203' + /* DGI */
            '50' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;





// store CRT constant  q
keydata =
'CD56A40C4B696022316FD7D6A26B326491B3AA243BDFC40E100A3232DDE5FDE177C92519ECA48D0B9BE0B8D02B3EADD86395834DAEA1FDDD1AE568AF7AF179A45A7E69321A1FCC4F';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '53'+
            '8204' + /* DGI */
            '50' + /* Encrypted KEYDATA Length */
            encrypted_keydata);
assertSW('9000');
sequence = sequence + 1;


// store CRT constant  p
keydata =
'C9E1B40C7E4739E4ADEAEF232921D43C1A124DB3EB059150FB99E16198CB67D451EABA119902C75D97900F12CA150ECFB5DD011015C28DDD094B7C031DB801887F62EAACC96199B3';  

encrypted_keydata = encrypt_data(keydata + '8000000000000000');
send('80E260' + String(toHex(sequence)) + '53'+
            '8205' + /* DGI */
            '50' + /* Encrypted KEYDATA Length */
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

