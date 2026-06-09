/*
 * Copyright (c) 2013 KEBTechnology Co., Ltd. All rights reserved.
 * KEBT PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

package com.konai.pboc;




import org.globalplatform.GPSystem;
import org.globalplatform.SecureChannel;





import javacard.framework.AID;
import javacard.framework.APDU;
import javacard.framework.AppletEvent;
import javacard.framework.CardException;
import javacard.framework.CardRuntimeException;
import javacard.framework.ISO7816;
import javacard.framework.Applet;
import javacard.framework.ISOException;
import javacard.framework.JCSystem;
import javacard.framework.Util;
import javacard.security.DESKey;
import javacard.security.KeyBuilder;
import javacard.security.MessageDigest;
import javacard.security.RSAPrivateCrtKey;
import javacard.security.RSAPrivateKey;
import javacard.security.RandomData;
import javacard.security.Signature;
import javacardx.crypto.Cipher;

/**
 * @author cyf
 *
 */
public class PBOC extends Applet implements AppletEvent {
   	byte   TypeOfAppletInstance;
   	static PSE pse;
   	static PSE ppse;
    static final byte   APPTYPE_PSE = (byte)0x01;
    static final byte   APPTYPE_PPSE  = (byte)0x02;
    static final byte   APPTYPE_PBOC =(byte)0x08;

    
	
	/*Install paramter */
    byte[] paramaterForPBOC;
	
    byte[] recordACforFDDA;
    
	static final byte OFFSET_PARA_BYTE1 = (byte) 0x00;
	static final byte OFFSET_PARA_BYTE2 = (byte) 0x01;
	static final byte OFFSET_PARA_BYTE3 = (byte) 0x02;

	static final byte PARA_BYTE1_MASK_SUPPORT_NO_PAD_80 = (byte) 0x80;

	static final short[]  ACTags = {(short)0x9F02, (short)0x9F03, (short)0x9F1A, (short)0x0095, (short)0x5F2A, 
		(short)0x009A, (short)0x009C, (short)0x9F37};
	static final short[] ACLens = {(short)0x0006, (short)0x0006, (short)0x0002, (short)0x0005, (short)0x0002, 
		(short)0x0003, (short)0x0001, (short)0x0004};
	short[]  ACOffsetsOfCDOL1 ={(short)0, (short)6, (short)12, (short)14, (short)19, 
		(short)21, (short)24, (short)25};
	short[]  ACOffsetsOfCDOL2 ={(short)0, (short)6, (short)12, (short)14, (short)19, 
		(short)21, (short)24, (short)25};
	
	/*GP Related Variables */
	static SecureChannel gpSecureChannel;
	
	/*Constants of GP Related Variables*/
	
	/* Instance   */
	static byte bCounterOfInstance;
    private boolean isFirstInstance;
    private byte bLifePhase;
    
    
    /* DTR Array*/
	static byte[] dtr_SrcTempBuffer;
	static byte[] dtr_Flags;
	static byte[] dtr_Satus;
	static byte[] dtr_TempKeyBuffer;
	static byte[] dta_CardChallenge;
	
	static private DESKey vk8;
	static private DESKey vk16;
	
	
	static short[] dtr_BER_TLV_DOL1;  //Temporary BER TLV DOL
	static short[] dtr_BER_TLV_DOL2;  //Temporary BER TLV DOL

	
	static byte[] dtr_BCDBuffer1;
	static byte[] dtr_BCDBuffer2;
	static byte[] dtr_BCDBuffer3;
	
	
	static short[] dtr_Len;
	
	static byte[] TCC;
	static byte[] ECAC;
	static byte[] MN;
	
	static byte isCardLocked;
	
	static  byte[] storedMAC;
	static byte[] IAD_Buffer;
	static byte[] IN_Terminal;//9F37
	static byte[] CTQ;
	static byte[] TTQ;
	
	static private byte[] tmpMACBuffer;
	static byte[] tmpCryptoBuffer;
	
	
	//
    byte[] dtr_ECLog;
    
    
    
    
	/*Static Object*/
	static private Signature sig;
	static private Cipher desCipher;
	static private RandomData randomData;
	
	/* Constants of DTR Array Variables's OFFSET Length*/
	static final short LEN_DTR_SRC_TEMP_BUFFER 	= (short)0x200;
	static final short LEN_DTR_FLAGS 			= (short)0x20;
	static final short LEN_DTR_LEN				= (short)0x0A;
	static final short LEN_DTR_STATUS 			= (short)0x0A;
	static final short LEN_DTR_TEMP_KEY_BUFFER	= (short)0x3C;
	static final short LEN_DTR_CARD_CHANLEGE	= (short)0x08;
	
	static final short LEN_DGI_TL				= (short)0x0003;
	static final short OFF_LEN_OF_DGI 			= (short)0x0007;	
	
	static final short OFF_OLD_EC_BALANCE = (short)0x02;		
	static final short OFF_NEW_EC_BALANCE = (short)0x008;
	static final short OFF_FIRST_VARIABLE_OF_ERC_LOG 			= (short)0x000e;	
	private static final byte OFF_BER_TLV_DOL_TAG = (byte) 0x00; //Offset in BER TLV DOL
	private static final byte OFF_BER_TLV_DOL_LEN = (byte) 0x01; //Offset in BER TLV DOL
	
	/* <Constants of DRT Array Variables's OFFSET/> */
	/* dtr_Fdtr_SrcTempBuffer*/
	static final short OFF_SART_OF_SRC_TEMP_BUFFER = (short)0;
	
	/* dtr_Flags*/
	static final short OFF_IS_LONG_DGI = (short)0;
	static final short OFF_IS_EC_TRASACTION = (short)(OFF_IS_LONG_DGI+1);
	static final short OFF_IS_SENCOND_CURRENCY = (short)(OFF_IS_EC_TRASACTION+1);
	static final short OFF_IS_CONTACTLESS  = (short)(OFF_IS_SENCOND_CURRENCY+1);
	static final short OFF_IS_ALLOWED_SCRIPT_PROCRSSING = (short)(OFF_IS_CONTACTLESS+1);
	static final short OFF_IS_VERIFY_RECEIVED = (short)(OFF_IS_ALLOWED_SCRIPT_PROCRSSING+1);
	static final short OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED = (short)(OFF_IS_VERIFY_RECEIVED+1);	
	static final short OFF_IS_SENCOND_CURRENCY_RETURN  = (short)(OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED+1);
	static final short OFF_IS_EXPECT_GET_RESPONSE = (short)(OFF_IS_SENCOND_CURRENCY_RETURN+1);
	static final short OFF_IS_ISSUER_SCRIPT_MAC_ERROR = (short)(OFF_IS_EXPECT_GET_RESPONSE+1);
	static final short OFF_IS_COUNTER_SCRIPT = (short)(OFF_IS_ISSUER_SCRIPT_MAC_ERROR+1);
	static final short OFF_IS_DOMESTIC = (short)(OFF_IS_COUNTER_SCRIPT+1);
	static final short OFF_IS_NOT_RESET= (short)(OFF_IS_DOMESTIC+1);
	static final short OFF_IS_FDDA01 = (short)(OFF_IS_NOT_RESET+1);
	static final short OFF_HAS_GOT_TERMINAL_RND  = (short)(OFF_IS_FDDA01+1);
	
	
	
	static  private boolean[] dtr_FlagsCAPP;
	static final short OFFSET_UPDATE_CAPP	                = (short)(0);
	static final short OFFSET_UPDATE_CAPP_WRONG	            = (short)(OFFSET_UPDATE_CAPP+1);
	static final short OFFSET_UPDATE_CAPP_SUCCESSFUL		= (short)(OFFSET_UPDATE_CAPP_WRONG+1);
	static final short OFFSET_IS_EXTENDED_TRANSACION     	= (short)(OFFSET_UPDATE_CAPP_SUCCESSFUL+1);
	static final short OFFSET_READ_UPDATE_CAPP_SAME     	= (short)(OFFSET_IS_EXTENDED_TRANSACION+1);
	static final short OFFSET_TOUZHI     					= (short)(OFFSET_READ_UPDATE_CAPP_SAME+1);
	static final short OFFSET_READ_EXTENDED_LOG     		= (short)(OFFSET_TOUZHI+1);
	
	/* dtr_Satus*/
	static final short OFF_SECURITY_LEVEL = (short)0x00;
	static final short OFF_CP_SEQUENCE = (short)(OFF_SECURITY_LEVEL+1);
	static final short OFF_CP_TYPE_PEROSO_DGI  = (short)(OFF_CP_SEQUENCE+1);
	static final short OFF_TRANSACTION_SEQUENCE = (short)(OFF_CP_TYPE_PEROSO_DGI+1);
	static final short OFF_CID 		 = (short)(OFF_TRANSACTION_SEQUENCE+1);
    static final short OFF_TRANS_CAPP_INDICATOR = (short)(OFF_CID+1);

	
	/* dtr_Len*/
	static final short  OFF_CURRENT_OF_DGI_SIZE =(short)0x00;
 
	
	/* < /Constants of DRT Array Variables's OFFSET >*/
	
	/* Offset of Flags*/
	
	
	
	/* Applet's Variables */
	byte numOfDESKeys; //Number of DES Keys
	byte numOfKCVs; //Number of DES Key Check Values
	boolean havePINBlock;
	boolean havePINData;
	
	byte[] rmENC; //8 right most digit of ENC-UDK 
	
	DESKey[] keys;
	byte[] pinBlock; //plain pin data

	
	private RSAPrivateKey iccPrivateKey;
	private RSAPrivateCrtKey iccPrivateCrtKey;
	
	private short nIC; //Length of ICC Public Key Modulus
	
	
	PBOCOwnerPIN Pin;
	
	static private Cipher rsaCipher;
	
	static private MessageDigest shaDigest;
	
	
	/* internal data*/
	//Record File sfi 1~10
	Object[] recordFile;
	
	short dataS_ATC; //Application Transaction Counter
	short dataS_lastOnlineATC;//Last Online ATC Register
	
	
	byte[] dataA_ACC; //Application Curency Code
	byte[] dataA_SACC; //Secondary Application Currency Code
	byte[] dataA_ICC; //Issuer Country Code
	byte[] dataA_ECSACC;//EC Secondary Application Currency Code
	
	
	//byte[] ADA; //Application Default Action
	byte dataB_ADA1;
	byte dataB_ADA2;
	

	short dataS_LCOL; // Lower Consecutive Offline Limit
	short dataS_UCOL; // Upper Consecutive Offline Limit
	short dataS_CTLI; // Consecutive Transaction Limit (International)
	short dataS_CTCI; // Consecutive Transaction Counter (International)
	short dataS_CTLIC; // Consecutive Transaction Limit (International-Country)
	short dataS_CTCIC; // Consecutive Transaction Counter (International-Country)
	byte[] dataA_CTTA; // Cumulative Total Transaction Amount
	byte[] dataA_CTTAL; // Cumulative Total Transaction Amount Limit
	byte[] dataA_CTTALDC; // Cumulative Total Transaction Amount Limit - Dual Currency
	byte[] dataA_CTTADC; // Cumulative Total Transaction Amount - Dual Currency
	byte[] dataA_CTTAUL; // Cumulative Total Transaction Amount Upper Limit
	byte[] dataA_CCF; // Currency Conversion Factor
	byte data_GI;
	byte[] dataA_Trac2Data;
	byte[] dataA_Trac1Data;
	byte[] dataA_CardHolderName;
	byte PANNumber;
	
	byte[] data_Flags;
	
	static final short OFF_IS_APP_BLOCKED = (short)0;
	static final short OFF_IS_SECONDARY_EC_SUPPORTED = (short)(OFF_IS_APP_BLOCKED+1);
	static final short OFF_IS_PAN_NUMBER_SHOWED = (short)(OFF_IS_SECONDARY_EC_SUPPORTED+1);
	static final short OFF_IS_CTQ_PRESONALIZED  = (short)(OFF_IS_PAN_NUMBER_SHOWED+1);
	static final short OFF_IS_AUTH_MANDAROTY	= (short)(OFF_IS_CTQ_PRESONALIZED+1);
	static final short OFF_IS_CL_IAD			= (short)(OFF_IS_AUTH_MANDAROTY+1);
	static final short OFF_IS_AOSL_SHOWED  		= (short)(OFF_IS_AUTH_MANDAROTY+1);
	static final short OFF_IS_CRT_RSA_ISSUED = (short)(OFF_IS_AOSL_SHOWED+1);
	
	static final short OFF_IS_ISSUER_AUTHENTICATION_FAILED = (short)(OFF_IS_CRT_RSA_ISSUED+1);	
	static final short OFF_IS_ONLINE_REQUESTED 	= (short)(OFF_IS_ISSUER_AUTHENTICATION_FAILED+1);
	static final short OFF_IS_SDA_FAILED 		= (short)(OFF_IS_ONLINE_REQUESTED+1);
	static final short OFF_IS_DDA_FAILED 		= (short)(OFF_IS_SDA_FAILED+1);
	static final short OFF_IS_DDOL_PERSONALIZE = (short)(OFF_IS_DDA_FAILED+1);
	static final short OFF_LAST_TRSNS_IS_DDA01 = (short)(OFF_IS_DDOL_PERSONALIZE+1);
	 
	static final short OFF_IS_EXTENDED_SUPPORDTED = (short)(OFF_LAST_TRSNS_IS_DDA01+1);
	static final short OFF_IS_TOUZHI_SPUPPORTED = (short)(OFF_IS_EXTENDED_SUPPORDTED+1);
	static final short OFF_IS_R_MAC = (short)(OFF_IS_TOUZHI_SPUPPORTED+1);

	
	boolean sequecorForNoAuth;//for ex
	
	//DOL
	byte[] ContactlessPDOL;
	byte[] PDOL;
	short[] DOLRelatedDataLength;
    byte[] LDOL; //Log Data Object List
    byte[] LDOL_EC; //Log Data Object List
	private byte[] CDOL1;
	private byte[] CDOL2;
	private byte[] DDOL;
	
	//AIP
	short AIP; //Application Interchange Profile
	short AIP_EC; //Application Interchange Profile	
	short AIP_QPBOC; //Application Interchange Profile
	
	
	byte ICTI;
	
	
	
	byte API; //Application Priority Indicator
	byte[] LangPref;
	byte[] IAD;
	byte[] IAD_CL;	
	byte[] hashBuffer; //Used in CDA
	short hashBufferPtr;
	
	//	Stores data will be stored to CVR bytes 4, bits 4~8
	// which means Number of Issuer Script commands received and issuer script processing failed
	// bits 4 : issuer script process fail
	// bits 5~8 : number of issuer script commands received
	byte Issuer_Script_Indicator_byte;
	
	private static final byte OFFSET_DOL_REL_DATA_LEN_PDOL = (byte)0x00;
	private static final byte OFFSET_DOL_REL_DATA_LEN_CDOL1 = (byte)0x01;
	private static final byte OFFSET_DOL_REL_DATA_LEN_CDOL2 = (byte)0x02;
	private static final byte OFFSET_DOL_REL_DATA_LEN_DDOL = (byte)0x03;
	private static final byte OFFSET_DOL_REL_DATA_LEN_PDOLCL = (byte)0x04;
	
	
	
	
	
	/* Debit/Credit*/
	
	byte[] AppLabel;
	byte[] AppPrefName;// Application Preferred Name
	byte[] FCI_IDD; // FCI Issuer Discretionary Data
	byte[] FCI_IDD_CL;// FCI Issuer Discretionary Data
	
	byte[] transLogEntry; //Transactional Log Entry
	static final short LOG_SFI = (short) 0x0000;
	static final short LOG_REC_MAX = (short) 0x0001;
	static final short READ_EC_LOG_MAX = (short)10;
	
	static final short LEN_DTR_EC_BATCH_LOG		= (short)0x16;
	static final short LEN_DTR_MAC_4BYTE		= (short)0x04;
	static final short LEN_DTR_EC_BATCH_HEAD	= (short)0x03;
	
	private short lfRecordSize; //Log File Record Size
	private byte[] logFile; //Log Files
	private byte lfRecordsUsed; //Used Log File Records
	private byte lfCurrentRecord; // Current Log File Record
	
	byte[] aflListEC; //List of Application File Locators
	private short AFLListLenEC; //Length of AFL List
	
	
	//qPBOC AFL info
	byte[] aflListCL; //List of Application File Locators
	private short AFLListLenCL; //Length of AFL List
	

	byte[] aflList; //List of Application File Locators
	private short AFLListLen; //Length of AFL List
	
	
	/*E-Cash*/ 
	byte[] ECB;//E-Cash Balance
	byte[] ECBL;//E-Cash Balance Limit
	byte[] ECBSTL;//E-Cash Balance Single Transaction Limit
	byte[] ECRT;//E-Cash Reset Threshold
	
	
	byte[] ECSAB;//E-Cash Secondary Application Balance
	byte[] ECSABL;//E-Cash Secondary Application Balance Limit
	byte[] ECSABSTL;//E-Cash Secondary Application Single Transaction Limit
	byte[] ECSART;//E-Cash Secondary Application Reset Threshold
	
	byte[] transLogEntryEC; //Transactional Log Entry

	
	private short lfRecordSizeEC; //Log File Record Size
	private byte[] logFileEC; //Log Files
	private byte lfRecordsUsedEC; //Used Log File Records
	private byte lfCurrentRecordEC; // Current Log File Record
	
	
	//EC
	boolean isECSavedInrecord;
	byte[]   EC_Info_ForRecord;
	static final byte OFFSET_EC_INFO_INDEX 		   = (byte)0x00;
	static final byte OFFSET_EC_INFO_RECORD_NUM	   = (byte)0x01; 
	static final byte OFFSET_EC_INFO_DATA_OFFSET	       = (byte)0x02;
	static final short LENGTH_EC_INFO	           = (byte)0x04;
	
	
	/*qPBOC*/
	
	byte CTQ_Byte1;
	byte CTQ_Byte2;
	byte[] CAP;
	
	static final short CAP_BYTE_1 = (short) 0x0000;
	static final short CAP_BYTE_2 = (short) 0x0001;
	static final short CAP_BYTE_3 = (short) 0x0002;
	static final short CAP_BYTE_4 = (short) 0x0003;
   
	
	byte[] RecoveryData;
	static byte[] RecoveryDataBuffer;
	short[] LengthArrayForPDOL_CL;
	
	boolean isRecoeryNeeded;
	
	//Second
	boolean isSecondQEC;
	byte[] CardCVMLimitECS;
	byte[] CardCVMLimit;
	
    byte[]   record_CardAuthRelatedData;//9F69  Card Authentication Related Data
    static byte[]   dtr_record_CardAuthRelatedData;//9F69  Card Authentication Related Data 
    short    offset_CardAuthRelatedData;
    short    len_CardAuthRelatedData;
    byte     sfiRCRD;
    byte     recnumRCRD;
    static final short OFFSET_CARD_FDDA_VERSION 		= (short)0;
    static final short OFFSET_CARD_UNPREDICTABLE_NUM  	= (short)1;
    static final short OFFSET_CARD_CTQ 	= (short)5;
    static final short OFFSET_CARD_RFU 	= (short)7;
    
    byte[] ProductTag;
    
    byte[] logFile_buffer_q;
	
	/*qPBOC Extended*/
	 //extended related data
    static final byte EXTENDED_TRANSACTION_PART_PURCHASE = (byte)0x01;
    static final byte EXTENDED_TRANSACTION_PRE_AUTHORITY2 = (byte)0x02;
    static final byte EXTENDED_TRANSACTION_PRE_AUTHORITY3 = (byte)0x03;
    
    static byte[] CAPPTransactionIndicator;//DF60
    static final short OFFSET_CAPP_INDICATOR = (short)0;
    byte flagPartPurchase;//DF61
    byte[] LimitOfECPartPurchase;//DF62
    byte[] AmountECPartPurchase;//DF63  
    byte[]  AmountECPartPurchaseBuffer;//DF63 
    static private DESKey extendedKey16;

   
    
    Object[] preAuthority; 
    static Object[] infoUpdateCAPP; 
    
    static final short EXT_PREAUTH_NUM_MAX =(short)3;
    
    static final byte OFFSET_UPDATE_FLAG = (byte)0x00;
    static final byte OFFSET_UPDATA_OFFSET = (byte)0x01;
    static final byte OFFSET_UPDATA_LENGTH = (byte)0x02;
    static final byte OFFSET_FILE_INDEX = (byte)0x03;
    static final byte OFFSET_RECORD_NUM = (byte)0x04;
    
    
	
	static final short OFFSET_PDOL_Cl_TTQ=(short)0;
	static final short OFFSET_PDOL_Cl_ECAC=(short)1;
	static final short OFFSET_PDOL_Cl_IN_TERMINAL=(short)2;
	static final short OFFSET_PDOL_Cl_TCC=(short)3;
	static final short OFFSET_PDOL_Cl_EXTENDED=(short)4;
//  static final short OFFSET_RECOBERY_ATC = (short)0;
	static final short OFFSET_RECOBERY_CTCI=(short) 0;
	static final short OFFSET_RECOBERY_ECB = (short)2;
	static final short OFFSET_RECOBERY_CTTA = (short) (12+OFFSET_RECOBERY_ECB);
	static final short OFFSET_RECOBERY_CTTAUL = (short) (OFFSET_RECOBERY_CTTA+12);
	static final short OFFSET_RECOBERY_CTTAL = (short) (OFFSET_RECOBERY_CTTAUL+12);
    
    static byte[] readCAPP ;
    byte[]	lastExtendedAC;
    static byte[]	lastExtendedACBuffer;
    
    static final short OFFSET_SFI = (short)0;
    static final short OFFSET_ID = (short)1;
    static final short OFFSET_REC_NUM = (short)3;
    
    static final short OFFSET_PREAUTH_AMOUNT = (short)4;
  
    
   
    
	private static final byte PAD_LAST_BLOCK = 0x00;
	private static final byte PAD_ADD_BLOCK = 0x01;
	
	//2013.03.08
	
    static private byte[] extendedKeyBuffer;
    static private byte[] extendedFileList;

    short  numOfExtendedFiles ;
    short  numOfExtendedKeys ;
    short  numOfExtendedKCVs ;
   

	
	/*R-MAC*/
	
	static byte[] rndTerminal;
	

	/**
	 * 
	 * Create PBOC Instance
	 * 
	 * @param bArray
	 * @param bOffset
	 * @param bLength
	 */
	private PBOC(byte[] bArray, short bOffset, byte bLength){

		short len_AID;
		short offset=bOffset;
		//short len_Control_info;
		len_AID=(short)(bArray[offset++]&0xFF);
		//check  Applet Type
		TypeOfAppletInstance=APPTYPE_PBOC;
		if(len_AID==(byte)14){
			if(Util.arrayCompare(bArray,offset,PSE.FCI_PSE,PSE.OFF_PSE_AID,len_AID)==0){
			   TypeOfAppletInstance=APPTYPE_PSE;
			}
			if (Util.arrayCompare(bArray,offset,PSE.FCI_PPSE,PSE.OFF_PSE_AID,len_AID)==0){
				TypeOfAppletInstance=APPTYPE_PPSE;
			}
		}
		offset+=len_AID;
		if(TypeOfAppletInstance==APPTYPE_PBOC){
			//Variable Initialize
			dataS_LCOL = (short) 0xFFFF;
			dataS_UCOL = (short) 0xFFFF;
			dataS_CTLI = (short) 0xFFFF;
			dataS_CTLIC = (short) 0xFFFF;
			//PBOC에서는 GI가 사용되지 않는다.
			//GI = (byte) 0xFF;
			API = (byte) 0x10;
			ICTI = (byte) 0xFF;
			
			
	
			//Create internal DES Keys
			bLength = (byte) 0x00;
			
			keys = new DESKey[6];
			while (bLength < (byte) 0x05) {
				keys[bLength] = (DESKey) KeyBuilder.buildKey(KeyBuilder.TYPE_DES, KeyBuilder.LENGTH_DES3_2KEY, false);
				bLength = (byte) (bLength + 1);
			}
		
			
			
			//Create static objects
			if(dtr_SrcTempBuffer == null){
				dtr_SrcTempBuffer = JCSystem.makeTransientByteArray(LEN_DTR_SRC_TEMP_BUFFER, JCSystem.CLEAR_ON_DESELECT);
				dtr_Flags = JCSystem.makeTransientByteArray(LEN_DTR_FLAGS, JCSystem.CLEAR_ON_DESELECT);
				dtr_Len = JCSystem.makeTransientShortArray(LEN_DTR_LEN, JCSystem.CLEAR_ON_DESELECT);
				dtr_Satus = JCSystem.makeTransientByteArray(LEN_DTR_STATUS, JCSystem.CLEAR_ON_DESELECT);
				dtr_TempKeyBuffer = JCSystem.makeTransientByteArray(LEN_DTR_TEMP_KEY_BUFFER, JCSystem.CLEAR_ON_DESELECT);
				dta_CardChallenge = JCSystem.makeTransientByteArray(LEN_DTR_CARD_CHANLEGE, JCSystem.CLEAR_ON_DESELECT);
				dtr_BER_TLV_DOL1 =JCSystem.makeTransientShortArray((short) 0x02, JCSystem.CLEAR_ON_DESELECT);
				dtr_BER_TLV_DOL2 =JCSystem.makeTransientShortArray((short) 0x02, JCSystem.CLEAR_ON_DESELECT);
				dtr_BCDBuffer1 = JCSystem.makeTransientByteArray((short) 0x000C, JCSystem.CLEAR_ON_DESELECT);
				dtr_BCDBuffer2 = JCSystem.makeTransientByteArray((short) 0x000C, JCSystem.CLEAR_ON_DESELECT);
				dtr_BCDBuffer3 = JCSystem.makeTransientByteArray((short) 0x000C, JCSystem.CLEAR_ON_DESELECT);
				ECAC=JCSystem.makeTransientByteArray((short)0x0C, JCSystem.CLEAR_ON_DESELECT);
				TCC= JCSystem.makeTransientByteArray((short)0x02, JCSystem.CLEAR_ON_DESELECT);
				MN = JCSystem.makeTransientByteArray((short) 0x14, JCSystem.CLEAR_ON_DESELECT);
				storedMAC = JCSystem.makeTransientByteArray((short) 0x0008, JCSystem.CLEAR_ON_DESELECT);
				IAD_Buffer = JCSystem.makeTransientByteArray((short) 0x07, JCSystem.CLEAR_ON_DESELECT);
				IN_Terminal=JCSystem.makeTransientByteArray((short)0x04, JCSystem.CLEAR_ON_DESELECT);
				CTQ=JCSystem.makeTransientByteArray((short)0x02, JCSystem.CLEAR_ON_DESELECT);
				TTQ=JCSystem.makeTransientByteArray((short)0x04, JCSystem.CLEAR_ON_DESELECT);
				randomData = RandomData.getInstance(RandomData.ALG_SECURE_RANDOM);
				sig = Signature.getInstance(Signature.ALG_DES_MAC8_NOPAD, false);
				desCipher = Cipher.getInstance(Cipher.ALG_DES_ECB_NOPAD, false);
				vk8 = (DESKey) KeyBuilder.buildKey(KeyBuilder.TYPE_DES_TRANSIENT_DESELECT, KeyBuilder.LENGTH_DES, false);
				vk16 = (DESKey) KeyBuilder.buildKey(KeyBuilder.TYPE_DES_TRANSIENT_DESELECT, KeyBuilder.LENGTH_DES3_2KEY, false);
				isFirstInstance = true;
				bCounterOfInstance = (byte) 0x00; 
				isCardLocked = Constants.FALSE;
				EMVUtil.initializeEMVUtil();
				
				tmpMACBuffer  = JCSystem.makeTransientByteArray((short) 0x08, JCSystem.CLEAR_ON_DESELECT);
				tmpCryptoBuffer = JCSystem.makeTransientByteArray((short)0x32, JCSystem.CLEAR_ON_DESELECT);
				extendedKey16 = (DESKey) KeyBuilder.buildKey(KeyBuilder.TYPE_DES_TRANSIENT_DESELECT, KeyBuilder.LENGTH_DES3_2KEY, false);
				dtr_FlagsCAPP=JCSystem.makeTransientBooleanArray((short)12, JCSystem.CLEAR_ON_DESELECT);
				//PBOCFile.createExtendedFile();
				extendedKeyBuffer =JCSystem.makeTransientByteArray((short) 200, JCSystem.CLEAR_ON_RESET);
				extendedFileList=JCSystem.makeTransientByteArray((short) 20, JCSystem.CLEAR_ON_DESELECT);
				CAPPTransactionIndicator= JCSystem.makeTransientByteArray((short)0x01, JCSystem.CLEAR_ON_DESELECT);
			} else {
				isFirstInstance = false;
			}
			// change card life phase to personalization
			bLifePhase = Constants.PERSONALISATION_PHASE;
			
			data_Flags = new byte[LEN_DTR_FLAGS];
		
			pinBlock = new byte[8];
   
			//Create dynamic objects
			IAD = new byte[32];
			IAD_CL = new byte[32];
			IAD[Constants.CVR_BYTE_1] = (byte) 0x03; //CVR length indicator
			
		
			dataA_SACC = new byte[2];
			dataA_ECSACC = new byte[2];
			dataA_ACC = new byte[2];
			dataA_ICC = new byte[2];
			dataA_CTTA = new byte[12]; 
			dataA_CTTADC = new byte[12];
			//ADA = new byte[2];
			rmENC = new byte[4];
			recordFile=new Object[Constants.NUMBER_RECORD_FILE];
			
			//EC
			ECB= new byte[12];
			ECBL= new byte[12];
			ECBSTL= new byte[12];
			ECRT= new byte[12];
	
			//CardCVMLimit=new byte[12];
			//CardCVMLimitECS=new byte[12];
			DOLRelatedDataLength = new short[5];
			bCounterOfInstance++;	
			
	 		byte Li = bArray[0];
	 		byte Lc = bArray[(short)(Li + 1)];
	 		byte La = bArray[(short)(Li + Lc + 2)];
			short offsetParameter = (short) (Li + Lc + 3);
			
			//the length of ICC RSA Key is longer than 1024, we can set the  sfi and num of record which is saved the  9F4B data
			if (La == (byte) 0x05) {
				if(bArray[offsetParameter]!=0&&bArray[(short)(offsetParameter+1)]!=0){
					recordACforFDDA=new byte[2];
					recordACforFDDA[0]=bArray[offsetParameter];
					recordACforFDDA[1]=bArray[(short)(offsetParameter+1)];
				}
				paramaterForPBOC= new byte[3];
				Util.arrayCopy(bArray, (short) (offsetParameter + 2), paramaterForPBOC, (short) 0x0000,(short) 3);
			
			}
			
		}else{
			if(TypeOfAppletInstance==APPTYPE_PSE){
				pse = new PSE(bArray, bOffset, bLength);
			}
			if(TypeOfAppletInstance==APPTYPE_PPSE){
				ppse = new PSE(bArray, bOffset, bLength);
			}
		}	

		register(bArray, (short) (bOffset + 1), bArray[bOffset]);
		


	}
	
	
	
	
	public static void install(byte[] bArray, short bOffset, byte bLength) {
		// GP-compliant JavaCard applet registration
		new PBOC(bArray, bOffset, bLength);
	}
	
	
	/**
     * @see javacard.framework.AppletEvent#uninstall()
	 * 	@Override 
     * to proceed the Delete command
     */
	
    public void uninstall() {
        
        if (bCounterOfInstance == (byte)0x01){
        	dtr_SrcTempBuffer = null;	
			dtr_Flags = null;
			dtr_Satus = null;	
			dtr_TempKeyBuffer = null;	
			dta_CardChallenge = null;	
			dtr_Len = null;
			dtr_BER_TLV_DOL1 = null;
			dtr_BER_TLV_DOL2 = null;
			dtr_BCDBuffer1 = null;
			dtr_BCDBuffer2 = null;
			dtr_BCDBuffer3 = null;
			ECAC = null;
			TCC= null;
			MN = null;
			storedMAC = null;
			randomData = null;
			IAD_Buffer = null;
			IN_Terminal= null;
			CTQ= null;
			TTQ= null;
			
			sig = null;	
			desCipher = null;	
			vk8 = null;	
			vk16 = null;	
			EMVUtil.destroyEMVUtil();
			dtr_ECLog = null;
			if(pse!=null){
				pse.uninstall();
			}
			if(ppse!=null){
				pse.uninstall();
			}
			pse = null;
			ppse = null;
			
			rsaCipher = null;
			shaDigest =null;
			RecoveryDataBuffer =null;
			
			
			tmpMACBuffer  =null;
			tmpCryptoBuffer =null;
			extendedKey16 = null;
			dtr_FlagsCAPP=null;
			//PBOCFile.createExtendedFile();
			extendedKeyBuffer =null;
			extendedFileList=null;
			
			 RecordFile.currentRecord = null;
            lastExtendedACBuffer =null;
            infoUpdateCAPP = null;
            readCAPP = null;
            rndTerminal = null;
            CAPPTransactionIndicator = null;
            dtr_record_CardAuthRelatedData = null;
        } 
        else {
            if (isFirstInstance == false)
            {
                bCounterOfInstance--;
            }           
        }
        
        return;
    }
	

	public void process(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		byte ins = (byte) apduBuffer[ISO7816.OFFSET_INS];
		if (isCardLocked == Constants.TRUE&&dtr_Flags[OFF_IS_NOT_RESET]!=Constants.TRUE ) {
			ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);
		}
		if(this.TypeOfAppletInstance ==APPTYPE_PSE ){
			pse.process(apdu);
		} else if(this.TypeOfAppletInstance ==APPTYPE_PPSE ){
			ppse.process(apdu);
		}else{
			
			
		
			
			if ((APDU.getProtocol() != APDU.PROTOCOL_T0) && (APDU.getProtocol() != APDU.PROTOCOL_T1)) {
				dtr_Flags[OFF_IS_CONTACTLESS]=Constants.TRUE;
			}else{
				dtr_Flags[OFF_IS_CONTACTLESS]=Constants.FALSE;
			}
			
			if(apduBuffer[ISO7816.OFFSET_INS] != Constants.INS_GET_RESPONSE){			
				dtr_Flags[OFF_IS_EXPECT_GET_RESPONSE] = Constants.FALSE;
				
			}
			
			try{
				
				switch((byte)(apduBuffer[0] & Constants.MASK_CLA_CHANNEL)){
		        	case (byte) Constants.CLA_EMV: 
			        case (byte) Constants.CLA_EMV_MAC: 
			        case (byte) Constants.CLA_ISO:
			        case (byte) Constants.CLA_ISO_MAC:
			        	
			            break;
			        default:
			            ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		        }
			
			
				if(bLifePhase == Constants.PERSONALISATION_PHASE){
				/*	if (selectingApplet()) {
						// Select Command Processing
						EMV_Select(apdu);
						return;
					}*/
				
					switch (ins) {  /* TODO STORE DATA COMMAND */
						case Constants.INS_EMV_SELECT:
						EMV_Select(apdu);
							break;
						case Constants.INS_GET_RESPONSE:
						getResponse(apdu);
							break;
						/* INITIALIZE UPDATE command */ 
						case Constants.CP_INIT_UPDATE:              
							CP_InitializeUpdate(apdu);
							break;
						/* EXTERNAL AUTHENTICATE command */
						case Constants.CP_EXT_AUTH:
							CP_ExternalAuthenticate(apdu);
							break;
						/* Store Data */
						case Constants.CP_STORE_DATA:
							CP_StoreData(apdu);
							break;
						default:        
							CardException.throwIt(ISO7816.SW_INS_NOT_SUPPORTED);
					}
				}else if(bLifePhase == Constants.USE_PHASE){

					switch (ins) {
					/* Error Select Command Processing */
					case Constants.INS_EMV_SELECT:
						EMV_Select(apdu);
						break;
					case Constants.INS_GET_RESPONSE:
						getResponse(apdu);
						break;
					/* Get Processing Option */
					case Constants.INS_EMV_GET_PROCESSING_OPTIONS:
						EMV_GetProcessingOptions(apdu);
						break;
					/* 1st and 2nd Generate AC Command Processing */
					case Constants.INS_EMV_GENERATE_AC:
						JCSystem.beginTransaction();
						EMV_GenerateAC(apdu);
						JCSystem.commitTransaction();
						break;
						// Internal Authentication Command
					case Constants.INS_EMV_INTERNAL_AUTHENTICATE:
						EMV_InternalAuthenticate(apdu);
						break;
					// External Authentication Command
					case Constants.INS_EMV_EXTERNAL_AUTHENTICATE:
						EMV_ExternalAuthenticate(apdu);
						break;	
						
					case Constants.INS_EMV_READ_RECORD :
						EMV_ReadRecord(apdu);
						break;					
					case Constants.INS_EMV_APP_BLOCK : //0x841E
						EMV_AppBlock(apdu);
						break;
					case Constants.INS_EMV_APP_UNBLOCK : //0x8418				
						EMV_AppUnblock(apdu);
						break;
					case Constants.INS_EMV_CARD_BLOCK : //0x8416
						EMV_CardBlock(apdu);
						break;
					case Constants.INS_EMV_PIN_CHANGE : //0x8424
						EMV_PinChange(apdu);
						break;
					case Constants.INS_EMV_PUT_DATA : //0x04DA
						EMV_PutData(apdu);
						break;
					case Constants.INS_EMV_UPDATE_RECORD : //0x04DC
						EMV_UpdateRecord(apdu);
						break;
					case Constants.INS_EMV_GET_DATA : //0x80CA
						EMV_GetData(apdu);
						break;
					case Constants.INS_EMV_GET_CHALLENGE :
						EMV_GetChallenge(apdu);
						break;
					case Constants.INS_EMV_VERIFY :
						EMV_Verify(apdu);
						break;
					/*PBOC*/
						//extended PC command
					case Constants.INS_CP_STORE_DATA : //0x80E2 or 0x84E2
			
						appendRecord(apdu);
					
						
						break;
					case Constants.INS_READ_CAPP_DATA: 
						readCAPPData(apdu);
						break;
					case Constants.INS_UPDATE_CAPP_DATA: 
						updateCAPPData(apdu);
						break;
					case Constants.INS_GET_TRANS_PROVE:
						getTransProve(apdu);
						break;
						
					default:        
						CardException.throwIt(ISO7816.SW_INS_NOT_SUPPORTED);
					}
				}
			
			
			}catch (CardException ce) {
				ISOException.throwIt(ce.getReason());
			}catch (ISOException ce){
				if(ins ==Constants.INS_UPDATE_CAPP_DATA &&data_Flags[OFF_IS_R_MAC]==Constants.TRUE&&dtr_Flags[OFF_HAS_GOT_TERMINAL_RND]==Constants.TRUE){
					Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short)0, tmpCryptoBuffer, (short)4, (short)4);
					addRMACForUpdataCAPP(apdu,ce.getReason());
				}
				ISOException.throwIt(ce.getReason());
				
				
			}catch (RuntimeException ce){
				ISOException.throwIt(ISO7816.SW_UNKNOWN);
			}
		}
	}
	/**
	 * 
	 * @param apdu
     *            the incoming <CODE>APDU</CODE> object
	 * 
	 *            <dt><b>Precondition:</b>
	 *            <dd>
	 *            Personalization phase of the card 
	 */
	protected final static void CP_InitializeUpdate (APDU apdu) {
		
		byte[] buffer = apdu.getBuffer();
		// class must be 80
		if (buffer[ISO7816.OFFSET_CLA] != Constants.CLA_EMV) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}

		try {
			// The GetSecureChannel method expects to receive the APDU as
			// defined in the Global Platform specs.
			gpSecureChannel = GPSystem.getSecureChannel();
			short length = gpSecureChannel.processSecurity(apdu);
			apdu.setOutgoingAndSend((short)ISO7816.OFFSET_CDATA, length);
		} catch (CardRuntimeException cardRuntimeException) {
			// Open Secure Channel failed
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
	}
	
	/**
	 * 
	 * @param apdu
	 *            the incoming <CODE>APDU</CODE> object
	 * 
	 *            <dt><b>Precondition:</b>
	 *            <dd>
	 *            Personalization phase of the card 
	 */
	protected final static void CP_ExternalAuthenticate (APDU apdu) {
		
		byte[] apduBuffer = apdu.getBuffer();
		
		// class must be 80
		if (apduBuffer[ISO7816.OFFSET_CLA] != Constants.CLA_EMV_MAC) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		
		if(gpSecureChannel == null){
			//the Secure Channel is not gotten  
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}else{
			gpSecureChannel.processSecurity(apdu);
		}
   		
	
	}
	

    /**
	 * Personalize the application *
	 * 
	 * @param apdu
	 *            the incoming <CODE>APDU</CODE> object
	 * 
	 *            <dt><b>Precondition:</b>
	 *            <dd>
	 *            Personalization phase of the card
	 * 
	 * @return - none
	 */
	private void CP_StoreData(APDU apdu)throws CardException {
		short offs = (short)ISO7816.OFFSET_CDATA;
		short sLenOfDGI;
		boolean full_DGI_received;
		
		// get the APDU buffer
		byte[] apduBuffer = apdu.getBuffer();
		apdu.setIncomingAndReceive();
		byte bP1 = apduBuffer[ISO7816.OFFSET_P1];
		short sLC = (short)(apduBuffer[ISO7816.OFFSET_LC]&Constants.MASK_FF);
		byte cla = (byte) (apduBuffer[ISO7816.OFFSET_CLA] & (byte) 0xFC);
		//TODO
		//? if this part of verification is needed is to be checked again
		// verify the class according to the security level exchanged during External Authenticate
		/*if (((dtr_Flags[OFF_SECURITY_LEVEL] == Constants.SECURITY_LEVEL_NO_SM) &&
				(apduBuffer[ISO7816.OFFSET_CLA] != Constants.CLA_EMV))||
				((dtr_Flags[OFF_SECURITY_LEVEL] != Constants.SECURITY_LEVEL_NO_SM) &&
						(apduBuffer[ISO7816.OFFSET_CLA] == Constants.CLA_EMV)))
			CardException.throwIt(Constants.SW_CLA_INCORRECT);*/
		if ((cla != Constants.CLA_EMV) && (cla != Constants.CLA_EMV_MAC)
				&& (cla != Constants.CLA_EMV_PROP) && (cla != Constants.CLA_ISO))
			CardException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		
		//if ((apduBuffer[ISO7816.O_LC] == (byte) 0) || (apdu.setIncomingAndReceive() != lc))
		//	CardException.throwIt(ISO7816.SW_WRONG_LENGTH);
		
		// check  state machine, lc, manage velocity counter decipher and and check Cmac
		if(apduBuffer[ISO7816.OFFSET_CLA] == Constants.CLA_EMV_MAC ){
			gpSecureChannel.unwrap(apduBuffer, (short)0,(short)(ISO7816.OFFSET_CDATA+sLC));
		}
		
		//check sequence counter in P2
		if(dtr_Satus[OFF_CP_SEQUENCE] != apduBuffer[ISO7816.OFFSET_P2]){
			CardException.throwIt(Constants.SW_PBOC_INVALID_STATE);
		}
		// prepare the sequence counter for the next command
		++dtr_Satus[OFF_CP_SEQUENCE];
		
		// get the Lc without mac
		sLC = (short)(apduBuffer[ISO7816.OFFSET_LC]&Constants.MASK_00FF);
		sLenOfDGI =  (short)(apduBuffer[OFF_LEN_OF_DGI]&Constants.MASK_00FF);	
		
		
		if(dtr_Flags[OFF_IS_LONG_DGI] == Constants.TRUE ){
		
			short sOffTempbuffer =(short)(OFF_SART_OF_SRC_TEMP_BUFFER+ISO7816.OFFSET_CDATA+dtr_Len[OFF_CURRENT_OF_DGI_SIZE]+LEN_DGI_TL);
			Util.arrayCopyNonAtomic(apduBuffer,ISO7816.OFFSET_CDATA,dtr_SrcTempBuffer,sOffTempbuffer,sLC);
			dtr_Len[OFF_CURRENT_OF_DGI_SIZE] = (short)(sLC+dtr_Len[OFF_CURRENT_OF_DGI_SIZE]);
			if(	dtr_Len[OFF_CURRENT_OF_DGI_SIZE]!=(short)(dtr_SrcTempBuffer[OFF_LEN_OF_DGI]&Constants.MASK_00FF)){	
				return;
			}else{
				apduBuffer=dtr_SrcTempBuffer;
				sLenOfDGI =  (short)(apduBuffer[OFF_LEN_OF_DGI]&Constants.MASK_00FF);
				dtr_Flags[OFF_IS_LONG_DGI] =  Constants.FALSE;
				dtr_Len[OFF_CURRENT_OF_DGI_SIZE]= (short)0x00;
			}
		}else{
			if(sLC<(short)(LEN_DGI_TL+sLenOfDGI)){
				Util.arrayCopyNonAtomic(apduBuffer,(short)0,dtr_SrcTempBuffer,OFF_SART_OF_SRC_TEMP_BUFFER,(short)(ISO7816.OFFSET_CDATA+sLC));
				dtr_Len[OFF_CURRENT_OF_DGI_SIZE] = (short)(sLC-LEN_DGI_TL);
				dtr_Flags[OFF_IS_LONG_DGI]=Constants.TRUE;
				return;
			}
		}
		
		
		treatDGI(apduBuffer, ISO7816.OFFSET_CDATA, sLenOfDGI, bP1, apdu);
		
		// check if it is the end of perso (p1 bit 8=1)
		// PERSO_PHASE -> USER_PHASE  (if P1 bit8 =1)
		if((bP1 & (byte)Constants.BIT_8) != (byte)0x00){ 
			finalizePersonalization(apdu);
		
		}
		
	}
	
	void finalizePersonalization(APDU apdu){
		/* change the application's life phase to Personalized */
		
		
		checkPersoDataCL(apdu);
		
		bLifePhase = Constants.USE_PHASE;
		GPSystem.setCardContentState(Constants.APPLET_PERSONALIZED);
		
		resetFlags();
	}
	
	/**
	 * treat the DGI save the data according to the DGI type
	 * 
	 * @param buffer
	 *            : input buffer which contains the DGI
	 * 
	 * @param sOffs
	 *            : offset in apduBuffer where the DGI starts
	 * 
	 * @param full_DGI_received
	 *            :boolean which indicates if a full DGI has been received or not
	 * 
	 * @param dgi_Length
	 *            : length of DGI included in the current command
	 * 
	 * @param p1
	 *            : P1 value
	 * 
	 * @return - none
	 */

	private final void treatDGI(byte[] apduBuffer, short sOff, short sLenDGI, byte bP1, APDU apdu) throws CardException 
	{
		short sTLVTag,sTLVLength;
		short sDGITag = Util.getShort(apduBuffer, Constants.OFF_PERSO_DGI);
		short sDGLen = EMVUtil.getUByte(apduBuffer, Constants.OFF_PERSO_DGI_LENTH);
		
		//If DGI is ecrypted, then decrypt
		if (sDGITag == (short) 0x8010 || sDGITag == (short) 0x8101 || sDGITag == (short) 0x8103||
				sDGITag == (short) 0x8201 ||sDGITag == (short) 0x8202 ||sDGITag == (short) 0x8203 ||sDGITag == (short) 0x8204 ||sDGITag == (short) 0x8205 ) {
			/*aArrayPersoData[6] = (byte) 0x80;
	
			if (secDomain.decryptVerifyKey(secureChannel, apdu, (short) 0x0006) == false) {
				ISOException.throwIt(ISO7816.SW_DATA_INVALID);
			}*/
			gpSecureChannel.decryptData(apduBuffer, Constants.OFF_PERSO_DGI_DATA, sDGLen);			
			
		}
	
		//Specific DGI pre-process
		switch (sDGITag) {
			case (short) 0x0D01 :
			case (short) 0x0E01 :
				sDGITag = Constants.SPECIAL_INTERNAL_TLV_DGI;
				break;
			/*case (short) 0x0E02 :
				setBlockingRules(apduBuffer, STOREDATA_DATA_OFFSET, sDGLen);
				sDGITag = SPECIAL_INTERNAL_DONOTPROCESS;
				break;*/
		}
	
		//Seperate DGI into 2 parts, left and right
		short sDGILeft = (short) ((short) (sDGITag >> (short) 0x0008) & (short) 0x00FF);
		short sDGIRight = (short) ((short) sDGITag & (short) 0x00FF);
		short sDataOffset = Constants.OFF_PERSO_DGI_DATA;
		short sDataEndOffset = (short)(sDataOffset+sDGLen);
	
		//If DGI Left bytes means SFI, then perso files by SFI
		if (sDGILeft < (short) 0x1F) {
		
			appendRecordCommon(apduBuffer, Constants.OFF_PERSO_DGI_DATA, (byte) (sDGILeft << (short) 0x0003), sDGLen, (byte) sDGIRight);
		
		
		}
		//If DGI Left bytes doesnot mean SFI, then perso internal values
		else {
			switch (sDGITag) {
				case (short)0x8001: // Alternate DES key for MSD
					break;
				case Constants.DGI8000 : // DES Keys
					if (sDGLen != (short)0x10) { // 1 key
						if (sDGLen != (short)0x30) { // 3key
							//if (sDGLen != (short)0x30) { // 4key
								ISOException.throwIt(ISO7816.SW_WRONG_DATA);								
							//}
						}
					}
					numOfDESKeys = (byte) (sDGLen / (short) 0x0010);
					if (numOfKCVs > (byte) 0x00) {
						Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short) 0x0000, apduBuffer, (short) 0x0038, (short) 0x0009);
						dealWithDESKeys(apduBuffer, Constants.OFF_PERSO_DGI_DATA, apdu);
					} else {
						Util.arrayCopyNonAtomic(apduBuffer, Constants.OFF_PERSO_DGI_DATA, dtr_TempKeyBuffer, (short) 0x0000, sDGLen);
					}
					break;
				case Constants.DGI9000 : //DES Key Check Values 
					if (sDGLen != 0 && sDGLen != (short) 0x0003 && sDGLen != (short) 0x0009) {
						ISOException.throwIt(ISO7816.SW_WRONG_DATA);
					}
					numOfKCVs = (byte) (sDGLen / (short) 0x0003);
					if (numOfDESKeys > (byte) 0x00) {
						Util.arrayCopyNonAtomic(apduBuffer, Constants.OFF_PERSO_DGI_DATA, apduBuffer, (short) 0x0038, sDGLen);
						Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short) 0x0000, apduBuffer, Constants.OFF_PERSO_DGI_DATA, (short) 0x0030);
						dealWithDESKeys(apduBuffer, Constants.OFF_PERSO_DGI_DATA, apdu);
					} else {
						Util.arrayCopyNonAtomic(apduBuffer, Constants.OFF_PERSO_DGI_DATA, dtr_TempKeyBuffer, (short) 0x0000, sDGLen);
					}
					break;
				case Constants.DGI8010 : //Offline PIN Block
					if (havePINData) {
						Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short) 0x0030, apduBuffer, (short) 0x0010, (short) 0x0002);
						dealWithPIN(apduBuffer, Constants.OFF_PERSO_DGI_DATA);
						break;
					} else {
						Util.arrayCopyNonAtomic(apduBuffer, Constants.OFF_PERSO_DGI_DATA, dtr_TempKeyBuffer, (short) 0x0030, (short) 0x0008);
						havePINBlock = true;
						break;
					}
				case Constants.DGI9010 : //PIN Related Data
					if (havePINBlock) {
						Util.arrayCopyNonAtomic(apduBuffer, Constants.OFF_PERSO_DGI_DATA, apduBuffer, (short) 0x0010, (short) 0x0002);
						Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short) 0x0030, apduBuffer, Constants.OFF_PERSO_DGI_DATA, (short) 0x0008);
						dealWithPIN(apduBuffer, Constants.OFF_PERSO_DGI_DATA);
						break;
					} else {
						Util.arrayCopyNonAtomic(apduBuffer, Constants.OFF_PERSO_DGI_DATA, dtr_TempKeyBuffer, (short) 0x0030, (short) 0x0002);
						havePINData = true;
					}
					break;
				case Constants.DGI8101 : //ICC Private Exponent(DDA/PIN Encipherment)
				case Constants.DGI8103 : //ICC Private Modulus (DDA/PIN Encipherment)
					if(paramaterForPBOC!=null&&((byte)(paramaterForPBOC[OFFSET_PARA_BYTE1]&PARA_BYTE1_MASK_SUPPORT_NO_PAD_80)==PARA_BYTE1_MASK_SUPPORT_NO_PAD_80)){
						apduBuffer[(short) 0x0007]=(byte)(sDGLen&0xFF);
					}else{
						apduBuffer[(short) 0x0007] = EMVUtil.calcKeyLength(apduBuffer, Constants.OFF_PERSO_DGI_DATA,sDGLen);
					}					//apduBuffer[(short) 0x0007]=(byte)(sDGLen&0xFF);
					putKeyRSA(apduBuffer, (byte) sDGIRight, (short) 0x0007);
					break;
					
				case Constants.DGI8201 : //ICC Private Exponent(DDA/PIN Encipherment)
				case Constants.DGI8202 : //ICC Private Modulus (DDA/PIN Encipherment)
				case Constants.DGI8203 : //ICC Private Exponent(DDA/PIN Encipherment)
				case Constants.DGI8204 : //ICC Private Modulus (DDA/PIN Encipherment)
				case Constants.DGI8205 : //ICC Private Exponent(DDA/PIN Encipherment)
					if(paramaterForPBOC!=null&&((byte)(paramaterForPBOC[OFFSET_PARA_BYTE1]&PARA_BYTE1_MASK_SUPPORT_NO_PAD_80)==PARA_BYTE1_MASK_SUPPORT_NO_PAD_80)){
						apduBuffer[(short) 0x0007]=(byte)(sDGLen&0xFF);
					}else{
						apduBuffer[(short) 0x0007] =  EMVUtil.calcKeyLength(apduBuffer, Constants.OFF_PERSO_DGI_DATA,sDGLen);
					}
					//apduBuffer[(short) 0x0007]=(byte)(sDGLen&0xFF);
					putKeyCrtRSA(apduBuffer, (byte) sDGIRight, (short) 0x0007);
					break;
					
				case (short) 0xA001:
					createExtenedFilePOSB(apduBuffer,Constants.OFF_PERSO_DGI_DATA,sDGLen);
				
				 	break;
				case (short) 0x8020 : // DES Keys
					if (sDGLen != (short)(0x10*numOfExtendedFiles)) { // 1 key					
						ISOException.throwIt(ISO7816.SW_WRONG_DATA);								
						
					}
				    numOfExtendedKeys= (byte) (sDGLen / (short) 0x0010);
					if (numOfExtendedKCVs > (byte) 0x00) {
						Util.arrayCopyNonAtomic(apduBuffer, (short) 0x0000, apduBuffer, (short) (sDGLen+8), (short) (numOfExtendedFiles*3));
						dealWithDESKeys_extended(apduBuffer, Constants.OFF_PERSO_DGI_DATA, apdu);
					} else {
						Util.arrayCopyNonAtomic(apduBuffer,Constants.OFF_PERSO_DGI_DATA, extendedKeyBuffer, (short) 0x0000, sDGLen);
					}
					break;	
				case (short) 0x9020 : //DES Key Check Values 
					if (sDGLen != (short)(0x0003*numOfExtendedFiles) ) {
						ISOException.throwIt(ISO7816.SW_WRONG_DATA);
					}
				    numOfExtendedKCVs = (byte) (sDGLen / (short) 0x0003);
				    //ISOException.throwIt((short)((short)0x9000+numOfExtendedFiles));
				    
					if (numOfExtendedKeys > (byte) 0x00) {
						Util.arrayCopyNonAtomic(apduBuffer,Constants.OFF_PERSO_DGI_DATA, apduBuffer, (short)(0x10*numOfExtendedFiles+ 0x008), sDGLen);
						Util.arrayCopyNonAtomic(extendedKeyBuffer, (short) 0x0000, apduBuffer, Constants.OFF_PERSO_DGI_DATA, (short)(0x10*numOfExtendedFiles));
						//apdu.setOutgoingAndSend((short)0, (short)200);
						//ISOException.throwIt((short)0x9670);
						dealWithDESKeys_extended(apduBuffer,Constants.OFF_PERSO_DGI_DATA, apdu);
					} else {
						Util.arrayCopyNonAtomic(apduBuffer,Constants.OFF_PERSO_DGI_DATA, extendedKeyBuffer, (short) 0x0000, sDGLen);
					}
				break;
				default : //case 0x9104(GPO Command Response Data)
				
					setTypeOfCurrentDGI(sDGITag);
					if (apduBuffer[(short) sDataOffset] == (byte) 0xA5) {
						sDataOffset += (short) 0x0002;
					}
	
					//Store TLV data from DataGroup(DG)
					while (sDataOffset < sDataEndOffset) {
						//Tag
						sTLVTag =
							Util.makeShort(
								(apduBuffer[(short) sDataOffset] & (byte) 0x1F) == (byte) 0x1F ? (apduBuffer[sDataOffset++]) : ((byte) 0x00),
								apduBuffer[sDataOffset]);
						sDataOffset += (short) 0x0001;
	
						//Legnth
						sTLVLength = EMVUtil.getUByte(apduBuffer, sDataOffset);
						sDataOffset += (short) 0x0001;
	
						//Store Value
						//TODO
						storeTagValue(sTLVTag, apduBuffer, sDataOffset, sTLVLength);
						sDataOffset = (short) (sDataOffset + sTLVLength);
					}
			}
		}
	}
	
	
	/**
	 * 
	 * @param sDGITag the tag value of the current DGI
	 */
	void setTypeOfCurrentDGI(short sDGITag){
		  dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]= (byte)0x00; 
		  switch(sDGITag){
          case Constants.DGI9104 :
              dtr_Satus[OFF_CP_TYPE_PEROSO_DGI] = (byte)0x01;    
              break;
          case Constants.DGI9203 : 
              dtr_Satus[OFF_CP_TYPE_PEROSO_DGI] = (byte)0x02;
              break;  
          case Constants.DGI9207: 
              dtr_Satus[OFF_CP_TYPE_PEROSO_DGI] = (byte)0x08;
              break;
          case Constants.DGI9103 :
        	  dtr_Satus[OFF_CP_TYPE_PEROSO_DGI] = (byte)0x10;
              break;
          case Constants.DGI9102 :
        	  dtr_Satus[OFF_CP_TYPE_PEROSO_DGI] = (byte)0x20;
              break;
        	  
          }
	}	
	/**
	 * Stores TLV object internally by tag
	 * 
	 * @param sTag Tag of TLV Object 
	 * @param bArray Source array which contains value of TLV Object
	 * @param sOff Value offset of TLV Object in bArray 
	 * @param sLen Length of TLV Object
	 */
	private void storeTagValue(short sTag, byte[] bArray, short sOff, short sLen) {
		byte bValue = bArray[sOff];
		switch (sTag) {
			case Constants.TAG9F36 : //Application Transaction Counter
				dataS_ATC = Util.getShort(bArray, sOff);
				return;
			case Constants.TAG9F58 : // Lower Consecutive Offline Limit
			/*	if(issAuthPerformed == true && issAuthFailed == true) {
					ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
				}*/
				dataS_LCOL = EMVUtil.getUByte(bArray, sOff);
				return;
			case Constants.TAG9F59 : // Upper Consecutive Offline Limit
				dataS_UCOL = EMVUtil.getUByte(bArray, sOff);
				return;
			case Constants.TAG9F53 : // Consecutive Transaction Limit (International)
				dataS_CTLI = EMVUtil.getUByte(bArray, sOff);
				return;
			case Constants.TAG9F72 : // Consecutive Transaction Limit (International Country)
				dataS_CTLIC = EMVUtil.getUByte(bArray, sOff);
				return;
			case Constants.TAG9F54 : // Cumulative Total Transaction Amount Limit
				dataA_CTTAL = EMVUtil.setData(bArray, sOff, dataA_CTTAL, (short) 0x000C, true);
				Util.arrayCopy(Constants.ZERO, (short) 0x0000, dataA_CTTA, (short) 0x0000, (short) 0x000C); //Reset CTTA
				return;
			case Constants.TAG9F75 : // Cumulative Total Transaction Amount Limit (Dual Currency)
				dataA_CTTALDC = EMVUtil.setData(bArray, sOff, dataA_CTTALDC, (short) 0x000C, true);
				return;
			case Constants.TAG9F79 : // ECB
			//TODO
				if(bLifePhase != Constants.PERSONALISATION_PHASE){
					/*byte[] temp = null; 
					ECAC = EMVUtil.setData(bArray,sOff, ECAC, (short) 0x000C, true);
					if(EMVUtil.compareBCD(ECAC,ECBL)>=0){
						JCSystem.beginTransaction();
						saveECBanlanceToLog(true,true,Constants.TAG9F79);
						ECB = EMVUtil.setData(bArray, sOff, ECB, (short) 0x000C, true);
						saveECBanlanceToLog(false,true,Constants.TAG9F79);
						JCSystem.commitTransaction();
					}else{
						ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
					}*/
					
					
					
					byte[] temp = null; 
					/*	ECAC = PBOC.setData(bArray,sOffset, ECAC, (short) 0x000C, true);
						if(compareBCD(ECAC,ECBL)>=0){
							ECB = PBOC.setData(bArray, sOffset, ECB, (short) 0x000C, true);
						}else{
							ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
						}*/
					dtr_BCDBuffer1 = EMVUtil.setData(bArray,sOff, dtr_BCDBuffer1, (short) 0x000C, true);
				
						
					if(data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE&&EMVUtil.compareBCD(Constants.ZERO,ECB)==0){
					
						
						if(EMVUtil.compareBCD(dtr_BCDBuffer1,AmountECPartPurchase)<0){
							EMVUtil.subBCD(dtr_BCDBuffer1,AmountECPartPurchase,dtr_BCDBuffer1);
							if(EMVUtil.compareBCD(dtr_BCDBuffer1,ECBL)<0){
								ISOException.throwIt(ISO7816.SW_WRONG_DATA);
							}
							
							if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&preAuthority!=null){
								EMVUtil.addBCD(calculateTotalPreAuthAmount(dtr_BCDBuffer2,dtr_BCDBuffer3),dtr_BCDBuffer1,dtr_BCDBuffer2);
								if(EMVUtil.compareBCD(dtr_BCDBuffer2,ECBL)<0){
									ISOException.throwIt(Constants.SW_PUT_WRANG_DATA);
								}
								
							}
							
							JCSystem.beginTransaction();
							saveECBanlanceToLog(true,true,Constants.TAG9F79);
							Util.arrayCopy(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
							saveECBanlanceToLog(false,true,Constants.TAG9F79);
							Util.arrayCopy(Constants.ZERO,(short)0,AmountECPartPurchase,(short)0,(short)12);
							JCSystem.commitTransaction();
						}else{
							if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&preAuthority!=null){
								EMVUtil.addBCD(calculateTotalPreAuthAmount(dtr_BCDBuffer2,dtr_BCDBuffer3),dtr_BCDBuffer1,dtr_BCDBuffer2);
								if(EMVUtil.compareBCD(dtr_BCDBuffer2,ECBL)<0){
									ISOException.throwIt(ISO7816.SW_WRONG_DATA);
								}
								
							}
							JCSystem.beginTransaction();
							saveECBanlanceToLog(true,true,Constants.TAG9F79);
							EMVUtil.subBCD(AmountECPartPurchase,dtr_BCDBuffer1,dtr_BCDBuffer2);
							Util.arrayCopy(dtr_BCDBuffer2,(short)0,AmountECPartPurchase,(short)0,(short)12);
							saveECBanlanceToLog(false,true,Constants.TAG9F79);
							JCSystem.commitTransaction();
						}
						
					}else{
						
						if(EMVUtil.compareBCD(dtr_BCDBuffer1,ECBL)<0){
							ISOException.throwIt(ISO7816.SW_WRONG_DATA);
						}
						
						if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&preAuthority!=null){
							EMVUtil.addBCD(calculateTotalPreAuthAmount(dtr_BCDBuffer2,dtr_BCDBuffer3),dtr_BCDBuffer1,dtr_BCDBuffer2);
							if(EMVUtil.compareBCD(dtr_BCDBuffer2,ECBL)<0){
								ISOException.throwIt(Constants.SW_PUT_WRANG_DATA);
							}
							
						}
						if(EMVUtil.compareBCD(dtr_BCDBuffer1,ECBL)>=0){
							JCSystem.beginTransaction();
							saveECBanlanceToLog(true,true,Constants.TAG9F79);
							ECB = EMVUtil.setData(bArray, sOff, ECB, (short) 0x000C, true);
							saveECBanlanceToLog(false,true,Constants.TAG9F79);
							JCSystem.commitTransaction();
						}else{
							ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
						}
					}
				}else{
					ECB = EMVUtil.setData(bArray, sOff, ECB, (short) 0x000C, true);
				}
			    return;
			case Constants.TAG9F77 : // ECBL
				if(bLifePhase != Constants.PERSONALISATION_PHASE){
					if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&LimitOfECPartPurchase!=null){
						dtr_BCDBuffer1 = EMVUtil.setData(bArray,sOff, dtr_BCDBuffer1, (short) 0x000C, true);
					     
						Util.arrayFillNonAtomic(dtr_BCDBuffer2,(short)0,(short)12,(byte)0x09);
						
						EMVUtil.subBCD(dtr_BCDBuffer2,LimitOfECPartPurchase,dtr_BCDBuffer2);
						if( EMVUtil.compareBCD(dtr_BCDBuffer1,dtr_BCDBuffer2)<0){
							ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
						}
					}
					ECBL = EMVUtil.setData(bArray, sOff, ECBL, (short) 0x000C, true);
				}else{
					ECBL = EMVUtil.setData(bArray, sOff, ECBL, (short) 0x000C, true);
				}
				return;
			case Constants.TAG9F78 : // ECBSTL
				ECBSTL = EMVUtil.setData(bArray, sOff, ECBSTL, (short) 0x000C, true);
				return;
			case Constants.TAG9F6D : // ECRT
				ECRT = EMVUtil.setData(bArray, sOff, ECRT, (short) 0x000C, true);
				return;
				
			///*2012-04.02 ~cyf Secondary Application 
			case Constants.TAGDF79://ECSAB 
				//TODO
				if(bLifePhase != Constants.PERSONALISATION_PHASE){
					dtr_BCDBuffer1 = EMVUtil.setData(bArray,sOff, dtr_BCDBuffer1, (short) 0x000C, true);
					if(EMVUtil.compareBCD(dtr_BCDBuffer1,ECSABL)>=0){
						JCSystem.beginTransaction();
						saveECBanlanceToLog(true,false,Constants.TAGDF79);
						ECSAB = EMVUtil.setData(bArray, sOff, ECSAB, (short) 0x000C, true);
						saveECBanlanceToLog(false,false,Constants.TAGDF79);
						JCSystem.commitTransaction();
					}else{
						ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
					}
					
					
					
				}else{
					ECSAB = EMVUtil.setData(bArray, sOff, ECSAB, (short) 0x000C, true);
					data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]=Constants.TRUE;
				}
			    return;
			case Constants.TAGDF77 : // ECBL
				ECSABL = EMVUtil.setData(bArray, sOff, ECSABL, (short) 0x000C, true);
				return;
			case Constants.TAGDF78 : // ECBSTL
				ECSABSTL = EMVUtil.setData(bArray, sOff, ECSABSTL, (short) 0x000C, true);
				return;	
			case Constants.TAGDF76 : // ECRT
				ECSART = EMVUtil.setData(bArray, sOff, ECSART, (short) 0x000C, true);
				return;
			//*/2012-04.02 ~cyf Secondary Application
			case  (short)0xDF61:
				flagPartPurchase =bArray[sOff];
				return;
			///*2012-05.29 ~cyf extended Application 
			case (short) 0xDF62 : // ECRT
				if(bLifePhase != Constants.PERSONALISATION_PHASE){
					dtr_BCDBuffer1 = EMVUtil.setData(bArray,sOff, dtr_BCDBuffer1, (short) 0x000C, true);
					Util.arrayFillNonAtomic(dtr_BCDBuffer2,(short)0,(short)12,(byte)0x09);
					EMVUtil.subBCD(dtr_BCDBuffer2,ECBL,dtr_BCDBuffer2);
					if(EMVUtil.compareBCD(dtr_BCDBuffer1,dtr_BCDBuffer2)<0){
						ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
					}
					if(EMVUtil.compareBCD(AmountECPartPurchase,dtr_BCDBuffer1)>=0){
						LimitOfECPartPurchase = EMVUtil.setData(bArray, sOff, LimitOfECPartPurchase, (short) 0x000C, true);
					}else{
						ISOException.throwIt(ISO7816.SW_WRONG_DATA);
					}
				}else{
					LimitOfECPartPurchase = EMVUtil.setData(bArray, sOff, LimitOfECPartPurchase, (short) 0x000C, true);
				
					data_Flags[OFF_IS_TOUZHI_SPUPPORTED] = Constants.TRUE;
				}
				return;
			case (short) 0xDF63 : // ECRT
				if(bLifePhase != Constants.PERSONALISATION_PHASE){
					ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
				}else{
					AmountECPartPurchase = EMVUtil.setData(bArray, sOff, AmountECPartPurchase, (short) 0x000C, true);
					AmountECPartPurchaseBuffer=JCSystem.makeTransientByteArray((short) 0x000C, JCSystem.CLEAR_ON_DESELECT);
					return;
					
				}
			
			//*/2012-05.29 ~cyf extended Application 
			case Constants.TAG9F73 : // Currency Conversion Factor
				if (dataA_CCF == null) {
					dataA_CCF = new byte[8];
				}
				EMVUtil.expandBCD(bArray, sOff, (short) 0x0004, dtr_BCDBuffer3);
				Util.arrayCopy(dtr_BCDBuffer3,(short)0,dataA_CCF,(short)0,(short)8);
				return;
			case Constants.TAG9F5C : // Cumulative Total Transaction Amount Upper Limit
				dataA_CTTAUL = EMVUtil.setData(bArray, sOff, dataA_CTTAUL, (short) 0x000C, true);
				return;
			case Constants.TAG9F6B :
				CardCVMLimit=EMVUtil.setData(bArray, sOff, CardCVMLimit, (short) 0x000C, true);	
				return;
			case Constants.TAGDF72 :
				CardCVMLimitECS=EMVUtil.setData(bArray, sOff, CardCVMLimitECS,  (short) 0x000C, true);
				return;

			case (short) 0x9F55 :
			case (short) 0x9F56 :
			case (short) 0x9F57 :
			case (short) 0x5F28 :
			case (short) 0x9F5A :
			case (short) 0x9F5B :
			case (short) 0x9F5E :
			case (short) 0x9F5F :
			case (short) 0x9F60 :
			case (short) 0x9F61 :
			case (short) 0x9F62 :
			case (short) 0x9F63 :
			case (short) 0x9F64 :
			case (short) 0x9F65 :
			case (short) 0x9F66 :
			case (short) 0x9F67 :
			//case (short) 0x9F68 :
			case (short) 0x9F69 :
			case (short) 0x9F6A :
			//case (short) 0x9F6B :
			//case (short) 0x9F6C :
			case (short) 0x9F6E :
			case (short) 0x9F6F :
			case (short) 0x9F70 :
			case (short) 0x9F71 :
			case (short) 0x9F74 :
			case (short) 0x9F76 :
			default :
				if (bLifePhase == Constants.PERSONALISATION_PHASE) {
					switch (sTag) {
						case Constants.TAG9F76 : // Secondary Application Currency Code
							Util.arrayCopyNonAtomic(bArray, sOff, dataA_SACC, (short) 0, sLen);
							return;
						case Constants.TAG9F57 : // Issuer Country Code
						case Constants.TAG5F28 : // Issuer Country Code , PBOC에만 존재
							Util.arrayCopyNonAtomic(bArray, sOff, dataA_ICC, (short) 0, sLen);
							return;
						case Constants.TAG9F51 : // Application Curency Code
						case Constants.TAG9F42 : // Application Currency Code, PBOC에만 존재
							Util.arrayCopyNonAtomic(bArray, sOff, dataA_ACC, (short) 0, sLen);
							return;
						//2012-04.02 ~cyf Secondary Application
						case Constants.TAGDF71 : // Application Curency Code
							Util.arrayCopyNonAtomic(bArray, sOff, dataA_ECSACC	, (short) 0, sLen);
							return;
						case Constants.TAG9F52 : // Application Default Action (ADA)
							//Util.arrayCopyNonAtomic(bArray, sOffset, ADA, (short) 0, sLength);
							dataB_ADA1 = bArray[sOff];
							dataB_ADA2 = bArray[(short)(sOff+1)];
						
							return;
						//PBOC에서는 GI가 사용되지 않는다.
						case Constants.TAG9F55 : // Geographic Indicator
							data_GI = bValue;
							return;
						case Constants.TAG0057:
							dataA_Trac2Data=new byte[sLen];
							dataA_Trac2Data=EMVUtil.setData(bArray, sOff, dataA_Trac2Data, sLen, false);
							return;
						case Constants.TAG5F20:
							dataA_CardHolderName=EMVUtil.setData(bArray, sOff, dataA_CardHolderName, sLen, false);
							return;
						case Constants.TAG5F34:
							JCSystem.beginTransaction();
							PANNumber=bArray[sOff];
							data_Flags[OFF_IS_PAN_NUMBER_SHOWED] = Constants.TRUE;
							JCSystem.commitTransaction();
						    return;
						case Constants.TAG9F1F:
							dataA_Trac1Data=EMVUtil.setData(bArray, sOff, dataA_Trac1Data, sLen, false);
							return;
						
						case Constants.TAG9F6C :
							JCSystem.beginTransaction();
							CTQ_Byte1 =bArray[sOff];
							CTQ_Byte2 =bArray[(short)(sOff+1)];
							data_Flags[OFF_IS_CTQ_PRESONALIZED] = Constants.TRUE;
							JCSystem.commitTransaction();
							return;
						case Constants.TAG9F68 :
							CAP = EMVUtil.setData(bArray, sOff, CAP, sLen, false);					
							return;
						case (short)0x9F67: // MSD Offset
												
							return;	
						case Constants.TAG9F56 : // Issuer Authentication Indicator
							data_Flags[OFF_IS_AUTH_MANDAROTY] = (bValue & (byte) 0x80) == (byte) 0x80 ? Constants.TRUE : Constants.FALSE;
							return;
						case Constants.TAG0050 : // Application Label
							AppLabel = EMVUtil.setData(bArray, sOff, AppLabel, sLen, false);
							return;
						case Constants.TAG0082 : // Application Interchange Profile (AIP)
							if((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F) == (byte)0x01){
								AIP = Util.getShort(bArray, sOff);
								//If CDA supported, then create hashBuffer
								if (((AIP & Constants.AIP_CDA_GENAC_SUPP) == Constants.AIP_CDA_GENAC_SUPP) && (hashBuffer == null)) {
									hashBuffer = new byte[255];
								}
							}else if(((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F) == (byte)0x02)){
								AIP_EC= Util.getShort(bArray, sOff);
							}else if(((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F) == (byte)0x08)){
								AIP_QPBOC= Util.getShort(bArray, sOff);
							}
							return;
						case Constants.TAG0087 : // Application Priority Indicator
							API = bValue;
							return;
						case Constants.TAG9F38 : // Processing Options Data Object List (PDOL)
							if((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x20) == (byte)0x20){
								PDOL = EMVUtil.setData(bArray, sOff, PDOL, sLen, false);
								// PDOL Related Data의 총 길이를 구함
								DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOL] = 
										EMVUtil.getDOLRelatedDataLength(PDOL, (short)0x0000, sLen);
							}
							if((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x10) == (byte)0x10){
								ContactlessPDOL = EMVUtil.setData(bArray, sOff, ContactlessPDOL, sLen, false);
								// PDOL Related Data의 총 길이를 구함
								DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOLCL] = 
										EMVUtil.getDOLRelatedDataLength(ContactlessPDOL, (short)0x0000, sLen);
							}
								//DEBUG
							//Util.setShort(tmpDebugBuf, (short)0x0006, DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOL]);
							return;
						case Constants.TAG5F2D : // Language Preference
							LangPref = EMVUtil.setData(bArray, sOff, LangPref, sLen, false);
							return;
						case Constants.TAG9F11 : // Issuer Code Table Index
							ICTI = bValue;
							return;
						case Constants.TAG9F10 : // Issuer Application Data
						//TODO
							if((byte)((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F) )== (byte)0x08){
								Util.arrayCopyNonAtomic(bArray, (short) (sOff + (short) 0x0001), IAD_CL, (short) 0x0000, (short) (sLen-1));
								data_Flags[OFF_IS_CL_IAD] = Constants.TRUE;
							}else{
								Util.arrayCopyNonAtomic(bArray, (short) (sOff + (short) 0x0001), IAD, (short) 0x0000, (short) (sLen-1));
							}
							return;
						case Constants.TAG9F17 : //Retry Counter
						/*	short retry_num=bArray[sOff];
						    short retry_num_card =Pin.getTriesRemaining();
						    if(retry_num_card>retry_num){
						    	for(short i=0;i<(short)(retry_num_card-retry_num);i++){
						    		Pin.decrementTriesRemaining();
								}  
						    }*/
							
							return;
							
						case Constants.TAG9F13 :
							dataS_lastOnlineATC=Util.getShort(bArray, sOff);
						    return;
						
						case Constants.TAG9F12 : // Application Preferred Name
							AppPrefName = EMVUtil.setData(bArray, sOff, AppPrefName, sLen, false);
							return;
						case Constants.TAGBF0C : // FCI Issuer Discretionary Data
							
							short offsetDOL = (short) 0x0000;
							short lenDOL;
							if(((byte)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x20) == (byte)0x20)){
								FCI_IDD = EMVUtil.setData(bArray, sOff, FCI_IDD, sLen, false);
								while (offsetDOL < FCI_IDD.length) {
									lenDOL = EMVUtil.parseDOL(FCI_IDD, offsetDOL, PBOC.dtr_BER_TLV_DOL1);
									if (PBOC.dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG] == (short) 0x9F4D) { //Set Log Entry
										transLogEntry = new byte[2]; //Transactional Log Entry
										Util.arrayCopyNonAtomic(
											FCI_IDD,
											(short) (offsetDOL + (short) 0x0003),
											transLogEntry,
											(short) 0x0000,
											(short) 0x0002);
									
										
										
									}
									if (PBOC.dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG] == (short) 0xDF4D) { //Set Log Entry
										transLogEntryEC = new byte[2]; //Transactional Log Entry
										Util.arrayCopyNonAtomic(
											FCI_IDD,
											(short) (offsetDOL + (short) 0x0003),
											transLogEntryEC,
											(short) 0x0000,
											(short) 0x0002);
									
										
										
									}
									
									offsetDOL = (short) (offsetDOL + lenDOL + PBOC.dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
									
									//ISOException.throwIt((short)((short)0x9000+(short)(FCI_IDD[offsetDOL]&0xFF)));
									
								}
								createLogFile();
								createLogFileEC();
							}
							if(((byte)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x10) == (byte)0x10)){
								FCI_IDD_CL = EMVUtil.setData(bArray, sOff, FCI_IDD_CL, sLen, false);
								
						
								while (offsetDOL < FCI_IDD_CL.length) {
									lenDOL = EMVUtil.parseDOL(FCI_IDD_CL, offsetDOL,dtr_BER_TLV_DOL1);
									if(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG] == (short) 0xDF61){
										
										flagPartPurchase = FCI_IDD_CL[(short) (offsetDOL + (short) 0x0003)];
										data_Flags[OFF_IS_R_MAC] = Constants.TRUE;
										rndTerminal = JCSystem.makeTransientByteArray((short) 8, JCSystem.CLEAR_ON_DESELECT);
										if(preAuthority == null){
											preAuthority = new Object[EXT_PREAUTH_NUM_MAX];
											preAuthority[0]= new byte[16];
											preAuthority[1]= new byte[16];
											preAuthority[2]= new byte[16];
										}
										
										if(infoUpdateCAPP == null){
											infoUpdateCAPP = new Object[6];
											infoUpdateCAPP[0]= JCSystem.makeTransientShortArray((short) 5, JCSystem.CLEAR_ON_DESELECT);
											infoUpdateCAPP[1]= JCSystem.makeTransientShortArray((short) 5, JCSystem.CLEAR_ON_DESELECT);
											infoUpdateCAPP[2]= JCSystem.makeTransientShortArray((short) 5, JCSystem.CLEAR_ON_DESELECT);
											infoUpdateCAPP[3]= JCSystem.makeTransientShortArray((short) 5, JCSystem.CLEAR_ON_DESELECT);
											infoUpdateCAPP[4]= JCSystem.makeTransientShortArray((short) 5, JCSystem.CLEAR_ON_DESELECT);
											infoUpdateCAPP[5]= JCSystem.makeTransientShortArray((short) 5, JCSystem.CLEAR_ON_DESELECT);
										}
										data_Flags[OFF_IS_EXTENDED_SUPPORDTED] =Constants.TRUE;
										readCAPP = JCSystem.makeTransientByteArray((short)0x05, JCSystem.CLEAR_ON_DESELECT);
										if(lastExtendedAC==null){
											lastExtendedAC= new byte[10];
											lastExtendedACBuffer=JCSystem.makeTransientByteArray((short) 10, JCSystem.CLEAR_ON_DESELECT);
										}
									} else {
									}
									offsetDOL = (short) (offsetDOL + lenDOL + dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
									
									//ISOException.throwIt((short)((short)0x9000+(short)(FCI_IDD[offsetDOL]&0xFF)));
									
								}
								
							}
							
							return;
						case Constants.TAG0094 : // Application File Locator (AFL)
							if (aflList == null&&(short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F) == (byte)0x01) {
								AFLListLen = sLen;
							}
							if (aflListEC == null&&(short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F)== (byte)0x02) {
								AFLListLenEC = sLen;
							}
							if (aflListCL == null&&(short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F) == (byte)0x08) {
								AFLListLenCL = sLen;
							}
							createAFLFiles(bArray, sOff, sLen);
							return;
						case Constants.TAG9F4F : // Log Format 
							LDOL = EMVUtil.setData(bArray, sOff, LDOL, sLen, false);
							offsetDOL = (short) 0x0000;
							lfRecordSize = (short) 0x0000;
							while (offsetDOL < LDOL.length) {
								lenDOL = EMVUtil.parseDOL(LDOL, offsetDOL, PBOC.dtr_BER_TLV_DOL1);
								lfRecordSize += PBOC.dtr_BER_TLV_DOL1[PBOC.OFF_BER_TLV_DOL_LEN];
								offsetDOL = (short) (offsetDOL + lenDOL);
							}
							createLogFile();
							return;
						case Constants.TAGDF4F : // Log Format EC
							LDOL_EC = EMVUtil.setData(bArray, sOff, LDOL_EC, sLen, false);
							offsetDOL = (short) 0x0000;
							lfRecordSizeEC = (short) 0x0000;
							while (offsetDOL < LDOL_EC.length) {
								lenDOL = EMVUtil.parseDOL(LDOL_EC, offsetDOL, PBOC.dtr_BER_TLV_DOL1);
								lfRecordSizeEC += PBOC.dtr_BER_TLV_DOL1[PBOC.OFF_BER_TLV_DOL_LEN];
								
								offsetDOL = (short) (offsetDOL + lenDOL);
							}
							lfRecordSizeEC+=14;
							createLogFileEC();
							return;
					   case Constants.TAG9F5D : //Available Offline Spending Limit
						   for(byte i=0;i<6;i++){
							   if(bArray[(short)(sOff+i)]!=(byte)0){
								   data_Flags[OFF_IS_AOSL_SHOWED] = Constants.TRUE;
								   return;
							   }
						   } 
						 /*  if(bArray[(short)(sOffset+5)]==(byte)1){
							   
							   AOSLIndicator=true;
						   }*/
						   
						  
					   return;

						case (short)0x9F63 : // Application Preferred Name
							ProductTag = EMVUtil.setData(bArray, sOff, ProductTag, sLen, false);
							return;
									
						default :
							ISOException.throwIt(ISO7816.SW_DATA_INVALID);
					}
				} else {
					//Issuer Auth가 성공한 transaction내에서는 ADA가 갱신되어서는 안된다.
					if (sTag == (short)0x9F52 && (dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] ==  Constants.TRUE && data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]== Constants.FALSE)) {
						ISOException.throwIt(ISO7816.SW_WRONG_DATA);
					} 
					else {
						ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
					}
				}
				return;
		}
	}

	
	
	
	/**
	 * Get value specified by tag into dest array
	 * and return length of value
	 * 
	 * @param sTag
	 * @param dest
	 * @param destOff
	 * @return length of specified value at personalized or 0xFFFF at not personalized
	 */
	private short getTagValue(short sTag, byte[] dest, short destOff) {

		switch (sTag) {
			case (short) 0x9F13 : //Last Online ATC Register (LOATC)
			case (short) 0x9F36 : //Application Transaction Counter (ATC)
				Util.setShort(dest, destOff, sTag == (short) 0x9F36 ? dataS_ATC : dataS_lastOnlineATC);
				return (short) 2;
			case (short) 0x9F17 : //PIN Try Counter
				if (Pin == null) {
					return (short) 0xFFFF;
				}
				dest[destOff] = Pin.getTriesRemaining();
				
				return (short) 1;
			case (short) 0x9F4F : //Log Format
				if (LDOL == null) {
					return (short) 0xFFFF;
				}
				Util.arrayCopyNonAtomic(LDOL, (short) 0x0000, dest, destOff, (short) LDOL.length);
				return (short) LDOL.length;
			case (short) 0xDF4F : //Log Format
				if (LDOL_EC == null) {
					return (short) 0xFFFF;
				}
				Util.arrayCopyNonAtomic(LDOL_EC, (short) 0x0000, dest, destOff, (short) LDOL_EC.length);
				return (short) LDOL_EC.length;
				
			case (short) 0x9F51 : //Application Currency Code
			case (short) 0x9F42 : // Applicatoin Currency Code, PBOC에서는 9F51, 9F42 두개가 존재
				return EMVUtil.getValueArray(dest, destOff, dataA_ACC);
			case (short) 0x9F76 : //Secondary Application Currency Code
				return EMVUtil.getValueArray(dest, destOff, dataA_SACC);
			case (short) 0xDF71 : //Secondary Application Currency Code
				return EMVUtil.getValueArray(dest, destOff, dataA_ECSACC);
			case (short) 0x9F52 : //Application Default Action
				//Util.arrayCopyNonAtomic(ADA, (short) 0x0000, dest, destOff, (short) 2);
				dest[destOff] = dataB_ADA1;
				dest[(short)(destOff+1)] = dataB_ADA2;
				return (short) 2;
			case (short) 0x9F53 : //Consecutive Transaction Limit(International)
				return EMVUtil.getValue(dest, destOff, (byte) dataS_CTLI);
//			PBOC에서는 GI가 사용되지 않는다.
//			case (short) 0x9F55 : //Geographic Indicator
//				return getValue(dest, destOff, GI);
			case (short) 0x9F56 : //Issuer Authentication Indicator
				return EMVUtil.getValue(dest, destOff, (data_Flags[OFF_IS_AUTH_MANDAROTY] == Constants.TRUE ? (byte) 0x80 : (byte) 0x00));
			case (short) 0x9F57 : //Issuer Country Code
			case (short) 0x5F28 : //Issuer Country Code, PBOC에만 존재
				return EMVUtil.getValueArray(dest, destOff, dataA_ICC);
			case (short) 0x9F58 : //Lower Consecutive Offline Limit VIS pA-35 1 byte
				return EMVUtil.getValue(dest, destOff, (byte) dataS_LCOL);
			case (short) 0x9F59 : //Uppper Consecutive Offline Limit VIS pA-42 1 byte
				return EMVUtil.getValue(dest, destOff, (byte) dataS_UCOL);
			case (short) 0x9F72 : //Consecutive Transaction Limit (International Country)
				return EMVUtil.getValue(dest, destOff, (byte) dataS_CTLIC);
			case (short) 0x9F54 : //Cumulative Total Transaction Amount Limit 
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dataA_CTTAL);
			//-cyf 2012.04.03 secondory currency for E-Cash 
			case (short) 0x9F79 : //EC Balance 
				if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSAB);
				}else{
				     return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECB);	
				}			
					
				
			case (short) 0x9F77 : //EC Balance 
				if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSABL);
				}else{
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECBL);
				}
			
			case (short) 0x9F78 : //EC Balance 
				if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSABSTL);
				}else{
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECBSTL);
				}
		
			case (short) 0x9F6D : //EC Balance 
				if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSART);
				}else{
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECRT);
				}
				
			
			//~cyf 20120604
			case (short) 0xDF79: //EC Balance 
				
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSAB);
				
			case (short) 0xDF77 : //EC Balance 
				
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSABL);
			
			
			case (short) 0xDF78 : //EC Balance 
				
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSABSTL);
				
		
			case (short) 0xDF76 : //EC Balance 
			
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSART);
				
			//~cyf 20120604

			case (short) 0xDF61 : //EC Balance 
				dest[destOff] = flagPartPurchase;
			    return (short) 1;
			case (short) 0xDF62 : //EC Balance 
				
				
			     return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, LimitOfECPartPurchase);
			case (short) 0xDF63 : //EC Balance 
			
			 if(isRecoeryNeeded){
				 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, AmountECPartPurchaseBuffer); 
			 }else{
				 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, AmountECPartPurchase);
		
			 }
				
			
			
			case (short) 0x9F5D : //EC Balance 
			
				if((byte)(CAP[CAP_BYTE_1]&0x80)==(byte)0x80){
					if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
						return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECSAB);
					}else{
						return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECB);
					}
				}else if((byte)(CAP[CAP_BYTE_1]&0x40)==(byte)0x40){
				     if(dataA_CTTAUL!=null){
				    	 if(EMVUtil.compareBCD(dataA_CTTAUL,dataA_CTTA)<0){
				    		 EMVUtil.subBCD(dataA_CTTAUL,dataA_CTTA,dtr_BCDBuffer1);
				    		
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dtr_BCDBuffer1);
				    	 }else{
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, Constants.ZERO); 
				    	 }
				     }else{
				    	 if(EMVUtil.compareBCD(dataA_CTTAL,dataA_CTTA)<0){
				    		 EMVUtil.subBCD(dataA_CTTAL,dataA_CTTA,dtr_BCDBuffer1);
				    		 
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dtr_BCDBuffer1);
				    	 }else{
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, Constants.ZERO); 
				    	 }
				     }
					
				}else if((byte)(CAP[CAP_BYTE_1]&0x20)==(byte)0x20){
					if(dataA_CTTAUL!=null){
				    	 if(EMVUtil.compareBCD(dataA_CTTAUL,dataA_CTTA)<0){
				    		 EMVUtil.subBCD(dataA_CTTAUL,dataA_CTTA,dtr_BCDBuffer1);
				    		 EMVUtil.addBCD(dtr_BCDBuffer1,ECB,dtr_BCDBuffer1);
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dtr_BCDBuffer1);
				    	 }else{
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECB);
				    	 }
				     }else{
				    	 if(EMVUtil.compareBCD(dataA_CTTAL,dataA_CTTA)<0){
				    		 EMVUtil.subBCD(dataA_CTTAL,dataA_CTTA,dtr_BCDBuffer1);
				    		 EMVUtil.addBCD(dtr_BCDBuffer1,ECB,dtr_BCDBuffer1);
				    		 
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dtr_BCDBuffer1);
				    	 }else{
				    		 return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, ECB); 
				    	 }
				     }
				}else{
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, Constants.ZERO);
				}
				
			case Constants.TAG9F5C: //Cumulative Total Transaction Amount Upper Limit
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dataA_CTTAUL);
			case Constants.TAG9F73 : //Currency Conversion Factor
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0004, dataA_CCF);
			case Constants.TAG9F75: //Cumulative Total Transaction Amount Limit (Dual Currency)
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, dataA_CTTALDC);
			case Constants.TAG9F4E:// Merchant Name
				Util.arrayCopyNonAtomic(MN, (short)0x00, dest, destOff, (short)0x14);
				return (short)0x14;
			case  Constants.TAG9F68:// CAP Card Additional Processes
				Util.arrayCopyNonAtomic(CAP, (short)0x00, dest, destOff, (short)CAP.length);
			    return (short)CAP.length;
			case Constants.TAG9F6B:// Card CVM Limit
				if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]==Constants.TRUE){
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, CardCVMLimitECS);
				}else{
					return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, CardCVMLimit);
				}
				
			case Constants.TAGDF72:// Card CVM Limit
				return EMVUtil.getValueBCD(dest, destOff, (short) 0x0006, CardCVMLimitECS);
				
			default :
				}
		return (short) 0xFFFF;
	}
	
	

	/**
	 * Reset all application flags
	 * 
	 * @param - none
	 * 
	 * @return - none
	 */
	private final void resetFlags() {
	/*	// set application state 'selected '
		dtr_Transaction[Constants.OFF_STATE_MACHINE] = Constants.STATE_SELECTED;
		
		// setting specific for user phase
		if (life_Phase == Constants.USE_PHASE) {
			is_Decline = false;
			is_Online = false;
			//reset_flags_GPO();
		} else {
			// setting in perso phase
			dtr_Transaction[Constants.OFF_NO_DGI_PART_IN_TRANSIENT_PRESENT] = Constants.OK;
			dtr_Transaction[Constants.OFF_P_SEQ_NUM] = (byte) 0;
		}*/
	}

	private void appendRecordCommon(byte[] src, short srcOff, byte convertedSFI, short len, byte recordNum) {
		short lenDOL1;
		short lenDOL2;
		short index;
		byte[] record;
	    short  length_DOL;
	    short  offset_DOL;
		
	    byte index_File=(byte) ((convertedSFI & ((short) 0x00FF)) >> (byte) 0x03);
	    index_File--;
		//Write data into record 
	    if(recordFile[index_File]==null){
	    	recordFile[index_File]=new PBOCFile((byte)((index_File+1)&0xFF));
	    }
		record =((PBOCFile) recordFile[index_File]).appendRecord(len,(short)(recordNum&0xFF));
		
		Util.arrayCopy(src, (short) srcOff, record, (short) 0x0000, len);

		lenDOL1 = EMVUtil.parseDOL(record, (short) 0x0000, dtr_BER_TLV_DOL1);		

		if(CDOL1==null||CDOL2==null||DDOL==null ||dataA_Trac2Data==null ||dataA_CardHolderName==null ||!isECSavedInrecord||ProductTag==null||record_CardAuthRelatedData==null){
		    index = lenDOL1;
			while (index < record.length) {
				lenDOL2 = EMVUtil.parseDOL(record, index, dtr_BER_TLV_DOL1);
				switch(dtr_BER_TLV_DOL1[0] ){
					case(short)0x008C:
						
						offset_DOL=(short)(index + (short) 0x0002);
						length_DOL=(short)(record[(short) (index + (short) 0x0001)]&0xFF);
						CDOL1=new byte[length_DOL];
						Util.arrayCopy(record,offset_DOL,CDOL1,(short)0,length_DOL);
						// CDOL1 Related Data의 총 길이를 구함 						
						DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_CDOL1] = 
												EMVUtil.getDOLRelatedDataLength(record, 
												(short)((short) (index + (short) 0x0002) & (short)0x00FF), 
												(short)((short)record[(short) (index + (short) 0x0001)] & (short)0x00FF));				
						// DEBUG
						//Util.setShort(tmpDebugBuf, (short)0x0000, DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_CDOL1]);
						checkingACElementOffsetForDOL(CDOL1,ACOffsetsOfCDOL1);
					
						break;
					
					case(short)0x008D:
						offset_DOL=(short)(index + (short) 0x0002); 
						length_DOL=(short)(record[(short) (index + (short) 0x0001)]&0xFF);
						
						
						CDOL2=new byte[length_DOL];
						Util.arrayCopy(record,offset_DOL,CDOL2,(short)0,length_DOL);
						
						// CDOL2 Related Data의 총 길이를 구함
						DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_CDOL2] = 
												EMVUtil.getDOLRelatedDataLength(record, 
												(short)((short) (index + (short) 0x0002) & (short)0x00FF), 
												(short)((short)record[(short) (index + (short) 0x0001)] & (short)0x00FF));
						// DEBUG
						//Util.setShort(tmpDebugBuf, (short)0x0002, DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_CDOL2]);
						checkingACElementOffsetForDOL(CDOL2,ACOffsetsOfCDOL2);
						break;
					
					case(short) 0x9F49:
						// DDOL Related Data의 총 길이를 구함
						data_Flags[OFF_IS_DDOL_PERSONALIZE] = Constants.TRUE;
						offset_DOL=(short)(index + (short) 0x0003);
						length_DOL=(short)(record[(short) (index + (short) 0x0002)]&0xFF);
						//addDebugLog(DDOLL,(short)0,(short)2);
						DDOL=new byte[length_DOL];
						Util.arrayCopy(record,offset_DOL,DDOL,(short)0,length_DOL);
						//addDebugLsog(DDOL,(short)0,length_DOL);
						DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_DDOL] = 
												EMVUtil.getDOLRelatedDataLength(record, 
												(short)((short) (index + (short) 0x0003) & (short)0x00FF), 
												(short)((short)record[(short) (index + (short) 0x0002)] & (short)0x00FF));
						// DEBUG
						//Util.setShort(tmpDebugBuf, (short)0x0004, DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_DDOL]);
						break;
					case(short) 0x9F63:
						// DDOL Related Data의 총 길이를 구함
						
						offset_DOL=(short)(index + (short) 0x0003);
						length_DOL=(short)(record[(short) (index + (short) 0x0002)]&0xFF);
						//addDebugLog(DDOLL,(short)0,(short)2);
						if(ProductTag==null){
							ProductTag=new byte[length_DOL];
							Util.arrayCopy(record,offset_DOL,ProductTag,(short)0,length_DOL);
						}
						
						//addDebugLsog(DDOL,(short)0,length_DOL);
						break;
					case (short) 0x0057:  // if Trac2					
										
						offset_DOL=(short)(index + (short) 0x0002); 					
						length_DOL=(short)(record[(short) (index + (short) 0x0001)]&0xFF);
						
						if(dataA_Trac2Data==null){
							dataA_Trac2Data=new byte[length_DOL];
							Util.arrayCopy(record,offset_DOL,dataA_Trac2Data,(short)0,length_DOL);
						}
						break;
					case (short) 0x9F79: // ECB
						offset_DOL=(short)(index + (short) 0x0003); 					
						length_DOL=(short)(record[(short) (index + (short) 0x0002)]&0xFF);
						
						if(length_DOL>0){						
							//JCSystem.beginTransaction();
							EMVUtil.expandBCD(record, offset_DOL, (short) 0x0006, dtr_BCDBuffer3);
							Util.arrayCopy(dtr_BCDBuffer3,(short)0,ECB,(short)0,(short)12);
							
							EC_Info_ForRecord=new byte[LENGTH_EC_INFO];
							isECSavedInrecord=true;
							EC_Info_ForRecord[OFFSET_EC_INFO_INDEX] =index_File;	  
							EC_Info_ForRecord[OFFSET_EC_INFO_RECORD_NUM]=recordNum;	 
							Util.setShort(EC_Info_ForRecord,OFFSET_EC_INFO_DATA_OFFSET,offset_DOL);
							//JCSystem.commitTransaction();	
						}
						break;
					case (short) 0x9F69: 
						offset_DOL=(short)(index + (short) 0x0003); 					
						length_DOL=(short)(record[(short) (index + (short) 0x0002)]&0xFF);
						if(length_DOL>0){
							record_CardAuthRelatedData = record;
							offset_CardAuthRelatedData = offset_DOL;
							len_CardAuthRelatedData = length_DOL;
							dtr_record_CardAuthRelatedData =  JCSystem.makeTransientByteArray(len_CardAuthRelatedData, JCSystem.CLEAR_ON_DESELECT);
							sfiRCRD = (byte)(index_File+1);
							recnumRCRD = (byte)(recordNum);
							
							
						}
					    break;
				
				}			
				index = (short) (index + lenDOL2 + dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
			}
		}			
		return;
	}
	
	void checkingACElementOffsetForDOL(byte[] dol,short[]acOffsetArray){
		
		short index = 0;		
		short indexOfACElementList=0;
        short tag;		
		short DOLRelatedDataOff = (short)0x0000;
		
		while (index < dol.length) {
			tag = Util.makeShort((dol[index] & (byte)0x1F) == (byte)0x1F ? dol[index++] : (byte)0x00, dol[index]);
		
			for(short index2=0;index2<(short)acOffsetArray.length;index2++){
				if(tag==ACTags[index2]){
					acOffsetArray[index2]=DOLRelatedDataOff;
					indexOfACElementList++;
					//addDebugLog(ACOffsetsOfCDOL1,(short)0,(short)ACOffsetsOfCDOL1.length);
					break;		
				}				
			}	
			
		    index += (short) 0x0001;
		    DOLRelatedDataOff += (short)((short)dol[index] & (short)0x00FF);
		    index += (short) 0x0001;
			
            if(indexOfACElementList==(short)ACTags.length){
				break;
			}
		}
	} 
	
	/**
	 * Decrypt and verify DES Keys and save it into internal DES Key array 
	 * 
	 * @param src
	 * @param srcOff
	 * @param apdu
	 */
	private void dealWithDESKeys(byte[] src, short srcOff, APDU apdu) {
		short index;

		if (numOfDESKeys == (byte) 0x00) {
			ISOException.throwIt(Constants.SW_UDK_FAILED_CHECK);
		}

		Util.setShort(src, (short) 0x0046, (short) 0x8110); //for decrypt and verify by securedomain
		src[(short) 0x0058] = (short) 0x0003;
		index = Constants.OFF_PERSO_DGI_DATA;

		if (numOfDESKeys > (byte) 0x00) {
			if (!saveKey(apdu, src, index, (short) (index + (short) 0x0030), Constants.DESKEY_UDK)) {
				if (numOfKCVs > (byte) 0x00) {
					ISOException.throwIt(Constants.SW_UDK_FAILED_CHECK);
				}
			}
		}

		if (numOfDESKeys > (byte) 0x01) {
			if (!saveKey(apdu, src, (short) (index + (short) 0x0010), (short) (index + (short) 0x0033), Constants.DESKEY_MAC)
				&& numOfKCVs > (byte) 0x01) {
				ISOException.throwIt(Constants.SW_MAC_UDK_FAILED_CHECK);
			}
			if (!saveKey(apdu, src, (short) (index + (short) 0x0020), (short) (index + (short) 0x0036), Constants.DESKEY_ENC)
				&& numOfKCVs > (byte) 0x01) {
				ISOException.throwIt(Constants.SW_ENC_UDK_FAILED_CHECK);
			}
			
			//Store 8 right most digit of ENC-UDK for later use(PIN Change/Unblock)
			Util.arrayCopyNonAtomic(src, (short) 0x004C, rmENC, (short) 0, (short) 0x0004);
		}
		numOfKCVs = (byte) 0xFF;
		return;
	}
	
	/**
	 * Decrypt and verify DES Key and save it into internal DES Key array 
	 * 
	 * @param apdu
	 * @param src
	 * @param keyOff
	 * @param kcvOff
	 * @param keyIndex
	 * @return
	 */
	private boolean saveKey(APDU apdu, byte[] src, short keyOff, short kcvOff, byte keyIndex) {
		boolean isDecryptVerifySuccess =false;

		Util.arrayCopyNonAtomic(src, keyOff, src, (short) 0x0048, (short) 0x0010);
		Util.arrayCopyNonAtomic(src, kcvOff, src, (short) 0x0059, (short) 0x0003);
		// 
		//isDecryptVerifySuccess =gpSecureChannel.
		isDecryptVerifySuccess = EMVUtil.decryptVerifyKey(apdu, (short) 0x0046);
		JCSystem.beginTransaction();
		keys[keyIndex].setKey(src, (short) 0x0048);
		JCSystem.commitTransaction();

		return isDecryptVerifySuccess;
	}
	
	/**
	 * Check and reform the format of PIN block data.
	 * and set PIN data from reformed PIN block data.
	 * 
	 * @param src
	 * @param srcOff
	 */
	private void dealWithPIN(byte[] src, short srcOff) {

		EMVUtil.checkPinBlock(src, srcOff);
		setPin(src, (short) (srcOff + (short) 0x0009), srcOff);
		Util.arrayCopy(src, srcOff, pinBlock, (short) 0, (short) 8); //store pin data for later use
		return;
	}
	
	/**
	 * Create RSA key and set modulus or exponent of this RSA key according to type parameter
	 * 
	 * @param src 
	 * @param type Modulus(0x03),Exponent(0x01)
	 * @param lenOff offset of length field in source array
	 */
	private void putKeyRSA(byte[] src, byte type, short lenOff) {
		if (iccPrivateKey == null) {
			nIC = EMVUtil.getUByte(src, lenOff); //nIC is Length of ICC public key modulus

			if ((short) (nIC % (short) 0x0004) != (short) 0x0000 || nIC < (short) 0x0040 || nIC >= (short) 0x00F8) {
				ISOException.throwIt(ISO7816.SW_WRONG_DATA);
			}
			try {
				iccPrivateKey = (RSAPrivateKey) KeyBuilder.buildKey(KeyBuilder.TYPE_RSA_PRIVATE, (short) (nIC * (short) 0x0008), false);
			} catch (CardRuntimeException e) {
				ISOException.throwIt(ISO7816.SW_WRONG_DATA);
			}
			if(rsaCipher==null){
				rsaCipher = Cipher.getInstance(Cipher.ALG_RSA_NOPAD, false);
			}
			if(shaDigest==null){
				shaDigest = MessageDigest.getInstance(MessageDigest.ALG_SHA, false);
			}
		}

		if (type == (byte) 0x03) { //set modulus
			iccPrivateKey.setModulus(src, (short) (lenOff + (short) 0x0001), nIC);
		} else {
			if (type == (byte) 0x01) { //set exponent
				iccPrivateKey.setExponent(src, (short) (lenOff + (short) 0x0001), nIC);
			}
		}
	}
	/**
	 * Create RSA key and set modulus or exponent of this RSA key according to type parameter
	 * 
	 * @param src 
	 * @param type Modulus(0x03),Exponent(0x01)
	 * @param lenOff offset of length field in source array
	 */
	private void putKeyCrtRSA(byte[] src, byte type, short lenOff) {
		short len_param=EMVUtil.getUByte(src, lenOff);
		if (iccPrivateCrtKey == null) {
			
			nIC = (short)(len_param*2); //nIC is Length of ICC public key modulus

			if ((short) (nIC % (short) 0x0004) != (short) 0x0000 || nIC < (short) 0x0040 || nIC >(short) 0x00F8) {
				ISOException.throwIt(ISO7816.SW_WRONG_DATA);
			}
			try {
				iccPrivateCrtKey = (RSAPrivateCrtKey) KeyBuilder.buildKey(KeyBuilder.TYPE_RSA_CRT_PRIVATE, (short) (nIC * (short) 0x0008), false);
				data_Flags[OFF_IS_CRT_RSA_ISSUED] = Constants.TRUE;
			
			} catch (CardRuntimeException e) {
				ISOException.throwIt(ISO7816.SW_WRONG_DATA);
			}
			
			if(rsaCipher==null){
				rsaCipher = Cipher.getInstance(Cipher.ALG_RSA_NOPAD, false);
			}
			if(shaDigest==null){
				shaDigest = MessageDigest.getInstance(MessageDigest.ALG_SHA, false);
			}
		}		
		
		switch(type){
			case (byte) 0x01:			
				iccPrivateCrtKey.setPQ(src, (short) (lenOff + (short) 0x0001), len_param);
				break;
			case (byte) 0x02:
				iccPrivateCrtKey.setDQ1(src, (short) (lenOff + (short) 0x0001), len_param);
				break;
			case (byte) 0x03:
				iccPrivateCrtKey.setDP1(src, (short) (lenOff + (short) 0x0001), len_param);
				break;
			case (byte) 0x04:
				iccPrivateCrtKey.setQ(src, (short) (lenOff + (short) 0x0001), len_param);
				break;
			case (byte) 0x05:
				iccPrivateCrtKey.setP(src, (short) (lenOff + (short) 0x0001), len_param);
				//rsaCipher.init(iccPrivateCrtKey, Cipher.MODE_ENCRYPT);
				break;
			}
	}
	
	
	/**
	 * Create Log File
	 *
	 */
	private void createLogFile() {
		if ((logFile == null) && (transLogEntry != null) && (lfRecordSize != (short) 0x0000)) {
			logFile = new byte[(short) (transLogEntry[1] * lfRecordSize)];
			lfRecordsUsed = (byte) 0x00;
			lfCurrentRecord = (byte) 0xFF;
		}
		return;
	}
	
	/**
	 * Create EC put data Log File
	 *
	 */
	private void createLogFileEC() {
		if ((logFileEC == null) && (transLogEntryEC != null) && (lfRecordSizeEC != (short) 0x0000)) {
			logFileEC = new byte[(short) (transLogEntryEC[1] * lfRecordSizeEC)];
			if(dtr_ECLog==null){
				dtr_ECLog = JCSystem.makeTransientByteArray(lfRecordSizeEC, JCSystem.CLEAR_ON_DESELECT);
			}
			lfRecordsUsedEC = (byte) 0x00;
			lfCurrentRecordEC = (byte) 0xFF;
		}
		return;
	}
	
	/**
	 * Create Files according to AFL
	 * 
	 * @param src
	 * @param srcOff
	 * @param len
	 */
	private void createAFLFiles(byte[] src, short srcOff, short len) {
		if ((len % 4) != 0) { //Length of one AFL is 4 bytes
			ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		}
		if((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F)==(byte)0x01){
			aflList = new byte[len];
			Util.arrayCopyNonAtomic(src, srcOff, aflList, (short) 0x0000, len);
			
		}else if((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F)==(byte)0x02) {		
			aflListEC = new byte[len];					
			Util.arrayCopyNonAtomic(src, srcOff, aflListEC, (short) 0x0000, len);
		}else if((short)(dtr_Satus[OFF_CP_TYPE_PEROSO_DGI]&0x0F)==(byte)0x08) {		
			aflListCL = new byte[len];					
			Util.arrayCopyNonAtomic(src, srcOff, aflListCL, (short) 0x0000, len);
			
		}
		return;
	}
	
	
	
	
	private void EMV_Select(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		short sOffset = (short) 0x0028; // 40
		short sLength, sLastOffset;
		byte CardContentState;
		AID currAID;
		byte[] fci_idd;
		
		if(apduBuffer[ISO7816.OFFSET_CLA] != (byte)0x00)
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);

		if(apduBuffer[ISO7816.OFFSET_P1] != (byte)0x04
			|| (byte)(apduBuffer[ISO7816.OFFSET_P2] & (byte)0xFD) != (byte)0x00)
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);

		if((short)apduBuffer[ISO7816.OFFSET_LC] < (short)0x05 
			|| (short)apduBuffer[ISO7816.OFFSET_LC] > (short)0x10)
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		//2013.07.15 if cla p1 and lc is not error and data field is not applet AID then return error.
		if(!selectingApplet()){
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		 
		
		
		recoveryData();
		//Making FCI Tempalte data from last to first
		apdu.setIncomingAndReceive();
		//If personalized
		if (bLifePhase != Constants.PERSONALISATION_PHASE) {
			sOffset = EMVUtil.copyTLV(AppLabel, apduBuffer, (short) 0x0027, (short) 0x0050);
			if (API != (byte) 0x10) {
				sOffset = Util.setShort(apduBuffer, sOffset, (short) 0x8701); // 0x87 is Tag of API, length is 1
				apduBuffer[sOffset] = API;
				sOffset += (short) 0x0001;
			}
			if(dtr_Flags[OFF_IS_CONTACTLESS]== Constants.TRUE&&ContactlessPDOL!=null){
				fci_idd = FCI_IDD_CL;
				sOffset = EMVUtil.copyTLV(ContactlessPDOL, apduBuffer, sOffset, (short) 0x9F38);
			}else{
				fci_idd = FCI_IDD;
				sOffset =EMVUtil. copyTLV(PDOL, apduBuffer, sOffset, (short) 0x9F38);
			}
				sOffset = EMVUtil.copyTLV(LangPref, apduBuffer, sOffset, (short) 0x5F2D);
			if (ICTI != (byte) 0xFF) {
				//0x9F11 is Tag of ICTI, length is 1
				sOffset = Util.setShort(apduBuffer, Util.setShort(apduBuffer, sOffset, (short) 0x9F11), Util.makeShort((byte) 0x01, ICTI));
			}
			sOffset = EMVUtil.copyTLV(AppPrefName, apduBuffer, sOffset, (short) 0x9F12);
			sOffset = EMVUtil.copyTLV(fci_idd , apduBuffer, sOffset, (short) 0xBF0C);
			
			// FCI나머지 부분을 구성하는 코드가 있었음.
			// PBOC에 없는 데이터를 구성하는 부분이므로 코드의 끝에 옮겨 주석처리 하였음.
			// dwkang - 2008.3.31
		}

		//FCI proprietary Templete - 0xA5
		sLength = (short) (sOffset - (byte) 0x28);
		sLastOffset = sOffset;
		sOffset = (byte) 0x27;
		apduBuffer[sOffset] = (byte) sLength;
		sOffset = (short) (sOffset - (short) 0x0001);
		if (sLength > (byte) 0x7F) { //length가 7F보다 크면 81을 붙임
			apduBuffer[sOffset] = (byte) 0x81;
			sOffset = (short) (sOffset - (short) 0x0001);
		}
		apduBuffer[sOffset] = (byte) 0xA5;

		//DF Name - 0x84
		currAID = JCSystem.getAID();
		sLength = currAID.getBytes(apduBuffer, (short) 0x0000);
		sOffset = (short) (sOffset - sLength - (short) 0x0002);
		Util.arrayCopyNonAtomic(
			apduBuffer,
			(short) 0x0000,
			apduBuffer,
			Util.setShort(apduBuffer, sOffset, Util.makeShort((byte) 0x84, (byte) sLength)),
			sLength);

		//FCI Template - 0x6F
		sLength = (short) (sLastOffset - sOffset);
		sOffset -= (short) 0x0001;
		apduBuffer[sOffset] = (byte) sLength;
		if (sLength > (byte) 0x7F) { //length가 7F보다 크면 81을 붙임
			sOffset -= (short) 0x0001;
			apduBuffer[sOffset] = (byte) 0x81;
		}
		sOffset -= (short) 0x0001;
		apduBuffer[sOffset] = (byte) 0x6F; // FCI templete

		// Get response를 applet에서 구현하고 setOutgoingAndSend를 호출하지 않음.
		//apdu.setOutgoingAndSend(sOffset, (short) (sLastOffset - sOffset));
		
		// 기존 코드에서는 FCI를 구성하여 FCI를 dtr_SrcTempBuffer에 벡업하였으나, FCI의 길이가 dtr_SrcTempBuffer의 크기를 넘어가는 경우
		// 비정상 처리 되므로 이 부분을 제거함. get_response()에서 FCI를 다시 구성하는 것으로 대체.

		Util.arrayCopyNonAtomic(apduBuffer, sOffset, dtr_SrcTempBuffer, (short)0x02, (short) (sLastOffset - sOffset));
		Util.setShort(dtr_SrcTempBuffer, (short)0x00, (short) (sLastOffset - sOffset));


		//Synchronize app block status
		CardContentState = GPSystem.getCardContentState();
		if ((data_Flags[OFF_IS_APP_BLOCKED] == Constants.TRUE) && (CardContentState != Constants.APPLET_BLOCKED)) {
			
			GPSystem.setCardContentState(Constants.APPLET_BLOCKED);
		} else {
			if ((data_Flags[OFF_IS_APP_BLOCKED] == Constants.FALSE) && (CardContentState == Constants.APPLET_BLOCKED)) {
				GPSystem.setCardContentState(Constants.APPLET_BLOCKED);
			}
		}
		
		if(dtr_Flags[OFF_IS_CONTACTLESS]==Constants.TRUE||APDU.getProtocol() == APDU.PROTOCOL_T1){
			apdu.setOutgoingAndSend(sOffset, (short) (sLastOffset - sOffset));
			if ( GPSystem.getCardContentState() == Constants.APPLET_BLOCKED) {
				ISOException.throwIt(Constants.SW_PBOC_SELECTED_FILE_INVALIDATED);
				return;
			}
		}else{
			
			
			dtr_Flags[OFF_IS_EXPECT_GET_RESPONSE] = Constants.TRUE;
			
			if ( GPSystem.getCardContentState() == Constants.APPLET_BLOCKED) {
				ISOException.throwIt(Constants.SW_PBOC_SELECTED_FILE_INVALIDATED);
				return;
			} else {			
			
				ISOException.throwIt((short)(0x6100 + (short) (sLastOffset - sOffset)));
				
			}
		}
		
	}
	
	private void getResponse(APDU apdu)
	{
	    byte[] apduBuffer = apdu.getBuffer();
		// FCI 구성후 총 길이를 totLen에 대입
		short totLen, sLength, sLastOffset;
		short sOffset = (short) 0x0028; // 40
		short Le = (short)((short)apduBuffer[ISO7816.OFFSET_LC] & 0x00FF);
		AID currAID;

		if(dtr_Flags[OFF_IS_EXPECT_GET_RESPONSE] == Constants.FALSE)
			ISOException.throwIt(ISO7816.SW_INS_NOT_SUPPORTED);
	
		dtr_Flags[OFF_IS_EXPECT_GET_RESPONSE] = Constants.FALSE;
	
		if(apduBuffer[ISO7816.OFFSET_CLA] != (byte)0x00)
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
	
		if(apduBuffer[ISO7816.OFFSET_P1] != (byte)0x00 || apduBuffer[ISO7816.OFFSET_P2] != (byte)0x00)
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
			
		// FCI 구성
		//If personalized
		if (bLifePhase != Constants.PERSONALISATION_PHASE) {
			sOffset = EMVUtil.copyTLV(AppLabel, apduBuffer, (short) 0x0027, (short) 0x0050);
			if (API != (byte) 0x10) {
				sOffset = Util.setShort(apduBuffer, sOffset, (short) 0x8701); // 0x87 is Tag of API, length is 1
				apduBuffer[sOffset] = API;
				sOffset += (short) 0x0001;
			}
			sOffset = EMVUtil.copyTLV(PDOL, apduBuffer, sOffset, (short) 0x9F38);
			sOffset = EMVUtil.copyTLV(LangPref, apduBuffer, sOffset, (short) 0x5F2D);
			if (ICTI != (byte) 0xFF) {
				//0x9F11 is Tag of ICTI, length is 1
				sOffset = Util.setShort(apduBuffer, Util.setShort(apduBuffer, sOffset, (short) 0x9F11), Util.makeShort((byte) 0x01, ICTI));
			}
			sOffset = EMVUtil.copyTLV(AppPrefName, apduBuffer, sOffset, (short) 0x9F12);
			sOffset = EMVUtil.copyTLV(FCI_IDD, apduBuffer, sOffset, (short) 0xBF0C);
		
			// FCI나머지 부분을 구성하는 코드가 있었음.
			// PBOC에 없는 데이터를 구성하는 부분이므로 코드의 끝에 옮겨 주석처리 하였음.
			// dwkang - 2008.3.31
		}

		//FCI proprietary Templete - 0xA5
		sLength = (short) (sOffset - (byte) 0x28);
		sLastOffset = sOffset;
		sOffset = (byte) 0x27;
		apduBuffer[sOffset] = (byte) sLength;
		sOffset = (short) (sOffset - (short) 0x0001);
		if (sLength > (byte) 0x7F) { //length가 7F보다 크면 81을 붙임
			apduBuffer[sOffset] = (byte) 0x81;
			sOffset = (short) (sOffset - (short) 0x0001);
		}
		apduBuffer[sOffset] = (byte) 0xA5;

		//DF Name - 0x84
		currAID = JCSystem.getAID();
		sLength = currAID.getBytes(apduBuffer, (short) 0x0000);
		sOffset = (short) (sOffset - sLength - (short) 0x0002);
		Util.arrayCopyNonAtomic(
			apduBuffer,
			(short) 0x0000,
			apduBuffer,
			Util.setShort(apduBuffer, sOffset, Util.makeShort((byte) 0x84, (byte) sLength)),
			sLength);

		//FCI Template - 0x6F
		sLength = (short) (sLastOffset - sOffset);
		sOffset -= (short) 0x0001;
		apduBuffer[sOffset] = (byte) sLength;
		if (sLength > (byte) 0x7F) { //length가 7F보다 크면 81을 붙임
			sOffset -= (short) 0x0001;
			apduBuffer[sOffset] = (byte) 0x81;
		}
		sOffset -= (short) 0x0001;
		apduBuffer[sOffset] = (byte) 0x6F; // FCI templete
		totLen = (short) (sLastOffset - sOffset);

		if(Le != totLen) {	
			if (Le == (short)0x0000) {
				//Le가 0x00인 경우 Le가 수정된 Get Response command를 허용한다. 
				dtr_Flags[OFF_IS_EXPECT_GET_RESPONSE] = Constants.TRUE;
				ISOException.throwIt((short)(0x6C00 + totLen));
			
			}
			else if (Le < totLen) {
				dtr_Flags[OFF_IS_EXPECT_GET_RESPONSE] =Constants.FALSE;
				apdu.setOutgoingAndSend(sOffset, Le);
				ISOException.throwIt((short)(0x6100 + (short)(totLen - Le)));
			}
			else {
				ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
			}
		}
		
		apdu.setOutgoingAndSend(sOffset, totLen);
	}

	private void EMV_GetData(APDU apdu){
		byte[] apduBuffer = apdu.getBuffer();
		short  sP1P2,valueLen;
		
		checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00);
	

		sP1P2 = Util.getShort(apduBuffer, ISO7816.OFFSET_P1);
		
		//Get CPLC
	    if (sP1P2 == (short) 0x9F7F) {
			apduBuffer[ISO7816.OFFSET_LC] = (short) 0x002A;
			//OPSystem.getCPLCData(apdu, ISO7816.OFFSET_CDATA, (short) 0x0000, (short) 0x002A);
			apdu.setOutgoingAndSend(ISO7816.OFFSET_P1, (short) 0x002D);
			return;
		}
		//PIN Try Counter
		
		if (sP1P2 == (short) 0x9F17) {
			if (checkPINTryLimitExceeded())
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD;
		}

		//Get value specified by tag into apduBuffer
		valueLen = getTagValue(sP1P2, apduBuffer, ISO7816.OFFSET_CDATA);
		if(data_Flags[OFF_IS_AOSL_SHOWED] == Constants.FALSE&&sP1P2==(short)0x9F5D){
			ISOException.throwIt(ISO7816.SW_DATA_INVALID);
		}
		
		if (valueLen == (short) 0xFFFF) { //Check whether personalized
			ISOException.throwIt(ISO7816.SW_DATA_INVALID);
		}

		//Send data
		apduBuffer[ISO7816.OFFSET_LC] = (byte) valueLen;
		apdu.setOutgoingAndSend(ISO7816.OFFSET_P1, (short) (valueLen + (short) 0x0003));
	}
	
	private void EMV_GetProcessingOptions(APDU apdu){
		short tempAflNumber;
		byte[] apduBuffer;		
		short offsetPDOL;
		short tcc=0;
		boolean isPBOCSupported=true;
		boolean isQPBOCSupported=true;
		byte ECI = 0;
		dtr_Flags[OFF_IS_SENCOND_CURRENCY]= Constants.FALSE;
		apduBuffer=apdu.getBuffer();
	
		
		apduBuffer = EMVUtil.checkIncoming(apdu, (byte) (EMVUtil.CHECK_CLA | EMVUtil.CHECK_RECEIVE | EMVUtil.CHECK_P1 | EMVUtil.CHECK_P2), (byte)0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		
		// check Lc, PDOL releated data는 tag 83이 앞에 오므로 2를 더해줌.
		// EMV spec에서 tag 83에 대해 BER-TLV구조라는 언급이 없으므로 단순히 2를 더해 줌.
		// 만약 tag 83이 BER-TLV구조이면 DOL releated data length가 80이상일 때 처리가 필요함.
		
		if(dtr_Flags[OFF_IS_CONTACTLESS]== Constants.TRUE&&ContactlessPDOL!=null){
			//addDebugLog(ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
			
			if (apduBuffer[ISO7816.OFFSET_LC] != (byte)(DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOLCL] + 0x0002)||
			    apduBuffer[(short)ISO7816.OFFSET_LC+2] != (byte)DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOLCL]) {
				ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
			}
		}else{
			if (apduBuffer[ISO7816.OFFSET_LC] != (byte)(DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOL] + 0x0002)||
			    apduBuffer[(short)ISO7816.OFFSET_LC+2] != (byte)DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_PDOL]	) {
				ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
			}
		}
		if (apduBuffer[ISO7816.OFFSET_CDATA] != (byte) 0x83) {
			ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		}
		
		if ((short) (dataS_ATC + (short) 0x0001) == (short) 0xFFFF) {
			GPSystem.setCardContentState(Constants.APPLET_BLOCKED);
			//appblocked = true;
			data_Flags[OFF_IS_APP_BLOCKED] = Constants.TRUE;
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
		
		
		if(dtr_Flags[OFF_IS_CONTACTLESS]== Constants.TRUE&&ContactlessPDOL!=null&&LengthArrayForPDOL_CL!=null){
			isPBOCSupported =isPBOCTrasnsaction(apdu);
		}
		
		if(isPBOCSupported){
			dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x03;
			dtr_Flags[OFF_IS_EC_TRASACTION]=Constants.FALSE;
			
			/*if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
								Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)50);
								currentLogNum++;*/
								
			//EC indicator
			byte[] tempPDOL=PDOL;
			
			if(dtr_Flags[OFF_IS_CONTACTLESS]==Constants.TRUE&&ContactlessPDOL!=null){
				tempPDOL=ContactlessPDOL;
			}
			 if(tempPDOL!=null){
				 offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F7A,tempPDOL,(short)0,(short)tempPDOL.length);
				 if(offsetPDOL!=(short)0xFFFF){
					 ECI=apduBuffer[(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL)];
				 }
				 //apduBuffer[0]=ECI;
				 //TCC 
				 offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x5F2A,tempPDOL,(short)0,(short)tempPDOL.length);
				 if(offsetPDOL!=(short)0xFFFF){
					 Util.arrayCopy(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL), TCC, (short)0x00, (short)0x02);
					 tcc = Util.getShort(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL));
				 }
				 //Util.arrayCopy(TCC,(short)0,apduBuffer,(short)1,(short)2);
				 //ECAC
				 offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F02,tempPDOL,(short)0,(short)tempPDOL.length);
				 if(offsetPDOL!=(short)0xFFFF){
					 //ECAC= PBOC.setData(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL), ECAC, (short) 0x000C, true);
					 EMVUtil.expandBCD(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL), (short) 6, ECAC);
				 }
				 //Util.arrayCopy(ECAC,(short)0,apduBuffer,(short)3,(short)12);
		           
					//Transaction Log 기록을 위해 상호이름(9F4E)저장
				 offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F4E,tempPDOL,(short)0,(short)tempPDOL.length);
				 if(offsetPDOL!=(short)0xFFFF){
					Util.arrayCopy(apduBuffer, (short)(ISO7816.OFFSET_CDATA +2+ offsetPDOL), MN, (short)0x00, (short)0x14);
				 }
			}
			//Is domestic or international?
			//isDomestic = (Util.arrayCompare(ICC, (short) 0x0000, apduBuffer, (short) 0x07, (short) 0x0002) == (byte) 0x00 ? true : false);
			//		PBOC에서는 GI가 사용되지 않는다.
			//		//Condition check, domestic and cdata length
			//		if ((isDomestic && ((GI & (byte) 0x80) != (byte) 0x80))
			//			|| (!isDomestic && (byte) (GI & (byte) 0x40) != (byte) 0x40)
			//			|| (apduBuffer[6] != (byte) (apduBuffer[ISO7816.OFFSET_LC] - (byte) 0x02))) {
			//			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			//		}		
			JCSystem.beginTransaction();
			dataS_ATC = (short) (dataS_ATC + (short) 0x0001);
			// GPO 전원 차단 테스트에서 커맨드 전송 후 1ms단위로 증가시키며 전원을 차단하다가 GPO가 완료될 수 있을만큼의 시간이 주어진 후 
			// GPO를 카드에 전송했을 때 카드가 응답이 없다.
			// ATC는 정상적으로 증가되는 것으로 봐서 ATC 증가 후 EEPROM에 접근하는 코드에서 문제가 발생한 것으로 생각된다.
			// 그래서 commitTranasction()의 위치를 GPO 치리 method중 EEPROM에 접근하는 마지막 코드 다음으로 옮겼다.
			// -- dwkang 2008.5.9
			//JCSystem.commitTransaction();
			dtr_Flags[OFF_IS_ALLOWED_SCRIPT_PROCRSSING] = Constants.FALSE;
 			//allowScriptProcessing = false;
			dtr_Satus[OFF_CID] = (byte) 0x00;
			// GPO 전원 차단테스트에서 전원 차단 후 GPO의 응답이 오지 않는 문제가 있었다.
			// 원인은 Util.arrayFillNonAtomic가 transaction내에 포함되지 않기 때문인데, 
			// 이 메서드는 atomic 버전이 없으므로 Util.arrayCopy로 0x00을 복사하도록 수정했다.
			// -- dwkang 2008.5.13
			//Util.arrayFillNonAtomic(IAD, CVR_BYTE_2, (short) 0x0003, (byte) 0x00);
			Util.arrayCopy(Constants.ZERO, (short)0x0000, IAD, Constants.CVR_BYTE_2, (short)0x0003);
			dtr_Flags[OFF_IS_VERIFY_RECEIVED]= Constants.FALSE;
	
			if (hashBuffer != null) {
				Util.arrayCopy(apduBuffer, (short) 0x0007, hashBuffer, (short) 0x0000, (short) (apduBuffer[ISO7816.OFFSET_LC] - (short) 0x0002));
				hashBufferPtr = (short) ((apduBuffer[ISO7816.OFFSET_LC] - (short) 0x0002));
			}
	         
			
			if(ECI==(byte)1){
				if(tcc == Util.getShort(dataA_ACC,(short)0)){
					if(EMVUtil.compareBCD(ECAC,ECB)>=0){
						if(EMVUtil.compareBCD(ECAC,ECBSTL)>=0){
							if(data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]!= Constants.TRUE){
								if((Issuer_Script_Indicator_byte & (byte) 0x08) == (byte) 0x00){
									if(Pin==null||(Pin!=null&&Pin.getTriesRemaining()!=(short)0)){
										dtr_Flags[OFF_IS_EC_TRASACTION]=Constants.TRUE;
									}							
								}
							}
						}
					}
				}
				//-cyf 2012.04.03 secondory currency 
				if(data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]==Constants.TRUE){
					if(tcc == Util.getShort(dataA_ECSACC,(short)0)){
						dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]= Constants.TRUE;
						if(EMVUtil.compareBCD(ECAC,ECSAB)>=0){
							if(EMVUtil.compareBCD(ECAC,ECSABSTL)>=0){
								if(data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]!= Constants.TRUE){
									if((Issuer_Script_Indicator_byte & (byte) 0x08) == (byte) 0x00){
										if(Pin==null||(Pin!=null&&Pin.getTriesRemaining()!=(short)0)){
											dtr_Flags[OFF_IS_EC_TRASACTION]=Constants.TRUE;
											dtr_Flags[OFF_IS_SENCOND_CURRENCY]=Constants.TRUE;
										}								
									}
								}
							}
						}
					}
				}
				
				
			}else{
				if(data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]==Constants.TRUE){
					if(tcc == Util.getShort(dataA_ECSACC,(short)0)){
						dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]= Constants.TRUE;
					}
				}
			}
			//make response data : 80 || length || AIP(2bytes) || AFL
			apduBuffer[0] = (byte) 0x80;
			if(dtr_Flags[OFF_IS_EC_TRASACTION]==Constants.TRUE){
				tempAflNumber = AFLListLenEC;
				Util.arrayCopy(aflListEC, (short) 0x0000, apduBuffer, Util.setShort(apduBuffer, (short) 0x0002, AIP_EC), tempAflNumber);
				apduBuffer[1] = (byte) ((short) 0x0002 + tempAflNumber);
			}else{
				tempAflNumber = AFLListLen;
				Util.arrayCopy(aflList, (short) 0x0000, apduBuffer, Util.setShort(apduBuffer, (short) 0x0002, AIP), tempAflNumber);
				apduBuffer[1] = (byte) ((short) 0x0002 + tempAflNumber);
			}
		
			dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x01;
			JCSystem.commitTransaction();
			//if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
			//Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)200);
			//currentLogNum++;
			
			apdu.setOutgoingAndSend((short) 0x0000, (short) ((short) 0x0004 + tempAflNumber));
		}else{
			dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x10;
			qPBOCPath(apdu);
		}
	}
	
	
	
	private void EMV_ReadRecord(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		short sP1P2 = Util.getShort(apduBuffer, ISO7816.OFFSET_P1);
		
		checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		EMVUtil.checkP2((byte) sP1P2);
		if ((transLogEntry != null) //If sfi means log file, then read log file
			&& (byte) ((apduBuffer[ISO7816.OFFSET_P2] & (short) 0x00FF) >> (short) 0x0003) == transLogEntry[(short) 0x0000]) {
			readLogRecord(apdu);
		} else if((transLogEntryEC != null) //If sfi means log file, then read log file
			&& (byte) ((apduBuffer[ISO7816.OFFSET_P2] & (short) 0x00FF) >> (short) 0x0003) == transLogEntryEC[(short) 0x0000]) {
			readLogRecordEC(apdu);
		} else if((byte) ((apduBuffer[ISO7816.OFFSET_P2] & (short) 0x00FF) >> (short) 0x0003) >(byte)0x15) { //normal files
			readCAPPLog(apdu);
		}else{ //normal files
			readRecord(apdu);
		}
		
	}
	
	/**
	 * Read record from file
	 * 
	 * @param apdu
	 */
	private void readRecord(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		byte[] readBuffer;
		
    	short len_reading = 0;
    	byte index=(byte) ((apduBuffer[ISO7816.OFFSET_P2] & ((short) 0x00FF)) >> (byte) 0x03);
	/*	if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
						Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00, (short) 50);
						currentLogNum++;*/
		if(apduBuffer[ISO7816.OFFSET_P1]==(byte)0){
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		
		readBuffer = getFileRecord(apduBuffer[ISO7816.OFFSET_P2], apduBuffer[ISO7816.OFFSET_P1]);
		
		if(isECSavedInrecord){
			index--;
			if(index==EC_Info_ForRecord[OFFSET_EC_INFO_INDEX]&&apduBuffer[ISO7816.OFFSET_P1]==EC_Info_ForRecord[OFFSET_EC_INFO_RECORD_NUM]){
				short offset_ECB=Util.getShort(EC_Info_ForRecord,OFFSET_EC_INFO_DATA_OFFSET);
				EMVUtil.retractBCD(ECB,(short)12,dtr_BCDBuffer3,(short)0);
				Util.arrayCopy(dtr_BCDBuffer3,(short)0,readBuffer,(short)offset_ECB,(short)6);
				
			}
			
		}
		
		
	 
		if(dtr_Flags[OFF_IS_FDDA01]==Constants.TRUE||
				(dtr_Satus[OFF_TRANSACTION_SEQUENCE]==(byte)0x03&&data_Flags[OFF_LAST_TRSNS_IS_DDA01]==Constants.TRUE)){
		   len_reading=(short)readBuffer.length;
		   len_reading=readRecordQPBOC(apdu,len_reading);

		   apdu.setOutgoing();
		   apdu.setOutgoingLength(len_reading);
		   apdu.sendBytesLong(readBuffer, (short) 0x0000, len_reading);
		}else{
	
		   
		   len_reading=(short)readBuffer.length;
		   len_reading=readRecordQPBOC(apdu,len_reading);
		   
		   if(record_CardAuthRelatedData!=null&&(sfiRCRD==(byte)((apduBuffer[ISO7816.OFFSET_P2] & ((short) 0x00FF)) >> (byte) 0x03))&&recnumRCRD==apduBuffer[ISO7816.OFFSET_P1]){
			   
			  Util.arrayCopyNonAtomic(readBuffer, (short)0,apduBuffer ,(short) 0, (short)readBuffer.length);
			  //ISOException.throwIt((short)(offset_CardAuthRelatedData+(short)0x9000)); 
			  if((short)(offset_CardAuthRelatedData+len_CardAuthRelatedData)<(short)readBuffer.length){
				  Util.arrayCopyNonAtomic(readBuffer, (short)(offset_CardAuthRelatedData+len_CardAuthRelatedData),apduBuffer ,(short)(offset_CardAuthRelatedData-3), (short)(readBuffer.length-offset_CardAuthRelatedData-len_CardAuthRelatedData));
			  }
			  apdu.setOutgoingAndSend((short)0, (short)(len_reading-len_CardAuthRelatedData-3));
		   }else{
			   apdu.setOutgoing();
			   apdu.setOutgoingLength(len_reading);
			   apdu.sendBytesLong(readBuffer, (short) 0x0000, len_reading);
		   }
		
		}
	
		
  
	   
	}
	

	
	/**
	 * Read log record from log file
	 * 
	 * @param apdu
	 */
	private void readLogRecord(APDU apdu) {
		byte[] apduBuffer;
		short index;
		byte P1; 

		if (logFile == null) {
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}

		apduBuffer = apdu.getBuffer();
		P1 = apduBuffer[ISO7816.OFFSET_P1];

		if ((P1 < (short) 0x0001) || (P1 > lfRecordsUsed)) {
			ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
		}

		index = (short) ((short) lfCurrentRecord - ((short)(P1&0x00FF) - (short)0x0001));
		if (index < 0) {
			index = (short) (index + transLogEntry[1]);
		}
		index = (short) (index * lfRecordSize);
		Util.arrayCopyNonAtomic(logFile, index, apduBuffer, (short) 0x0000, lfRecordSize);
		apdu.setOutgoingAndSend((short) 0x0000, lfRecordSize);
	}
	
	/**
	 * Read log record from log file
	 * 
	 * @param apdu
	 */
	private void readLogRecordEC(APDU apdu) {
		byte[] apduBuffer;
		short index;
		byte P1; 
		short sOffset = 0;
		short dOffset = 3;
		short counter = (short)10;
		
		if (logFileEC == null) {
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		apduBuffer = apdu.getBuffer();
		P1 = apduBuffer[ISO7816.OFFSET_P1];

		//if ((P1 < (short) 0x0001) || (P1 > lfRecordsUsedEC)) { nb\
		if (P1 > lfRecordsUsedEC) {
			ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
		}

			//counter = lfRecordsUsedEC;
			Util.setShort(apduBuffer, (short)0, dataS_ATC);
			Util.arrayFillNonAtomic(apduBuffer, (short)2, (short)1, (byte)(lfRecordsUsedEC));
		if(P1 == (byte)0){
			index = lfCurrentRecordEC;
			while(index>=0){
				sOffset = (short) (index*lfRecordSizeEC);
				Util.arrayCopyNonAtomic(logFileEC, (short)sOffset, apduBuffer, dOffset, LEN_DTR_EC_BATCH_LOG);
			    Util.setShort(apduBuffer,(short)(dOffset+LEN_DTR_EC_BATCH_LOG-2), Util.getShort(logFileEC, (short) ((short)(EMVUtil.getDOLRelatedDataOffset((short)0x9F36, LDOL_EC, (short)0,(short)LDOL_EC.length)+(short)0x0E)+sOffset)));
				index--;
				dOffset += LEN_DTR_EC_BATCH_LOG; 
			}
			if(lfRecordsUsedEC ==transLogEntryEC[1]){
				index = (short)(transLogEntryEC[1]-1);
				while(index>lfCurrentRecordEC){
					sOffset = (short) (index*lfRecordSizeEC);
					Util.arrayCopyNonAtomic(logFileEC, (short)sOffset, apduBuffer, dOffset, LEN_DTR_EC_BATCH_LOG);
				    Util.setShort(apduBuffer,(short)(dOffset+LEN_DTR_EC_BATCH_LOG -2), Util.getShort(logFileEC, (short) ((short)(EMVUtil.getDOLRelatedDataOffset((short)0x9F36, LDOL_EC, (short)0,(short)LDOL_EC.length)+(short)0x0E)+sOffset)));
					index--;
					dOffset += LEN_DTR_EC_BATCH_LOG; 
				}	
			}
			if(lfRecordsUsedEC >(short)10 ){
				sOffset = (short)(LEN_DTR_EC_BATCH_LOG*READ_EC_LOG_MAX+LEN_DTR_EC_BATCH_HEAD);
			}
			performVisMAC(getSessionKey(keys[Constants.DESKEY_MAC]), apduBuffer, (short)0, (short)dOffset);
			Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short)0, apduBuffer, (short)dOffset, (short)LEN_DTR_MAC_4BYTE);
			apdu.setOutgoingAndSend((short) 0x0000, (short)(dOffset+LEN_DTR_MAC_4BYTE));
			
			
		}else{
			index = (short) ((short) lfCurrentRecordEC - ((short)(P1&0x00FF) - (short)0x0001));
			if (index < 0) {
				index = (short) (index + transLogEntryEC[1]);
			}
			index = (short) (index * lfRecordSizeEC);
			Util.arrayCopyNonAtomic(logFileEC, index, apduBuffer, (short) 0x0000, lfRecordSizeEC);
			apdu.setOutgoingAndSend((short) 0x0000, lfRecordSizeEC);
		}
	}	
	
	private void EMV_GenerateAC(APDU apdu) {
		byte[] apduBuffer = PBOC.checkIncoming(apdu, (byte) (Constants.CHECK_CLA |Constants. CHECK_RECEIVE | Constants.CHECK_P2), (byte)0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00);
	    
	    
	/*	if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
							Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)100);
							currentLogNum++;*/
		
		boolean isFirstGenAC = true;
		boolean CDARequested;
		short sCDOLOff, hashBufferOffset, CryptoType_index, macOffset, endMacOffset; //, sShort6;
		byte bByte;
		short sOffset;
		boolean isToReturnECBwithPreAuthAmount = false;
		
		sequecorForNoAuth= false;
		//Excute order check
		if (dtr_Satus[OFF_TRANSACTION_SEQUENCE] == (byte) 0x03)
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		
		//check Lc
		if ((dtr_Satus[OFF_TRANSACTION_SEQUENCE] != (byte)0x02 && apduBuffer[ISO7816.OFFSET_LC] != (byte)DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_CDOL1])
			|| (dtr_Satus[OFF_TRANSACTION_SEQUENCE] == (byte)0x02 && apduBuffer[ISO7816.OFFSET_LC] != (byte)DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_CDOL2])) {
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}	
		//CDA Condition check
		CDARequested = (apduBuffer[ISO7816.OFFSET_P1] & (byte) 0x10) == (byte) 0x10 ? true : false;
		if(dtr_Flags[OFF_IS_EC_TRASACTION] == Constants.TRUE){
			if ((CDARequested) && ((AIP_EC &Constants.AIP_CDA_GENAC_SUPP) == (short) 0x0000)) {
				ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);
			}
		}else{
			if ((CDARequested) && ((AIP & Constants.AIP_CDA_GENAC_SUPP) == (short) 0x0000)) {
				ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);
			}
		}
		if ((CDARequested) && (iccPrivateKey == null&&iccPrivateCrtKey == null)) {
			ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);
		}

		//P1 Check
		apduBuffer[ISO7816.OFFSET_P1] &= (byte) 0xC0;
		if (apduBuffer[ISO7816.OFFSET_P1] == (byte) 0xC0) //Cryptogram Type RFU
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);

		IAD[Constants.CVR_BYTE_4] = (byte) (Issuer_Script_Indicator_byte | ((byte) 0x07 & IAD[Constants.CVR_BYTE_4]));
		sCDOLOff = ISO7816.OFFSET_CDATA;
		
		//Transaction Log 기록을 위해 apduBuffer를 벡업한다.
		Util.arrayCopyNonAtomic(apduBuffer, (short)0x00, dtr_SrcTempBuffer, (short)0x00, (short)0x40);
		
		//Do Card Action Analysis
		//Generate AC Command의 data field에서 Transaction Time을 제거한다.
		//apduBuffer[ISO7816.OFFSET_LC] -= (short)0x03;
		if (dtr_Satus[OFF_TRANSACTION_SEQUENCE] == (byte) 0x01) {			
			//Util.arrayCopyNonAtomic(apduBuffer, (short)0x20, apduBuffer, (short)0x1D, (short)0x05);
			if (buildCDOLDataForAC(dtr_SrcTempBuffer, apduBuffer, true) == false) {
				ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			}
			genAC1(apduBuffer);
			// online request or return go to online 
			
		} else {
			isFirstGenAC = false;
			//Util.arrayCopyNonAtomic(apduBuffer, (short)0x22, apduBuffer, (short)0x1F, (short)0x05);
			if (buildCDOLDataForAC(dtr_SrcTempBuffer, apduBuffer, false) == false) {
				ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			}
			genAC2(apduBuffer);
			sCDOLOff += (short) 0x0002;
		
		}
   
		//Write Transaction Log
		if ((logFile != null) && ((dtr_Satus[OFF_CID] & Constants.CID_TC) != (byte) 0x00)) {
			//Transaction Log기록을 위해 벡업된 CDOL releated data를 사용한다.
			//Transaction Log를 기록할 때 CDOL을 파싱하면서 각 element의 길이에 따라 CDOL releated data로 부터
			//데이터를 읽어오므로 발급된 CDOL1, CDOL2와 CDOL releated data가 일치해야 한다.
			createLogRecord(isFirstGenAC, dtr_SrcTempBuffer);
			if(!isFirstGenAC){
				createLogRecordEC(isFirstGenAC,dtr_SrcTempBuffer);
			}
		} 

		//Application Cryptogram Generation
		hashBufferOffset = (short) 0x0000;
		if (hashBuffer != null) {
			/*		Util.arrayCopyNonAtomic(apduBuffer, ISO7816.OFFSET_CDATA, hashBuffer, hashBufferPtr, apduBuffer[ISO7816.OFFSET_LC]);
			hashBufferOffset = (short) (hashBufferPtr + (isFirstGenAC ? (short) 0x0019 : (short) 0x001B));
			hashBufferPtr = (short) (hashBufferPtr + apduBuffer[ISO7816.OFFSET_LC]);*/
			//<~ cyf 2013.02.21  fixed the bug that CDA first Hash Value is wrong because  the apduBuffer is changed after buildCDOLDataForAC
			Util.arrayCopyNonAtomic(dtr_SrcTempBuffer, ISO7816.OFFSET_CDATA, hashBuffer, hashBufferPtr, dtr_SrcTempBuffer[ISO7816.OFFSET_LC]);
			
			//the offset of 9F37
			hashBufferOffset = (short) (hashBufferPtr + (isFirstGenAC ? ACOffsetsOfCDOL1[7] : ACOffsetsOfCDOL2[7]));
			hashBufferPtr = (short) (hashBufferPtr + apduBuffer[ISO7816.OFFSET_LC]);
			// cyf 2013.02.21~> 
		}

		if ((!CDARequested) || (dtr_Satus[OFF_CID] & (byte) 0xC0) == Constants.CID_AAC) { //Request AAC, Response Format 1
			CryptoType_index = (short) 0x0001;
			macOffset = (short) 0x0005;
			endMacOffset = (short) 0x000D;
			//	sShort6 = (short) 0x0016;
		} else { //Request TC or ARQC, Response Format 2
			CryptoType_index = (short) 0x0002;
			macOffset = (short) 0x0018;
			endMacOffset = (short) (nIC + (short) 0x0010);
			//sShort6 = (short) (nIC + (short) 0x001C);
			IAD[Constants.CVR_BYTE_4] |= Constants.CVR_B4_DDA_PERF;
		}
 
		//Set AIP, ATC, CVR at the end of CDOL Data in apdu buffer
		if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.TRUE){
			
			IAD[Constants.CVR_BYTE_4]=(byte)(IAD[Constants.CVR_BYTE_4]&0x0F);
			if(isFirstGenAC){				
			    IAD[Constants.CVR_BYTE_3]=(byte)(IAD[Constants.CVR_BYTE_3]&0x43);
			}
			Util.arrayCopyNonAtomic(
					IAD,
					Constants.CVR_BYTE_1,
					apduBuffer,
					Util.setShort(apduBuffer, Util.setShort(apduBuffer, (short) (sCDOLOff + (short) 0x001D), AIP_EC), dataS_ATC),
					(short) 0x0004);
		}else{
			
			
			Util.arrayCopyNonAtomic(
				IAD,
				Constants.CVR_BYTE_1,
				apduBuffer,
				Util.setShort(apduBuffer, Util.setShort(apduBuffer, (short) (sCDOLOff + (short) 0x001D), AIP), dataS_ATC),
				(short) 0x0004);
		}

		performVisMAC(getSessionKey(keys[Constants.DESKEY_UDK]), apduBuffer, sCDOLOff, (short) 0x0025);
		//Calculate MAC and store it to apudbuffer
		Util.arrayCopyNonAtomic(
			dtr_TempKeyBuffer,
			(short) 0x0000,
			apduBuffer,
			macOffset,
			(short) 0x0008);
			
 
		//Store mac for subsequent processing	
		bByte = (byte) (IAD[Constants.CVR_BYTE_2] & (byte) 0x30);
		if (((bByte == (byte) 0x20) || (bByte == (byte) 0x00)) && (isFirstGenAC)) { //Return ARQC or first AAC
			Util.arrayCopy(apduBuffer, macOffset, storedMAC, (short) 0x0000, (short) 0x0008);
			dtr_Flags[OFF_IS_ALLOWED_SCRIPT_PROCRSSING] = Constants.TRUE;
		}

		sOffset = endMacOffset;
		
	
	  if(isToReturnECBwithPreAuthAmount){
		   
			if (CryptoType_index == (short) 0x0002) {
				sOffset=fillIAD(apduBuffer,sOffset,true,IAD,true);
			}else{
				sOffset=fillIAD(apduBuffer,sOffset,false,IAD,true);
			}
		}else{
			if (CryptoType_index == (short) 0x0002) {
				sOffset=fillIAD(apduBuffer,sOffset,true,IAD,false);
			}else{
				sOffset=fillIAD(apduBuffer,sOffset,false,IAD,false);
			}
		}
	
	/*	if (CryptoType_index == (short) 0x0002) {
			sOffset=fillIAD(apduBuffer,sOffset,true,IAD,false);
		}else{
			sOffset=fillIAD(apduBuffer,sOffset,false,IAD,false);
		}*/

		sOffset = (short) (sOffset - endMacOffset);
		if (CryptoType_index == (short) 0x0001) {
			apduBuffer[0] = (byte) 0x80;
			apduBuffer[1] = (byte) ((byte) 0x0B + sOffset);
			apduBuffer[2] = dtr_Satus[OFF_CID];
			Util.setShort(apduBuffer, (short) 0x0003, dataS_ATC);
		} else if (CryptoType_index == (short) 0x0002) {
			apduBuffer[0] = (byte) 0x77;
			apduBuffer[1] = (byte) 0x81;
			apduBuffer[2] = (byte) (nIC + (byte) 0x0D + sOffset);
			apduBuffer[(short) (endMacOffset + (short) 0x0002)] = (byte) (sOffset - (short) 0x0003); //Set IAD length
			apduBuffer[Util.setShort(apduBuffer, (short) 0x0003, (short) 0x9F27)] = (byte) 0x01; //Set CID tag, length
			apduBuffer[6] = dtr_Satus[OFF_CID]; // Set CID Value
			apduBuffer[Util.setShort(apduBuffer, (short) 0x0007, (short) 0x9F36)] = (byte) 0x02; //Set ATC tag, length
			Util.setShort(apduBuffer, (short) 0x000A, dataS_ATC); //Set ATC value
			Util.setShort(apduBuffer, (short) 0x000C, (short) 0x9F4B); //Set SDAD tag 
			Util.setShort(apduBuffer, (short) 0x000E, Util.makeShort((byte) 0x81, (byte) nIC)); //Set SDAD length

			/* Set SDAD Data Start */
			Util.setShort(apduBuffer, (short) 0x0010, (short) 0x6A05); //Header, format 
			Util.setShort(apduBuffer, (short) 0x0012, (short) 0x0120); //HAI, IDD length

			/* ICC Dynamic Data Start */
			apduBuffer[(short) 0x0014] = (byte) 0x02; //ICC Dynamic Number length
			Util.setShort(apduBuffer, (short) 0x0015, dataS_ATC); //ICC Dynamic Number
			apduBuffer[(short) 0x0017] = dtr_Satus[OFF_CID]; //CID

			//Generate Transaction Data Hash
			Util.arrayCopyNonAtomic(apduBuffer, (short) 0x0003, hashBuffer, hashBufferPtr, (short) 0x0009);
			Util.arrayCopyNonAtomic(apduBuffer, endMacOffset, hashBuffer, (short) (hashBufferPtr + 9), sOffset);
			shaDigest.doFinal(hashBuffer, (short) 0x0000, (short) (hashBufferPtr + (short) 0x0009 + sOffset), apduBuffer, (short) 0x0020);
			/* ICC Dynamic Data End */

			Util.arrayFillNonAtomic(apduBuffer, (short) 0x0034, (short) (nIC - (short) 0x0020 - (short) 0x0019), (byte) 0xBB); //Padding
			Util.arrayCopyNonAtomic(hashBuffer, hashBufferOffset, apduBuffer, (short) (nIC - (short) 0x0005), (short) 0x0004);
			apduBuffer[(short) (nIC + 15)] = (byte) 0xBC; //Trailer
			//Set Hashresult
			shaDigest.doFinal(
				apduBuffer,
				(short) 0x0011,
				(short) ((short) 0x0027 + nIC - (short) 0x0020 - (short) 0x0019),
				apduBuffer,
				(short) (nIC - (short) 0x0005));

			//Set Sign
			// generatAC() 밖에서 transaction 처리를 하므로 이를 제거함.
			//JCSystem.beginTransaction();
			if(data_Flags[OFF_IS_CRT_RSA_ISSUED] == Constants.TRUE){
				rsaCipher.init(iccPrivateCrtKey, Cipher.MODE_ENCRYPT);
			}else{
				rsaCipher.init(iccPrivateKey, Cipher.MODE_ENCRYPT);
			}
			//JCSystem.commitTransaction();
			rsaCipher.doFinal(apduBuffer, (short) 0x0010, nIC, apduBuffer, (short) 0x0010);
			/* Set SDAD Data End */
		}
		
		//if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
	    //Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)200);
	    //currentLogNum++;
        
		/*if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
									Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)100);
									currentLogNum++;*/
        
		apdu.setOutgoingAndSend(
			(short) 0x0000,
			(short) ((apduBuffer[CryptoType_index == (short) 0x0001 ? (short) 0x0001 : (short) 0x0002] & (short) 0x00FF)
				+ (CryptoType_index == (short) 0x0001 ? (short) 0x0002 : (short) 0x0003)));
		return;
	}
	/**
	 * Do card action analysis
	 * 
	 * @param apduBuf
	 */
	private void genAC1(byte[] apduBuffer) {
		byte bP1;
		boolean isACCMatched; //Is Application Currency Code matched with TCC?
		boolean isSACCMatched; //Is Second Application Currency Code
		bP1 = apduBuffer[ISO7816.OFFSET_P1];
		isACCMatched = false; //Is ACC matched with TCC(Transaction Currencty Code)?
		isSACCMatched = false; //Is SACC matched with TCC?
		if(data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]==Constants.TRUE&&dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
			if(Util.arrayCompare(dataA_ECSACC, (short) 0x0000, apduBuffer, (short) 0x0018, (short) 0x0002) == (byte) 0x00){
			
				dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]= Constants.TRUE;
			}else{
				
				dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]= Constants.FALSE;
			}
		}
		if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
			//If Online Authorisation Not Completed
			if (data_Flags[OFF_IS_ONLINE_REQUESTED]== Constants.TRUE) {
				bP1 = (byte) 0x80; //Means ARQC request, Requests online processing
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_LAST_ONLINE_TRANS_NOT_COMPLTD; //sets CVR indicator
			}
	
			//If Issuer Authentication Failed on last transaction
			if (((AIP &Constants. AIP_ISS_AUTH_SUPP) != (byte) 0x00) && data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]== Constants.TRUE) {
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_ISS_AUTHENT_FAIL_ON_LAST_ONLINE; //sets CVR indicator
				//Checks ADA and requests online processing if indicated
				if ((dataB_ADA1 & (byte) (short) 0xFF80) != (byte) 0x00) {
					bP1 = (byte) 0x80; //Means ARQC request, Requests online processing
				}
			}
		}
		//If SDA Failed on last transaction 
		if (data_Flags[OFF_IS_SDA_FAILED]== Constants.TRUE) {
			IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_SDA_FAIL; //sets CVR indicator
		}

		//If DDA Failed on last transaction
		if (data_Flags[OFF_IS_DDA_FAILED]== Constants.TRUE) {
			IAD[Constants.CVR_BYTE_4] |= Constants.CVR_B4_DDA_FAIL; //sets CVR indicator
		}
		if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
			//Issuer Script Processing Check
			IAD[Constants.CVR_BYTE_4] = (byte) (Issuer_Script_Indicator_byte | ((byte) 0x07 & IAD[Constants.CVR_BYTE_4]));
			if ((dataB_ADA2 & Constants.ADA_B2_ISS_SCRIPT_FAIL_PREV_TRANS_GO_ONLINE) != (byte) 0x00) {
				if ((Issuer_Script_Indicator_byte & (byte) 0x08) != (byte) 0x00) { //If script processing failed
					bP1 = (byte) 0x80; //Means ARQC request, Requests online processing
				}
			}
		}
		if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
			//Store Amount(authorised) to tmpBCDBuffer temporarily in BCD format
			EMVUtil.expandBCD(apduBuffer, ISO7816.OFFSET_CDATA, (short) 0x0006, dtr_BCDBuffer1);
	
			isACCMatched = checkCurrency(apduBuffer, (short) 0x0018, dataA_ACC); //Check whether TCC matched with ACC
			isSACCMatched = checkCurrency(apduBuffer, (short) 0x0018, dataA_SACC); //Check whether TCC matched with SACC
			dtr_Flags[OFF_IS_DOMESTIC] = ((Util.arrayCompare(dataA_ICC, (short) 0x0000, apduBuffer, (short) 0x0011, (short) 0x0002) == (byte) 0x00) ? Constants.TRUE : Constants.FALSE);
	
			//Velocity Checking 
			// Total Consecutive Offline Transaction
			// Total Consecutive Offline International Transaction (based on currency)
			// Total Consecutive International Transaction (based on country)
			if (((dataS_CTLI >= (short) 0x0000) && (!isACCMatched) && (dataS_CTCI >= dataS_CTLI))
				|| ((dataS_CTLIC >= (short) 0x0000) && (dtr_Flags[OFF_IS_DOMESTIC]== Constants.FALSE) && (dataS_CTCIC >= dataS_CTLIC))
				|| ((dataS_LCOL >= (short) 0x0000) && ((short) (dataS_ATC - dataS_lastOnlineATC) > dataS_LCOL))) {
				bP1 = veloc_exceeded_genac1();
			}
	
			//Velocity Checking for Transaction Amount in Designated Currency
			if (dataA_CTTAL != null) {
				if (isACCMatched) {
					if ((EMVUtil.addBCD(dataA_CTTA, dtr_BCDBuffer1, dtr_BCDBuffer2))
						|| (((dataA_CTTAL != null)
							? ((Util.arrayCompare(dtr_BCDBuffer2, (short) 0x0000, dataA_CTTAL, (short) 0x0000, (short) 0x000C) == (byte) 0x01)
								? true
								: false)
							: false))) {
						bP1 = veloc_exceeded_genac1();
					}
				}
			}
	
			//Velocity checking for Transaction Amount(Dual Currencty)
			if (dataA_CTTALDC != null) {
				if ((isACCMatched) || (isSACCMatched)) {
					if ((isSACCMatched) && (convertCurrency(apduBuffer))) {
						bP1 = veloc_exceeded_genac1();
					}
					if ((EMVUtil.addBCD(dataA_CTTADC, dtr_BCDBuffer1, dtr_BCDBuffer1))
						|| (((dataA_CTTALDC != null)
							? ((Util.arrayCompare(dtr_BCDBuffer1, (short) 0x0000, dataA_CTTALDC, (short) 0x0000, (short) 0x000C) == (byte) 0x01)
								? true
								: false)
							: false))) {
						bP1 = veloc_exceeded_genac1();
					}
				}
			}
	
			//If New Card
			if (dataS_lastOnlineATC == (short) 0x0000) {
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_NEW_CARD; //sets new card bit
				if ((dataB_ADA1 & Constants.ADA_B1_NEW_CARD_GO_ONLINE) != (byte) 0x00) {
					bP1 = (byte) 0x80; //request online processing
				}
			}
	
			//If offline PIN verification not performed(PIN try limit exceeded)
			if ((Pin != null) && (dtr_Flags[OFF_IS_VERIFY_RECEIVED] == Constants.FALSE) && (Pin.getTriesRemaining() == (byte) 0x00)) {
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD; //set CVR
				if ((dataB_ADA2 & Constants.ADA_B2_PIN_EXCDD_PREV_TRANS_DECLINE_TRANS) != (byte) 0x00) {
					bP1 = (byte) 0x00; //decline transaction and block application
				} else {
					if ((dataB_ADA2 & Constants.ADA_B2_PIN_EXCDD_PREV_TRANS_GO_ONLINE) != (byte) 0x00) {
						bP1 = (byte) 0x80; //request online processing
					}
				}
			}
			
		}else{
			//2012.02.07-cyf EC checking
			//Store Amount(authorised) to tmpBCDBuffer temporarily in BCD format
			bP1=forATM(apduBuffer ,bP1);
		}
		
		if (data_Flags[OFF_IS_APP_BLOCKED]==Constants.TRUE) {
			bP1 = (byte) 0x00;
		}
	
		
		dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x03;
		IAD[Constants.CVR_BYTE_2] &= (byte) 0x0F;
		dtr_Satus[OFF_CID] &= (byte) 0x3F;
		
		dtr_Flags[OFF_IS_COUNTER_SCRIPT] = Constants.FALSE;
		dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] = Constants.FALSE;
		
		if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.TRUE){
			IAD[Constants.CVR_BYTE_4] &= (byte) 0x0F;
		}
		//If card declined transaction offline
		if (((apduBuffer[ISO7816.OFFSET_P1] == (byte) 0x00) || (bP1 == (byte) 0x00))) {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_GAC1_AAC;
			if ((dataB_ADA1 &Constants. ADA_B1_TRANS_DECL_OFFL_CREATE_ADVICE) != (byte) 0x00) {
				dtr_Satus[OFF_CID] |= Constants.CID_ADV_REQD;
			}
			if (Pin != null) {
				if ((Pin.getTriesRemaining() == (byte) 0x00)) {
					if ((dataB_ADA1 & Constants.ADA_B1_PIN_EXCDD_TRANS_DECL_CREATE_ADVICE) != (byte) 0x00) {
						dtr_Satus[OFF_CID] = (byte) ((byte) (dtr_Satus[OFF_CID] & (short) 0x00F0) | Constants.CID_ADV_REQD | Constants.CID_PIN_TRY_EXCDD);
					}
				}
			}
			//Checks TVR 
			checkTVR(apduBuffer, (short) 0x0013);
		}
		//If card request online processing
		else if ((apduBuffer[ISO7816.OFFSET_P1] == (byte) 0x80) || (bP1 == (byte) 0x80)) {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_GAC1_ARQC;
			dtr_Satus[OFF_CID] |= Constants.CID_ARQC;
			data_Flags[OFF_IS_ONLINE_REQUESTED]= Constants.TRUE;
			dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x02;
			return;
		}
		//If card approved transaction offline
		else {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_GAC1_TC;
			dtr_Satus[OFF_CID] |= Constants.CID_TC;
			if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
				if ((isACCMatched) || (isSACCMatched)) {
					Util.arrayCopy(dtr_BCDBuffer1, (short) 0x0000, dataA_CTTADC, (short) 0x0000, (short) 0x000C);
				}
				if (isACCMatched) {
					Util.arrayCopy(dtr_BCDBuffer2, (short) 0x0000,  dataA_CTTA, (short) 0x0000, (short) 0x000C);
				}
			}else{
				//-cyf 2012.04.03 EC sencondory currency
 				if(dtr_Flags[OFF_IS_SENCOND_CURRENCY] == Constants.TRUE){
 					EMVUtil.subBCD(ECSAB,ECAC,dtr_BCDBuffer3);
					Util.arrayCopy(dtr_BCDBuffer3, (short) 0x0000, ECSAB, (short) 0x0000, (short) 0x000C);
				}else{
					EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer3);
					Util.arrayCopy(dtr_BCDBuffer3, (short) 0x0000, ECB, (short) 0x0000, (short) 0x000C);
				}
			}
			sequecorForNoAuth= true;
			
		}

		//Increments counters
		if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE)
		incrementCounters(isACCMatched);
	}

	/**
	 * Do Completion
	 * 
	 * @param apduBuffer
	 */
	private void genAC2(byte[] apduBuffer) {
		byte bP1 = apduBuffer[ISO7816.OFFSET_P1];
		short sARC; //Authorization Response Code 
		boolean isACCMatched; //Is Application Currency Code matched with TCC?

		if (bP1 ==Constants.CID_ARQC) //Cryptogram Type ARQC
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);

		IAD[Constants.CVR_BYTE_2] &= (byte) 0x3F; //means Second generate AC is returned to AAC
		dtr_Satus[OFF_CID] &= (byte) 0x3F; //means AAC
		sARC = Util.getShort(apduBuffer, ISO7816.OFFSET_CDATA);
		
		if(data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED] == Constants.TRUE&&dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
			if(Util.arrayCompare(dataA_ECSACC, (short) 0x0000, apduBuffer, (short) 0x001A, (short) 0x0002) == (byte) 0x00){
				dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN] = Constants.TRUE;
				
			}else{
				dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN] = Constants.FALSE;
			}
		}

		//If Online Authorization not completed
		if ((sARC == Constants.ARC_APPROVED_ONLINE_FAILED) || (sARC == Constants.ARC_DECLINED_ONLINE_FAILED)) {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_UNABLE_TO_GO_ONLINE;

			//Store Amount(authorised) to tmpBCDBuffer temporarily in BCD format
			EMVUtil.expandBCD(apduBuffer, (short) 0x0007, (short) 0x0006, dtr_BCDBuffer1);

			//Velocity Checking
			isACCMatched = checkCurrency(apduBuffer, (short) 0x001A,dataA_ACC);
			if (dataA_CTTAUL != null) {
				bP1 = check_veloc_excdd_genac2(dataA_CTTA, bP1);
				bP1 = check_veloc_excdd_genac2(dataA_CTTADC, bP1);
			}
			if ((dataS_UCOL >= (short) 0x0000) && ((short) (dataS_ATC - dataS_lastOnlineATC) > dataS_UCOL)) {
				bP1 = check_veloc_excdd_genac2(null, bP1);
			}

			//New Card Checking
			if (dataS_lastOnlineATC == (short) 0x0000) {
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_NEW_CARD;
				if ((dataB_ADA1 &Constants. ADA_B1_NEW_CARD_DECLINE_IF_UNABLE_TO_ONLINE) != (byte) 0x00) {
					bP1 = Constants.CID_AAC;
				}
			}

			//PIN Try Limit Exceed checking
			if (((AIP & Constants.AIP_CV_SUPP) != (short) 0x0000)
				&& (dtr_Flags[OFF_IS_VERIFY_RECEIVED] == Constants.FALSE)
				&& (Pin != null)
				&& (Pin.getTriesRemaining() == (byte) 0x00)
				&& ((dataB_ADA2 & Constants.ADA_B2_PIN_EXCDD_PREV_TRANS_CANT_ONLINE_DECLINE) != (byte) 0x00)) {
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD;
				bP1 = Constants.CID_AAC;
			}

			incrementCounters(!isACCMatched ? true : false);

			//If Terminal or Card Risk Mgt request AAC?
			if (bP1 == Constants.CID_AAC) { //Respond with Decline(AAC)
				checkTVR(apduBuffer, (short) 0x0015);
				if ((dataB_ADA1 & Constants.ADA_B1_TRANS_DECL_OFFL_CREATE_ADVICE) != (byte) 0x00) {
					dtr_Satus[OFF_CID] |= Constants.CID_ADV_REQD;
				}
			} else { //Responde with Approval(TC)
				if (isACCMatched) {
					if (dataA_CTTAL != null) {
						EMVUtil.addBCD(dtr_BCDBuffer1, dataA_CTTA, dtr_BCDBuffer3);
						Util.arrayCopy(dtr_BCDBuffer3,(short)0,dataA_CTTA,(short)0,(short)12);
					}
					if (dataA_CTTALDC != null) {
						EMVUtil.addBCD(dtr_BCDBuffer1, dataA_CTTADC, dtr_BCDBuffer3);
						Util.arrayCopy(dtr_BCDBuffer3,(short)0,dataA_CTTADC,(short)0,(short)12);
					}
				}
				if (dataA_CTTALDC != null) {
					if (checkCurrency(apduBuffer, (short) 0x001A, dataA_SACC)) {
						convertCurrency(apduBuffer);
						EMVUtil.addBCD(dtr_BCDBuffer1, dataA_CTTADC, dtr_BCDBuffer3);
						Util.arrayCopy(dtr_BCDBuffer3,(short)0,dataA_CTTADC,(short)0,(short)12);
					}
				}
				IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_GAC2_TC;
				dtr_Satus[OFF_CID] |= Constants.CID_TC;
			}
		} else { //Online Authorization Completed
			if ((bP1 == Constants.CID_TC) //If Terminal Request TC 
				&& ((sARC == Constants.ARC_APPROVED_1_ONLINE)
					|| (sARC == Constants.ARC_APPROVED_2_ONLINE)
					|| (sARC == Constants.ARC_APPROVED_3_ONLINE)
					|| (sARC == Constants.ARC_APPROVED_4_ONLINE)
					|| (sARC == Constants.ARC_APPROVED_5_ONLINE))) {
				if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
					if (((AIP & Constants.AIP_ISS_AUTH_SUPP) != (short) 0x0000) && (dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] == Constants.FALSE)) {
						IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_ISS_AUTH_NOT_DONE_AFTER_ONLINE_AUTH;
					}
				}
              
				if (((AIP & Constants.AIP_ISS_AUTH_SUPP) != (short) 0x0000)
					&& (dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] == Constants.TRUE)
					&& (data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]== Constants.TRUE)
					&& ((dataB_ADA1 & Constants.ADA_B1_ISS_AUTH_FAIL_DECLINE) != (byte) 0x00)) {

					if ((dataB_ADA1 & Constants.ADA_B1_ISS_AUTH_FAIL_TRANS_DECLINE_CREATE_ADVICE) != (byte) 0x00) {
						dtr_Satus[OFF_CID] |= Constants.CID_ADV_REQD;
					}
					if (data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]== Constants.TRUE) {
						IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_ISS_AUTH_PERFORM_AND_FAILED;
					}
				} else {
					IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_GAC2_TC;
					dtr_Satus[OFF_CID] |= Constants.CID_TC;
					if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
						checkIssuerAuth(true);
					}
				}
			} else { //If Terminal Request AAC
				if(dtr_Flags[OFF_IS_EC_TRASACTION]  == Constants.FALSE){
					checkIssuerAuth(false);
				}
				
			}
		}
		dtr_Flags[OFF_IS_COUNTER_SCRIPT] = Constants.TRUE;
		dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x03;
		return;
	}
	
	private void EMV_GetChallenge(APDU apdu) {
		byte[] apduBuffer = checkIncoming(apdu, (byte)(Constants.CHECK_CLA | Constants.CHECK_P1 | Constants.CHECK_P2), (byte)0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00);
						
		/*if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
									Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)50);
									currentLogNum++;*/				
		
		randomData.generateData(apduBuffer, (short) 0x0000, Constants.CARD_CHALLENGE_LENGTH);
		Util.arrayCopyNonAtomic(apduBuffer, (short) 0x00, dta_CardChallenge, (short) 0x00,  Constants.CARD_CHALLENGE_LENGTH);
		apdu.setOutgoingAndSend((short) 0x00,  Constants.CARD_CHALLENGE_LENGTH);
		return;
	}
	
	/**
	 * Calculate SDAD(Signed Dynamic Application Data) and send it to terminal
	 * 
	 * <Input Data format for Signed Dynamic Application Data>
	 * Header(0x6A) || Signed Data Format(0x05) || Hash Algorithm Indicator(0x01)
	 * || ICC Dynamic Data Length, Ldd(0x03) || ICC Dynamic Data(0x02 || ATC), 3bytes
	 * || Padding(0xBB), nIC - Ldd - 25bytes || Hash Result, 20bytes || Trailer(0xBC)
	 * 
	 * <Input data for Hash generation>
	 * Signed Data Format(0x05) || Hash Algorithm Indicator(0x01)
	 * || ICC Dynamic Data Length, Ldd(0x03) || ICC Dynamic Data(0x02 || ATC), 3bytes
	 * || Padding(0xBB), nIC - Ldd - 25bytes || Terminal Dynamic Data
	 * 
	 * Input Data for Signed Dynamic Application Data is encrypted with ICC Private Key to make SDAD.
	 * So, final output data format is
	 * Header(0x80) || Length(nIC) || Value(SDAD)
	 * 
	 * @param apdu apdu buffer which contains terminal dynamic data
	 */
	private void EMV_InternalAuthenticate(APDU apdu) {
		byte[] apduBuffer = PBOC.checkIncoming(apdu, (byte) (Constants.CHECK_CLA | Constants.CHECK_RECEIVE | Constants.CHECK_P1 | Constants.CHECK_P2), (byte)0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00);;
		short sLength, sOffset;
        byte lc = apduBuffer[ISO7816.OFFSET_LC];
		/*if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
							Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)50);
							currentLogNum++;*/
		// check Lc
		if(data_Flags[OFF_IS_DDOL_PERSONALIZE] != Constants.TRUE && lc == (byte)0){
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}
		
		if (lc != DOLRelatedDataLength[OFFSET_DOL_REL_DATA_LEN_DDOL]) {
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}

		if (iccPrivateKey == null&&iccPrivateCrtKey == null)
			ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);

		IAD[Constants.CVR_BYTE_4] |= (byte) 0x02; //Offline DDA performed
		sLength = EMVUtil.getUByte(apduBuffer, ISO7816.OFFSET_LC);

		//set Length
		if (nIC < (short) 0x0080) {
			apduBuffer[1] = (byte) nIC;
			sOffset = (short) 0x0002;
		} else {
			apduBuffer[1] = (byte) 0x81;
			apduBuffer[2] = (byte) nIC;
			sOffset = (short) 0x0003;
		}

		//Copy Terminal Dynamic Data for hash generation 
		Util.arrayCopyNonAtomic(apduBuffer, ISO7816.OFFSET_CDATA, apduBuffer, (short) (nIC + sOffset - (short) 0x0015), sLength);
		//Make input data
		  //1. set Tag '80'
		apduBuffer[0] = (byte) 0x80; 
		  //2. set SDAD Header '6A'
		apduBuffer[sOffset] = (byte) 0x6A; 
		  //3. set Signature data format ''
		  
		Util.arrayFillNonAtomic(
			apduBuffer,
			Util.setShort(
				apduBuffer,
				Util.setShort(apduBuffer, Util.setShort(apduBuffer, (short) (sOffset + (short) 0x0001), (short) 0x0501), (short) 0x0302),
				dataS_ATC),
			(short) (nIC - (byte) 0x1C),
			(byte) 0xBB);							

		//Generate and set the Hash
		shaDigest.doFinal(
			apduBuffer,
			(short) (sOffset + 1),
			(short) (nIC - (byte) 0x16 + sLength),
			apduBuffer,
			(short) (nIC + sOffset - (byte) 0x15));
		apduBuffer[(short) (nIC + sOffset - (short) 0x0001)] = (byte) 0xBC; //set the trailer
		//ISOException.throwIt((short)0x9488);
		//Sign data using ICC private key to make SDAD 
		
		JCSystem.beginTransaction();
		if(data_Flags[OFF_IS_CRT_RSA_ISSUED] == Constants.TRUE){
			rsaCipher.init(iccPrivateCrtKey, Cipher.MODE_ENCRYPT);
		}else{
			rsaCipher.init(iccPrivateKey, Cipher.MODE_ENCRYPT);
		}	
		JCSystem.commitTransaction();
		
		rsaCipher.doFinal(apduBuffer, sOffset, nIC, apduBuffer, sOffset);
		
		//Send SDAD to terminal 
		apdu.setOutgoingAndSend((short) 0x0000, (short) (nIC + sOffset));
		return;
	}
	
	
	private void EMV_ExternalAuthenticate(APDU apdu){
			
		byte[] apduBuffer =
			checkIncoming(
				apdu,
				(byte) ( Constants.CHECK_CLA|Constants.CHECK_RECEIVE | Constants.CHECK_P2 | Constants.CHECK_LC),
				(byte) 0x00,
				(byte) 0x00,
				(byte) 0x00,
			    (byte) 0x0A);
				
	
		

		//P1 Check
		if (apduBuffer[ISO7816.OFFSET_P1] != (byte) 0x00)
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);

		//Condition Check
		if (((sequecorForNoAuth) && (data_Flags[OFF_IS_APP_BLOCKED] == Constants.FALSE || dtr_Flags[OFF_IS_ALLOWED_SCRIPT_PROCRSSING] == Constants.FALSE )) || dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] == Constants.TRUE) {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_ISS_AUTH_PERFORM_AND_FAILED;
			data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED] = Constants.TRUE;
			//ATC = (short) (ATC + (short) 0x0001);
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}

		dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] =Constants.TRUE;
	

		//D1 = ARC + '000000000000' xor AC
		//ARPC = 3-DES(D1, sessionKey);  
		//sessionKey generation
		getSessionKey(keys[Constants.DESKEY_UDK]);
		//D1 생성
		Util.setShort(dtr_TempKeyBuffer, (short)0x00, Util.getShort(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 8)));
		Util.arrayFillNonAtomic(dtr_TempKeyBuffer, (short)0x02, (short)0x06, (byte)0x00);
		EMVUtil.xor(dtr_TempKeyBuffer, (short)0x00, storedMAC, (short)0x00, (short)0x08);
		
		doFinal(true, vk16, dtr_TempKeyBuffer, (short)0x00, (short)0x08);
		// Issuer Authentication Fail
		if (Util.arrayCompare(apduBuffer, ISO7816.OFFSET_CDATA, dtr_TempKeyBuffer, (short)0x00, (short) 0x0008) != (byte) 0x00) {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_ISS_AUTH_PERFORM_AND_FAILED;
			
			data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED] = Constants.TRUE;
			dtr_Flags[OFF_IS_ISSUER_SCRIPT_MAC_ERROR] = Constants.TRUE;
			ISOException.throwIt(Constants.SW_PBOC_AUTHENTICATION_FAILED);				
		}
		//Issuer Authentication Success
		else {
			IAD[Constants.CVR_BYTE_2] &= (byte) 0xF7; //clear CVR_B2_ISS_AUTH_PERFORM_AND_FAILED bit, so it means success
			data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED] = Constants.FALSE;
				
		}
	}
	
	private void EMV_Verify(APDU apdu) {

		byte[] apduBuffer = checkIncoming(apdu, (byte)(Constants.CHECK_CLA | Constants.CHECK_P1), (byte)0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		short responseCode = (short) 0x9000;
		byte PIN_Index = ISO7816.OFFSET_CDATA;
		
		apdu.setIncomingAndReceive();
        
		/*if(currentLogNum>=MAXDEBUGLOGNUM)currentLogNum=0;
							Util.arrayCopyNonAtomic(apduBuffer, (short)0x00,(byte[])debugFile[currentLogNum], (short)0x00,  (short)50);
							currentLogNum++;*/
	

		if (Pin == null)
			ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);

		if (checkPINTryLimitExceeded()) {
			IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_OFFLINE_PIN_VERIF_FAILED;
			IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD;
			if (dtr_Flags[OFF_IS_VERIFY_RECEIVED]==Constants.TRUE){
				responseCode = Constants.SW_AUTH_METHOD_BLOCKED;
			}else {
				responseCode = ISO7816.SW_DATA_INVALID;
				dtr_Flags[OFF_IS_VERIFY_RECEIVED]=Constants.TRUE;
			}
		} else {
			//Enciphered PIN
			if (apduBuffer[ISO7816.OFFSET_P2] == (byte) Constants.VERIFY_ENCIPHERED_PIN) {
				short nIC;
				
				if (iccPrivateKey == null&&iccPrivateCrtKey == null)
					ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);

				//PIN decipher
				if(data_Flags[OFF_IS_CRT_RSA_ISSUED]== Constants.TRUE){
					nIC = (short) (iccPrivateCrtKey.getSize() / 8);
				}else{
					nIC = (short) (iccPrivateKey.getSize() / 8);
				}
				JCSystem.beginTransaction();

				if(data_Flags[OFF_IS_CRT_RSA_ISSUED]== Constants.TRUE)
					rsaCipher.init(iccPrivateCrtKey, Cipher.MODE_DECRYPT);
				else
					rsaCipher.init(iccPrivateKey, Cipher.MODE_DECRYPT);
				
				JCSystem.commitTransaction();
				rsaCipher.doFinal(apduBuffer, ISO7816.OFFSET_CDATA, nIC, apduBuffer, ISO7816.OFFSET_CDATA);

				if (Util.arrayCompare(apduBuffer, (short) 0x0E, dta_CardChallenge, (short) 0x00, (short) 0x08) == 0 && apduBuffer[5] == (byte) 0x7F)
					PIN_Index++;
			}
			
			JCSystem.beginTransaction();
			dtr_Flags[OFF_IS_VERIFY_RECEIVED]=Constants.TRUE;
			//verify PIN
			if (Pin.check(apduBuffer, PIN_Index, (byte) 0x08)) {	
				IAD[Constants.CVR_BYTE_2] &= ~Constants.CVR_B2_OFFLINE_PIN_VERIF_FAILED;
				Pin.resetAndUnblock();
			}
			else {
				IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_OFFLINE_PIN_VERIF_FAILED;
				if (checkPINTryLimitExceeded()) {
					IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD;
					if ((dataB_ADA2 & Constants.ADA_B2_PIN_EXCDD_CURR_TRANS_BLOCK_APP) == Constants.ADA_B2_PIN_EXCDD_CURR_TRANS_BLOCK_APP) {
						IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_APP_BLKD_PIN_LIMIT_EXCDD;

						//Application Block
						setApplication(Constants.INS_EMV_APP_BLOCK);						
					}
					responseCode = (short) 0x63C0;

				} else
					responseCode = (short) ((short) 0x63C0 + (short) Pin.getTriesRemaining());
			}
			JCSystem.commitTransaction();
		}

		IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_OFFLINE_PIN_VERIF_PERFORMED;
		
		if (responseCode != (short) 0x9000)
			ISOException.throwIt(responseCode);
	}
	private void EMV_PinChange(APDU apdu){
		byte[] apduBuffer = checkIncoming(apdu, (byte)(Constants.CHECK_CLA | Constants.CHECK_P1), (byte)0x84, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		prepareScriptProcessing(apdu, false);
		pinChangeUnblock(apduBuffer);
		resetScriptFailIndicator(true);
		return;
	}
	
	private void EMV_UpdateRecord(APDU apdu){
		byte[] apduBuffer	=	checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x04, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		byte p2	=	apduBuffer[ISO7816.OFFSET_P2];
		EMVUtil.checkP2((byte) p2);
		updateRecord(apduBuffer, (short) ((apduBuffer[ISO7816.OFFSET_LC] & (short) 0x00FF) - prepareScriptProcessing(apdu, false)));
		resetScriptFailIndicator(true);
		return;
	}
	
	
	
	private void EMV_PutData(APDU apdu){
		byte[] apduBuffer = checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x04, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		short sP1P2 = Util.getShort(apduBuffer, ISO7816.OFFSET_P1);
		//TODO define in storeData command 
		storeTagValue(sP1P2, apduBuffer, (short) 0x000F, prepareScriptProcessing(apdu, false));
		resetScriptFailIndicator(true);
		return;
	}
	
	private void EMV_CardBlock(APDU apdu){
		checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x84, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		prepareScriptProcessing(apdu, true);	
		//set card block flag to the PlatForm
		setApplication(Constants.INS_EMV_CARD_BLOCK);
		resetScriptFailIndicator(true);
		
	}
	
	private void EMV_AppUnblock(APDU apdu){
		checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x84, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		prepareScriptProcessing(apdu, true);
		setApplication(Constants.INS_EMV_APP_UNBLOCK);
		resetScriptFailIndicator(true); //0x0F
		return;
	}
	
	private void EMV_AppBlock(APDU apdu){
		checkIncoming(apdu, Constants.CHECK_CLA, (byte)0x84, (byte) 0x00, (byte) 0x00, (byte) 0x00);
		prepareScriptProcessing(apdu, true);
		setApplication(Constants.INS_EMV_APP_BLOCK);
		//parseBlockingRules(true, LINKED_UNBLOCK);
		resetScriptFailIndicator(true); //0x7F
	}
	
	private void resetScriptFailIndicator(boolean condition) {
		if (!condition) {
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
		Issuer_Script_Indicator_byte &= (byte) 0xF7;
	}
	/**
	 * change application state
	 * 
	 *  
	 * @param script command  CLA and INS
	 * @return card state
	 */
	public final void setApplication(short instruction){
		
		switch(instruction)
		{
			case Constants.INS_EMV_APP_BLOCK:
				GPSystem.setCardContentState(Constants.APPLET_BLOCKED);
				data_Flags[OFF_IS_APP_BLOCKED] = Constants.TRUE;
				break;
			case Constants.INS_EMV_APP_UNBLOCK:
				GPSystem.setCardContentState(Constants.APPLET_PERSONALIZED);
				data_Flags[OFF_IS_APP_BLOCKED] = Constants.FALSE;
				break;
			case Constants.INS_EMV_CARD_BLOCK:
				GPSystem.setCardContentState(GPSystem.CARD_LOCKED);
				//bLifePhase = Constants.BLOCKED_PHASE;
				dtr_Flags[OFF_IS_NOT_RESET] = Constants.TRUE;
				isCardLocked = Constants.TRUE;
		}
	}
	
	private byte prepareScriptProcessing(APDU apdu,boolean checkP1P2){
		
		// PBOC3.0 if mac is error trailing ISSUER SCRIPT COMMAND is error
		if(dtr_Flags[OFF_IS_ISSUER_SCRIPT_MAC_ERROR]==Constants.TRUE){
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
		//1 set initial value for prepareScriptProcessing method 
		byte[] apduBuffer = checkIncoming(apdu,(checkP1P2) ? (byte) (Constants.CHECK_P1 | Constants.CHECK_P2) : (byte)0 , (byte)0, (byte)0, (byte)0,(byte)0);
		byte ins	=	apduBuffer[ISO7816.OFFSET_INS];
		byte p2	=	apduBuffer[ISO7816.OFFSET_P2];
		short sLc	=	apduBuffer[ISO7816.OFFSET_LC];	
		Issuer_Script_Indicator_byte |= (byte) 0x08;//Set status to issuer script processing failed
		
		//2 check the head of apdu
				
		if ((ins == Constants.INS_EMV_APP_BLOCK) || (ins == Constants.INS_EMV_APP_UNBLOCK) || (ins == Constants.INS_EMV_CARD_BLOCK)
				|| ((ins == Constants.INS_EMV_PIN_CHANGE) && (p2 == (byte)0x00))) {
					//If a commmanjud is one of the commands specified above, LC shall be 4.
					if (sLc != (short) 0x0004) {
								ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
					}
		}else {
				if ((short) (sLc - (short) 0x0004) < (short) 0x0000) {
					ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
				}
		}
		if (ins == Constants.INS_EMV_PIN_CHANGE){
			if(p2 != (byte)0x00 && p2 != (byte)0x01 && p2 != (byte)0x02) {  //p2 [00] reset counter [01] reset and change pin value(use original PIN) [02]reset and change pin value
			   ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
			}
			if ((p2 == (byte)0x01 || p2 == (byte)0x02) &&
				apduBuffer[ISO7816.OFFSET_LC] != (byte)0x14) {
					ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
			}
		}
		//3 check condition  
			// a GAC1 = TC =>sequecorForNoAuth = True 
        if(sequecorForNoAuth) {
       	 Issuer_Script_Indicator_byte =(byte)(Issuer_Script_Indicator_byte& 0xF7);
       	 ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
        }
        	// b GAC1 = ARQC => allowScriptProcessing = true
		if (sLc > apdu.setIncomingAndReceive() || (	dtr_Flags[OFF_IS_ALLOWED_SCRIPT_PROCRSSING] == Constants.FALSE)) {
			ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
			// c dtr_Satus[OFF_TRANSACTION_SEQUENCE] after GPO [01] (after GAC1)&ARQC [02] just after GAC1 [03] after GAC2[03] 
				// after GAC1  isCounterScript = false , after GAC2 isCounterScript = true;
		if (dtr_Satus[OFF_TRANSACTION_SEQUENCE] != (byte) 0x02&&dtr_Flags[OFF_IS_COUNTER_SCRIPT]== Constants.TRUE) {
			//if iss script command counter is maximum(F), doesnot increase counter 
			if ((short) (Issuer_Script_Indicator_byte & (short) 0x00F0) != (short) 0x00F0) {
				//JCSystem.beginTransaction();
				//Increase Counter
				Issuer_Script_Indicator_byte =
					(byte) ((byte) ((Issuer_Script_Indicator_byte & (short) 0x00F0) + (short) 0x0010) | (byte) (short) 0x0008);
				//JCSystem.commitTransaction();
			}
		}
		//4 check MAC
			//a calculation MAC
				//Stores mac for later use(MAC Compare)
		Util.arrayCopyNonAtomic(
				apduBuffer,
				(short) (ISO7816.OFFSET_CDATA + sLc - (short) 0x0008),
				apduBuffer,
				(short) (sLc + (short) 0x001B),
				(short) 0x0008);

				//Set CDATA
		Util.arrayCopyNonAtomic(
				apduBuffer, 
				ISO7816.OFFSET_CDATA, 
				apduBuffer, 
				(short) 0x000F, 
				(short) (sLc - (short) 0x0004));
				//Set AC(App Cryptogram) and ATC : apdu header(5) || ATC(2) || AC(8) || CData(var)
		Util.arrayCopyNonAtomic(
				storedMAC, 
				(short) 0x0000, 
				apduBuffer, 
				Util.setShort(apduBuffer, ISO7816.OFFSET_CDATA, dataS_ATC), 
				(short) 0x0008);
				//calculate 8 byte Signature 
		performVisMAC(getSessionKey(keys[Constants.DESKEY_MAC]), apduBuffer, (short) 0x0000, (short) ((short) 0x000F + sLc - (short) 0x0004));
				//check MAC (4byte)
		if (Util.arrayCompare(apduBuffer, (short) (sLc + (short) 0x001F),
				dtr_TempKeyBuffer,
				(short) 0x0000,
				(short) 0x0004)	!= (byte) 0x00) {	
			dtr_Flags[OFF_IS_ISSUER_SCRIPT_MAC_ERROR]= Constants.TRUE;
			ISOException.throwIt(Constants.SW_SM_INCORRECT);
			
			
		}
		return (byte) 0x04;
	}

	
	/**
	 * Get session key 
	 * 
	 * @param key
	 * @return
	 */
	//sessionKey_A = 3-DES('000000000000' + ATC, uniqueDEAKey);
	//sessionKey_B = 3-DES('000000000000' + ~ATC, uniqueDEAKey);
	private DESKey getSessionKey(DESKey key) {

		//Util.arrayFillNonAtomic(dtr_TempKeyBuffer, (short) 0, (short) 6, (byte) 0x00);
		//Util.arrayFillNonAtomic(dtr_TempKeyBuffer, (short) 8, (short) 6, (byte) 0x00);
		Util.arrayFillNonAtomic(dtr_TempKeyBuffer, (short) 0, (short) 14, (byte) 0x00);		
		
		Util.setShort(dtr_TempKeyBuffer, (short)6, dataS_ATC);
		Util.setShort(dtr_TempKeyBuffer,	(short)14, (short) (dataS_ATC ^ (short)0xFFFF));

		boolean inTransaction = false;
		if (JCSystem.getTransactionDepth() == 0) {
			inTransaction = true;
			JCSystem.beginTransaction();
		}
		
		desCipher.init(key, Cipher.MODE_ENCRYPT);
		desCipher.doFinal(dtr_TempKeyBuffer, (short) 0, (short) 16, dtr_TempKeyBuffer, (short) 0);

		vk16.setKey(dtr_TempKeyBuffer, (short) 0x0000);
		
		if (inTransaction) JCSystem.commitTransaction();
		
		return vk16;
	}
	
	/**
	 * Calculate MAC value
	 * 
	 * @param sessionKey
	 * @param src
	 * @param srcOff
	 * @param len
	 * @param bBoolean
	 * @return
	 */
	private void performVisMAC(DESKey sessionKey, byte[] src, short srcOff, short len) {

		DESKey tempKey;
		short tempLen;

		tempKey = sessionKey;
		/*	if (bBoolean) {
				if (mergedData[1] == (byte) 0x0E) {
					src[(short) (srcOff + len)] = (byte) 0x80;
					len++;
					temp_Key = cryptV14SessionKey();
				}
			}*/

		//Padding
		/*Check 80 padding*/
		src[(short) (srcOff + len)] = (byte) 0x80; //80 Padding 
		len++;

		tempLen = (short) (len % (short) 0x0008);
		if (tempLen > (short) 0x0000) {
			tempLen = (short) ((short) 0x0008 - tempLen);
			Util.arrayFillNonAtomic(src, (short) (srcOff + len), tempLen, (byte) 0x00);
		}
		len = (short) (len + tempLen);

		//final 3-DES 연산
		tempKey.getKey(dtr_TempKeyBuffer, (short) 0x0000);
		
		boolean inTransaction = false;
		if (JCSystem.getTransactionDepth() == 0) {
			inTransaction = true;
			JCSystem.beginTransaction();
		}
		if(len ==(short)0x0008){
			//vk8.setKey(dtr_TempKeyBuffer, (short) 0x0000);
			//sig.init(vk8, Signature.MODE_SIGN);
			
			//sig.sign(src, srcOff, (short) len, dtr_TempKeyBuffer, (short) 0x0000);
			sig.init(tempKey, Signature.MODE_SIGN);
			sig.sign(src, (short) 0, (short) 0x0008, dtr_TempKeyBuffer, (short) 0x0000);
		}else{
			
			vk8.setKey(dtr_TempKeyBuffer, (short) 0x0000);
			sig.init(vk8, Signature.MODE_SIGN);
			
			sig.sign(src, srcOff, (short) (len - (short) 0x0008), dtr_TempKeyBuffer, (short) 0x0000);
			sig.init(tempKey, Signature.MODE_SIGN, dtr_TempKeyBuffer, (short) 0x0000, (short) 0x0008);
			sig.sign(src, (short) (srcOff + len - (short) 0x0008), (short) 0x0008, dtr_TempKeyBuffer, (short) 0x0000);
		}
		if (inTransaction) JCSystem.commitTransaction();
	}

	
	
	private void updateRecord(byte[] apduBuffer, short sLength) {
		byte index;
		byte P1 = apduBuffer[ISO7816.OFFSET_P1];
		byte P2 = apduBuffer[ISO7816.OFFSET_P2];
		byte[] readArray;
		
		if (P1==(byte)0){
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		
		readArray = getFileRecord(P2, P1);
		/*	
		if (readArray.length != sLength) {
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}*/

		index = (byte) ((P2 & ((short) 0x00FF)) >> (byte) 0x03);
		index--;

		if (readArray.length != sLength){
			
			JCSystem.beginTransaction();
			((PBOCFile)recordFile[index]).updateRecord(sLength,(short)(P1&0xFF));
			JCSystem.requestObjectDeletion();
			readArray = getFileRecord(P2, P1);
			Util.arrayCopy(apduBuffer, (short) 0x000F, readArray, (short) 0x0000, sLength);			
			JCSystem.commitTransaction();
			
		} else {
			Util.arrayCopy(apduBuffer, (short) 0x000F, readArray, (short) 0x0000, sLength);
		}

		//Util.arrayCopy(apduBuffer, (short) 0x000F, readArray, (short) 0x0000, sLength);
		
		if (isECSavedInrecord){
			if ((index==EC_Info_ForRecord[OFFSET_EC_INFO_INDEX]) && (P1==EC_Info_ForRecord[OFFSET_EC_INFO_RECORD_NUM])){
				EMVUtil.expandBCD(readArray, Util.getShort(EC_Info_ForRecord,OFFSET_EC_INFO_DATA_OFFSET), (short) 0x0006, dtr_BCDBuffer3);
				Util.arrayCopy(dtr_BCDBuffer3,(short)0,ECB,(short)0,(short)12);
			}			
		}
		
	}
	private byte[] getFileRecord(byte convertedSFI, short recordNum) {
		byte index=(byte) ((convertedSFI & ((short) 0x00FF)) >> (byte) 0x03);
		index--;
		byte[] record_reference= null;
		if(index>=Constants.NUMBER_RECORD_FILE||recordFile[index]==null){
			 ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}else{
			record_reference = ((PBOCFile)recordFile[index]).getRecord(recordNum);
			if(record_reference==null){
				ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
			}
		}
		return record_reference;		          
	}
	
	private static byte[] checkIncoming(APDU apdu, byte checkType, byte cla, byte p1, byte p2, byte lc) {
		byte[] apduBuffer = apdu.getBuffer();
		//check CLA
		if (((checkType & Constants.CHECK_CLA) != (byte)0x00) && (apduBuffer[ISO7816.OFFSET_CLA] != cla)) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		//check P1, P2
		if ((((checkType & Constants.CHECK_P1) != (byte) 0x00) && (apduBuffer[ISO7816.OFFSET_P1] != p1))
			|| (((checkType & Constants.CHECK_P2) != (byte) 0x00) && (apduBuffer[ISO7816.OFFSET_P2] != p2))) {
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		//check LC
		if (((checkType & (byte) Constants.CHECK_LC) != (byte) 0x00) && (apduBuffer[ISO7816.OFFSET_LC] != lc)) {
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}
		//check receive
		if ((checkType & Constants.CHECK_RECEIVE) != (byte) 0x00) {
			apdu.setIncomingAndReceive();
		}

		return apduBuffer;
	}
	/**
	 * Set PIN data from source array
	 * 
	 * @param src
	 * @param tryLimitOff
	 * @param pinBlockOff
	 */
	private void setPin(byte[] src, short tryLimitOff, short pinBlockOff) {
		Pin = new PBOCOwnerPIN(src[tryLimitOff], (byte) 0x08); // OwnerPIN(byte tryLimit, byte maxPINSize) 
		Pin.update(src, pinBlockOff, (byte) 0x08);
		Pin.resetAndUnblock();

		return;
	}
	
	private boolean checkPINTryLimitExceeded() {
		return Pin.getTriesRemaining() == 0 ? true : false;
	}
	
	
	
	private void pinChangeUnblock(byte[] apduBuf) {
		byte p2 = apduBuf[ISO7816.OFFSET_P2];
		byte pinLen;

		if (Pin == null)
			ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);

		if (p2 == (byte) 0x01 || p2 == (byte) 0x02) {
			//decrypt encrypted pin data
			doFinal(false, getSessionKey(keys[Constants.DESKEY_ENC]), apduBuf, (short) 0x0F, (short) 0x10);

			for (byte i = 0; i < 4; i++) {
				apduBuf[(short) (i + (byte) 0x14)] ^= rmENC[(short) i];
			}
 
			//If Pin change using current Pin, do additional modify
			if (p2 == (byte) 0x01) {
				//Current PIN block shall be modified to get new PIN block
				//ex) current PIN block : 241234FFFFFFFFFF -> 1234000000000000
				Util.arrayFillNonAtomic(dtr_SrcTempBuffer, (short)0x00, (short)0x08, (byte)0x00);
				pinLen = (byte)(pinBlock[0] & (byte)0x0F);
				if (pinLen %2 != 0) {
					Util.arrayCopyNonAtomic(pinBlock, (short)0x01, dtr_SrcTempBuffer, (short)0x00, (byte)(pinLen /2 + 1));
					dtr_SrcTempBuffer[(byte)(pinLen / 2)] &= (byte)0xF0;
				}
				else {
					Util.arrayCopyNonAtomic(pinBlock, (short)0x01, dtr_SrcTempBuffer, (short)0x00, (byte)(pinLen /2));
				}
				
				for (byte i = 0; i < 8; i++) {
					apduBuf[(short) (i + (byte) 0x10)] ^= dtr_SrcTempBuffer[(short) i];
				}
			}			
			EMVUtil.checkPinBlock(apduBuf, (short)0x10);
			
			JCSystem.beginTransaction();
			Pin.update(apduBuf, (short)0x10, (byte)0x08);
			Util.arrayCopy(apduBuf, (short)0x10, pinBlock, (short)0x00, (short)0x08);
			Pin.resetAndUnblock();
			JCSystem.commitTransaction();
			return;
						
		} else if (p2 != (byte) 0x00) {
			ISOException.throwIt((short) 0x6B00);
		}
		
		Pin.resetAndUnblock();
		
	}
	public boolean select() {
		dtr_Satus[OFF_TRANSACTION_SEQUENCE] = (byte) 0x03;
		dtr_Flags[OFF_IS_ALLOWED_SCRIPT_PROCRSSING] = Constants.FALSE;
		return super.select();
		}
	private void doFinal(boolean isEncryption, DESKey key, byte[] inBuff, short inOffset, short inLength) {
		boolean inTransaction = false;
		if (JCSystem.getTransactionDepth() == 0) {
			inTransaction = true;
			JCSystem.beginTransaction();
		}
				
		desCipher.init(key, (isEncryption) ? Cipher.MODE_ENCRYPT : Cipher.MODE_DECRYPT);
		desCipher.doFinal(inBuff, inOffset, inLength, inBuff, inOffset);
		
		if (inTransaction) JCSystem.commitTransaction();
	}
	short fillIAD(byte[]apduBuffer,short srcOff,boolean isTLV,byte[] iad,boolean preAuthIncluded){
		if(isTLV){
			apduBuffer[Util.setShort(apduBuffer, srcOff, (short) 0x9F10)] = (byte) (7+1);//IAD tag, length
			srcOff=(short)(srcOff+3);
		}
		apduBuffer[srcOff++]=(byte)7;
		Util.arrayCopyNonAtomic(iad,(short)0,apduBuffer,(short)srcOff,(short)7);
		srcOff=(short)(srcOff+7);
		//ISOException.throwIt((short)((short)0x9000+IAD[7]));
		if(iad[7]!=0){
			
			apduBuffer[srcOff]=iad[7];
			short DataLen =(short)8;
			short offsetHash =  (short)(srcOff+7);
			switch(iad[8]){
			case (byte)0x01:
				//-cyf 2012.04.03
				if(	dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]==Constants.TRUE){
					EMVUtil.retractBCD(ECSAB,(short)12,apduBuffer,(short)(srcOff+1));
				}else{		
					EMVUtil.retractBCD(ECB,(short)12,apduBuffer,(short)(srcOff+1));
					
				}
				
				apduBuffer[(short)(srcOff+7)]=(byte)0x00;
				//DataLen=(short)8;			
				
				break;
			case (byte)0x02:
				EMVUtil.retractBCD(dataA_CTTA,(short)12,apduBuffer,(short)(srcOff+1));
				apduBuffer[(short)(srcOff+7)]=(byte)0x00;
				//DataLen=(short)8;
				break;
			case (byte)0x03:
				EMVUtil.retractBCD(dataA_CTTA,(short)12,apduBuffer,(short)(srcOff+6));
				EMVUtil.retractBCD(ECB,(short)12,apduBuffer,(short)(srcOff+1));
				Util.arrayFillNonAtomic(apduBuffer,(short)(srcOff+12),(short)4,(byte)0);
				DataLen=(short)16;
				 offsetHash =  (short)(srcOff+12);
				break;
			case (byte)0x04:
				EMVUtil.retractBCD(dataA_CTTAL,(short)12,apduBuffer,(short)(srcOff+6));
				EMVUtil.retractBCD(dataA_CTTA,(short)12,apduBuffer,(short)(srcOff+1));
			    Util.arrayFillNonAtomic(apduBuffer,(short)(srcOff+12),(short)4,(byte)0);
				DataLen=(short)16;
				offsetHash =  (short)(srcOff+12);
				break;
			case (byte)0x05:
				getTagValue((short) 0x9F5D,apduBuffer,(short)(srcOff+1));
				apduBuffer[(short)(srcOff+7)]=(byte)0x00;
				//DataLen=(short)8;
				break;
			
			}
			
			Util.setShort(apduBuffer,srcOff,dataS_ATC);
			Util.arrayCopyNonAtomic(apduBuffer,srcOff,dtr_SrcTempBuffer,srcOff,DataLen);
			performVisMAC(vk16, dtr_SrcTempBuffer, srcOff,DataLen);
			Util.arrayCopyNonAtomic(
					dtr_TempKeyBuffer,
					(short) 0x0000,
					apduBuffer,
					offsetHash,
					(short) 0x0004);
			apduBuffer[srcOff]=iad[7];
			apduBuffer[(short)(srcOff+1)]=iad[8];
			if(isTLV){
				apduBuffer[(short)(srcOff-9)]=(byte)(8+iad[7]+1);
			}
			srcOff=(short)(srcOff+iad[7]+1);
		}
		return srcOff;
	}
	
	private boolean buildCDOLDataForAC(byte[] genACCmdBuffer, byte[] dest, boolean isFirstGenAC)
	{
		byte tagIndex;
		short destOffset, valueOffset;
		
		
		short offsetPDOL;
		if(isFirstGenAC){
			offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F4E,CDOL1,(short)0,(short)CDOL1.length);
		}else{
			offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F4E,CDOL2,(short)0,(short)CDOL2.length);
		} 
		if(offsetPDOL!=(short)0xFFFF){
			Util.arrayCopy(genACCmdBuffer, (short)(ISO7816.OFFSET_CDATA + offsetPDOL), MN, (short)0x00, (short)0x14);
		}
				
		destOffset = (isFirstGenAC == true) ? (short)5 : (short)7;

		for (tagIndex = (byte)0; tagIndex < ACTags.length; tagIndex += (byte)1) {
			valueOffset =(isFirstGenAC == true) ? ACOffsetsOfCDOL1[tagIndex] : ACOffsetsOfCDOL2[tagIndex] ; 
			if (valueOffset == (short)0xFFFF) {
				return false;
			}

			Util.arrayCopyNonAtomic(genACCmdBuffer, 
								(short)((short)ISO7816.OFFSET_CDATA + valueOffset),
								dest,
								destOffset,
								ACLens[tagIndex]);
			destOffset = (short)(destOffset + ACLens[tagIndex]);
		}		
		return true;
	}
	
	private void createLogRecord(boolean isFirstGenAC, byte[] src) {
		short index;
		short dolLen;
		short recordOffset;
		short valueLen;

		if (logFile == null) {
			return;
		} else {
			index = (short) 0x0000;
			//Adjust current record and record offset
			if ((lfCurrentRecord += (byte) 0x01) == transLogEntry[LOG_REC_MAX]) {
				lfCurrentRecord = (short) 0x0000;
			}
			if (lfRecordsUsed < transLogEntry[LOG_REC_MAX]) {
				lfRecordsUsed += (byte) 0x01;
			}
			recordOffset = (short) (lfCurrentRecord * lfRecordSize);
			Util.arrayFillNonAtomic(logFile, recordOffset, lfRecordSize, (byte) 0x00);

			while (index < LDOL.length) {
				dolLen = EMVUtil.parseDOL(LDOL, index, dtr_BER_TLV_DOL1);
				valueLen = getTagValue(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG], logFile, recordOffset); //Find from card data
				if (valueLen == (short) 0xFFFF) {
					valueLen = findCDOLData(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG], isFirstGenAC); //Find from terminal data
					if (valueLen != (short) 0xFFFF) {
						Util.arrayCopyNonAtomic(
							src,
							(short) ((short) ISO7816.OFFSET_CDATA + valueLen),
							logFile,
							recordOffset,
							dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
					}
				}
				recordOffset = (short) (recordOffset + dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
				index = (short) (index + dolLen);
			}
		}
	}
	private void createLogRecordEC(boolean isFirstGenAC, byte[] src) {
		short index;
		short dolLen;
		short recordOffset;
		short valueLen;

		if (logFileEC == null) {
			return;
		} else {
			index = (short) 0x0000;
			//Adjust current record and record offset
		
			recordOffset = OFF_FIRST_VARIABLE_OF_ERC_LOG;

			while (index < LDOL_EC.length) {
				dolLen = EMVUtil.parseDOL(LDOL_EC, index, dtr_BER_TLV_DOL1);
				valueLen = getTagValue(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG], dtr_ECLog, recordOffset); //Find from card data
				if (valueLen == (short) 0xFFFF) {
					valueLen = findCDOLData(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG], isFirstGenAC); //Find from terminal data
					if (valueLen != (short) 0xFFFF) {
						Util.arrayCopyNonAtomic(
							src,
							(short) ((short) ISO7816.OFFSET_CDATA + valueLen),
							dtr_ECLog,
							recordOffset,
							dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
					}
				}
				recordOffset = (short) (recordOffset + dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
				index = (short) (index + dolLen);
			}
		}
	}
	
	private void saveECBanlanceToLog(boolean isSavingOldBalance,boolean isFirstEC,short tag){
		byte[] balanceEC;
		short offsetBanlance;
		short recordOffset;
		if(isSavingOldBalance){
			offsetBanlance = OFF_OLD_EC_BALANCE;
		}else{
			offsetBanlance = OFF_NEW_EC_BALANCE;
		}
		if(isFirstEC){
			balanceEC = ECB;
		}else{
			balanceEC = ECSAB;
		}
		//TODO templet for EC load log 
		switch(tag){
			case(short)0x9F79:
				Util.setShort(dtr_ECLog, (short)0, (short)0x9F79);
				break;
			case(short)0xDF79:
				Util.setShort(dtr_ECLog, (short)0, (short)0xDF79);
				break;
		}
		//Util.setShort(bArray, bOff, sValue)
		EMVUtil.retractBCD(balanceEC, (short)0x0C, dtr_ECLog, offsetBanlance);
		
		if(!isSavingOldBalance){
			if ((lfCurrentRecordEC += (byte) 0x01) == transLogEntryEC[LOG_REC_MAX]) {
				lfCurrentRecordEC = (short) 0x0000;
			}
			if (lfRecordsUsedEC < transLogEntryEC[LOG_REC_MAX]) {
				lfRecordsUsedEC += (byte) 0x01;
			}
			recordOffset = (short) (lfCurrentRecordEC * lfRecordSizeEC);
			Util.arrayFillNonAtomic(logFileEC, recordOffset, lfRecordSizeEC, (byte) 0x00);
			Util.arrayCopy(dtr_ECLog, (short)0, logFileEC, recordOffset, lfRecordSizeEC);
		}
		
	}
	private short findCDOLData(short tag, boolean isFirstGenAC) {
		byte[] cdolRecord;
		short cdolOffset;
		short cdolEndOffset;
		short cdolLen;
		short cdataOffset;

		cdataOffset = 0;

		//cdolRecord = getFile((byte) 0x18, CDOL_Data[0]).getRecord(CDOL_Data[0]);
		cdolRecord=(isFirstGenAC == true ? CDOL1 : CDOL2);
		cdolOffset =(short)0;
		cdolEndOffset = (short) cdolRecord.length;
		while (cdolOffset < cdolEndOffset) {
			cdolLen = EMVUtil.parseDOL(cdolRecord, cdolOffset, dtr_BER_TLV_DOL2);
			if (dtr_BER_TLV_DOL2[OFF_BER_TLV_DOL_TAG] == tag) {
				break;
			}
			cdataOffset = (short) (cdataOffset + dtr_BER_TLV_DOL2[OFF_BER_TLV_DOL_LEN]);
			cdolOffset = (short) (cdolOffset + cdolLen);
		}
		return (cdolOffset >= cdolEndOffset ? (short) 0xFFFF : cdataOffset);
	}
	/**
	 * Sets the Exceeded Velocity Checking Counters bit to 1 in CVR
	 * and returns 0x80 means request online processing
	 * 
	 * @return
	 */
	private byte veloc_exceeded_genac1() {
		IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
		return Constants.CID_ARQC;
	}
	
	/**
	 * Sets the Exceeded Velocity Checking Counters bit to 1 in CVR
	 * and returns 0x00 means request AAC
	 * 
	 * @return
	 */
	private byte check_veloc_excdd_genac2(byte[] src, byte bCID) {
		if ((src != null)
			&& (!EMVUtil.addBCD(dtr_BCDBuffer1, src, dtr_TempKeyBuffer))
			&& (Util.arrayCompare(dtr_TempKeyBuffer, (short) 0x0000, dataA_CTTAUL, (short) 0x0000, (short) 0x000C) != (byte) 0x01)) {
			return bCID;
		}
		IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
		return Constants.CID_AAC;
	}
	
	/**
	 * Check 2 currency code whether they matched or not
	 * return true if they matched
	 * 
	 * @param src
	 * @param srcCurrencyOff
	 * @param cardCurrencyOff
	 * @param sOffset
	 * @param isBCD
	 * @return
	 */
	private boolean checkCurrency(byte[] src, short srcOff, byte[] dest) {
		if (dataS_CTLI >= 0) {
			return (Util.arrayCompare(src, srcOff, dest, (short) 0x0000, (short) 0x0002) == (byte) 0x00 ? true : false);
		} else {
			return false;
		}
	}
	
	/**
	 * Convert second application currency to determine the approximate value of transaction in the application currency
	 * coverted result is stored to dtr_BCDBuffer1
	 * return true if coverted result is overflowed
	 * 
	 * @param src
	 * @return
	 */
	private boolean convertCurrency(byte[] src) {
		short index1, index2, index3;
		short indexCCF;
		byte result1;
		byte result2;

		index1 = (short) (Util.arrayFillNonAtomic(src, (short) 0x0064, (short) 0x0014, (byte) 0x00) - (short) 0x0001);
		indexCCF = (short) 0x0007;
		while (indexCCF >= (short) 0x0001) {
			result2 = (short) 0x0000;
			index2 = index1--;
			index3 = (short) 0x000B;
			while (index3 >= (byte) 0x00) {
				result1 = (byte) (((dtr_BCDBuffer1[index3--] * dataA_CCF[indexCCF]) + result2) + src[index2]);
				src[index2--] = (byte) (result1 % (byte) (short) 0x000A);
				result2 = (byte) (result1 / (short) 0x000A);
			}
			src[index2] = result2;
			indexCCF -= (short) 0x0001;
		}
		index1 = (short) 0x0064;
		while (index1 < (short) ((short) 0x006C - dataA_CCF[(short) 0x0000])) {
			if (src[index1++] != (byte) 0x00) {
				return true;
			}
		}
		Util.arrayCopyNonAtomic(src, index1, dtr_BCDBuffer1, (short) 0x0000, (short) 0x000C);
		return false;
	}
	/**
	 * Check whether Issuer Authentication was successful or not, and reset values according to result. 
	 * 
	 * @param isApproved
	 */
	private void checkIssuerAuth(boolean isApproved) {
		
		//If Issuer Auth Supported
		if ((AIP & Constants.AIP_ISS_AUTH_SUPP) != (short) 0) {
			if (dtr_Flags[OFF_IS_ISSUER_AUTHENTICATION_PERFPRMED] ==  Constants.TRUE) {
				
				if (data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]== Constants.TRUE) {
					if (isApproved) {
						IAD[Constants.CVR_BYTE_2] |= Constants.CVR_B2_ISS_AUTH_PERFORM_AND_FAILED;
					}
					return;
				}
			} else {
				
				IAD[Constants.CVR_BYTE_3] |= Constants.CVR_B3_ISS_AUTH_NOT_DONE_AFTER_ONLINE_AUTH;
				if (data_Flags[OFF_IS_AUTH_MANDAROTY]==Constants.TRUE) {
					
					data_Flags[OFF_IS_ISSUER_AUTHENTICATION_FAILED]= Constants.TRUE;
					return;
				}
			}
		}

	
		
		data_Flags[OFF_IS_ONLINE_REQUESTED]= Constants.FALSE;
		data_Flags[OFF_IS_DDA_FAILED]= Constants.FALSE;
		data_Flags[OFF_IS_SDA_FAILED]= Constants.FALSE;
		
		Issuer_Script_Indicator_byte = (byte) 0x00;

		if (isApproved) {
			Util.arrayCopy(Constants.ZERO, (short) 0x0000, dataA_CTTA, (short) 0x0000, (short) 0x000C);
			Util.arrayCopy(Constants.ZERO, (short) 0x0000, dataA_CTTADC, (short) 0x0000, (short) 0x000C);
			//addDebugLog((short)9077);
			dataS_CTCI = (short) 0x0000;
			//addDebugLog((short)9078);
			dataS_CTCIC = (short) 0x0000;
			dataS_lastOnlineATC = dataS_ATC;
			
		}
		return;
	}


	/**
	 * Increment Counters
	 * 
	 * @param isACCMatched
	 */
	private void incrementCounters(boolean isACCMatched) {
		if (dtr_Flags[OFF_IS_DOMESTIC]== Constants.FALSE) {
			dataS_CTCIC += (short) 0x0001;
		}
		if (!isACCMatched) {
			dataS_CTCI += (short) 0x0001;
		}
		return;
	}
	/**
	 * Check SDA, DDA and CDA result in TVR
	 * 
	 * @param src array which contains TVR data
	 * @param srcOff TVR offset
	 */
	private void checkTVR(byte[] src, short srcOff) {

		if (((AIP & Constants.AIP_SDA_SUPP) != (short) 0x0000) && ((src[srcOff] & Constants.TVR_B1_OFFLINE_SDA_FAIL) != (byte) 0x00)) {
			data_Flags[OFF_IS_SDA_FAILED]= Constants.TRUE;
		}
		if (((AIP & Constants.AIP_DDA_SUPP) != (short) 0x0000) && ((src[srcOff] & Constants.TVR_B1_OFFLINE_DDA_FAIL) != (short) 0x00)) {
			data_Flags[OFF_IS_DDA_FAILED]= Constants.TRUE;
		}
		if (((AIP & Constants.AIP_CV_SUPP) != (short) 0x0000) && ((src[srcOff] & Constants.TVR_B1_CDA_FAIL) != (short) 0x00)) {
			data_Flags[OFF_IS_DDA_FAILED]= Constants.TRUE;
		}
		return;
	}
	
	byte forATM(byte[] apduBuffer,byte currentCID ){
		
		byte cid=currentCID;
		byte requestCID = apduBuffer[ISO7816.OFFSET_P1];
		//2012.02.07-cyf EC checking
		//Store Amount(authorised) to tmpBCDBuffer temporarily in BCD format
		EMVUtil.expandBCD(apduBuffer, ISO7816.OFFSET_CDATA, (short) 0x0006, dtr_BCDBuffer1);
		 
		if(EMVUtil.compareBCD(ECAC,dtr_BCDBuffer1)!=0){
			
			if(requestCID == Constants.CID_ARQC){
				
				cid = Constants.CID_ARQC;
				
			}else{
				cid = Constants.CID_AAC;
			}
			
			
		}else if (Util.arrayCompare(TCC, (short) 0x0000, apduBuffer, (short) 0x0018, (short) 0x0002) != (byte) 0x00){
			if(requestCID == Constants.CID_ARQC){
				
				cid = Constants.CID_ARQC;
			
				
			}else{
				cid = Constants.CID_AAC;
			}
		}
		return cid;
	} 
	
	void checkPersoDataCL(APDU apdu){
		
		byte[] apduBuffer = apdu.getBuffer();
		
		if (numOfKCVs == (byte) 0x00) {
			Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short) 0x0000, apduBuffer, Constants.OFF_PERSO_DGI_DATA, (short) 0x0030);
			dealWithDESKeys(apduBuffer, Constants.OFF_PERSO_DGI_DATA, apdu);
		}
		
		if(logFile_buffer_q==null){
			logFile_buffer_q=JCSystem.makeTransientByteArray((short) (lfRecordSize), JCSystem.CLEAR_ON_DESELECT);
	    }

	
		if(iccPrivateCrtKey!=null||iccPrivateKey!=null){
			if(rsaCipher==null){
				rsaCipher = Cipher.getInstance(Cipher.ALG_RSA_NOPAD, false);
			}
			if(shaDigest==null){
				shaDigest = MessageDigest.getInstance(MessageDigest.ALG_SHA, false);
			}
		}
		
		if(iccPrivateCrtKey!=null){
			rsaCipher.init(iccPrivateCrtKey,Cipher.MODE_ENCRYPT);
			if(aflListCL!=null&&nIC>(short)128){
				short len=(short)aflListCL.length;
				short filelen=(short)(nIC+3+4+9);
				byte index_File;
				byte recordNum;
				if(recordACforFDDA!=null){
					index_File=(byte) ((recordACforFDDA[0] & ((short) 0x00FF)) >> (byte) 0x03);	
					recordNum = recordACforFDDA[1];
					if(index_File<1||index_File>Constants.NUMBER_RECORD_FILE||recordNum==0){
						ISOException.throwIt(ISO7816.SW_DATA_INVALID);
					}
				}else{
					/*index_File = (byte) ((aflListCL[(short) (len - 4)] & ((short) 0x00FF)) >> (byte) 0x03);		
					recordNum = aflListCL[(short) (len - 2)];*/
					index_File = (byte) ((aflListCL[(short) 0] & ((short) 0x00FF)) >> (byte) 0x03);		
					recordNum = aflListCL[(short) 2];
				}
			    index_File--;
				//Write data into record 
			    if(recordFile[index_File]==null){
			    	recordFile[index_File]=new PBOCFile((byte)((index_File+1)&0xFF));
			    }
				((PBOCFile)recordFile[index_File]).appendRecord(filelen,(short)(recordNum&0xFF));					
				
			}				  
		}
		if(ContactlessPDOL!=null&&aflListCL!=null){
		   RecoveryData=new byte[(short)(OFFSET_RECOBERY_CTTAL+12)];
		   if(RecoveryDataBuffer==null){
			   RecoveryDataBuffer=JCSystem.makeTransientByteArray((short) RecoveryData.length, JCSystem.CLEAR_ON_DESELECT);
		   }
		   
		   
		   LengthArrayForPDOL_CL=new short[5];
		   
		   short offsetPDOL;
		   
		   //TCC
		   offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x5F2A,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		   if(offsetPDOL!=(short)0xFFFF){
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TCC]=(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL);					
		   }else{
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TCC]=offsetPDOL;
		   }	   
	
		   //IN_Terminal		   
		   offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F37,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		   if(offsetPDOL!=(short)0xFFFF){
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_IN_TERMINAL]=(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL);					
		   }else{
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_IN_TERMINAL]=offsetPDOL;
		   }
		   //ECAC		   
		   offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F02,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		   if(offsetPDOL!=(short)0xFFFF){
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_ECAC]=(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL);					
		   }else{
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_ECAC]=offsetPDOL;
		   }
		    //TTQ
		   offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0x9F66,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		   if(offsetPDOL!=(short)0xFFFF){
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ]=(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL);					
		   }else{
			   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ]=offsetPDOL;
		   }	
		   
		   
		   if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
			   offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0xDF60,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
			   if(offsetPDOL!=(short)0xFFFF){
				   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_EXTENDED]=(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL);					
			   }else{
				   LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_EXTENDED]=offsetPDOL;
			   }
		   }
		}
	}
	
	
	boolean isPBOCTrasnsaction(APDU apdu){
		byte[] apduBuffer = apdu.getBuffer();
		short offsetTTQ=(short)0xFFFF;
			
		//offsetPDOL=getDOLRelatedDataOffset((short)0x9F66,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		//offsetTTQ=offsetPDOL;
		offsetTTQ=LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ];
		if(offsetTTQ!=(short)0xFFFF){
			 Util.arrayCopyNonAtomic(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ],TTQ, (short)0,(short)TTQ.length);
			 byte TTQ_Byte1 = TTQ[0];
			 
			
			 if((byte)(TTQ_Byte1&0x40)==(byte)0x40){
				 return true;
			 }else  if((byte)(TTQ_Byte1&0x20)==(byte)0x20){
				 return false;
			 }else{
				 ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			 }			 
					 
		 }else{
			 return true;
		 }
		
		return true;

	}
	
	
	void qPBOCPath(APDU apdu){
	
		
		byte[]apduBuffer=apdu.getBuffer();
	

		Util.arrayCopyNonAtomic(Constants.ZERO, (short)0x0000, IAD_Buffer, (short)0, (short)0x0007);
		byte TTQ_Byte1=apduBuffer[(short)(LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ])];
		byte TTQ_Byte2=apduBuffer[(short)(LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ]+1)];
		
		 //addDebugLog((short)0x9001);
		//addDebugLog(apduBuffer,(short)0,(short)50);
		//available offline spending Amount 
		//7.7.1 
		boolean isACCMactched;
		boolean  checkingOnline=false;
		boolean  finishOnline=false;
		boolean checkingOffline=false;
		boolean finishOffline=false;
		boolean isOfflineOnly=((byte)(TTQ_Byte1&0x08)==(byte)0x08);
		byte CID_qPBOC=(byte)0;
		
		byte[] cardCVMLimit = CardCVMLimit;
		short offsetPDOL;
		/*//TCC
		offsetPDOL=getDOLRelatedDataOffset((short)0x5F2A,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		//offsetPDOL=(short)23;
		if(offsetPDOL!=(short)0xFFFF){
			Util.arrayCopyNonAtomic(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TCC], TCC, (short)0x00, (short)0x02);
		}
		
	   //IN_Terminal
	   offsetPDOL=getDOLRelatedDataOffset((short)0x9F37,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		//offsetPDOL=(short)29;
		if(offsetPDOL!=(short)0xFFFF){
			Util.arrayCopyNonAtomic(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL), IN_Terminal, (short)0x00, (short)0x04);
	   }
	    
		   //ECAC
		   offsetPDOL=getDOLRelatedDataOffset((short)0x9F02,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
		  // offsetPDOL=(short)4;
		   if(offsetPDOL!=(short)0xFFFF){
				ECAC= PBOC.setData(apduBuffer, (short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL), ECAC, (short) 0x000C, true);
		   }	*/
		CTQ[0]=CTQ_Byte1;
		CTQ[1]=CTQ_Byte2;
	
	    Util.arrayCopyNonAtomic(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TCC], TCC, (short)0x00, (short)0x02);
		//tcc = Util.getShort(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TCC]);	 
		Util.arrayCopyNonAtomic(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_IN_TERMINAL], IN_Terminal, (short)0x00, (short)0x04);	 
		EMVUtil.expandBCD(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_ECAC], (short) 0x0006, ECAC);
		
		//PBOC.setData(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_ECAC], ECAC, (short) 0x000C, true);
	   //isACCMactched=(Util.arrayCompare(TCC,(short)0,ACC,(short)0,(byte)2)==0);
		
		if(flagPartPurchase!=(byte)0x00){
			  offsetPDOL=EMVUtil.getDOLRelatedDataOffset((short)0xDF60,ContactlessPDOL,(short)0,(short)ContactlessPDOL.length);
			  if(offsetPDOL!=(short)0xFFFF){
				  CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] = apduBuffer[(short)(ISO7816.OFFSET_CDATA + 2+offsetPDOL)];
			  }
		}
		//check extended is supported or not
		
		  
		
	   isACCMactched=checkCurrencyIsMatched();
	   if(dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
		   cardCVMLimit = CardCVMLimitECS;
	   }
	   if(!isACCMactched&&(CAP[CAP_BYTE_2]&0x40)==0x40){
			 //7.17
		   CID_qPBOC=Constants.CID_AAC;
		   //addDebugLog((short)0x9002);
		   generateAC_fDDA(apdu,CID_qPBOC);
	   }else{	 
		   //Terminal only support offline transaction 7.7.2
		   if(isOfflineOnly){
			   //new card && CAP 2nd byte 6 bit->AAC
				if(dataS_lastOnlineATC==(short)0&&(byte)(CAP[CAP_BYTE_2]&0x20)==0x20){
					//generate AAC
					CID_qPBOC=Constants.CID_AAC;
					//addDebugLog((short)0x9003);
				//CAP 1st byte 4 bit&&pin no retry Remaining->AAC
				
				}else if ((byte)(CAP[CAP_BYTE_1]&0x08)==0x08&&(Pin != null)  && (Pin.getTriesRemaining() == (byte) 0x00)) {
					IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD; //set CVR	
					//generate AAC
					CID_qPBOC=Constants.CID_AAC;
					 //addDebugLog((short)0x9004);
				}else if((byte)(TTQ_Byte2&0x40)==(byte)0x40||
					(EMVUtil.compareBCD(ECAC,cardCVMLimit)<0&&isACCMactched)||
					(!isACCMactched&&(byte)(CAP[CAP_BYTE_3]&0x20)==0x20)){
					
					 //addDebugLog((short)0x9005);
					if((byte)(TTQ_Byte1&0x02)==(byte)0x02&&(byte)(CAP[CAP_BYTE_3]&0x10)==(byte)0x10){
						//set 7th bit of fist byte of CTQ to 1
						CTQ[0]|=(byte)0x40;
						//7.7.5
						 //addDebugLog((short)0x9006);
						checkingOffline=true;
					}else{
						//7.7.16 terminate transaction
						//ISOException.throwIt((short)0x9001);
						 //addDebugLog((short)0x9007);
						dataS_ATC = (short) (dataS_ATC + (short) 0x0001);
						ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
					}
					
				}else{
					//7.7.5
					 //addDebugLog((short)0x9008);
					checkingOffline=true;
				}
			}else{
				//7.7.3 CVM requirement
				 //addDebugLog((short)0x9009);
				if((byte)(TTQ_Byte2&0x40)!=(byte)0x40&&
					((EMVUtil.compareBCD(ECAC,cardCVMLimit)>=0&&isACCMactched)||
						(!isACCMactched&&(byte)(CAP[CAP_BYTE_3]&0x20)==(byte)0x00))){
					//7.7.4	
					 //addDebugLog((short)0x9010);
						checkingOnline=true;
				}else{
					 //addDebugLog((short)0x9011);
					if(((byte)(TTQ_Byte2&0x40)==(byte)0x40)||(((byte)(TTQ_Byte2&0x40)!=(byte)0x40)&&EMVUtil.compareBCD(ECAC,cardCVMLimit)<0&&isACCMactched)||
							((((byte)(TTQ_Byte2&0x40)!=(byte)0x40))&&!isACCMactched&&((byte)(CAP[CAP_BYTE_3]&0x20)==(byte)0x20))){
						//boolean terminateTransaction=true;
						//addDebugLog((short)0x9012);
						
						if((byte)(TTQ_Byte1&0x04)==(byte)0x04&&((isACCMactched&&(byte)(CAP[CAP_BYTE_3]&0x80)==(byte)0x80)||
								(!isACCMactched&&(byte)(CAP[CAP_BYTE_3]&0x40)==(byte)0x40))){
									//set 8th bit of fist byte of CTQ to 1
									//addDebugLog((short)0x9013);
									CTQ[0]|=(byte)0x80;
									//terminateTransaction=false;
									//7.7.15
									finishOnline=true;
									CID_qPBOC=Constants.CID_ARQC;;
						}else  if((byte)(TTQ_Byte1&0x02)==(byte)0x02&&(byte)(CAP[CAP_BYTE_3]&0x10)==(byte)0x10){
						//terminateTransaction=false;
						//7.7.4
						//set 7th bit of fist byte of CTQ to 1
							//addDebugLog((short)0x9014);
							CTQ[0]|=(byte)0x40;
							checkingOnline=true;
						}else{
							//addDebugLog((short)0x9015);
							dataS_ATC = (short) (dataS_ATC + (short) 0x0001);
							ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
						}
					}
					}
			}
			//7.7.4
			if(checkingOnline==true){
				if((byte)(TTQ_Byte2&0x80)==(byte)0x80){
					//7.7.15
					//////addDebugLog((short)0x9016);
					finishOnline=true;
					CID_qPBOC=Constants.CID_ARQC;
				}else{
					if(!isACCMactched&&(byte)(CAP[CAP_BYTE_1]&0x04)!=(byte)0x04){
						   //addDebugLog((short)0x9017);
							finishOnline=true;
							CID_qPBOC=Constants.CID_ARQC;
						
					}else if((byte)(CAP[CAP_BYTE_1]&0x10)==(byte)0x10&&dataS_lastOnlineATC==(short)0){
							//addDebugLog((short)0x9018);
							finishOnline=true;
							IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_NEW_CARD;
							CID_qPBOC=Constants.CID_ARQC;
							
							
					}else if((byte)(CAP[CAP_BYTE_1]&0x08)==(byte)0x08&&Pin != null&& (Pin.getTriesRemaining() == (byte) 0x00)){
						    //addDebugLog((short)0x9019);
							IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_PIN_TRY_LIMIT_EXCDD; //set CVR	
							//generate AAC
							finishOnline=true;
							CID_qPBOC = Constants.CID_ARQC;
					}else{
							//addDebugLog((short)0x9020);
							checkingOffline=true;
							CID_qPBOC = Constants.CID_TC;
					}
				}
			}
			 
			//7.7.5
			if(checkingOffline==true){
				
				if(!isACCMactched){
					//addDebugLog((short)0x9021);
					//addDebugLog((short)CTCI);
					//addDebugLog((short)CTLI);
					
					//7.7.13
					if(dataS_CTCI >= dataS_CTLI){
						IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
						if((TTQ_Byte1&0x08)==(byte)0x08){
							//addDebugLog((short)0x9022);
							//7.7.17	
							CID_qPBOC=Constants.CID_AAC;
						
						}else{
							//7.7.15
							//addDebugLog((short)0x9023);
							finishOnline=true;
							CID_qPBOC=Constants.CID_ARQC;
						}
					}else{
					    //addDebugLog((short)0x9024);
					    saveRecoveryData();
					    dataS_CTCI++;
						////addDebugLog((short)0x9024);
						
						finishOffline=true;
						CID_qPBOC=Constants.CID_TC;
					}
				
				}else{
					//7.7.6
					if((byte)(CAP[CAP_BYTE_1]&0x80)==(byte)0x80){
						//addDebugLog((short)0x9025);
						//only offline
						if(isOfflineOnly){	
							if(data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]==Constants.TRUE&&dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
								if(EMVUtil.compareBCD(ECAC,ECSAB)<0||EMVUtil.compareBCD(ECAC,ECSABSTL)<0){									
									//7.7.17
									IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
									CID_qPBOC=Constants.CID_AAC;
								}else{
									isSecondQEC = true;
									saveRecoveryData();
									EMVUtil.subBCD(ECSAB,ECAC,dtr_BCDBuffer1);
									Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECSAB,(short)0,(short)12);									
									//addDebugLog((short)0x9026);
									CID_qPBOC=Constants.CID_TC;
									finishOffline=true;
								}
							}else{
						/*		if(EMVUtil.compareBCD(ECAC,ECB)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0){									
									//7.7.17
									IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
									CID_qPBOC=Constants.CID_AAC;
								}else{
									saveRecoveryData();
									EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
									Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);									
									//addDebugLog((short)0x9026);
									CID_qPBOC=Constants.CID_TC;
									finishOffline=true;
								}*/
								if((data_Flags[OFF_IS_EXTENDED_SUPPORDTED]!=Constants.TRUE||!(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] ==EXTENDED_TRANSACTION_PRE_AUTHORITY3||(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE &&data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE)))
										&&(EMVUtil.compareBCD(ECAC,ECB)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0) ){									
										//7.7.17
											IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
											CID_qPBOC=Constants.CID_AAC;
										}else{
										/*	saveRecoveryData();
											subBCD(ECB,ECAC,dtr_BCDBuffer1);
											Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
											//addDebugLog((short)0x9026);
											CID_qPBOC=CID_TC;
											finishOffline=true;*/
											
											if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE ){
												if(data_Flags[OFF_IS_TOUZHI_SPUPPORTED]!=Constants.TRUE){
													if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
													   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
													}
													
													saveRecoveryData();
													EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
													Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
													//addDebugLog((short)0xConstants.9026);
													CID_qPBOC=Constants.CID_TC;
													dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
													finishOffline=true;
												}else{
												
													EMVUtil.addBCD(ECB,LimitOfECPartPurchase,dtr_BCDBuffer1);
													EMVUtil.addBCD(AmountECPartPurchase,ECAC,dtr_BCDBuffer2);
													if(EMVUtil.compareBCD(dtr_BCDBuffer2,dtr_BCDBuffer1)<0){
														IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
														CID_qPBOC=Constants.CID_AAC;
													}else{
														if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
														   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
														}
														
														saveRecoveryData();
														
														if(EMVUtil.compareBCD(ECAC,ECB)<0){
																EMVUtil.addBCD(ECAC,AmountECPartPurchase,dtr_BCDBuffer1);
																EMVUtil.subBCD(dtr_BCDBuffer1,ECB,dtr_BCDBuffer1);
															   Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,AmountECPartPurchaseBuffer,(short)0,(short)12);
															   Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,ECB,(short)0,(short)12);	
															   dtr_FlagsCAPP[OFFSET_TOUZHI] =true;
															
														}else{
															EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
															Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
														}
														//addDebugLog((short)0x9026);
														CID_qPBOC=Constants.CID_TC;
														dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
														finishOffline=true;
													}
												}
											}else if (CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2){
												   if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
													   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
												   }
												   
												
											
												if(check4thConsecutivePreAuth()){
													ISOException.throwIt(Constants.SW_CONSECCUTIVE_4TH_OFFLINE_PREAUTHOEITY);
												}
												if(checkConsecutiveSamePreAuth()<3){
													ISOException.throwIt(Constants.SW_CONSECCUTIVE_SAME_OFFLINE_PREAUTHOEITY);
												}
											
												saveRecoveryData();
												EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
												
												Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
												//addDebugLog((short)0x9026);
												CID_qPBOC=Constants.CID_TC;
												dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
												finishOffline=true;
												
												
											}else if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] ==EXTENDED_TRANSACTION_PRE_AUTHORITY3 ){
												   if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
													   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
												   }
												short index =checkConsecutiveSamePreAuth();
												if(index==3){
													ISOException.throwIt(Constants.SW_PREAUTHOEITY_TRSANSACTION);
												}
												Util.arrayCopyNonAtomic((byte[])preAuthority[index],OFFSET_PREAUTH_AMOUNT,dtr_BCDBuffer1,(short)0,(short)12);
											
												EMVUtil.addBCD(ECB,dtr_BCDBuffer1,dtr_BCDBuffer2);
												if(EMVUtil.compareBCD(ECAC,dtr_BCDBuffer2)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0){
													IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
													CID_qPBOC=Constants.CID_AAC;
												}else{
													saveRecoveryData();
													EMVUtil.subBCD(dtr_BCDBuffer2,ECAC,dtr_BCDBuffer1);
													if(data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE){
														
														if(EMVUtil.compareBCD(AmountECPartPurchase,dtr_BCDBuffer1)<0){
															
																EMVUtil.subBCD(AmountECPartPurchase,dtr_BCDBuffer1,dtr_BCDBuffer1);
															   Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,AmountECPartPurchaseBuffer,(short)0,(short)12);
															   Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,ECB,(short)0,(short)12);	
															   dtr_FlagsCAPP[OFFSET_TOUZHI] =true;
														}else{
															   EMVUtil.subBCD(dtr_BCDBuffer1,AmountECPartPurchase,dtr_BCDBuffer1);
															   Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
															   Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,AmountECPartPurchaseBuffer,(short)0,(short)12);	
															   dtr_FlagsCAPP[OFFSET_TOUZHI] =true;
														}
														
														   
														
														
													}else{
														Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
													}
													
													
													//addDebugLog((short)0x9026);
													CID_qPBOC=Constants.CID_TC;
													dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
													finishOffline=true;
												}
											}else{
												
											
												saveRecoveryData();
												EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
												Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
												//addDebugLog((short)0x9026);
												CID_qPBOC=Constants.CID_TC;
												finishOffline=true;
												
			
											}
																				
											
										}
							}
						
						}else{
							if(data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]==Constants.TRUE&&dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]== Constants.TRUE){
								EMVUtil.addBCD(ECAC,ECSART,dtr_BCDBuffer1);
								if(EMVUtil.compareBCD(dtr_BCDBuffer1,ECSAB)<0||EMVUtil.compareBCD(ECAC,ECSABSTL)<0){     				
									//7.7.15
									//addDebugLog((short)0x9026);
								    IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
									finishOnline=true;
									CID_qPBOC=Constants.CID_ARQC;										
							   }else{
								   isSecondQEC = true;
								    saveRecoveryData();
								    EMVUtil.subBCD(ECSAB,ECAC,dtr_BCDBuffer1);
									Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECSAB,(short)0,(short)12);									
									//addDebugLog((short)0x9027);
									CID_qPBOC=Constants.CID_TC;
									finishOffline=true;
							    }	
							}else{
							/*	EMVUtil.addBCD(ECAC,ECRT,dtr_BCDBuffer1);
								if(EMVUtil.compareBCD(dtr_BCDBuffer1,ECB)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0){     				
									//7.7.15
									//addDebugLog((short)0x9026);
								    IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
									finishOnline=true;
									CID_qPBOC=Constants.CID_ARQC;										
							   }else{	
								    saveRecoveryData();
								    EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
									Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);									
									//addDebugLog((short)0x9027);
									CID_qPBOC=Constants.CID_TC;
									finishOffline=true;
							    }	*/
								EMVUtil.addBCD(ECAC,ECRT,dtr_BCDBuffer1);
								if((data_Flags[OFF_IS_EXTENDED_SUPPORDTED]!=Constants.TRUE||!(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] ==EXTENDED_TRANSACTION_PRE_AUTHORITY3||(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE &&data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE)))
								&&(EMVUtil.compareBCD(dtr_BCDBuffer1,ECB)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0)){     				
									//7.7.15
									//addDebugLog((short)0x9026);
								    IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
									finishOnline=true;
									CID_qPBOC=Constants.CID_ARQC;										
							   }else{
								/*   saveRecoveryData();
									subBCD(ECB,ECAC,dtr_BCDBuffer1);
									Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
									//addDebugLog((short)0x9026);
									CID_qPBOC=CID_TC;
									finishOffline=true;*/
								   
								   if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE ){
									
										if(data_Flags[OFF_IS_TOUZHI_SPUPPORTED]!=Constants.TRUE){
											
											if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
												   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
											}
											saveRecoveryData();
											EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
											Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
											//addDebugLog((short)0x9026);
											CID_qPBOC=Constants.CID_TC;
											dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
											finishOffline=true;
										}else{
											EMVUtil.addBCD(AmountECPartPurchase,dtr_BCDBuffer1,dtr_BCDBuffer2);
											EMVUtil.addBCD(ECB,LimitOfECPartPurchase,dtr_BCDBuffer1);
											if(EMVUtil.compareBCD(dtr_BCDBuffer2,dtr_BCDBuffer1)<0){
												IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
												finishOnline=true;
												CID_qPBOC=Constants.CID_ARQC;
											}else{
												if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
													   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
												}
												saveRecoveryData();
												if(EMVUtil.compareBCD(ECAC,ECB)<0){
													 EMVUtil.addBCD(ECAC,AmountECPartPurchase,dtr_BCDBuffer1);
													 EMVUtil.subBCD(dtr_BCDBuffer1,ECB,dtr_BCDBuffer1);
													 Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,AmountECPartPurchaseBuffer,(short)0,(short)12);
													 Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,ECB,(short)0,(short)12);	
													 dtr_FlagsCAPP[OFFSET_TOUZHI] =true;
												}else{
													
													EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
													Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
												
												}
												//addDebugLog((short)0x9026);
												CID_qPBOC=Constants.CID_TC;
												dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
												finishOffline=true;
											}
										}
									   
									   
										
										
									}else if (CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2){
										   if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
											   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
										   }
										
										if(check4thConsecutivePreAuth()){
											ISOException.throwIt(Constants.SW_CONSECCUTIVE_4TH_OFFLINE_PREAUTHOEITY);
										}
										if(checkConsecutiveSamePreAuth()<3){
											ISOException.throwIt(Constants.SW_CONSECCUTIVE_SAME_OFFLINE_PREAUTHOEITY);
										}
										
										saveRecoveryData();
										EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
										Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
										//addDebugLog((short)0x9026);
										CID_qPBOC=Constants.CID_TC;
										dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
										finishOffline=true;
										
									}else if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] ==EXTENDED_TRANSACTION_PRE_AUTHORITY3 ){
										   if(readCAPP[0]==(byte)0&&!dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]){
											   ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
										   }
										
										short index =checkConsecutiveSamePreAuth();
										if(index==3){
											ISOException.throwIt(Constants.SW_PREAUTHOEITY_TRSANSACTION);
										}
										Util.arrayCopyNonAtomic((byte[])preAuthority[index],OFFSET_PREAUTH_AMOUNT,dtr_BCDBuffer2,(short)0,(short)12);
										
										EMVUtil.addBCD(ECB,dtr_BCDBuffer2,dtr_BCDBuffer2);
										
										
										if(EMVUtil.compareBCD(dtr_BCDBuffer1,dtr_BCDBuffer2)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0){    
											 IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
												finishOnline=true;
												CID_qPBOC=Constants.CID_ARQC;	
										}else{
											
										
											saveRecoveryData();
											EMVUtil.subBCD(dtr_BCDBuffer2,ECAC,dtr_BCDBuffer1);
											
											if(data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE){
												
												if(EMVUtil.compareBCD(AmountECPartPurchase,dtr_BCDBuffer1)<0){
													
													   EMVUtil.subBCD(AmountECPartPurchase,dtr_BCDBuffer1,dtr_BCDBuffer1);
													   Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,AmountECPartPurchaseBuffer,(short)0,(short)12);
													   Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,ECB,(short)0,(short)12);	
													   dtr_FlagsCAPP[OFFSET_TOUZHI] =true;
												}else{
													   EMVUtil.subBCD(dtr_BCDBuffer1,AmountECPartPurchase,dtr_BCDBuffer1);
													   Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
													   Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,AmountECPartPurchaseBuffer,(short)0,(short)12);	
													   dtr_FlagsCAPP[OFFSET_TOUZHI] =true;
												}
												
												   
												
												
											}else{
												Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
											}
											//addDebugLog((short)0x9026);
											CID_qPBOC=Constants.CID_TC;
											dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION] =true;
											finishOffline=true;
										}
										
									
									}else{
									   saveRecoveryData();
									    EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
										Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);									
										//addDebugLog((short)0x9027);
										CID_qPBOC=Constants.CID_TC;
										finishOffline=true;
										
									}
							    }							
								
								
							}
													
						}
					}else{
						//7.7.7  7.7.11
						//addDebugLog((short)0x9026);
						if((byte)(CAP[CAP_BYTE_1]&0x40)==(byte)0x40){
							
							EMVUtil.addBCD(ECAC,dataA_CTTA,dtr_BCDBuffer1);
							
							//7.7.11
							//only offline
							if(isOfflineOnly){
									if((dataA_CTTAUL!=null?EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAUL)<0:EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAL)<0)
									||EMVUtil.compareBCD(ECAC,ECB)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0){							
										//addDebugLog((short)0x9027);
										//7.7.17
										IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
										CID_qPBOC=Constants.CID_AAC;
									}else{	
										saveRecoveryData();
										EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
										Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
										EMVUtil.addBCD(dataA_CTTA,ECAC,dtr_BCDBuffer2);
										Util.arrayCopyNonAtomic(dtr_BCDBuffer2,(short)0,dataA_CTTA,(short)0,(short)12);
										finishOffline=true;
										//addDebugLog((short)0x9028);										
										CID_qPBOC=Constants.CID_TC;
								   }	
							}else {
									EMVUtil.addBCD(ECAC,ECRT,dtr_BCDBuffer2);
									
								   if((dataA_CTTAUL!=null?EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAUL)<0:EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAL)<0)||EMVUtil.compareBCD(dtr_BCDBuffer2,ECB)<0||EMVUtil.compareBCD(ECAC,ECBSTL)<0){								
										IAD_Buffer[Constants.CVR_BYTE_3]|=Constants.CVR_B3_VELOC_EXCDD;
										finishOnline=true;
										CID_qPBOC=Constants.CID_ARQC;
										//addDebugLog((short)0x9029);
								   }else{	
										saveRecoveryData();	
										EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
										Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
										EMVUtil.addBCD(dataA_CTTA,ECAC,dtr_BCDBuffer2);
										Util.arrayCopyNonAtomic(dtr_BCDBuffer2,(short)0,dataA_CTTA,(short)0,(short)12);									
										finishOffline=true;
										//addDebugLog((short)0x9030);						
										CID_qPBOC = Constants.CID_TC;
									}										   
							}
						}else{
							//addDebugLog((short)0x9027);
							//7.7.8	
							if((CAP[CAP_BYTE_1]&0x20)==(byte)0x20){
	
								EMVUtil.addBCD(ECAC,dataA_CTTA,dtr_BCDBuffer1);
									
									//only offline
									if(isOfflineOnly){
										if(EMVUtil.compareBCD(ECAC,ECBSTL)<0||(EMVUtil.compareBCD(ECAC,ECB)<0&&(dataA_CTTAUL!=null?EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAUL)<0:EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAL)<0))){
										    IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
										    ////addDebugLog((short)0x9099);
											CID_qPBOC=Constants.CID_AAC;	
										}else{
											saveRecoveryData();
											if(EMVUtil.compareBCD(ECAC,ECB)>=0){
												EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
												Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
											}else{
												EMVUtil.addBCD(dataA_CTTA,ECAC,dtr_BCDBuffer2);
												Util.arrayCopyNonAtomic(dtr_BCDBuffer2,(short)0,dataA_CTTA,(short)0,(short)12);
											}
											//addDebugLog((short)0x9098);
											
											//7.7.14
											finishOffline=true;
											CID_qPBOC=Constants.CID_TC;
										}
											
									}else{
										if((EMVUtil.compareBCD(ECAC,ECBSTL)<0||((EMVUtil.compareBCD(ECAC,ECB)<0&&(dataA_CTTAUL!=null?EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAUL)<0:EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAL)<0))))){
											//addDebugLog((short)0x9097);
											//7.7.15
											finishOnline=true;
											IAD_Buffer[Constants.CVR_BYTE_3] |= Constants.CVR_B3_VELOC_EXCDD;
											CID_qPBOC = Constants.CID_ARQC;
									
										}else{
											saveRecoveryData();
											if(EMVUtil.compareBCD(ECAC,ECB)>=0){
												EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
												Util.arrayCopyNonAtomic(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
											}else{
												EMVUtil.addBCD(dataA_CTTA,ECAC,dtr_BCDBuffer2);
												Util.arrayCopyNonAtomic(dtr_BCDBuffer2,(short)0,dataA_CTTA,(short)0,(short)12);
											}
											//7.7.14
											finishOffline=true;
											CID_qPBOC= Constants.CID_TC;
										}
									}
						}else{
							//addDebugLog((short)0x9028);
							//7.7.9
							if(isOfflineOnly){
								//7.17
								CID_qPBOC = Constants.CID_AAC;
							}else{
								//7.7.15
								finishOnline=true;
								CID_qPBOC = Constants.CID_ARQC;
							}
						}
					}
				}
			}
		 }
		////addDebugLog(AOSA,(short)0,(short)12);
		//Offonline
			
			//ISOException.throwIt((short)0x9044);
			 
		if(finishOffline){
			//addDebugLog((short)0x9029);
			generateAC_fDDA(apdu,CID_qPBOC);
		//online	
		}else if(finishOnline){
			//addDebugLog((short)0x9030);
			if((byte)(CAP[CAP_BYTE_1]&0x02)==(byte)0x02&&(byte)(TTQ_Byte1&0x10)==(byte)0x10){ 
				//7.7.16 terminate transaction
				//ISOException.throwIt((short)0x9003);
				//addDebugLog((short)0x9031);
				dataS_ATC = (short) (dataS_ATC + (short) 0x0001);
				ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			}else{
				//addDebugLog((short)0x9032);
				if((byte)(CAP[CAP_BYTE_2]&0x80)==(byte)0x80){
					//addDebugLog((short)0x9033);
					
					if(EMVUtil.compareBCD(ECAC,Constants.ZERO)==0){
						//AAC
						CID_qPBOC=Constants.CID_AAC;
						//addDebugLog((short)0x9034);
						generateAC_fDDA(apdu,CID_qPBOC);
					}else{
						if((byte)(CAP[CAP_BYTE_1]&0x40)==(byte)0x40){ 
							//addDebugLog((short)0x9035);
							//addDebugLog(ECB,(short)0,(short)12);
							EMVUtil.addBCD(ECAC,dataA_CTTA,dtr_BCDBuffer1);
							//addDebugLog(dtr_BCDBuffer1,(short)0,(short)12);
							if(EMVUtil.compareBCD(ECAC,ECB)<0||(dataA_CTTAUL!=null?EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAUL)<0:EMVUtil.compareBCD(dtr_BCDBuffer1,dataA_CTTAL)<0)){
								//addDebugLog((short)0x9030);
								CID_qPBOC = Constants.CID_AAC;
								generateAC_fDDA(apdu,CID_qPBOC);
								
							}else{
								JCSystem.beginTransaction();
								EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
								Util.arrayCopy(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
								EMVUtil.addBCD(dataA_CTTA,ECAC,dtr_BCDBuffer2);
								Util.arrayCopy(dtr_BCDBuffer2,(short)0,dataA_CTTA,(short)0,(short)12);
								
								CID_qPBOC=Constants.CID_ARQC;
								//generate AC and setting CVR
								//addDebugLog((short)0x9039);
								generateAC_fDDA(apdu,CID_qPBOC);
								JCSystem.commitTransaction();									}
							
						}
					
						if((byte)(CAP[CAP_BYTE_1]&0x80)==(byte)0x80){ 
							//addDebugLog((short)0x9036);
							if(EMVUtil.compareBCD(ECAC,ECB)<0){								
								CID_qPBOC=Constants.CID_AAC;
								generateAC_fDDA(apdu,CID_qPBOC);
							}else{
								JCSystem.beginTransaction();
								EMVUtil.subBCD(ECB,ECAC,dtr_BCDBuffer1);
								Util.arrayCopy(dtr_BCDBuffer1,(short)0,ECB,(short)0,(short)12);
								CID_qPBOC=Constants.CID_ARQC;
								//generate AC and setting CVR
								//addDebugLog((short)0x9039);
								generateAC_fDDA(apdu,CID_qPBOC);
								JCSystem.commitTransaction();
							}
						}
					}
					
				}else{
					CID_qPBOC=Constants.CID_ARQC;
					//generate AC and setting CVR
					//addDebugLog((short)0x9039);
					generateAC_fDDA(apdu,CID_qPBOC);
				}
				
			}
		}else{
			//addDebugLog((short)0x9037);
			//AAC
			CID_qPBOC=Constants.CID_AAC;
			generateAC_fDDA(apdu,CID_qPBOC);
		}
	  }
	}
	private boolean checkCurrencyIsMatched(){
		
		boolean isACCMactched=(Util.getShort(TCC, (short)0) == Util.getShort(dataA_ACC,(short)0));
       
	    //-cyf 2012.04.03 Secondory Currency for E-cash
	    if(!isACCMactched&&data_Flags[OFF_IS_SECONDARY_EC_SUPPORTED]==Constants.TRUE){
		    if(isACCMactched=(Util.getShort(TCC, (short)0) == Util.getShort(dataA_ECSACC,(short)0))){
			    dtr_Flags[OFF_IS_SENCOND_CURRENCY_RETURN]= Constants.TRUE;
		    }
	    }
	    
	    return isACCMactched;
	}
	
	void saveRecoveryData(){
 
	    Util.setShort(RecoveryDataBuffer,OFFSET_RECOBERY_CTCI,dataS_CTCI);
	    if(isSecondQEC){
	    	Util.arrayCopyNonAtomic(ECSAB,(short)0,RecoveryDataBuffer,OFFSET_RECOBERY_ECB,(short)12);
	    }else{
	    	Util.arrayCopyNonAtomic(ECB,(short)0,RecoveryDataBuffer,OFFSET_RECOBERY_ECB,(short)12);
	    }
	    
	    Util.arrayCopyNonAtomic(dataA_CTTA,(short)0,RecoveryDataBuffer,OFFSET_RECOBERY_CTTA,(short)12);
	    
	    if(dataA_CTTAUL!=null)Util.arrayCopyNonAtomic(dataA_CTTAUL,(short)0,RecoveryDataBuffer,OFFSET_RECOBERY_CTTAUL,(short)12);
	    if(dataA_CTTAL!=null)Util.arrayCopyNonAtomic(dataA_CTTAL,(short)0,RecoveryDataBuffer,OFFSET_RECOBERY_CTTAL,(short)12);
	   
	    Util.arrayCopyNonAtomic(RecoveryDataBuffer,(short)0,RecoveryData,(short)0,(short)RecoveryData.length);
	    isRecoeryNeeded=true;
	}		
	 /*
	 void setRecoveryFlag(){
		 
	 }
	 */
	void recoveryData(){
		if(isRecoeryNeeded){
		     JCSystem.beginTransaction();
		     //ATC= Util.getShort(RecoveryData,OFFSET_RECOBERY_ATC);
		     dataS_CTCI= Util.getShort(RecoveryData,OFFSET_RECOBERY_CTCI);
		     if(isSecondQEC){
		    	 Util.arrayCopy(RecoveryData,OFFSET_RECOBERY_ECB,ECSAB,(short)0,(short)12);
		    	 isSecondQEC=false;
		     }else{
		    	 Util.arrayCopy(RecoveryData,OFFSET_RECOBERY_ECB,ECB,(short)0,(short)12);
		     }
		    
		     Util.arrayCopy(RecoveryData,OFFSET_RECOBERY_CTTA,dataA_CTTA,(short)0,(short)12);
		     if(dataA_CTTAUL!=null) Util.arrayCopy(RecoveryData,OFFSET_RECOBERY_CTTAUL,dataA_CTTAUL,(short)0,(short)12);
		     if(dataA_CTTAL!=null) Util.arrayCopy(RecoveryData,OFFSET_RECOBERY_CTTAL,dataA_CTTAL,(short)0,(short)12);
		     //Util.arrayCopyNonAtomic(RecoveryData,(short)0,RecoveryData,(short)0,(short)RecoveryData.length);
		     isRecoeryNeeded=false;
		     
		     JCSystem.commitTransaction();
		}		
	}
  
    private void generateAC_fDDA(APDU apdu,byte cid){
		byte[] apduBuffer=apdu.getBuffer();
		//for generatte 
		short macOffset, endMacOffset,sCDOLOff;
		short sOffset=0;
		byte[] IAD_temp;
		
		
		byte TTQ_Byte4 =0;
		short tcc = Util.getShort(apduBuffer, LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TCC]);
		
		short offsetTTQ=LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ];
		if(offsetTTQ!=(short)0xFFFF){
			TTQ_Byte4=apduBuffer[(short)(LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_TTQ]+3)];
			dtr_Flags[OFF_IS_FDDA01]=((byte)(TTQ_Byte4&0x80)==(byte)0x80)?Constants.TRUE:Constants.FALSE;
		}
		
		if(data_Flags[OFF_IS_CL_IAD]==Constants.TRUE){
			IAD_temp=IAD_CL;
		}else{
			IAD_temp=IAD;
		}
		
		//IAD[CVR_BYTE_2]=(byte)0x10;
		dataS_ATC=(short)(dataS_ATC+1);
		
		if(cid==Constants.CID_TC){
			IAD_Buffer[Constants.CVR_BYTE_2]= Constants.CVR_B2_GAC1_TC;
			//addDebugLog(IAD,(short)0,(short)IAD.length);
			//ISOException.throwIt((short)0x9002);
			//77+81xx+AIP(4)+AFL(2+X)+ATC(5)
		/*	macOffset = (short)(17+aflListCL.length);
			//macOffset = (short)(3+4+aflListCL.length+2+5+3);
			endMacOffset = (short)( macOffset+8);
		*/
			
			
			if(!(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&
					CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2
					)){
				macOffset = (short)(17+aflListCL.length);
				//macOffset = (short)(3+4+aflListCL.length+2+5+3);
				endMacOffset = (short)( macOffset+8);
				if((byte)(CAP[this.CAP_BYTE_2]&0x10) == (byte)0x010){
					saveLogToBuffer(apdu);
				}
			}else{
				macOffset = (short)(14+aflListCL.length);
				endMacOffset = macOffset;
				if((byte)(CAP[this.CAP_BYTE_2]&0x10) == (byte)0x010){
					saveLogToBuffer(apdu);
				}
			}
			
			
			
		}else{
			//77+xx+AIP(4)+ATC(5)+Trac2data+IAD(+IDD)
			if(cid==Constants.CID_ARQC){
				IAD_Buffer[Constants.CVR_BYTE_2]=Constants.CVR_B2_GAC1_ARQC;
				/*if((byte)(CAP[CAP_BYTE_1]&0x10)==(byte)0x10)
				dataS_lastOnlineATC = dataS_ATC;*/
			
			}
			else{
				IAD_Buffer[Constants.CVR_BYTE_2]=Constants.CVR_B2_GAC1_AAC;
			}
			macOffset = (short)(3+4+5+2+dataA_Trac2Data.length+3+8+3);
			if(IAD_temp[7]!=0){
				macOffset=(short)(macOffset+IAD_temp[7]+1);
			}
			
			endMacOffset = (short)( macOffset+8);
			
		}
		
		
		sCDOLOff = ISO7816.OFFSET_CDATA;
		if(IAD_temp[1]==(byte)1){
			////addDebugLog(tmpSrcBuffer, (short)0x00, (short)0x40);
			//Util.arrayCopyNonAtomic(apduBuffer, (short)0x00, tmpSrcBuffer, (short)0x00, (short)0x40);
		/*    if (buildCDOLDataForAC(tmpSrcBuffer, apduBuffer, true) == false) {
				ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
			}*/
		    //addDebugLog(apduBuffer, (short)0x00, (short)0x40);
			if(!(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&
					CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2
					&&cid==Constants.CID_TC)){
				
				if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
				    if(LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_EXTENDED]==(short)(ISO7816.OFFSET_CDATA + 2)){
					 sCDOLOff++;
				    }
				 }
			
				IAD_Buffer[Constants.CVR_BYTE_1]=(byte)0x03;
				Util.arrayCopyNonAtomic(
						IAD_Buffer,
						Constants.CVR_BYTE_1,
						apduBuffer,
						Util.setShort(apduBuffer, Util.setShort(apduBuffer, (short) (sCDOLOff + (short) 0x0023), AIP_QPBOC), dataS_ATC),
						(short) 0x0004);
				//addDebugLog( apduBuffer, sCDOLOff, (short) 0x0025);
				//Calculate MAC and store it to apudbuffer
					performVisMAC(getSessionKey(keys[Constants.DESKEY_UDK]), apduBuffer, (short)(sCDOLOff+6), (short) 0x0025);
					Util.arrayCopyNonAtomic(
						dtr_TempKeyBuffer,
						(short) 0x0000,
						apduBuffer,
						macOffset,
						(short) 0x0008);
			}
		   }
			if(IAD_temp[1]==(byte)17||IAD_temp[1]==(byte)23){
				//addDebugLog((short)0x9072);
			// CVN17 AC source = Amount,Authorized(6, '9F02') || Unpredictable Number(4, '9F37') || ATC(2) || IAD byte 5(1)
				if(!(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&
						CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2
						&&cid==Constants.CID_TC)){
					
					if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
						   if(LengthArrayForPDOL_CL[OFFSET_PDOL_Cl_EXTENDED]==(short)(ISO7816.OFFSET_CDATA + 2)){
								 sCDOLOff++;
							    }
					}
					EMVUtil.retractBCD(ECAC,(short)12,apduBuffer,sCDOLOff);
					Util.arrayCopyNonAtomic(IN_Terminal,(short)0,apduBuffer,(short)(sCDOLOff+6),(short)4);
					Util.arrayCopyNonAtomic(
							IAD_Buffer,
							Constants.CVR_BYTE_2,
							apduBuffer,
							Util.setShort(apduBuffer,(short) (sCDOLOff + (short) 0x000A), dataS_ATC),
							(short) 0x0001);
					//Calculate MAC and store it to apudbuffer
					//addDebugLog((short)0x9071);
						performVisMAC(getSessionKey(keys[Constants.DESKEY_UDK]), apduBuffer, sCDOLOff, (short) 0x000D);
						Util.arrayCopyNonAtomic(
							dtr_TempKeyBuffer,
							(short) 0x0000,
							apduBuffer,
							macOffset,
							(short) 0x0008);
					}
		   }
			
			if(!(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&
					CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2
					&&cid==Constants.CID_TC)){
				apduBuffer[Util.setShort(apduBuffer, (short)(macOffset-3), (short) 0x9F26)] = (byte) 0x08;
			}
			 byte[] record = null;
			if(cid==Constants.CID_TC){
				
				
				if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
					
					if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE||
							CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY3	){
						Util.arrayCopyNonAtomic(apduBuffer,	macOffset,lastExtendedACBuffer,(short) 0,(short) 0x08);
						Util.setShort(lastExtendedACBuffer,(short) 8,dataS_ATC);
						dtr_FlagsCAPP[OFFSET_UPDATE_CAPP] = true;
					}else if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2){
						Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,lastExtendedACBuffer,(short) 0,(short) 0x08);
						Util.setShort(lastExtendedACBuffer,(short) 8,dataS_ATC);
						  
						dtr_FlagsCAPP[OFFSET_UPDATE_CAPP] = true;
						 
					}
				}
				//addDebugLog((short)0x9073);
				//apduBuffer[0] = (byte) 0x77;
				//apduBuffer[1] = (byte) 0x81;
				//AIP 82
				Util.setShort(apduBuffer, (short) 0x0003, (short) 0x8202);//AIP tag, length
				Util.setShort(apduBuffer, (short) 0x0005, AIP_QPBOC); //Set AIP value
				//AFL(contactless) 94 
				Util.setShort(apduBuffer, (short) 0x0007, (short)((short) 0x9400+AFLListLenCL));//AFL tag, length
				Util.arrayCopyNonAtomic(aflListCL,(short)0,apduBuffer,(short)0x09,AFLListLenCL);
				sOffset=(short)(0x09+AFLListLenCL);
				
				//ATC 9F36
				apduBuffer[Util.setShort(apduBuffer, sOffset, (short) 0x9F36)] = (byte) 0x02;
				sOffset=(short)(sOffset+3);
				Util.setShort(apduBuffer, (short) sOffset, dataS_ATC); //Set ATC value
				sOffset=(short)(sOffset+2);
				
							
				if(!(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&
						CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2)){		
					sOffset=endMacOffset;
				}
				
				//IAD 9F10
				
				sOffset=fillIAD(apduBuffer,sOffset,true,IAD_temp,false);
				Util.arrayCopyNonAtomic(IAD_Buffer,Constants.CVR_BYTE_2,apduBuffer,(short)(endMacOffset+7),(short)3);
				//Trac 2 data  57 
				Util.setShort(apduBuffer, sOffset, (short)((short) 0x5700+(short)dataA_Trac2Data.length));//Trac 2 tag, length
				sOffset=(short)(sOffset+2);
				Util.arrayCopyNonAtomic(dataA_Trac2Data,(short)0,apduBuffer,(short)sOffset,(short)dataA_Trac2Data.length);
				sOffset=(short)(sOffset+dataA_Trac2Data.length);
				
				//5F34 01
				if(data_Flags[OFF_IS_PAN_NUMBER_SHOWED] == Constants.TRUE){
					apduBuffer[Util.setShort(apduBuffer, sOffset, (short) 0x5F34)] = (byte) 0x01;//PAN Number tag, length
					sOffset=(short)(sOffset+3);
					apduBuffer[sOffset++]=PANNumber;
				}
				short startSDAD=sOffset;
				//ISOException.throwIt((short)0x9002);
				if(iccPrivateCrtKey!=null){
					if(nIC>(short)128){
						apduBuffer=dtr_SrcTempBuffer;
						sOffset=(short)3;
						apduBuffer[0]=(byte)(0x70);
						apduBuffer[1]=(byte)(0x81);
						apduBuffer[2]=(byte)((nIC+4)&0xFF);
						apduBuffer[Util.setShort(apduBuffer, (short) sOffset, (short) 0x9F4B)]=(byte) 0x81;
						apduBuffer[(short)(sOffset+3)]=(byte) nIC; //Set SDAD tag length
						sOffset=(short)(sOffset+4);
					}else if(nIC==(short)128){
						Util.setShort(apduBuffer, (short) sOffset, (short) 0x9F4B); //Set SDAD tag 
						sOffset=(short)(sOffset+2);
						Util.setShort(apduBuffer, (short) sOffset, Util.makeShort((byte) 0x81, (byte) nIC)); //length
						sOffset=(short)(sOffset+2);
					}else{
						apduBuffer[Util.setShort(apduBuffer, sOffset, (short)0x9F4B)]=(byte)nIC;//PAN Number tag, length		
						sOffset=(short)(sOffset+3);					
					}
					
					short offsetSign=sOffset;
					/* Set SDAD Data Start */
					Util.setShort(apduBuffer, (short) sOffset, (short) 0x6A05); //Header, format
					sOffset=(short)(sOffset+2);
					
					if(dtr_Flags[OFF_IS_FDDA01]==Constants.TRUE){
						apduBuffer[sOffset++]=(byte)1;
						apduBuffer[sOffset++]=(byte)(3+len_CardAuthRelatedData);
					}else{
						Util.setShort(apduBuffer, (short) sOffset, (short) 0x0103); //HAI, IDD length
						sOffset=(short)(sOffset+2);
					}
					
					/* ICC Dynamic Data Start */
					apduBuffer[sOffset++]=(byte)2;
					
					Util.setShort(apduBuffer, sOffset, dataS_ATC); //ICC Dynamic Number
					sOffset=(short)(sOffset+2);				
		             
					if(dtr_Flags[OFF_IS_FDDA01]==Constants.TRUE){
						//ISOException.throwIt((short)0x9007);
						//update card 
						randomData.generateData(dtr_record_CardAuthRelatedData, OFFSET_CARD_UNPREDICTABLE_NUM, (short)4);
						Util.arrayCopyNonAtomic(CTQ,(short)0,dtr_record_CardAuthRelatedData, OFFSET_CARD_CTQ, (short)2);
						if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
							dtr_record_CardAuthRelatedData[OFFSET_CARD_RFU]=flagPartPurchase;	
						}
						Util.arrayCopyNonAtomic(dtr_record_CardAuthRelatedData,OFFSET_CARD_UNPREDICTABLE_NUM,record_CardAuthRelatedData,(short)(offset_CardAuthRelatedData+OFFSET_CARD_UNPREDICTABLE_NUM),(short)7);
						
						Util.arrayCopyNonAtomic(record_CardAuthRelatedData, offset_CardAuthRelatedData, apduBuffer, sOffset, len_CardAuthRelatedData);
						sOffset=(short)(sOffset+len_CardAuthRelatedData);	
					}
					
					//Generate Transaction Data Hash
					//Util.arrayCopyNonAtomic(apduBuffer, (short) 0x0003, hashBuffer, hashBufferPtr, (short) 0x0009);
					//Util.arrayCopyNonAtomic(apduBuffer, endMacOffset, hashBuffer, (short) (hashBufferPtr + 9), sOffset);
					//shaDigest.doFinal(hashBuffer, (short) 0x0000, (short) (hashBufferPtr + (short) 0x0009 + sOffset), apduBuffer, (short) 0x0020);
					/* ICC Dynamic Data End */
		
				
					//addDebugLog( apduBuffer, offsetSign, (short) nIC_Crt);
					
					if(dtr_Flags[OFF_IS_FDDA01]==Constants.TRUE){
						Util.arrayFillNonAtomic(apduBuffer, (short) sOffset, (short) (nIC - (short) 0x0003 -len_CardAuthRelatedData- (short) 0x0019), (byte) 0xBB); //Padding
						//Util.arrayCopyNonAtomic(IN_Terminal, (short)0, apduBuffer, (short) (offsetSign+1+nIC_Crt - (short) 0x0019+3-8), (short) 0x0004);
						//9F37
						Util.arrayCopyNonAtomic(IN_Terminal, (short)0, apduBuffer, (short) (offsetSign+nIC - (short) 0x15), (short) 0x0004);
						//set 9F02
						EMVUtil.getValueBCD(apduBuffer, (short) (offsetSign+nIC - (short) 0x0015+4), (short) 0x0006, ECAC);
						//set 5F2A
						Util.setShort(apduBuffer, (short) (offsetSign+nIC - (short) 0x0015+4+6), tcc);
						//9F69
						Util.arrayCopyNonAtomic(record_CardAuthRelatedData, offset_CardAuthRelatedData, apduBuffer, (short) (offsetSign+nIC - (short) 0x0015+4+6+2), len_CardAuthRelatedData);
						//Util.arrayCopyNonAtomic(IN_Terminal, (short)0, apduBuffer, (short) (offsetSign+nIC - (short) 0x15), (short) 0x0004);
						
					}else{
						Util.arrayFillNonAtomic(apduBuffer, (short) sOffset, (short) (nIC - (short) 0x0003- (short) 0x0019), (byte) 0xBB); //Padding
						//Util.arrayCopyNonAtomic(IN_Terminal, (short)0, apduBuffer, (short) (offsetSign+1+nIC_Crt - (short) 0x0019+3), (short) 0x0004);
						Util.arrayCopyNonAtomic(IN_Terminal, (short)0, apduBuffer, (short) (offsetSign+nIC - (short) 0x0015), (short) 0x0004);
					}
				
					//addDebugLog( apduBuffer, offsetSign, (short) nIC_Crt);
					apduBuffer[(short) (offsetSign+nIC -1)] = (byte) 0xBC; //Trailer
					//addDebugLog( apduBuffer, offsetSign, (short) nIC_Crt);
					//Set Hashresult
				/*	shaDigest.doFinal(
						apduBuffer,
						(short) (offsetSign+1),
						(short) ((short) 0x0003 + nIC_Crt  - (short) 0x0019+4),
						apduBuffer,
						(short) (offsetSign+nIC_Crt - (short) 0x0014-1));*/
					if(dtr_Flags[OFF_IS_FDDA01]==Constants.TRUE){
					  shaDigest.doFinal(
								
								apduBuffer,
								(short) (offsetSign+1),
								(short) ((short)  nIC  - (short) 0x0012+0x10),
								apduBuffer,
								(short) (offsetSign+nIC - (short) 0x0015));
					}else{
						shaDigest.doFinal(
					
							apduBuffer,
							(short) (offsetSign+1),
							(short) ((short)  nIC  - (short) 0x0012),
							apduBuffer,
							(short) (offsetSign+nIC - (short) 0x0015));
					
					}
				/*		shaDigest.doFinal(
								apduBuffer,
								(short) (offsetSign+1),
								(short) ((short)  nIC  - (short) 0x0012),
								apduBuffer,
								(short) (offsetSign+nIC - (short) 0x0015));*/
						//Log( apduBuffer, offsetSign, (short) nIC_Crt);
			
						//Set Sign
						// generatAC() 밖에서 transaction 처리를 하므로 이를 제거함.
						//JCSystem.beginTransaction();
						
						//JCSystem.commitTransaction();
						//addDebugLog((short)0x9074);
						//rsaCipherCrt.init(iccPrivateCrtKey, Cipher.MODE_ENCRYPT);
						//addDebugLog((short)0x9075);
						if(bCounterOfInstance>1){
							rsaCipher.init(iccPrivateCrtKey,Cipher.MODE_ENCRYPT);
						}
						rsaCipher.doFinal(apduBuffer, (short) offsetSign, nIC, apduBuffer, (short) offsetSign);
						
					if(nIC==(short)128){	
						sOffset=(short)(startSDAD+nIC+4);
					}else if(nIC<128){
						sOffset=(short)(startSDAD+nIC+3);
					}else{
						//retrieve the value of sfffset and apdu buffer
						sOffset=startSDAD;
						
					   if(aflListCL!=null){
						   short len=(short)aflListCL.length;
						  /* if(aflListCL[(short)(len-4)]==(byte)(apduBuffer[ISO7816.OFFSET_P2]&0x00F8)&&aflListCL[(short)(len-2)]==apduBuffer[ISO7816.OFFSET_P1]){
							   isRecoeryNeeded=false;
						   }*/					  
			
						   if(recordACforFDDA!=null){
							   record = getFileRecord((byte) recordACforFDDA[0],recordACforFDDA[1]);
						   }else{
							   //record = getFileRecord((byte) aflListCL[(short) (len - 4)],aflListCL[(short) (len - 2)]);
							   record = getFileRecord((byte) aflListCL[0],aflListCL[2]);
						   }
						
						   Util.arrayCopy(apduBuffer, (short) 0, record, (short) 0x0000, (short)(nIC+3+4));
						       //record[2]=(byte)((short)(nIC_Crt+4)&0xFF);
					   }				   
					   // restore apduBuffer from tmpSrcBuffer
						apduBuffer=apdu.getBuffer();					
						//write record 
					}
				}
				//addDebugLog((short)0x9076);
		}else{
			//addDebugLog((short)0x9077);
		    //apduBuffer[0] = (byte) 0x77;          
			data_Flags[OFF_LAST_TRSNS_IS_DDA01]=Constants.FALSE;
			//AIP 82
			Util.setShort(apduBuffer, (short) 0x0003, (short) 0x8202);//AIP tag, length
			Util.setShort(apduBuffer, (short) 0x0005, AIP_QPBOC); //Set AIP value
			//ATC 9F36
			apduBuffer[Util.setShort(apduBuffer, (short)0x07, (short) 0x9F36)] = (byte) 0x02;
		
			Util.setShort(apduBuffer, (short)0x0A, dataS_ATC); //Set ATC value		
			
			//Trac 2 data  57 
			Util.setShort(apduBuffer,(short)0x0C, (short)((short) 0x5700+(short)dataA_Trac2Data.length));//Trac 2 tag, length
			Util.arrayCopyNonAtomic(dataA_Trac2Data,(short)0,apduBuffer,(short)0x0E,(short)dataA_Trac2Data.length);
			sOffset=(short)((short)0x0E+dataA_Trac2Data.length);
			
			short offset_cvr=sOffset;
			//IAD 9F10
			if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&cid==Constants.CID_ARQC){
				sOffset=fillIAD(apduBuffer,sOffset,true,IAD_temp,true);
			}else{
				sOffset=fillIAD(apduBuffer,sOffset,true,IAD_temp,false);
			}
			
			Util.arrayCopyNonAtomic(IAD_Buffer,Constants.CVR_BYTE_2,apduBuffer,(short)(offset_cvr+7),(short)3);
			
			sOffset=endMacOffset;
			
			if(cid == Constants.CID_ARQC&&ProductTag!=null){
				apduBuffer[Util.setShort(apduBuffer, sOffset, (short) 0x9F63)] = (byte)ProductTag.length;//PAN Number tag, length
				sOffset=(short)(sOffset+3);
				
				Util.arrayCopyNonAtomic(ProductTag, (short)0, apduBuffer,sOffset , (short)ProductTag.length);
				sOffset=(short)(sOffset+ProductTag.length);
			}
			//5F34 01 
			//if PAN is showed    -2011.5.08 by cyf
			if(data_Flags[OFF_IS_PAN_NUMBER_SHOWED] == Constants.TRUE){
				apduBuffer[Util.setShort(apduBuffer, sOffset, (short) 0x5F34)] = (byte) 0x01;//PAN Number tag, length
				sOffset=(short)(sOffset+3);
				apduBuffer[sOffset++]=PANNumber;
			}	
		}
		
		if(data_Flags[OFF_IS_CTQ_PRESONALIZED]==Constants.TRUE){
			apduBuffer[Util.setShort(apduBuffer, sOffset, (short) 0x9F6C)] = (byte) 0x02;//Card Transaction Qualifies tag, length
			sOffset=(short)(sOffset+3);
			apduBuffer[sOffset++]=CTQ[0];
			apduBuffer[sOffset++]=CTQ[1];
		}		
		//addDebugLog((short)0x9079);
		if((byte)(CAP[CAP_BYTE_1]&0x1)==0x01&&data_Flags[OFF_IS_AOSL_SHOWED] == Constants.TRUE){
			if(cid!=Constants.CID_TC||(cid==Constants.CID_TC&&nIC<=128)||(cid==Constants.CID_TC&&iccPrivateCrtKey==null)){
				apduBuffer[Util.setShort(apduBuffer, sOffset, (short) 0x9F5D)] = (byte) 0x06;//Card Transaction Qualifies tag, length
				sOffset=(short)(sOffset+3);
				//addDebugLog((short)0x9080);
				getTagValue((short) 0x9F5D,apduBuffer,sOffset);
				//Util.arrayCopyNonAtomic(aosa,(short)0,apduBuffer,sOffset,(short)6);
				sOffset=(short)(sOffset+6);
			}else{
				if(record!=null){
				record[Util.setShort(record, (short)(nIC+3+4), (short) 0x9F5D)]= (byte) 0x06;
				getTagValue((short) 0x9F5D,dtr_BCDBuffer3,(short)0);
				Util.arrayCopy(dtr_BCDBuffer3,(short)0,record,(short)(nIC+3+4+3),(short)6);
				record[2]=(byte)((short)(nIC+4+9)&0xFF);
				}
			}
		}
		
		short totLen = (short)(sOffset - (short)0x0003);
		sOffset = (short)0x0002;
		apduBuffer[sOffset] = (byte)totLen;
		sOffset -= (short)0x0001;
		if (totLen > (short)0x007F) {
			apduBuffer[sOffset] = (byte)0x81;
			sOffset -= (short)0x0001;
			totLen += (short)0x0001;
		}
		apduBuffer[sOffset] = (byte)0x77;
		totLen += (short)0x0002;
		
		//waitMinimumDelay(IDX_DELAY_LOOP_GPO_FORMAT_2);
		////addDebugLog(apduBuffer,(short)0,(short)50);
		apdu.setOutgoingAndSend(sOffset, totLen);
		
		/*if(cid==CID_TC){
			apduBuffer[2] = (byte) (sOffset-3);
		}else{
			apduBuffer[1] = (byte) (sOffset-2);
		}
		apdu.setOutgoingAndSend((short)0,sOffset);*/
	} 	  
    
    short readRecordQPBOC(APDU apdu,short lenRecord){
    	byte[] apduBuffer = apdu.getBuffer();
    	short len;
    	
	    if(isRecoeryNeeded){
		    len=(short)aflListCL.length;
		    /*  if(aflListCL[(short)(len-4)]==(byte)(apduBuffer[ISO7816.OFFSET_P2]&0x00F8)&&aflListCL[(short)(len-2)]==apduBuffer[ISO7816.OFFSET_P1]){
			   
			    isRecoeryNeeded=false;
		    }*/
		
	    	if(aflListCL[(short)(len-4)]==(byte)(apduBuffer[ISO7816.OFFSET_P2]&0x00F8)&&aflListCL[(short)(len-2)]==apduBuffer[ISO7816.OFFSET_P1]){
    		     
	    		if(dtr_FlagsCAPP[OFFSET_IS_EXTENDED_TRANSACION]&&(!dtr_FlagsCAPP[OFFSET_UPDATE_CAPP_SUCCESSFUL]||!dtr_FlagsCAPP[OFFSET_READ_UPDATE_CAPP_SAME]||dtr_FlagsCAPP[OFFSET_UPDATE_CAPP_WRONG])){
				   dtr_FlagsCAPP[OFFSET_UPDATE_CAPP_WRONG]=false;
				   ISOException.throwIt(Constants.SW_UPDATE_WRONG);
				   
			   }  
	    		JCSystem.beginTransaction();
			    isRecoeryNeeded=false;
			    if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
					   if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE||
							CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2||
							CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY3	){
						   Util.arrayCopy(lastExtendedACBuffer,	(short)0,lastExtendedAC,(short) 0,(short) 10);
						
					   }
				   
				 
				       if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE &&data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE&& dtr_FlagsCAPP[OFFSET_TOUZHI]){
					
						   Util.arrayCopy(AmountECPartPurchaseBuffer,(short)0,AmountECPartPurchase,(short)0,(short)12);
						  	
					   }
					   if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] ==EXTENDED_TRANSACTION_PRE_AUTHORITY2 ){
					   
						   savePreauth();
					   }
					   if(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] ==EXTENDED_TRANSACTION_PRE_AUTHORITY3 ){
							if(data_Flags[OFF_IS_TOUZHI_SPUPPORTED]==Constants.TRUE&& dtr_FlagsCAPP[OFFSET_TOUZHI]){
								Util.arrayCopy(AmountECPartPurchaseBuffer,(short)0,AmountECPartPurchase,(short)0,(short)12);
							}
						   short index =checkConsecutiveSamePreAuth();
						/*	if(index==3){
								ISOException.throwIt(this.SW_PREAUTHOEITY_TRSANSACTION);
							}*/
							Util.arrayCopyNonAtomic((byte[])preAuthority[index],OFFSET_PREAUTH_AMOUNT,dtr_BCDBuffer1,(short)0,(short)12);
							Util.arrayCopy(Constants.ZERO,(short)0,(byte[])preAuthority[index],OFFSET_SFI,(short)8);	
							Util.arrayCopy(Constants.ZERO,(short)0,(byte[])preAuthority[index],(short)(OFFSET_SFI+8),(short)8);	
							//Util.arrayFillNonAtomic((byte[])preAuthority[index],OFFSET_SFI,(short)15,(byte)0);
						}
		
					   updateCAPP();
				   }
			       
			    
				if((byte)(CAP[this.CAP_BYTE_2]&0x10) == (byte)0x010){
					saveLog();
				}
				if(dtr_Flags[OFF_IS_FDDA01]==Constants.TRUE){
					data_Flags[OFF_LAST_TRSNS_IS_DDA01]=Constants.TRUE;
				}else{
					if(data_Flags[OFF_LAST_TRSNS_IS_DDA01]==Constants.TRUE){
						data_Flags[OFF_LAST_TRSNS_IS_DDA01]=Constants.FALSE;
					}
				}
				JCSystem.commitTransaction();
		    }
		    
		
	    }
	    
	    if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE){
	    	dtr_FlagsCAPP[OFFSET_UPDATE_CAPP]=false;
	    }
	   
	    if(recordACforFDDA == null){
		    if(aflListCL!=null){
			    len=(short)aflListCL.length;
/*			    if(aflListCL[(short)(len-4)]==(byte)(apduBuffer[ISO7816.OFFSET_P2]&0x00F8)&&aflListCL[(short)(len-2)]==apduBuffer[ISO7816.OFFSET_P1]){
				    if(nIC>(short)128&&!((byte)(CAP[CAP_BYTE_1]&0x1)==0x01&&data_Flags[OFF_IS_AOSL_SHOWED]==Constants.TRUE)){
					    lenRecord=(short)(lenRecord-9);
				    }
				  
			    }*/
			    if(aflListCL[0]==(byte)(apduBuffer[ISO7816.OFFSET_P2]&0x00F8)&&aflListCL[2]==apduBuffer[ISO7816.OFFSET_P1]){
				    if(nIC>(short)128&&!((byte)(CAP[CAP_BYTE_1]&0x1)==0x01&&data_Flags[OFF_IS_AOSL_SHOWED]==Constants.TRUE)){
					    lenRecord=(short)(lenRecord-9);
				    }
				  
			    }
		    }
		
	    }else{
		    if(recordACforFDDA[0]==(byte)(apduBuffer[ISO7816.OFFSET_P2]&0x00F8)&&recordACforFDDA[1]==apduBuffer[ISO7816.OFFSET_P1]){
			    if(nIC>(short)128&&!((byte)(CAP[CAP_BYTE_1]&0x1)==0x01&&data_Flags[OFF_IS_AOSL_SHOWED]==Constants.TRUE)){
				    lenRecord=(short)(lenRecord-9);
			    }
		    }
	    }
	   
	    return lenRecord;
    }
    
    
	void saveLog(){
		short recordOffset;
		
		//Adjust current record and record offset
		if ((lfCurrentRecord += (byte) 0x01) == transLogEntry[LOG_REC_MAX]) {
			lfCurrentRecord = (short) 0x0000;
		}
		if (lfRecordsUsed < transLogEntry[LOG_REC_MAX]) {
			lfRecordsUsed += (byte) 0x01;
		}
		recordOffset = (short) (lfCurrentRecord * lfRecordSize);
		Util.arrayFillNonAtomic(logFile, recordOffset, lfRecordSize, (byte) 0x00);
		
		
		Util.arrayCopy(logFile_buffer_q, (short)0, logFile, recordOffset, lfRecordSize);
	}
	void saveLogToBuffer( APDU apdu){
		short index;
		short dolLen;
		short recordOffset;
		short valueLen;
        byte[] src= apdu.getBuffer();
		if (logFile == null||logFile_buffer_q == null) {
			return;
		} else {
			index = (short) 0x0000;
		
			recordOffset = (short) 0;
			Util.arrayFillNonAtomic(logFile_buffer_q, recordOffset, lfRecordSize, (byte) 0x00);

			while (index < LDOL.length) {
				dolLen = EMVUtil.parseDOL(LDOL, index,dtr_BER_TLV_DOL1);
				valueLen = getTagValue(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG], logFile_buffer_q, recordOffset); //Find from card data
				if (valueLen == (short) 0xFFFF) {
					valueLen = findPDOL_qPBOC(dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_TAG]); //Find from terminal data
					if (valueLen != (short) 0xFFFF) {
						Util.arrayCopyNonAtomic(
							src,
							(short) ((short) ISO7816.OFFSET_CDATA +2+ valueLen),
							logFile_buffer_q,
							recordOffset,
							dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
					}
				}
				recordOffset = (short) (recordOffset + dtr_BER_TLV_DOL1[OFF_BER_TLV_DOL_LEN]);
				index = (short) (index + dolLen);
			}
		}

	}
	
	private short findPDOL_qPBOC(short tag) {
		byte[] cdolRecord;
		short cdolOffset;
		short cdolEndOffset;
		short cdolLen;
		short cdataOffset;

		cdataOffset = 0;

		//cdolRecord = getFile((byte) 0x18, CDOL_Data[0]).getRecord(CDOL_Data[0]);
		cdolRecord=ContactlessPDOL;
		cdolOffset =(short)0;
		cdolEndOffset = (short) cdolRecord.length;
		while (cdolOffset < cdolEndOffset) {
			cdolLen = EMVUtil.parseDOL(cdolRecord, cdolOffset, dtr_BER_TLV_DOL2);
			if (dtr_BER_TLV_DOL2[OFF_BER_TLV_DOL_TAG] == tag) {
				break;
			}
			cdataOffset = (short) (cdataOffset +dtr_BER_TLV_DOL2[OFF_BER_TLV_DOL_LEN]);
			cdolOffset = (short) (cdolOffset + cdolLen);
		}
		return (cdolOffset >= cdolEndOffset ? (short) 0xFFFF : cdataOffset);
	}
	
	//Extened
	void appendRecord(APDU apdu){
		byte[] apduBuffer = apdu.getBuffer();
		if(apduBuffer[ISO7816.OFFSET_CLA]!=(byte)0x04){
			 ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		if(apduBuffer[ISO7816.OFFSET_P1]!=0){
			 ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		short length = (short)(((short)(apduBuffer[ISO7816.OFFSET_LC]&0xFF))+5-4);
	
		apdu.setIncomingAndReceive();
		
		byte index_File=(byte) ((apduBuffer[ISO7816.OFFSET_P2] & ((short) 0x00FF)) >> (byte) 0x03);
		
		
		index_File--;
		
		if(index_File<(byte)0x14){
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}else{
			
			
			
			RecordFile rFile= (RecordFile)recordFile[index_File];
			if(rFile==null){
				ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			}
			
			
			Util.arrayCopyNonAtomic(apduBuffer, (short) ((short)(apduBuffer[ISO7816.OFFSET_LC]&0xFF)+5-4),tmpMACBuffer,(short)0,(short)4);
		/*	if(rFile.getInitializeKeyData()!=null){
				Util.arrayCopyNonAtomic(rFile.getInitializeKeyData(), (short)0,apduBuffer,(short)0,(short)16);
				apdu.setOutgoingAndSend((short)0,(short)16);
				ISOException.throwIt((short)0x9087);

			}else{
				ISOException.throwIt((short)0x9088);
			}*/
			
			extendedKey16.setKey(rFile.getInitializeKeyData(),(short)0);
			
		/*	extendedKey16.setKey(apduBuffer,(short)0);*/
			/*apdu.setOutgoingAndSend((short)0,(short)0x30);
			ISOException.throwIt((short)0x9088);*/
			//checking MAC
			/*	Util.arrayFillNonAtomic(tmpKeyBuffer, (short) 0, (short) 14, (byte) 0x00);		
			
			Util.setShort(tmpKeyBuffer, (short)6, ATC);
			Util.setShort(tmpKeyBuffer,	(short)14, (short) (ATC ^ (short)0xFFFF));
			
			performVisMAC(extendedKey16, apduBuffer, (short)0,  length);*/
			
			generate_cardMAC(extendedKey16, apduBuffer, (short)0,  length,dtr_TempKeyBuffer,(short)0,false,false);
			
			if(Util.arrayCompare(tmpMACBuffer, (short)0, dtr_TempKeyBuffer,(short)0, (short)4)!=0){
				ISOException.throwIt(Constants.SW_SM_INCORRECT);
			}
			
			 //ISOException.throwIt((short)((short)0x9000+length));
			length = (short)(length-5);
            
			
			vk16.setKey(rFile.getInitializeKeyData(),(short)0);
			
			desCipher.init(vk16, Cipher.MODE_DECRYPT);
			desCipher.doFinal(apduBuffer, ISO7816.OFFSET_CDATA, (short) 16,apduBuffer, ISO7816.OFFSET_CDATA);
			//ISOException.throwIt((short)((short)0x9000+length));
			
			rFile.append(apduBuffer, ISO7816.OFFSET_CDATA,length);
			
			
		
	/*		Util.arrayCopyNonAtomic(((LinearVariableFile)rFile).getRecordLengthList(),(short)0,apduBuffer,(short)0,(short)4);
			Util.arrayCopyNonAtomic(((LinearVariableFile)rFile).getBody(),(short)0,apduBuffer,(short)4,(short)0x40);
			apdu.setOutgoingAndSend((short)0,(short)0x44);*/
			//apdu.setOutgoingAndSend((short)0,(short)0x30);
		
		}
		
		
	}
	
	
	private void readCAPPData(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		//flagsClearOnDeselect[OFFSET_READ_CAPP_SUCCESSFUL]= false;
		if(apduBuffer[ISO7816.OFFSET_CLA]!=(byte)0x80){
			 ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		if(apduBuffer[ISO7816.OFFSET_P1]!=(byte)0){
			 ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		byte p2 = apduBuffer[ISO7816.OFFSET_P2];
		short lc = (short)(apduBuffer[ISO7816.OFFSET_LC]&0xFF);
		if(lc>0){
			apdu.setIncomingAndReceive();
			if(lc!=(short)10&&lc!=(short)2){
				 ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
			}
			if(lc==(short)10){
			   dtr_Flags[OFF_HAS_GOT_TERMINAL_RND] = Constants.TRUE;
			   Util.arrayCopyNonAtomic(apduBuffer, (short)(ISO7816.OFFSET_CDATA+2), rndTerminal, (short)0,(short) rndTerminal.length);
			}
		}
		byte conditions= (byte) (p2 & 0x07);
		boolean isFirstConcurence = (conditions==(byte)0) ;
		short id = 0;
		id= Util.getShort(apduBuffer,ISO7816.OFFSET_CDATA);
		
		if(conditions>1){
			ISOException.throwIt(ISO7816.SW_FUNC_NOT_SUPPORTED);
		}
		byte index_File=(byte) ((p2 & ((short) 0x00FF)) >> (byte) 0x03);
		
		if(index_File==(byte)0){
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		index_File--;
		if(index_File<(byte)0x14||index_File>=Constants.NUMBER_RECORD_FILE){
			
			 ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		

		
		}else{
			RecordFile rFile= (RecordFile)recordFile[index_File];
			if(rFile==null){
				ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			}
			
			dtr_FlagsCAPP[OFFSET_UPDATE_CAPP]= false;
			short foundReadNum = rFile.searchReccordByID(id,isFirstConcurence,(short)0);
			if(foundReadNum==(short)0){
				ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
			}else{
				short readLength = rFile.read((byte)foundReadNum,apduBuffer,(short)0,(short)0);
				
				readCAPP[OFFSET_SFI]=(byte)(index_File+1);
				Util.setShort(readCAPP,(short)OFFSET_ID,id);
				readCAPP[OFFSET_REC_NUM]=(byte)(foundReadNum&0xFF);
				
				if(lc==(short)10){
					rFile.setKeyData(foundReadNum,extendedKey16);
					generate_cardMAC(extendedKey16, apduBuffer, (short)0, readLength, apduBuffer, readLength, true,true);
					apdu.setOutgoingAndSend((short)0,(short)(readLength+4));
					
               }else{
            	   
            	   apdu.setOutgoingAndSend((short)0,readLength);
               }
				
				//flagsClearOnDeselect[OFFSET_READ_CAPP_SUCCESSFUL]= true;
			}
		
		}
	}
	
	private void updateCAPPData(APDU apdu) {
		dtr_FlagsCAPP[OFFSET_UPDATE_CAPP_SUCCESSFUL]= false;
		byte[] apduBuffer = apdu.getBuffer();
		if(apduBuffer[ISO7816.OFFSET_CLA]!=(byte)0x84){
			 ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		
		if(apduBuffer[ISO7816.OFFSET_P1]!=(byte)0){
			 ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		byte p2 = apduBuffer[ISO7816.OFFSET_P2];
		short lc = (short) (apduBuffer[ISO7816.OFFSET_LC]&0xFF);
		
		apdu.setIncomingAndReceive();
		if(!dtr_FlagsCAPP[OFFSET_UPDATE_CAPP]||
				CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR]<1||CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR]>3){
			
			 dtr_FlagsCAPP[OFFSET_UPDATE_CAPP_WRONG]= true;
			 ISOException.throwIt(ISO7816.SW_CONDITIONS_NOT_SATISFIED);
		}
		
		byte conditions= (byte) (p2 & 0x07);

		boolean isFirstConcurence = (conditions==(byte)0) ;
		short id = 0;
		id= Util.getShort(apduBuffer,ISO7816.OFFSET_CDATA);
		
		
	
		byte index_File=(byte) ((p2 & ((short) 0x00FF)) >> (byte) 0x03);
		
		if(index_File==(byte)0){
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		
		if(conditions!=(byte)0&&conditions!=(byte)1){
			 ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		
		
	/*	if(readCAPP[0]!=index_File&&id!=Util.getShort(readCAPP,(short)1)){
			flagsClearOnDeselect[OFFSET_UPDATE_CAPP_WRONG]=true;
		}*/
		index_File--;
		
		if(index_File<(byte)0x14||index_File>=Constants.NUMBER_RECORD_FILE){
			
				 ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			
	
			
		}else{
			RecordFile rFile= (RecordFile)recordFile[index_File];
			if(rFile==null){
				ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			}
			
			short foundReadNum; 
			if(rFile.isCyclic()){
				foundReadNum = 0;
			}else{
				foundReadNum= rFile.searchReccordByID(id,isFirstConcurence,(short)(lc-4));
				if(foundReadNum==(short)0){
					ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
				} 
				
						
			}
			short lengRecord = rFile.getRecordLength((byte)foundReadNum);
			
			Util.arrayCopyNonAtomic(apduBuffer, (short) (lc+5-4),tmpMACBuffer,(short)0,(short)4);
			rFile.setKeyData(foundReadNum,extendedKey16);
			
			/*Util.arrayFillNonAtomic(tmpKeyBuffer, (short) 0, (short) 14, (byte) 0x00);
			Util.setShort(tmpKeyBuffer, (short)6, ATC);
			Util.setShort(tmpKeyBuffer,	(short)14, (short) (ATC ^ (short)0xFFFF));
			performVisMAC(extendedKey16, apduBuffer, (short)0, (short) (lc+5-4));*/
			generate_cardMAC(extendedKey16, apduBuffer, (short)0,  (short) (lc+5-4),dtr_TempKeyBuffer,(short)0,false,false);
			
			if (Util.arrayCompare(tmpMACBuffer, (short) 0,
					dtr_TempKeyBuffer,
					(short) 0x0000,
					(short) 0x0004)	!= (byte) 0x00) {	
				
				ISOException.throwIt(Constants.SW_SM_INCORRECT);
			}
			
			apduBuffer[ISO7816.OFFSET_LC] -=4;
		    lc = (short) (apduBuffer[ISO7816.OFFSET_LC]&0xFF);
		    if(readCAPP[OFFSET_SFI]==(byte)(index_File+1)&&id==Util.getShort(readCAPP,OFFSET_ID)){
		    	dtr_FlagsCAPP[OFFSET_READ_UPDATE_CAPP_SAME]=true;
		    }
		    if(dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]&&readCAPP[OFFSET_SFI]==(byte)(index_File+1)
		    		&&(CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY2||CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PRE_AUTHORITY3)){
		    	dtr_FlagsCAPP[OFFSET_READ_UPDATE_CAPP_SAME]=true;
		    }
		    
			if(dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]&&CAPPTransactionIndicator[OFFSET_CAPP_INDICATOR] == EXTENDED_TRANSACTION_PART_PURCHASE ){
				dtr_FlagsCAPP[OFFSET_READ_UPDATE_CAPP_SAME]=true;
			}
		    saveCAPP(apduBuffer,index_File,foundReadNum);
			//rFile.update((byte)foundReadNum,apduBuffer,ISO7816.OFFSET_CDATA,lc);
		    dtr_FlagsCAPP[OFFSET_UPDATE_CAPP_SUCCESSFUL]= true;
		    dtr_FlagsCAPP[OFFSET_UPDATE_CAPP]= true;
		    if(data_Flags[OFF_IS_R_MAC]==Constants.TRUE&&dtr_Flags[OFF_HAS_GOT_TERMINAL_RND]==Constants.TRUE){
				Util.arrayCopyNonAtomic(dtr_TempKeyBuffer, (short)0, tmpCryptoBuffer, (short)4, (short)4);
		    	addRMACForUpdataCAPP(apdu,(short)0x9000);
			}
		}
	}

	private void getTransProve(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		if(apduBuffer[ISO7816.OFFSET_CLA]!=(byte)0x80){
			 ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		if(apduBuffer[ISO7816.OFFSET_P1]!=(byte)0||apduBuffer[ISO7816.OFFSET_P2]!=(byte)0){
			 ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		
		if(apduBuffer[ISO7816.OFFSET_LC]!=(byte)2){
			 ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}
		apdu.setIncomingAndReceive();
		
		short ATC_termianl = Util.getShort(apduBuffer,ISO7816.OFFSET_CDATA);
		
		if(ATC_termianl==0||ATC_termianl !=Util.getShort(lastExtendedAC,(short)8) ){
			ISOException.throwIt(Constants.SW_TC_NOT_USABLE);
		}
			
		Util.arrayCopyNonAtomic(lastExtendedAC,(short)0,apduBuffer,(short)0,(short)8);
		
		apdu.setOutgoingAndSend((short)0,(short)8);
		
	}
	
	boolean check4thConsecutivePreAuth(){
		boolean is4th=true;
		for(byte i=0;i<EXT_PREAUTH_NUM_MAX;i++){
			if(((byte[])preAuthority[i])[OFFSET_SFI]==0){
				is4th=false;
			
			}
		}
		return is4th;
	}
/*	boolean checkConsecutiveSamePreAuth(){
		boolean isSame=false;
		byte[]  temp;
		for(byte i=0;i<3;i++){
			temp = (byte[])preAuthority[i];
			if(temp[OFFSET_SFI]==readCAPP[OFFSET_SFI]&&Util.arrayCompare(temp,OFFSET_ID,readCAPP,OFFSET_ID,(short)2)==0){
				isSame=true;
				return isSame;
				
			}
		}
		return isSame;
	}*/
	
	short checkConsecutiveSamePreAuth(){
		short isSame= 3;
		byte[]  temp;
		RecordFile rFile= (RecordFile)recordFile[(short)(readCAPP[OFFSET_SFI]-1)];
		for(byte i=0;i<EXT_PREAUTH_NUM_MAX;i++){
			temp = (byte[])preAuthority[i];
			if(readCAPP[OFFSET_SFI]!=0){
				
				/*
				 * For cyclic file, only the SFI and ID is cheked
				 * otherwise,SFI, ID and record num should be checked  
				 */
				if(rFile!=null&&rFile.isCyclic()){
					if(temp[OFFSET_SFI]==readCAPP[OFFSET_SFI]&&Util.arrayCompare(temp,OFFSET_ID,readCAPP,OFFSET_ID,(short)2)==0){
						isSame=i;
						return isSame;
						
					}
				}else{
						
					if(temp[OFFSET_SFI]==readCAPP[OFFSET_SFI]&&temp[OFFSET_REC_NUM]==readCAPP[OFFSET_REC_NUM]&&Util.arrayCompare(temp,OFFSET_ID,readCAPP,OFFSET_ID,(short)2)==0){
						isSame=i;
						return isSame;
						
					}
				}
			}
		}
		return isSame;
	}
	
	void savePreauth(){
		boolean isSame=false;
		byte[]  temp;
		for(byte i=0;i<EXT_PREAUTH_NUM_MAX;i++){
			temp = (byte[])preAuthority[i];
			if(temp[OFFSET_SFI]==0){
				isSame=true;
				Util.arrayCopy(readCAPP,OFFSET_SFI,temp,OFFSET_SFI,(short)4);
				Util.arrayCopy(ECAC,(short)0,temp,OFFSET_PREAUTH_AMOUNT,(short)0x0c);
				return;
			}
		}
		
	}
	
	
	void saveCAPP(byte[] apduBuffer,short index, short num ){
		boolean isSame=false;
		short[]  temp;
		short offset =0;
		short len =(short) (apduBuffer[ISO7816.OFFSET_LC]&0xFF);
		for(byte i=0;i<6;i++){
			temp = (short[])infoUpdateCAPP[i];
			if(temp[OFFSET_UPDATE_FLAG]== (byte)0x00){
				temp[OFFSET_UPDATE_FLAG]=Constants.TRUE;
				temp[OFFSET_UPDATA_OFFSET]=(short)offset;
				temp[OFFSET_UPDATA_LENGTH]=(short)len;
				temp[OFFSET_FILE_INDEX]=(short)index;
				temp[OFFSET_RECORD_NUM]=(short)num;
				Util.arrayCopy(apduBuffer,ISO7816.OFFSET_CDATA,dtr_SrcTempBuffer,temp[OFFSET_UPDATA_OFFSET],len);
				return;
			}else if(temp[0]==Constants.TRUE){
				
				offset=(short)(temp[OFFSET_UPDATA_LENGTH]+offset);
			
				
			}
		}
		
	}
	
	void updateCAPP() {
		boolean isSame=false;
		short[]  temp = null;
		RecordFile rFile = null;
		if(data_Flags[OFF_IS_EXTENDED_SUPPORDTED]==Constants.TRUE&&infoUpdateCAPP!=null){
			for(byte i=0;i<6;i++){
				temp = (short[])infoUpdateCAPP[i];
			   if(temp[OFFSET_UPDATE_FLAG]==Constants.TRUE){
				   rFile= (RecordFile)recordFile[temp[OFFSET_FILE_INDEX]];
				   rFile.update((byte)temp[OFFSET_RECORD_NUM],dtr_SrcTempBuffer,temp[OFFSET_UPDATA_OFFSET],temp[OFFSET_UPDATA_LENGTH]);
				   temp[OFFSET_UPDATE_FLAG] =Constants.FALSE;
					
				}
			}
		}
	}
	private void generate_cardMAC(DESKey macKey, byte[] src, short srcOff, short srcLen, byte[] dest, short destOff,boolean isRMAC,boolean isRead)
	{
		srcOff = (short)(srcOff & 0xFF);
		destOff = (short)(destOff & 0xFF);
		srcLen = (short)(srcLen & 0xFF);
	
		srcLen = pad_80(src, srcOff, srcLen, PAD_ADD_BLOCK);
	
	
		// extract right 8-byte key(key A) from the double length key
		macKey.getKey(dtr_TempKeyBuffer, (short)0x00);
		vk8.setKey(dtr_TempKeyBuffer, (short)0x00);
		if(isRMAC){
			if(isRead){
				Util.arrayCopyNonAtomic(rndTerminal, (short)0, tmpCryptoBuffer, (short)0x00, (short)0x08);
			}else{
				Util.arrayCopyNonAtomic(Constants.ZERO, (short)0, tmpCryptoBuffer, (short)0x00, (byte)0x04);
			}
			
		}else{
			// encrypt with DES CBC mode except tha last block
			// initial vector := carder random(4) || 00000000
			Util.arrayCopyNonAtomic(Constants.ZERO, (short)0, tmpCryptoBuffer, (short)0x00, (byte)0x06);
			Util.setShort(tmpCryptoBuffer, (short)6, dataS_ATC);
		}
		
		if (srcLen > 8) {
			sig.init(vk8, Signature.MODE_SIGN, tmpCryptoBuffer, (short)0x00, (short)0x08);
			sig.sign(src, srcOff, (short)(srcLen - 0x08), tmpCryptoBuffer, (short)0x00 );
		}
		
		// encrypt the last block with 3DES
		sig.init(macKey, Signature.MODE_SIGN, tmpCryptoBuffer, (short)0x00, (short)0x08);
		sig.sign(src, (short)(srcOff + srcLen - 0x08), (short)0x08, tmpCryptoBuffer, (short)0x00);
		Util.arrayCopyNonAtomic(tmpCryptoBuffer, (short)0x00, dest, destOff, (short)0x04);
	}
	private short pad_80(byte[] src, short srcOff, short srcLen, byte pad_method) {
		short tempLen;
		
		srcOff = (short)(srcOff & 0xFF);
		srcLen = (short)(srcLen & 0xFF);
				
		switch(pad_method) {	
			case PAD_LAST_BLOCK:
				if ((short)(srcLen % (short)0x08) != (byte)0x00) {
					src[(short)(srcOff + srcLen)] = (byte)0x80;
					srcLen++;
			
					while((byte)(srcLen % 8) != (byte)0x00)
					{
				 		src[(short)(srcOff + srcLen)] = (byte)0x00;
				 		srcLen++;
					}
				}
					
				break;
				
			case PAD_ADD_BLOCK:
				src[(short) (srcOff + srcLen)] = (byte) 0x80;  
				srcLen++;
		
				tempLen = (short) (srcLen % (short) 0x0008);
				if (tempLen > (short) 0x0000) {
					tempLen = (short) ((short) 0x0008 - tempLen);
					Util.arrayFillNonAtomic(src, (short) (srcOff + srcLen), tempLen, (byte) 0x00);
				}
				srcLen = (short) (srcLen + tempLen);
				
				break;			
			}
		
		return srcLen;
	}
	
	
	private void readCAPPLog(APDU apdu) {
		byte[] apduBuffer = apdu.getBuffer();
		if(apduBuffer[ISO7816.OFFSET_CLA]!=(byte)0x00){
			 ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		short num = (short)(apduBuffer[ISO7816.OFFSET_P1]&0xFF);
		byte p2 = apduBuffer[ISO7816.OFFSET_P2];
		
		byte index_File=(byte) ((p2 & ((short) 0x00FF)) >> (byte) 0x03);
		index_File--;
		if(index_File<(byte)0x15||index_File>=Constants.NUMBER_RECORD_FILE){
			if(index_File>=Constants.NUMBER_RECORD_FILE||recordFile[index_File]==null){
				 ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			}
		}else{
			RecordFile rFile= (RecordFile)recordFile[index_File];
			if(rFile==null){
				ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
			}
			
			if(rFile.getMaxRecordNumber()<num){
				ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
			}
		
			short readLength = rFile.read((byte)(num&0xFF),apduBuffer,(short)0,(short)0);
			readCAPP[OFFSET_SFI]=(byte)(index_File+1);
			Util.setShort(readCAPP,(short)OFFSET_ID,(short)0);
			readCAPP[OFFSET_REC_NUM]=(byte)(num&0xFF);
				
		  	dtr_FlagsCAPP[OFFSET_READ_EXTENDED_LOG]=true;
				
			apdu.setOutgoingAndSend((short)0,readLength);
			
		
		}
	}
	byte[] calculateTotalPreAuthAmount(byte[] tempTotal,byte[] tempSingle){
		byte[] temp = null;
		Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,tempTotal,(short)0,(short)12);
		Util.arrayCopyNonAtomic(Constants.ZERO,(short)0,tempSingle,(short)0,(short)12);
		if(preAuthority!=null){
			for(byte i=0;i<EXT_PREAUTH_NUM_MAX;i++){
				temp = (byte[])preAuthority[i];
				if(temp[OFFSET_SFI]!=0){
					Util.arrayCopyNonAtomic(temp,OFFSET_PREAUTH_AMOUNT,tempSingle,(short)0,(short)0x0c);
					EMVUtil.addBCD(tempTotal,tempSingle,tempTotal);							
				}
			}
		}
		return tempTotal;
	}
/*	private boolean checkIdamasSsibalomGaesaeki10seki() {
	    APDU apdu = APDU.getCurrentAPDU();
	    OPSystem.getCPLCData(apdu, (short)259, (short)4, (short)2);
	    byte[] buf = apdu.getBuffer();
	    if ((buf[259] == (byte)0x82 && buf[260] == (byte)0x41)
	    		|| (buf[259] == (byte)0x42 && buf[260] == (byte)0x51)) {
	    return true;
	    
	    }
	    return false;
	}
*/
	private void createExtenedFilePOSB(byte[] apduBuffer,short storedataDataOffset, short sDGLen)
	{
		
		 byte index_File = 0;
		 byte file_type  = 0;
		 byte num = 0;
		 
		 if(sDGLen%Constants.LEN_FILE_INFO!=0){
			 ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		 }
		 numOfExtendedFiles =(short)(sDGLen/7);
		 for(short offset = storedataDataOffset;offset<(short)(storedataDataOffset+sDGLen);offset=(short)(offset+Constants.LEN_FILE_INFO)){
			 index_File =apduBuffer[(short)(offset+Constants.OFFSET_FILE_INFO_SFI)];
			 index_File--;
			 file_type =apduBuffer[(short)(offset+Constants.OFFSET_FILE_INFO_TYPE)];
			 extendedFileList[num] =index_File;
			 num++;
			 if(recordFile[index_File]==null){
				 if(file_type == RecordFile.TYPE_VARIABLE){
			
					// recordFile[index_File] = new Object();
					
					 recordFile[index_File]=new LinearVariableFile(apduBuffer,(short)(offset+Constants.OFFSET_FILE_INFO_READ));
			
					
					 
				 }else if(file_type == RecordFile.TYPE_CYCLIC){
					 recordFile[index_File]=new CyclicFixedFile(apduBuffer,(short)(offset+Constants.OFFSET_FILE_INFO_READ));
				
					
				 }
				  
			 }else{
				//pass  
			 }
			 
		 }
		
		
			
	}
	
	private void dealWithDESKeys_extended(byte[] src, short srcOff, APDU apdu) {
		short index;

		if (numOfExtendedKeys == (byte) 0x00) {
			ISOException.throwIt(Constants.SW_EXTENDED_KEY_CHECK);
		}

		Util.setShort(src, (short) (8+19*numOfExtendedKeys+5), (short) 0x8110); //for decrypt and verify by securedomain
		src[(short)  (8+19*numOfExtendedKeys+5+16+2)] = (short) 0x0003;
		index = Constants.OFF_PERSO_DGI_DATA;

		for(short i=0;i<numOfExtendedKeys;i++){
			if (numOfExtendedKeys > (byte) 0x00) {
				if (!saveKey_extended(apdu, src, (short)(index+(short)(16*i)), (short) (index + (short)(16*numOfExtendedKeys+i*3)), extendedFileList[i])) {
					if (numOfExtendedKCVs > (byte) 0x00) {
						ISOException.throwIt((short)(Constants.SW_EXTENDED_KEY_CHECK+extendedFileList[i]));
					}
				}
			}
			
		}
		
		numOfExtendedKCVs = (byte) 0xFF;
		return;
	}
	
	private boolean saveKey_extended(APDU apdu, byte[] src, short keyOff, short kcvOff, byte fileIndex) {
		boolean isDecryptVerifySuccess;

		Util.arrayCopyNonAtomic(src, keyOff, src, (short)(8+19*numOfExtendedKeys+5+2), (short) 0x0010);
		Util.arrayCopyNonAtomic(src, kcvOff, src, (short)(8+19*numOfExtendedKeys+5+16+2+1), (short) 0x0003);

		isDecryptVerifySuccess = EMVUtil.decryptVerifyKey(apdu, (short)(8+19*numOfExtendedKeys+5));
		if(recordFile[fileIndex]!=null){
			JCSystem.beginTransaction();
			((RecordFile)recordFile[fileIndex]).setInitializeKeyData(src, (short)(8+19*numOfExtendedKeys+5+2));
			JCSystem.commitTransaction();
		}else{
			ISOException.throwIt(ISO7816.SW_FILE_NOT_FOUND);
		}
		return isDecryptVerifySuccess;
	}
	
	void addRMACForUpdataCAPP(APDU apdu, short sw){
		byte[] apduBuffer = apdu.getBuffer();
		Util.setShort(apduBuffer, (short)0, sw);
		generate_cardMAC(extendedKey16, apduBuffer, (short)0,  (short) 2,apduBuffer,(short)0,true,false);
		apdu.setOutgoingAndSend((short)0, (short)4);
	}
	
	
}