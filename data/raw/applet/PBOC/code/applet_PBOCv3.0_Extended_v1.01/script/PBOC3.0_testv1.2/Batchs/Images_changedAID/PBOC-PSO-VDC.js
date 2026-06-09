/*
 * Card Image 0005  (PBOC 스펙에 없는 image )
 */
 
 
var perso_appPreferredName = "4341524420494D4147452030303332"; //9F12
var perso_AIP = "5C00"; //82
var perso_ADA = "8240"; //9F52
var perso_IAI = "80"; //9F56
var perso_LCOL = "0F"; //9F58
var perso_UCOL = "0F"; //9F59

var isd_aid = 'A0';
var sequence = 0;


include("..\\..\\_PBOC_CONF.js");

var isRemoveInstance;
isRemoveInstance=true;

//select ISD
reset();
select('a0000000030000');
auth();

if(isRemoveInstance){
	
	//remove instance
	print('\n* Remove Instance');
	send('80E40000104F0E325041592E535953 2E444446303100');
	send('80E40000104F0E315041592E535953 2E444446303100');
	send('80E40000094F07A000000333010200');
	send('80E40000094F07A000000333010100');
	/*print('\n* Remove Instance');
	send('80E40000094F07A000000333010100');
	send('80E40000094F07A000000333010200');
	send('80E40000104F0E315041592E535953 2E444446303100');
	send('80E40000104F0E325041592E535953 2E444446303100');*/
	
}else{

	//delete package
	print('\n* Delete packages');
	send('80E4008007 4F05FFEEDDCCBB');    //delete MF
	send('80E40080074F05315041592E00');
	send('80E40080084F06A0000003330100');
	send('80E40080074F05554433221100');
	
	//load applet
	print('\n* Load PBOC');
	loadCAP(PBOC_capFilePath);
}

//print('////////////////////////////////////////////');
//print(' C91C에 실인증 보내기 위한 추가 코드          ');
//print(' EEPROM size를 C91A에 맞게 수정한다.         ');
//print('////////////////////////////////////////////');
//include("[1C v1.0] eep_patch_lib.js");
//
//reset();
//eep_patch_auth();
//
//eep_patch_write('080E5B','081590'+'006A50');
//
////select ISD
//reset();
//select('a0000000030000');
//auth();
//print('////////////////////////////////////////');

// 에플릿 크기 측정용
//pause();

//print('\n* Install MF');
///send('80E60C001B 05FFEEDDCCBB 06FFEEDDCCBBAA 07FFEEDDCCBBAA01 011402C90000');

//print('\n* Install PBOC');
//send('80E60C001E 06A00000033301 07A0000003330101 08A000000333010101 011002C9000000');
//assertSW('9000');

print('\n* Install PBOC');
send('80E60C001D 06A00000033301 07A0000003330101 07A0000003330101 011002C9000000');
//send('80E60C001D 06A00000033301 07A0000000031010 07A0000000031010 011002C9000000');//visa
assertSW('9000');

print('\n* Select PBOC');
select(pboc_aid);

print('\n* External Authenticate and Initialize Update');
auth();

reset();
print('****************************************************************');
print('* Card Image 0005 : ');
print('****************************************************************');

print('\n* External Authenticate and Initialize Update');
set_var('scp02');

print('\n* Select PBOC');
select(pboc_aid);

print('\n* External Authenticate and Initialize Update');
auth();

print('\n* Get Processing Options Command Response Data');
// DGI 9104 : tag 82, 94
send('80E200' + String(toHex(sequence)) + '19 9104 16'+
            '82 02' + perso_AIP + /* Application Interchange Profile (AIP) */
            '94 10 08010200 10010300 18010301 20010100'+ /* Application File List (AFL) */
            '00');
assertSW('9000');
sequence = sequence + 1;


