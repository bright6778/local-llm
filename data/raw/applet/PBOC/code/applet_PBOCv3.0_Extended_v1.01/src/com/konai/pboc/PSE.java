/*
 * Copyright (c) 2013 KEBTechnology Co., Ltd. All rights reserved.
 * KEBT PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.konai.pboc;

import org.globalplatform.GPSystem;
import org.globalplatform.SecureChannel;
import javacard.framework.APDU;
import javacard.framework.Applet;
import javacard.framework.AppletEvent;
import javacard.framework.CardException;
import javacard.framework.ISO7816;
import javacard.framework.ISOException;
import javacard.framework.JCSystem;
import javacard.framework.Util;
/**
 * @author cyf
 * created on 2013. 4. 25.
 */
public class PSE extends Applet implements AppletEvent {
	//object
    Object[] records_PSE;
	SecureChannel secureChannel;
	
	//instruction
	static final byte EMV_INS_GET_DATA 		 = (byte) 0xCA;
	static final byte EMV_INS_READ_RECORD 	 = (byte) 0xB2;
	static final byte CP_STORE_DATA 	 	 = (byte) 0xE2;
	static final byte CP_EXT_AUTH 		     = (byte) 0x82;
	static final byte EMV_INS_SELECT		 = (byte) 0xA4;
	static final byte CP_INS_INITIALIZE_UPDATE = (byte) 0x50;
	static final byte CP_INS_PUT_DATA  	     = (byte) 0xDA;
	
	//Class byte define
	static final byte CLA_EMV     = (byte)0x80;
	static final byte CLA_EMV_MAC = (byte)0x84;
	static final byte CLA_ISO     = (byte)0x00;
	static final byte CLA_ISO_MAC = (byte)0x04;
	
	//P1P2 byte define
	static final byte GP_P1_SELECT_BY_NAME 			= 	(byte)0x04;
	static final byte GP_P2_SELECT_FIRST_OCCURRENCE	=	(byte)0x00;
	static final byte GP_P2_SELECT_NEXT_OCCURRENCE	=	(byte)0x02;
	static final byte EMV_P2_IS_RECORD				=	(byte)0x04;
	static final byte ISO_P2_APPEND_RECORD_L3bit	=	(short)0;
	static final byte ISO_P2_SFI_1					=	(byte)0x08;  // 0000 1000b   
	
	//define DGI
	static final short DGI_SELECT_REPONSE = (short)0x9102;
	static final short DGI_01NN	=	(short)0x0001;
	static final short TAG_APPLET_DATE = (short) 0x9F7D;	
	static final short TAG_DEFAULT_LANGUAGE = (short) 0x5F2D;	
	static final short TAG_ICTI = (short)0x9F11;//Issuer Code table index	
	static final short TAG_IDD = (short)0xBF0C; //FCI discretionary data
	static final short TAG_88	=	(byte)0x88;
	
	//define TEMPLATE
	static final byte TEMPLATE_70 = (byte)0x70;
	static final byte TEMPLATE_A5 = (byte)0xA5;
	static final byte TEMPLATE_6F = (byte)0x6F;
	static final byte TEMPLATE_84 = (byte)0x84;
	static final byte TEMPLATE_LONGLEN_6F	=	(byte)0x6F81;
	static final byte TEMPLATE_LONGLEN_70	=	(byte)0x7081;
	
	//define lemit number
	static final short MAX_LEN_TLV				=	(short) 0x007F;
	static final short MAX_LEN_DEFAULT_LANGUAGE	=	(short)0x08;
	static final short MIN_LEN_DEFAULT_LANGUAGE	=	(short)0x02;
	
	//data length
	static final short LEN_APDU_HEAD	=	(short)5;
	static final short LEN_DO_T_1BYTES 	= (short)1;
	static final short LEN_DO_T_2BYTES	=	(short)2;
	static final short LEN_DO_TL_1BYTES_1BYTES = (short)2;
	static final short LEN_DO_TL_1BYTES_2BYTES = (short)3;
	static final short LEN_DO_TL_2BYTES_1BYTES = (short)3;
	static final short LEN_REPONSE_INITIALIZEUPDATA	=	(short)28;
	static final short LEN_DGI	=	(short)2;
	static final short LEN_ICTI	=	(short)1;
	static final short LEN_IDD	=	(short)222;
	
