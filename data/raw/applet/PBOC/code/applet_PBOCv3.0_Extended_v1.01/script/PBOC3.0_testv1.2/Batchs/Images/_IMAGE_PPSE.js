var isd_aid = 'A0';
var ppse_aid = '325041592E5359532E4444463031';
               


reset();
set_var('scp02');
select(isd_aid);
auth();

print('\n* Install PPSE');

//delete PSE applet
//send('80E4000010 4F0E315041592E5359532E444446303100');

    // Installation using the PSE Applet
send('80E60C0024'+ 
              '06 A00000033301'+  /* Load File AID: ¡®1PAY.¡¯ */
              '07 A0000003330101'+ /* Applet AID: ¡®1PAY.SYS.DDF01¡¯ */
//              '06 A00000033310'+  /* Load File AID: ¡®1PAY.¡¯ */       
//              '07 A0000003331010'+ /* Applet AID: ¡®1PAY.SYS.DDF01¡¯ */
              '0E 325041592E5359532E4444463031'+ /* Application instance identifier (AID): ¡®2PAY.SYS.DDF01¡¯ */
              '01 00'+ 
              '02 C900'+ 
              '00');

print('\n* Select PPSE');
select(ppse_aid);

print('\n* External Authenticate and Initialize Update');
auth();

print('\n* Data Elements Stored in Records');
// SFI 1 Record 1
send('80E200001D 0101 1A'+
            '70 18'+
               '61 16'+
                  '4F 07 A0000003330101'+ /* Application Identifier AID */			
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
// DGI ¡®9102¡¯
send('80E2800123 9102 20'+
		'A5 1E'+ /* FCI Proprietary Template */
               		'BF0C 1B'+
               			'61 19'+
                  			'4F 07 A0000003330101'+ /* Application Identifier AID */			
                  			'50 0B 50424F4320437265646974'+ /* Application Label */
                  			'8701  01'+
                '00'); 
/* Besides, FCI Issuer Discretionary Data (tag 'BF0C') can be 
 * contained in DGI '9102'. */