print('\n* Data Elements Stored in Records');
// SFI 1 Record 1
// DGI 0101 : tag  57, 5F20, 9F1F
send('80E200' + String(toHex(sequence)) + '43 0101 40 70 3E'+
            '57   11 6228000100001117D30122010123456789'+ /* Track 2 Equivalent Data */
            '5F20 0F 46554C4C2046554E4354494F4E414C'+ /* Cardholder Name */
            '9F1F 16 30313032303330343035303630373038303930413042'+ /* Track 1 Discretionary Data */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 1 Record 2
// DGI 0102 : tag 57, 9F1F
send('80E200' + String(toHex(sequence)) + '31 0102 2E 70 2C'+
            '57   11 6228000100001117D30122010123456789'+ /* Track 2 Equivalent Data */
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

// SFI 3 Record 1
// DGI 0301 : tag 5A, 5F34
// this data is a signed application data
send('80E200' + String(toHex(sequence)) + '13 0301 10 70 0E'+
            '5A   08 6228000100001117'+ /* Application Primary Account Number (PAN) */
            '5F34 01 01'+ /* Application PAN Sequence Number */
            '00');
assertSW('9000');
sequence = sequence + 1;

// SFI 3 Record 2
// DGI 0302 : tag 8C, 8D, 8E, 5F24, 5F25, 5F28, 5F30, 9F07, 9F08, 9F0D, 9F0E, 9F0F, 9F42
send('80E200' + String(toHex(sequence)) + '8D 0302 8A 70 8187'+
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
            

// SFI 3 Record 3
// DGI 0303 : tag 8E
send('80E200' + String(toHex(sequence)) + '19 0303 16 70 14'+
            '8E 12 0000000000000000410342035E0343031F00'+ /* CVM List */
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


print('\n* Data Elements Not Stored in Records');
// Issuer Application Data
// DGI 9200 : tag 9F10
send('80E200' + String(toHex(sequence)) + '0E 9200 0B'+
            '9F10 08 0701010300000001'+
            '00');
assertSW('9000');
sequence = sequence + 1;

// Optional/conditional tags, retrievable via Get Data Command
// DGI 0D01 : tag 9F58, 9F59, 9F53, 9F54, 9F72, 9F4F
send('80E200' + String(toHex(sequence)) + '48 0D01 45'+
            '9F58 01' + perso_LCOL + /* Lower Consecutive Offline Limit (Card Velocity Checking) */
            '9F59 01' + perso_UCOL + /* Upper Consecutive Offline Limit (Card Velocity Checking) */
            '9F53 01 0F'+ /* Consecutive Transaction Limit, International */
            '9F54 06 000099999999'+ /* Cumulative Total Transaction Amount Limit */
            '9F75 06 000000015000'+ /* Cumulative Total Transaction Amount Limit (Dual Currency) */            
            '9F73 04 20000175'+ /* Currency Conversion Factor */
            '9F72 01 0F'+ /* Consecutive Transaction Limit, International (Country) */
            '9F4F 19 9A039F21039F02069F03069F1A025F2A029F4E149C019F3602'+ /* Log Format */
            '00');
assertSW('9000');
sequence = sequence + 1;

// Optional/conditional tags, not retrievable via command
// DGI 0E01 : tag 9F51, 9F52, 9F55, 9F56, 9F57, 9F76
//send('80 E2 00 09 25 0E01<p align="justify"></p> 22 9F51020840 9F520482400000 9F5501C0 9F560180 9F57020410 9F76020000 9F5D0101 00');
send('80E200' + String(toHex(sequence)) + '1B 0E01 18'+
            '9F51 02 0156'+     /* Application Currency Code */
            '9F52 02'+ perso_ADA + /* Application Default Action (ADA) */
            '9F56 01'+ perso_IAI +       /* Issuer Authentication Indicator */
            '9F57 02 0156' +    /* Issuer Country Code */
            '9F76 02 0826'+     /* Secondary Application Currency Code */
          /*  '9F5D 01 01'+       /* Available Offline Spending Limit */
            '00');
assertSW('9000');
sequence = sequence + 1;


print('\n* Select Command Response Data');
// DGI 9102 : tag 50, 87, 5F2D, 9F38, 9F11, 9F12, BF0C
send('80E200' + String(toHex(sequence)) + '47 9102 44'+
              'A5 42'+ /* FCI Proprietary Template */
                '50   0B 50424F4320437265646974'+ /* Application Label */
                '87   01 01'+ /* Application Priority Indicator */
                '5F2D 08 7A68656E66726465'+ /* Language Preference */
                '9F38 06 9F33039F4E14'+ /* PDOL. The tag '9F1A' is 'Terminal Country Code' */
                '9F11 01 01'+ /* Issuer Code Table Index */
                '9F12 0F'+perso_appPreferredName+ /* Application Preferred Name */
                'BF0C 05'+ /* FCI Issuer Discretionary Data */
                  '9F4D 02' + /* Log Entry Tag */
                    '0B 0A' +    /* SFI 12, 10 records */
                '00');
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


var isd_aid = 'A000000003000000';
var pse_aid = '315041592E5359532E4444463031';
        


set_var('scp02');
select(isd_aid);
auth();

print('\n* Install PSE');

//delete PSE applet
send('80E4000010 4F0E315041592E5359532E444446303100');

    // Installation using the PSE Applet
send('80E60C0024'+ 
              '06 A00000033301'+  /* Load File AID: ‘1PAY.’ */
              '07 A0000003330101'+ /* Applet AID: ‘1PAY.SYS.DDF01’ */
              '0E 315041592E5359532E4444463031'+ /* Application instance identifier (AID): ‘1PAY.SYS.DDF01’ */
              '01 00'+ 
              '02 C900'+ 
              '00');

print('\n* Select PSE');
select(pse_aid);

print('\n* External Authenticate and Initialize Update');
auth();

print('\n* Data Elements Stored in Records');
// SFI 1 Record 1
send('80E200004D 0101 4A'+
            '70 48'+
               '61 16'+
                  '4F 07 A0000003330101'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
               '61 16'+
                  '4F 07 A0000003330102'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
               '61 16'+
                  '4F 07 A0000003330103'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
                  '00');
                  
                  
// SFI 1 Record 1
/*send('80E200001E 0101 1B'+
            '70 19'+
               '61 17'+
                  '4F 08 A0000003330101'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
       /*           '00');*/

/* Besides, Directory Discretionary Template (tag '73') can be 
 * contained in DGI '0101'. */

print('\n* Data Elements Not Stored in Records');
// DGI ‘9102’
send('80E2800108 9102 05'+
              'A5 03'+ /* FCI Proprietary Template */
                '88 01 01'+ /* SFI of the directory elementary file */
                '00'); 
/* Besides, FCI Issuer Discretionary Data (tag 'BF0C') can be 
 * contained in DGI '9102'. */  

//inputDialog("카드 상태를 SECURED로 바꿈.");
//reset();
//select(isd_aid);
//auth();
//send('80F0800700'); // transition the Card Life Cycle to INITIALIZED
//assertSW('9000');
//send('80F0800F00'); // transition the Card Life Cycle to SECURED
//assertSW('9000');