	//offset
	static final short OFF_BUF_START 				= 	(short)0;
	static final short OFF_BUF_START_FROM_BYTE2		=	(short)1;
	static final short OFF_IS_CONTACTLESS			=	(short)0;
	static final short OFF_FLAGS_NOT_DESELECTED 	= 	(short)0;
	//offset of FCI option data 
	static final short OFF_FCI_OPT_TAG_5F2D = (short) 0;
	static final short OFF_FCI_OPT_TAG_9F11 = (short) 11;
	static final short OFF_FCI_OPT_TAG_BF0C = (short) 15;
	// offset of ADF name within record data (apdu buffer)
	static final short OFF_RECORD_ADF_LEN = (short) 10;
	static final short OFF_RECORD_ADF 	  = (short) 11;
	//offset of FCI mandatory data in APDU buffer
	static final short OFF_FCI_TAG_6F = (short) 1;
	static final short OFF_FCI_TAG_A5 = (short) 19;
	static final short OFF_STORE_DATA_ADF_LEN = (short) 13;
	static final short OFF_STORE_DATA_ADF = (short) 14; // head[5] DGI[2] LEN[1] 70 LC 61 LC 4F LC = 14
	static final short OFF_RECORD_DATA_ADF	=	(short)6;// 70 LC 61 LC 4F LC = 6
	static final short OFF_STOREDATA_DATA = (short) 8;
	static final short OFF_STOREDATA_A5_DATA = (short) 10;
	static final short OFF_SHIFT_4BIT	=	(short)8;
	static final short OFF_1	=	(short)0x01;
	static final short OFF_2	=	(short)0x02;
	static final short OFF_3	=	(short)0x03;
	static final short OFF_6	=	(short)0x06;
	static final short OFF_5	=	(short)0x05;
	
	//check mask
	static final byte MASK_BIT4	=	(byte)0x04;
	static final byte MASK_LOW_3BIT	=	(byte)0x07;
	
	//limit number
	static final short MAXENTRIES 		= (short) 5;
	static final short MAX_LEN_OPT_DATA = (short) 240;
	static final short MAX_LEN_BUFER_RESPONSE =(short)253; //255- 2(sw) = 253
	static final short MAX_LEN_BUFER_COMMAND	=	(short)250;  // 255- 5(head) = 250
	
	//SW
	static final short SW_REFERENCED_DATA_NOT_FOUND = (short) 0x6A88;
	static final short SW_FILE_APPLICATION_NOT_FOUND= (short) 0x6A80;
	
	static final byte   APPTYPE_PSE = (byte)0x01;
    static final byte   APPTYPE_PPSE  = (byte)0x02;
	static final short OFF_PSE_AID =(byte)0x04;
	static final byte[] APPLET_DATE = {(byte) 0x06, (byte) 0x31, (byte) 0x39, // day
		 (byte) 0x31, (byte) 0x32, // month
		 (byte) 0x30, (byte) 0x30 }; // year
	
	// Response from SELECT command on PSE or PPSE
	static final byte FCI_PSE[] = {
		//Tag of File Control Information(FCI)Template
		(byte) 0x6F,(byte) 21,
		//Dedicated File(DF) name 
		(byte) 0x84,(byte) 14,
		//FCI proprietary Template
		(byte) '1',(byte) 'P',(byte) 'A',(byte) 'Y',(byte) '.',(byte) 'S',(byte) 'Y',(byte) 'S',(byte) '.',(byte) 'D',(byte) 'D',(byte) 'F',(byte)'0',(byte)'1',(byte) 0xA5,(byte)3,(byte)0x88,(byte)1,(byte)1};
	
	static final byte FCI_PPSE[] = {
		//Tag of File Control Information(FCI)Template
		(byte) 0x6F,(byte) 18,
		//Dedicated File(DF) name 
		(byte) 0x84,(byte) 14,
		//FCI proprietary Template
		(byte) '2', (byte) 'P',(byte) 'A',(byte) 'Y',(byte) '.',(byte) 'S',(byte) 'Y',(byte) 'S',(byte) '.',(byte) 'D',(byte) 'D',(byte) 'F',(byte)'0',(byte)'1',(byte) 0xA5,(byte)00};
	
	//variable
	private static boolean registerMyself;
	boolean isPersonalized;
	boolean[] dtr_flagForProtocol;	
	boolean[] dtr_flag_Deselct_PSE;
	boolean isExtAuthSucceedForPSE;
	short maxentries_PSE;
	short numEntries_PSE;
	byte  TypeOfAppletInstance;	
	short LEN_AID;
	byte[] buf_FCI;
	byte[] buf_optionalData_PSE;
	byte[] buf_recordData;
		
	/**
	 * Default constructor for the PSE applet.
	 * 
	 *   This method is called by the JCRE when applet has been selected
	 *   To distinguish PSE and PPSE with applet AID
	 *   PSE  is begin from a DDF named'1PAY.SYS.DDF01'
	 * 	 PPSE is begin from a DDF named'2PAY.SYS.DDF01'
	 * @param 
	 */
	public PSE(byte[] bArray, short bOffset, byte bLength) {
		
		short offset= bOffset;
		LEN_AID=(short)(bArray[offset++]&0xFF);
		//determine if PSE or PPSE
		if(Util.arrayCompare(bArray,(short)(bOffset+1),FCI_PSE,OFF_PSE_AID,LEN_AID)==0){
			TypeOfAppletInstance=APPTYPE_PSE;	   
		}else if(Util.arrayCompare(bArray,(short)(bOffset+1),FCI_PPSE,OFF_PSE_AID,LEN_AID)==0){
			TypeOfAppletInstance=APPTYPE_PPSE;	   
		}else ISOException.throwIt(ISO7816.SW_APPLET_SELECT_FAILED);
		//transient buffer
		dtr_flagForProtocol=JCSystem.makeTransientBooleanArray((short) 1, JCSystem.CLEAR_ON_DESELECT);	
		dtr_flag_Deselct_PSE = JCSystem.makeTransientBooleanArray((short) 1, JCSystem.CLEAR_ON_DESELECT);
		
		maxentries_PSE=MAXENTRIES;  
		buf_optionalData_PSE = new byte[MAX_LEN_OPT_DATA];
		numEntries_PSE = (short) 0;

		// alloc array holding the records
		records_PSE = new Object[MAXENTRIES];
		
		
		if(registerMyself){
			register(bArray, (short) (bOffset + 1), bArray[bOffset]);
		}
		
		
	}
	public static void install(byte[] bArray, short bOffset, byte bLength) {
		registerMyself = true;
		new PSE(bArray, bOffset, bLength);
		registerMyself = false;
	}

	public void process(APDU apdu) {
		byte[] apduBuffer	=	apdu.getBuffer();
	
		switch (apduBuffer[ISO7816.OFFSET_INS]) {
			
			case EMV_INS_SELECT : // SELECT
				EMV_SelectCommand(apdu);
				return;
			case EMV_INS_READ_RECORD :
				short sP1P2 = Util.makeShort(apduBuffer[ISO7816.OFFSET_P1], apduBuffer[ISO7816.OFFSET_P2]);
				PSE.checkP2((byte) sP1P2);
				EMV_ReadRecord(apdu);
				return;
			case (byte) CP_STORE_DATA :
				if (apduBuffer[ISO7816.OFFSET_CLA] == CLA_ISO) {
					ISO_AppendRecord(apdu);
				} else {
					CP_StoreData(apdu);
				}
				return;
			case (byte) CP_INS_PUT_DATA :
				CP_PutData(apdu);
				return;
			case (byte) EMV_INS_GET_DATA :
				if (apduBuffer[ISO7816.OFFSET_CLA] != CLA_EMV) {
					ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
				}
				if (Util.getShort(apduBuffer, ISO7816.OFFSET_P1) ==  TAG_APPLET_DATE) {
					Util.arrayCopyNonAtomic(APPLET_DATE, OFF_BUF_START, apduBuffer, (short) 4, (short) 7);
					apdu.setOutgoingAndSend((short) 2, (short) 9);
					return;
				}
			case CP_INS_INITIALIZE_UPDATE :
				CP_InitializeUpdata(apdu);
				return;
			case CP_EXT_AUTH :
				CP_ExternalAuth(apdu);
				return;
			default :
				ISOException.throwIt(ISO7816.SW_INS_NOT_SUPPORTED);
				return;
			}
	}

	public void uninstall() {
	
	}
	/**
	 * select command for select PSE or PPSE,
	 * receive AID determine the select command is select PSE
	 * <P>
	 * reponse:
	 * <br>&nbsp&nbspFCI:
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp6F FCI template
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp84 DFname
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspA5 FCI Proprietary data 
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp88  the SFI of Directory elementary file  
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp5F2D default language
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp9F11 Issuer Code table index
	 * <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspBF0C FCI discretionary data
	 * @param apdu 
	 * @exception ISO7816.SW_FILE_NOT_FOUND
	 * @exception ISO7816.SW_CLA_NOT_SUPPORTED
	 * @exception ISO7816.SW_INCORRECT_P1P2    
x	 *              
	 */	
	private void EMV_SelectCommand(APDU apdu){
		byte[] apduBuffer = apdu.getBuffer();		
		short currentOffset = 0;
		//if not PSE is error for file not found
		if( TypeOfAppletInstance==APPTYPE_PSE){
			buf_FCI=FCI_PSE;
		}
		else if( TypeOfAppletInstance==APPTYPE_PPSE){
			buf_FCI=FCI_PPSE;
			if(apdu.getProtocol() == APDU.PROTOCOL_T0||apdu.getProtocol() == APDU.PROTOCOL_T1){
				ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			}
		}
		else{
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		
		//check APDU head 
		if (apduBuffer[ISO7816.OFFSET_CLA] != CLA_ISO) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}

		if (apduBuffer[ISO7816.OFFSET_P1] != GP_P1_SELECT_BY_NAME
			|| (apduBuffer[ISO7816.OFFSET_P2] != GP_P2_SELECT_FIRST_OCCURRENCE && apduBuffer[ISO7816.OFFSET_P2] != GP_P2_SELECT_NEXT_OCCURRENCE)) {
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}

		//Check that the select command is actually selecting the PSE
		if (!selectingApplet()) {
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		// Copy the entire FCI		
		//currentOffset = Util.arrayCopyNonAtomic(FCI,currentOffset, apduBuffer,(short)1, (short) FCI.length); modify 2013-05-15 by mllee
				
			
		currentOffset = Util.arrayCopyNonAtomic(buf_FCI,PSE.OFF_BUF_START, apduBuffer, PSE.OFF_BUF_START_FROM_BYTE2, (short) buf_FCI.length);
		// Copy 5F2D
		if (Util.getShort(buf_optionalData_PSE, OFF_FCI_OPT_TAG_5F2D) == TAG_DEFAULT_LANGUAGE) {
			currentOffset =
				Util.arrayCopyNonAtomic(
					buf_optionalData_PSE,
					OFF_FCI_OPT_TAG_5F2D,
					apduBuffer,
					currentOffset,
					(short) (getUByte(buf_optionalData_PSE, (short) (OFF_FCI_OPT_TAG_5F2D + LEN_DO_T_2BYTES)) + LEN_DO_TL_2BYTES_1BYTES));
		}
		// Copy 9F11
		if (Util.getShort(buf_optionalData_PSE, OFF_FCI_OPT_TAG_9F11) == TAG_ICTI) {
			currentOffset =
				Util.arrayCopyNonAtomic(
					buf_optionalData_PSE,
					OFF_FCI_OPT_TAG_9F11,
					apduBuffer,
					currentOffset,
					(short) (getUByte(buf_optionalData_PSE, (short) (OFF_FCI_OPT_TAG_9F11 + LEN_DO_T_2BYTES)) + LEN_DO_TL_2BYTES_1BYTES));
		}
		// Copy BF0C
		if (Util.getShort(buf_optionalData_PSE, OFF_FCI_OPT_TAG_BF0C) == TAG_IDD) {
			currentOffset =
				Util.arrayCopyNonAtomic(
					buf_optionalData_PSE,
					OFF_FCI_OPT_TAG_BF0C,
					apduBuffer,
					currentOffset,
					(short) (getUByte(buf_optionalData_PSE, (short) (OFF_FCI_OPT_TAG_BF0C + LEN_DO_T_2BYTES)) + LEN_DO_TL_2BYTES_1BYTES));
		}

		// Modify the length of tag 6F
		//apduBuffer[(short) (OFF_FCI_TAG_6F + OFF_1)] += (currentOffset - FCI.length - OFF_1); modify 20130515 by mllee
		apduBuffer[(short) (OFF_FCI_TAG_6F + OFF_1)] += (byte) (currentOffset  -buf_FCI.length- PSE.OFF_BUF_START_FROM_BYTE2);
		// Modify the length of tag A5
		apduBuffer[(short) (OFF_FCI_TAG_A5 + OFF_1)] += (currentOffset - buf_FCI.length - PSE.OFF_BUF_START_FROM_BYTE2);

		if (getUByte(apduBuffer, (short) (OFF_FCI_TAG_6F + OFF_1)) > MAX_LEN_TLV) {
			Util.setShort(apduBuffer, OFF_BUF_START, TEMPLATE_LONGLEN_6F);
			apdu.setOutgoingAndSend(OFF_BUF_START, (short) (getUByte(apduBuffer, (short)(OFF_FCI_TAG_6F + OFF_1)) + LEN_DO_TL_1BYTES_2BYTES));
			
		} else {
			apdu.setOutgoingAndSend((short)PSE.OFF_BUF_START_FROM_BYTE2, (short) (getUByte(apduBuffer, (short) (OFF_FCI_TAG_6F + OFF_1)) + LEN_DO_TL_1BYTES_1BYTES));
	
			
		}
		
	}
	/**
	 * Handles the INITIALIZE UPDATE command.
	 * This command is used to establish the secure channel session to be used during personalization.
	 * 
	 * @param apdu the incoming <CODE>APDU</CODE> object
	 * @param apduBuffer contains the command apdu data
	 * @param idl input data length
	 * @throws CardException 
	 * <dt><b>Pre-condition:</b><dd>The <code>PSE</code> applet must be in the personalization phase</dd></dt>  
	 */ 
	private void CP_InitializeUpdata(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();		
		isExtAuthSucceedForPSE = false;		
		if (apduBuffer[ISO7816.OFFSET_CLA] != CLA_EMV) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		apdu.setIncomingAndReceive();
		secureChannel = GPSystem.getSecureChannel();
		secureChannel.processSecurity(apdu);		
		//initialize updata reponse  Key diversification data [10bytes]  + Key information [2bytes] + Card challenge [8bytes] + Card cryptogram [8bytes]
		apdu.setOutgoingAndSend(ISO7816.OFFSET_CDATA, LEN_REPONSE_INITIALIZEUPDATA);
	}
	
	/**
	 * finish PERSONALIZATION step get record file value from PSE
	 * <br>Construct TLV with tag "70"
	 * @param apdu P1 = record number , P2 = SFI || xxxxx100 
	 * @return record Construct TLV
	 * @exception ISO7816.SW_CLA_NOT_SUPPORTED
	 * @exception ISO7816.SW_CONDITIONS_NOT_SATISFIED
	 * @exception ISO7816.SW_RECORD_NOT_FOUND
	 * @exception ISO7816.SW_INCORRECT_P1P2
	 * @exception ISO7816.SW_FILE_NOT_FOUND
	 */
	private void EMV_ReadRecord(APDU apdu) {
		
		//PPSE not support READRECORD command
		if( TypeOfAppletInstance==APPTYPE_PPSE){
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		short cumRecNo = 1, cumRecLen = 0, currentPtr = 3;
		byte[] apduBuffer = apdu.getBuffer();
		//byte aaa = GPSystem.APPLICATION_INSTALLED;
		//byte bbb = GPSystem.APPLET_PERSONALIZED;
		if (apduBuffer[ISO7816.OFFSET_CLA] != (byte) CLA_ISO) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}

		//if the applet is not the state PERSINALIZED or after PERSIONALIZATION is not reselecte, receive READ RECORD command is exception.
		if ((GPSystem.getCardContentState() != GPSystem.SECURITY_DOMAIN_PERSONALIZED || dtr_flag_Deselct_PSE[OFF_FLAGS_NOT_DESELECTED] == true)) {
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}

		// P1 denotes the record number
		short recNum = getUByte(apduBuffer, ISO7816.OFFSET_P1);
		if ((recNum <= (short) 0) || (recNum > numEntries_PSE))
			ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
		// check P2
		if ((apduBuffer[ISO7816.OFFSET_P2] & MASK_BIT4 ) != PSE.EMV_P2_IS_RECORD) // check read by record flag
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		//get value from PSE
		for (short i = 0; i < numEntries_PSE; i++) {
			//check the AID in the record file whether get instance
			// the ADF name starts at offset 6 in the buffer; rec is as follows:
			// [ 70 L [ 61 L [ 4F L [ ADF-Name ]]]]
			if (JCSystem.lookupAID((byte[]) records_PSE[i], OFF_6, (byte) (((byte[]) records_PSE[i])[OFF_5])) == null)
				continue;
			if ((short) (cumRecLen + (short) (((byte[]) records_PSE[i]).length)) > (short) (MAX_LEN_BUFER_RESPONSE -OFF_1)) {
				cumRecNo += (short) 1;
				cumRecLen = (short) (((byte[]) records_PSE[i]).length);
			} else {
				cumRecLen += (short) (((byte[]) records_PSE[i]).length);
			}
			if (recNum == cumRecNo) {
				//record file is construct TLV and the first byte is template of the record file the second byte is length of the construct TLV element.
				currentPtr =
					Util.arrayCopyNonAtomic((byte[]) records_PSE[i], OFF_2, apduBuffer, currentPtr, (short) (((byte[]) records_PSE[i]).length - OFF_2));
			}
		}
		//check NULL record file  the OFF_3 = TEMPLATE  
		if (currentPtr == OFF_3) {
			ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
		}		
        //set the DO length
		apduBuffer[OFF_2] = (byte) (currentPtr - (short)OFF_3);
		//check TLV long length
		if (getUByte(apduBuffer, OFF_2) > PSE.MAX_LEN_TLV) {
			Util.setShort(apduBuffer, PSE.OFF_BUF_START, TEMPLATE_LONGLEN_70);
			apdu.setOutgoingAndSend(PSE.OFF_BUF_START , (short) (getUByte(apduBuffer, OFF_2) + PSE.LEN_DO_TL_1BYTES_2BYTES));
		} else {
			apduBuffer[OFF_1] = PSE.TEMPLATE_70;
			apdu.setOutgoingAndSend(PSE.OFF_BUF_START_FROM_BYTE2, (short) (getUByte(apduBuffer, OFF_2) + PSE.LEN_DO_TL_1BYTES_1BYTES));
		}
	}
	
	/** 
	 * Add a new record to the payment system environment directory (PSE). 
	 * We prefer APPEND over UPDATE because the PSE is configured for
	 * <br>a certain of directory entries at install time; entries once
	 * added cannot be removed (in this implementation);
	 * append record command is define in ISO7816 part 4
	 * 
	 * @param apdu the APPEND_RECORD apdu command
	 * @exception ISO7816.SW_FILE_FULL
	 * @exception ISO7816.SW_INCORRECT_P1P2
	 * @exception ISO7816.SW_WRONG_LENGTH
	 * @exception ISO7816.SW_CONDITIONS_NOT_SATISFIED
	 *
    
	 * The current applet context is in the Life Cycle State of INSTALLED (0x03).
	 * <p>Note:<ul>
	 * <li><em>The Life Cycle State INSTALLED could be indicated along with another application
	 * specific Life Cycle State, e.g. a value of (0x07) indicates that the applet has been made
	 * selectable.</em>
	 * </ul>
	 */
	private void ISO_AppendRecord(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		
		apdu.setIncomingAndReceive();
		//check P2
		if ((apduBuffer[ISO7816.OFFSET_P2] & PSE.MASK_LOW_3BIT) != ISO_P2_APPEND_RECORD_L3bit) // check read by record flag
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		if (apduBuffer[ISO7816.OFFSET_P2] != PSE.ISO_P2_SFI_1) // check SFI
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		// do a simple (TLV sanity) validation / check if application is installed
		if (apduBuffer[ISO7816.OFFSET_CDATA] != PSE.TEMPLATE_70
			|| JCSystem.lookupAID(apduBuffer, OFF_RECORD_ADF, apduBuffer[OFF_RECORD_ADF_LEN]) == null)
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		// Check that this entry does not already exist in the directory.
		for (short i = 0; i < numEntries_PSE; i++)
			// the ADF name starts at offset 6 in the buffer; rec is as follows:
			// [ 70 L [ 61 L [ 4F L [ ADF-Name ]]]]
			if (Util.arrayCompare(apduBuffer, OFF_RECORD_ADF, (byte[]) (records_PSE[i]), PSE.OFF_RECORD_DATA_ADF, apduBuffer[OFF_RECORD_ADF_LEN]) == 0)
				ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		if (numEntries_PSE == maxentries_PSE)
			ISOException.throwIt(ISO7816.SW_FILE_FULL);
		// copy data into new record
		JCSystem.beginTransaction();
		buf_recordData = new byte[getUByte(apduBuffer, ISO7816.OFFSET_LC)];
		Util.arrayCopy(apduBuffer, ISO7816.OFFSET_CDATA, buf_recordData, PSE.OFF_BUF_START, (short) (getUByte(apduBuffer, ISO7816.OFFSET_LC)+PSE.LEN_APDU_HEAD));
		records_PSE[numEntries_PSE++] = buf_recordData;
		JCSystem.commitTransaction();
		// this should ideally be inside the transaction, but the Oberthur card doesn't like it

		// If first append record, personalize application
		GPSystem.setCardContentState(GPSystem.SECURITY_DOMAIN_PERSONALIZED);
	}
	/** 
	 * Add a new record to the payment system environment directory (PSE). 
	 * added cannot be removed (in this implementation);
	 * append record command is define in GP
	 * @param apdu the APPEND_RECORD apdu command
	 * @exception ISO7816.SW_FILE_FULL
	 * @exception ISO7816.SW_INCORRECT_P1P2
	 * @exception ISO7816.SW_WRONG_LENGTH
	 * @exception ISO7816.SW_CONDITIONS_NOT_SATISFIED
	 */
	
	private void CP_StoreData(APDU apdu) {
		
		byte[] apduBuffer = apdu.getBuffer();
		
		short DGITag, DGILen, DGILeft, tag, tagOffset , offset = 0;
		
		apdu.setIncomingAndReceive();
		if (apduBuffer[ISO7816.OFFSET_CLA] == PSE.CLA_EMV) {
			if (GPSystem.getCardState() >= GPSystem.CARD_SECURED) {
				ISOException.throwIt(ISO7816.SW_SECURITY_STATUS_NOT_SATISFIED);
			}
		} else if (apduBuffer[ISO7816.OFFSET_CLA] == PSE.CLA_EMV_MAC) {
			secureChannel.unwrap(apduBuffer,PSE.OFF_BUF_START,(byte)(apduBuffer[ISO7816.OFFSET_LC]));
		} else {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		
		DGITag = Util.getShort(apduBuffer, ISO7816.OFFSET_CDATA);
		DGILen = getUByte(apduBuffer, (short) (ISO7816.OFFSET_CDATA + LEN_DGI));
		DGILeft = (short) ((short) (DGITag >> PSE.OFF_SHIFT_4BIT) & (short) 0x00FF);
		//after personlization phase and applet was deselected then applet just only receive DGI 01nn
		if (GPSystem.getCardContentState() == GPSystem.SECURITY_DOMAIN_PERSONALIZED
			&& dtr_flag_Deselct_PSE[OFF_FLAGS_NOT_DESELECTED] == false
			&& DGILeft != DGI_01NN) {
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
		//the frist record file is the PSE applet AID 
		if (DGITag == PSE.DGI_SELECT_REPONSE) {

			if(TypeOfAppletInstance!=APPTYPE_PPSE){
				if (apduBuffer[OFF_STOREDATA_DATA] != PSE.TEMPLATE_A5
					|| apduBuffer[OFF_STOREDATA_A5_DATA] != PSE.TAG_88
					|| apduBuffer[(byte) (OFF_STOREDATA_A5_DATA + 1)] != (byte) 0x01
					|| apduBuffer[(byte) (OFF_STOREDATA_A5_DATA + 2)] != (byte) 0x01) {
					ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
				}
				tagOffset = (short) (OFF_STOREDATA_A5_DATA + 3);
		    }else{
		    	tagOffset = OFF_STOREDATA_A5_DATA ;
		    }
			
			while (true) {
				tag = Util.getShort(apduBuffer, tagOffset);
				if (tag != PSE.TAG_DEFAULT_LANGUAGE && tag != PSE.TAG_ICTI && tag != PSE.TAG_IDD) {
					break;
				}

				//set offset of optional data
				switch (tag) {
					case (short) PSE.TAG_DEFAULT_LANGUAGE:
						offset = OFF_FCI_OPT_TAG_5F2D;
						break;
					case (short) PSE.TAG_ICTI :
						offset = OFF_FCI_OPT_TAG_9F11;
						break;
					case (short) PSE.TAG_IDD:
						offset = OFF_FCI_OPT_TAG_BF0C;
						break;
					default :
						ISOException.throwIt(ISO7816.SW_UNKNOWN);
				}
				// copy the tag + Lc + data
				Util.arrayCopy(apduBuffer, tagOffset, buf_optionalData_PSE, offset, (short) (getUByte(apduBuffer, (short) (tagOffset + PSE.LEN_DO_T_2BYTES)) + PSE.LEN_DO_TL_2BYTES_1BYTES));
				// Find next tag
				tagOffset += (short) (getUByte(apduBuffer, (short) (tagOffset + 2)) + 3);
				isPersonalized=true;
			}
		}else if (DGILeft == PSE.DGI_01NN) {
			// Check tag 70 and existence of an applet
			if (apduBuffer[(byte) (ISO7816.OFFSET_CDATA + PSE.LEN_DO_TL_2BYTES_1BYTES)] != PSE.TEMPLATE_70
					//check the first ADF if is not applet instance AID then error  
					|| JCSystem.lookupAID(apduBuffer, OFF_STORE_DATA_ADF, apduBuffer[OFF_STORE_DATA_ADF_LEN]) == null)
					ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
				
			for (short i = 0; i < numEntries_PSE; i++)
				// the first ADF name starts at offset 6 in the buffer that name records_PSE ; rec is as follows:
				// [ 70 L [ 61 L [ 4F L [ ADF-Name ]]]]
				// check whether the ADF name is reduplicated 
				if (Util.arrayCompare(apduBuffer, OFF_STORE_DATA_ADF, (byte[]) (records_PSE[i]), (short) OFF_RECORD_DATA_ADF, apduBuffer[OFF_STORE_DATA_ADF_LEN]) == 0)
					ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			if (numEntries_PSE == maxentries_PSE) {
				ISOException.throwIt(ISO7816.SW_FILE_FULL); 
			}
			// copy data into new record
			JCSystem.beginTransaction();
			buf_recordData = new byte[DGILen];	
			//store record with the formate[ 70 L [ 61 L [ 4F L [ ADF-Name ]]]] 
			Util.arrayCopy(apduBuffer, (byte) (ISO7816.OFFSET_CDATA + PSE.LEN_DO_TL_2BYTES_1BYTES), buf_recordData, PSE.OFF_BUF_START, DGILen);
			records_PSE[numEntries_PSE++] =(byte[]) buf_recordData;
			JCSystem.commitTransaction();			

		}else {
			ISOException.throwIt(SW_REFERENCED_DATA_NOT_FOUND);
		}
		GPSystem.setCardContentState(GPSystem.SECURITY_DOMAIN_PERSONALIZED);
		dtr_flag_Deselct_PSE[OFF_FLAGS_NOT_DESELECTED] = true;
	}
	
	/**
	 * Adds optional data elements to the FCI.
	 * allows for the following data to be added:
	 *<dr>&nbsp&nbsptag=5F2D (Language Preference)
	 *<dr>&nbsp&nbsptag=9F11 (Issuer Code table index)
	 *<dr>&nbsp&nbsptag=BF0C (FCI discretionary data)
	 *<p> &nbsp&nbspAll these will fall under the proprietary data tag (A5)
	 * 
	 * @param apdu the put-data apdu
	 * @exception
	 */
	private void CP_PutData(APDU apdu) {
		short tag, lc, offset = 0;
		byte[] apduBuffer = apdu.getBuffer();
		//byte[] FCI;

		if (apduBuffer[ISO7816.OFFSET_CLA] != PSE.CLA_EMV) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}

		apdu.setIncomingAndReceive();
		tag = Util.getShort(apduBuffer, ISO7816.OFFSET_P1);

		// check tag
		if (tag != TAG_DEFAULT_LANGUAGE && tag != PSE.TAG_ICTI && tag != TAG_IDD)
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);

		// check LC
		lc = getUByte(apduBuffer, ISO7816.OFFSET_LC);
		if ((tag == TAG_DEFAULT_LANGUAGE && (lc < MIN_LEN_DEFAULT_LANGUAGE || lc > MAX_LEN_DEFAULT_LANGUAGE))
			|| (tag == PSE.TAG_ICTI && lc != LEN_ICTI)
			|| (tag == TAG_IDD && lc > LEN_IDD)) {
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}
		if (GPSystem.getCardContentState() == GPSystem.SECURITY_DOMAIN_PERSONALIZED&& dtr_flag_Deselct_PSE[OFF_FLAGS_NOT_DESELECTED] == false) {
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}

		//set offset of optional data
		switch (tag) {
			case TAG_DEFAULT_LANGUAGE :
				offset = OFF_FCI_OPT_TAG_5F2D;
				break;
			case PSE.TAG_ICTI :
				offset = OFF_FCI_OPT_TAG_9F11;
				break;
			case TAG_IDD :
				offset = OFF_FCI_OPT_TAG_BF0C;
				break;
			default :
				ISOException.throwIt(ISO7816.SW_UNKNOWN);
		}

		// copy the tag + Lc + data
		Util.arrayCopy(apduBuffer, ISO7816.OFFSET_P1, buf_optionalData_PSE, offset, (short) (lc + PSE.LEN_DO_TL_2BYTES_1BYTES));

		GPSystem.setCardContentState(GPSystem.SECURITY_DOMAIN_PERSONALIZED);
		dtr_flag_Deselct_PSE[OFF_FLAGS_NOT_DESELECTED] = true;
	}
	/**
	 * Handles the EXTERNAL AUTHENTICATE command in personalization phase.
	 * This command follows the INITIALIZE UPDATE command and is used to authenticate the host to the <code>PSE</code> 
	 * applet, and also to select the security level for the subsequent STORE DATA commands.
	 * 
	 * @param apdu the incoming <CODE>APDU</CODE> object
	 * @param apduBuffer contains the command apdu data
	 * @param idl input data length
	 * @throws CardException 
	 * <dt><b>Pre-condition:</b><dd>The <code>PSE</code> applet must be in the personalization phase</dd></dt>  
	 */
	private void CP_ExternalAuth(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();

		if (apduBuffer[ISO7816.OFFSET_CLA] != PSE.CLA_EMV_MAC) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}		
		apdu.setIncomingAndReceive();

		secureChannel.processSecurity(apdu);

		isExtAuthSucceedForPSE = true;
		
	}
	
	private static short getUByte(byte[] bArray, short bOffset) {
		return (short) (bArray[bOffset] & (short) 0x00FF);
	}

	/**
	 * Check P2
	 * If p2 does not indicate record number referencing, throw exception
	 * 
	 * @param bByte
	 */
	private static void checkP2(byte bByte) {
		if ((bByte & PSE.MASK_LOW_3BIT) != PSE.EMV_P2_IS_RECORD) {
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
	}
}
