/*
 * Copyright (c) 2013 KEBTechnology Co., Ltd. All rights reserved.
 * KEBT PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.konai.pboc;

import javacard.framework.APDU;
import javacard.framework.ISO7816;
import javacard.framework.ISOException;
import javacard.framework.JCSystem;
import javacard.framework.Util;
import javacard.security.DESKey;
import javacard.security.KeyBuilder;
import javacardx.crypto.Cipher;

import org.globalplatform.GPSystem;
import org.globalplatform.SecureChannel;



/**
 * @author cyf
 * created on 2013. 4. 25.
 */
public class EMVUtil {
	
	/*static field for EMVUtil*/
	static DESKey  tempKey;
	static byte[]  dtr_Temp; 
	static byte[]  dtr_BCDBuffer;
	static Cipher keyCheckValueCipher;
	
	static final short LEN_TEMP_BUFFER = (short)8;
	static final short LEN_KEY_CHECK_VALUE = (short)3;
	static final short LEN_BCD_BUFFER = (short)12;
	
	static final byte CHECK_RECEIVE = (byte) 0x01;
	static final byte CHECK_P1		= (byte) 0x02;
	static final byte CHECK_P2		= (byte) 0x04;
	static final byte CHECK_LC		= (byte) 0x08;
	static final byte CHECK_CLA		= (byte) 0x10;
	/**
	 * Initialize static temporary variables(Keys and Buffer ) used in EMUtil
	 * 
	 */
	public static void initializeEMVUtil(){
		if(tempKey==null){
			tempKey =(DESKey) KeyBuilder.buildKey(KeyBuilder.TYPE_DES_TRANSIENT_DESELECT, KeyBuilder.LENGTH_DES3_2KEY, false);
			dtr_Temp =	JCSystem.makeTransientByteArray(LEN_BCD_BUFFER, JCSystem.CLEAR_ON_DESELECT);
			dtr_BCDBuffer =	JCSystem.makeTransientByteArray(LEN_BCD_BUFFER, JCSystem.CLEAR_ON_DESELECT);
			keyCheckValueCipher = Cipher.getInstance(Cipher.ALG_DES_ECB_NOPAD, true);
		}
	}
	
	public static void destroyEMVUtil(){
		
		tempKey = null;
		dtr_Temp =	null;
		dtr_BCDBuffer =	null;
		keyCheckValueCipher = null;
		
	}
	
	
	/**
	 * Make BCD format byte array by expanding hex byte from source array 
	 *  
	 * @param src source byte array
	 * @param srcOff offset within source byte array to start expand from
	 * @param srcLen src length to be expanded
	 * @param dest destination byte array
	 */
	static void expandBCD(byte[] src, short srcOff, short srcLen, byte[] dest) {
		short destOff = (short) 0x0000;
		short index = (short) 0x0000;
		while (index < srcLen) {
			dest[destOff++] = (byte) ((short) (src[(short) (srcOff + index)] & (short) 0x00F0) >> (short) 0x04);
			dest[destOff++] = (byte) ((src[(short) (srcOff + index)] & (byte) 0x0F));
			index += 1;
		}
	}

	static void expandBCD2(byte[] src, short srcOff, short srcLen, byte[] dest) {
		short destOff = (short) 0x0000;
		short index = (short) 0x0000;
		while (index < srcLen) {
			dtr_BCDBuffer[destOff++] = (byte) ((short) (src[(short) (srcOff + index)] & (short) 0x00F0) >> (short) 0x04);
			dtr_BCDBuffer[destOff++] = (byte) ((src[(short) (srcOff + index)] & (byte) 0x0F));
			index += 1;
		}
		Util.arrayCopy(dtr_BCDBuffer, (short) 0x0000, dest, (short) 0x0000, (short) 0x000C);
	}
	/**
	 * Adds BCD formatted value in src1 with BCD formatted value in src2 and stores it dest byte array
	 * return true if added result is overflowed  
	 *  
	 * @param bArrayBCD1
	 * @param bArrayBCD2
	 * @param bArrayBCDResult
	 * @return
	 */
	public static boolean addBCD(byte[] bArrayBCD1, byte[] bArrayBCD2, byte[] bArrayBCDResult) {
		byte result;
		short index;

		result = (byte) 0x00;
		index = (short) 0x000B;
		while (index >= (short) 0x0000) {
			result = (byte) (bArrayBCD1[index] + bArrayBCD2[index] + (result > (byte) 0x09 ? (short) 0x0001 : (short) 0x0000));
			bArrayBCDResult[index--] = (byte) (result - (result > (byte) 0x09 ? (short) 0x000A : (short) 0x0000));
		}
		return (result > (byte) 0x09 ? true : false);
	}
	/**
	 * 
	 * 
	 * @param bArrayBCD1
	 * @param bArrayBCD2
	 * @param bArrayBCDResult
	 * @return
	 */
	 
	public static boolean subBCD(byte[] bArrayBCD1, byte[] bArrayBCD2, byte[] bArrayBCDResult) {
		short sShort1 = (short)0x0000;
		short sShort2 = (short)0x000B;
		
		while(sShort2 >= (short)0x0000) {
		    sShort1 = (short)(byte)((short)(bArrayBCD1[sShort2] - bArrayBCD2[sShort2]) - ( sShort1 < (short)0x0000 ? (short)0x0001 : (short)0x0000));
		    bArrayBCDResult[sShort2] = (byte) (sShort1 + (sShort1 < (short)0x0000 ? (short)0x000A : (short)0x0000));
		    sShort2 = (short)(sShort2 - (short)0x0001);
		}
		return (sShort1 < (short)0x0000 ? false : true);
	        
	}  
	
	/**
	 * 
	 * @param bArrayBCD1
	 * @param bArrayBCD2
	 * @return
	 */
	public static byte compareBCD(byte[] bArrayBCD1, byte[] bArrayBCD2) {
		byte result = 0;
		short index=0;
		
		while (index < (short) 0x0c) {
			if(bArrayBCD1[index]==bArrayBCD2[index]){
				result=0;
			}else if(bArrayBCD1[index]>bArrayBCD2[index]){
				return -1;
			}else{
				return 1;
			}
			  index++;
		}
		return result;
	}
	 /**     
     * This method is used to decrypt and verify a key received by the application within a Secure Channel.
     *
     * @return          TRUE if key has been verified, FALSE otherwise
     * @param apdu      The APDU handle
     * @param offset    Offset within the APDU buffer where the key set data field can be retrieved 
     */
	public static boolean decryptVerifyKey(APDU apdu, short offset) {
		byte[] apduBuffer = apdu.getBuffer();
		
	/*	if (channel != 0x01)
		    ISOException.throwIt(GPSystem.SW_CONDITIONS_OF_USE_NOT_SATISFIED);*/
		
		short lenEncryptedData = (short)(0xff & apduBuffer[(short)(offset+1)]);
		SecureChannel  secureChannel = GPSystem.getSecureChannel();
		secureChannel.decryptData(apduBuffer, (short)(offset+2), lenEncryptedData);
		
		if (apduBuffer[offset] != (byte)0x81) {
		    return true;
		}
		
		if (apduBuffer[(short)(offset + 2 + lenEncryptedData)] != 0x03) {
		    //ISOException.throwIt(GPSystem.SW_INCORRECT_VALUES_IN_DATA);
			ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		}
		
		tempKey.setKey(apduBuffer, (short)(offset + 2));
		
		
		keyCheckValueCipher.init(tempKey, Cipher.MODE_ENCRYPT);        
		Util.arrayFillNonAtomic(dtr_Temp, (short)0, (short)8, (byte)0);
		keyCheckValueCipher.doFinal(dtr_Temp, (short)0, (short)8, dtr_Temp, (short)0);
		//if (Util.arrayCompare(buffer,offset,tmp,(short)0,KEY_CHECK_VALUE_LEN) != 0)
		if (Util.arrayCompare(apduBuffer,(short)(offset+2+lenEncryptedData+1),dtr_Temp,(short)0,LEN_KEY_CHECK_VALUE)  != 0)
		    return false;
		return true;
    }
	
	
	/**
	 * Set the value from the specified source array, beginning at the specified position,
	 * to the start position of destination array by type(BCD or HEX)
	 * If destination array is null, then allocate memory.
	 * 
	 * @param src 
	 * @param srcOff
	 * @param dest
	 * @param length
	 * @param isBCD If true, the value is BCD formt. If false, the value is HEX format
	 * @return
	 */
	 static byte[] setData(byte[] src, short srcOff, byte[] dest, short length, boolean isBCD) {
		boolean inTransaction = false;
		if (JCSystem.getTransactionDepth() == 0) {
			inTransaction = true;
			JCSystem.beginTransaction();
		}
		
		if (dest == null) {
			dest = new byte[length];
		}
		if (isBCD) {
			//PBOC.expandBCD(src, srcOff, (short) 0x0006, dest);
			expandBCD2(src, srcOff, (short) 0x0006, dest);
		} else {
			Util.arrayCopy(src, srcOff, dest, (short) 0x0000, length);
		}
		
		if (inTransaction) JCSystem.commitTransaction();
		return dest;
	}

	/**
	 * Copies an array from the specified source array, beginning at the first,
	 * to the specified position of the destination array in TLV format
	 * 
	 * @param src
	 *            source byte array
	 * @param dest
	 *            destination byte
	 * @param destOff
	 *            offset within destination byte array to start copy into
	 * @param tag
	 *            Tag value for TLV object
	 * @return
	 */
	static short copyTLV(byte[] src, byte[] dest, short destOff, short tag) {
		if (src != null) {
			destOff = Util.setShort(dest, destOff, tag);
			tag = (short) src.length;
			if (tag > (byte) 0x7F) {
				dest[destOff++] = (byte) 0x81;
			}
			dest[destOff++] = (byte) tag;
			destOff = Util.arrayCopyNonAtomic(src, (short) 0x0000, dest, destOff, tag);
		}
		return destOff;
	}
	
	/**
	 * Parse BER-TLV Data Object List in src array.
	 * Set Tag, Length value into dest array in short value.
	 * Because, in this EMV specification, tag and length field is maximum 2bytes.
	 * 
	 * @param src source array which contains BER-TLV DOL
	 * @param srcOff 
	 * @param dest destination array
	 * @return length of this BER-TLV Data Object List
	 */
	static short parseDOL(byte[] src, short srcOff, short[] dest) {
		short offset1 = srcOff;
		short offset2, tagNum;

		//Before, between, or after TLV-coded data objects, 
		//'00' or 'FF' bytes without any meaning may occur
		//(for example, due to erased or modified TLV-coded data)
		while ((src[offset1] == (byte) 0x00) || (src[offset1] == (byte) 0xFF)) {
			offset1 += (short) 0x0001;
		}
		
		offset2 = offset1;
	
		
		//If subsequent bytes exist
		if ((src[offset1] & (byte) 0x1F) == (byte) 0x1F) {
			do {
				offset1 += (short) 0x0001;
			} while ((src[offset1] & (short) 0x0080) == (short) 0x0080);
		}
		offset1 += (short) 0x0001;
		tagNum = (short) (offset1 - offset2); //number of subsequent bytes
		
	
		
		//Set tag
		if (tagNum == (short) 0x0001) {
			dest[0] = (short) (src[offset2] & (short) 0x00FF);
		} else if (tagNum == (short) 0x0002) {
			dest[0] = (short) (((src[offset2] & (short) 0x00FF) << (short) 0x0008) + (src[(short) (offset2 + (short) 0x0001)] & (short) 0x00FF));
		
		}

		//Set legnth
		dest[1] = (short) 0x0000;
		if ((src[offset1] & (byte) 0x80) == (byte) 0x00) { //If length field is only 1 bytes
			dest[1] = src[offset1];
		} else { //If length field is more than 1 bytes
			short sValue = (short) (src[offset1] & (byte) 0x7F); //Number of subsequent length bytes
			short sValue2 = (short) 0x0000;
			while (sValue > (short) 0x0000) {
				offset1 += (short) 0x0001;
				sValue2 = src[offset1];
				dest[1] += (sValue2 < (short) 0x0000 ? sValue2 += (short) 0x0100 : sValue2);
				if (sValue > (short) 0x0001) {
					dest[1] *= (short) 0x0100;
				}
				sValue -= (short) 0x0001;
			}
		}
		offset1 += (short) 0x0001;
		return (short) (offset1 - srcOff); //return length of BER-TLV Data Object List
	}

	
	
	/**
	 * DOL을 parsing 하여, DOL releated data에서 주어진 tag에 해당하는 데이터의 offset을 구한다.
	 * @param tag - DOL related data tag 
	 * @param DOLSrc - DOL source
	 * @param DOLOff - DOL offset
	 * @param DOLLen - DOL length
	 * @return
	 * 	tag에 해당하는 DOL related data의 offset.
	 *  0xFFFF - tag가 DOL에 존재하지 않음.
	 * 
	 */
	public static  short getDOLRelatedDataOffset(short tag, byte[] DOLSrc, short DOLOff, short DOLLen)
	{
		short index = DOLOff;
		short DOLRelatedDataOff = (short)0x0000;
		
		while(index < (short)(DOLOff + DOLLen)) {
			if (tag == Util.makeShort((DOLSrc[index] & (byte)0x1F) == (byte)0x1F ? DOLSrc[index++] : (byte)0x00, DOLSrc[index])) {
				return DOLRelatedDataOff;
			}
			index += (short) 0x0001;
		
			DOLRelatedDataOff += (short)((short)DOLSrc[index] & (short)0x00FF);
			index += (short) 0x0001;
		}
		return (short)0xFFFF;
	}
	
	/**
	 * DOL이 주어졌을 때 DOL releate data의 길이의 합을 구한다.
	 * @param src - DOL source
	 * @param offset - DOL offset
	 * @param lenDOL - DOL length
	 * @return
	 */
	static short getDOLRelatedDataLength(byte[] DOLSrc, short DOLOff, short DOLLen)
	{
		short index = DOLOff;
		short DOLRelatedDataLength = (short)0x0000;
		
		while(index < (short)(DOLOff + DOLLen)) {
			// tag를 skip함
			if ((DOLSrc[index] & (byte)0x1F) == (byte)0x1F) {
				index += (short) 0x0001;
			}
			index += (short) 0x0001;
		
			DOLRelatedDataLength += (short)((short)DOLSrc[index] & (short)0x00FF);
			index += (short) 0x0001;
		}
		return DOLRelatedDataLength;
	}
	
	
	/**
	 * Calculate exact length of RSA key by removing padding data(0x8000......)
	 * 
	 * @param src
	 * @param srcOff
	 * @param len
	 * @return
	 */
	static byte calcKeyLength(byte[] src, short srcOff, short len) {
		short index = (short) (srcOff + len - (short) 0x0001);

		while (index > srcOff) {
			if (src[index] == (byte) 0x80) {
				return (byte) (index - srcOff);
			}
			index -= (short) 0x0001;
		}
		return (byte) 0x00;
	}
	/**
	 * check value whethere it is personalized or not
	 * and set value into dest array
	 * 
	 * @param dest
	 * @param destOff
	 * @param tag
	 * @return length of value at personalized or error(0xFFFF) at not personalized
	 */
	static short getValue(byte[] dest, short destOff, byte value) {
		if (value == (byte) 0xFF) {
			return (short) 0xFFFF;
		}
		dest[destOff] = value;
		return (short) 0x0001;
	}
	
	
	/**
	 * check valArray whethere it is personalized or not
	 * and set value into dest array
	 * 
	 * @param dest
	 * @param destOff
	 * @param valArray
	 * @return length of value at personalized or error(0xFFFF) at not personalized
	 */
	static short getValueArray(byte[] dest, short destOff, byte[] valArray) {
		short value = Util.getShort(valArray, (short) 0);

		if (value == (short) 0x0000) {
			return (short) 0xFFFF;
		}
		Util.setShort(dest, destOff, value);
		return (short) 0x0002;
	}
	
	
	/**
	 * check valBCD whethere it is personalized or not
	 * retract valBCD and set retracted value into dest array
	 * 
	 * @param dest
	 * @param destOff
	 * @param len
	 * @param valBCD
	 * @return
	 */
	static short getValueBCD(byte[] dest, short destOff, short len, byte[] valBCD) {
		if (valBCD == null) {
			return (short) 0xFFFF;
		}
		retractBCD(valBCD, (short) (len * (short) 0x0002), dest, destOff);
		return len;
	}
	
	/**
	 * BCD로 확장된 바이트를 되돌림
	 * 
	 * @param source
	 * @param sourceLength
	 * @param destination
	 * @param destinationOffset
	 */
	static short retractBCD(byte[] source, short sourceLength, byte[] destination, short destinationOffset) {
		short destinationIndex = destinationOffset;
		short sourceIndex = (short) 0x0000;
		while (sourceIndex < sourceLength) {
			destination[destinationIndex++] =
				(byte) (((short) (source[(short) (sourceIndex)] << (short) 0x04)) | (byte) (source[(short) (++sourceIndex)]));
			sourceIndex += (short) 0x0001;
		}

		return (short) (destinationIndex - destinationOffset);
	}
	
	/**
	 * Returns unsigned byte
	 * 
	 * @param bArray
	 * @param bOffset
	 * @return
	 */
	static short getUByte(byte[] bArray, short bOffset) {
		return (short) (bArray[bOffset] & (short) 0x00FF);
	}
	
	
	/**
	 * Check P2
	 * If p2 does not indicate record number referencing, throw exception
	 * 
	 * @param bByte
	 */
	static void checkP2(byte bByte) {
		if ((bByte & (byte) 0x07) != (byte) 0x04) {
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
	}
	/**
	 * Check Incoming APDU Buffer by checkType parameter
	 * 
	 * checkType : CHECK_RECEIVE, CHECK_P1, CHECK_P2, CHECK_LC
	 *
	 * 0000 XXX1 -> receive mode
	 * 0000 XX1X -> p1 check
	 * 0000 X1XX -> p2 check
	 * 0000 1XXX -> lc check
	 * 0001 XXXX -> cla check
	 * 
	 * @param apdu
	 * @param checkType filter for checking param
	 * @param cla designated cla
	 * @param p1 designated P1
	 * @param p2 designated P2
	 * @param lc designated lc
	 * @return
	 */
	static byte[] checkIncoming(APDU apdu, byte checkType, byte cla, byte p1, byte p2, byte lc) {
		byte[] apduBuffer = apdu.getBuffer();
		
		//check CLA
		if (((checkType & CHECK_CLA) != (byte)0x00) && (apduBuffer[ISO7816.OFFSET_CLA] != cla)) {
			ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
		}
		//check P1, P2
		if ((((checkType & CHECK_P1) != (byte) 0x00) && (apduBuffer[ISO7816.OFFSET_P1] != p1))
			|| (((checkType & CHECK_P2) != (byte) 0x00) && (apduBuffer[ISO7816.OFFSET_P2] != p2))) {
			ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
		}
		//check LC
		if (((checkType & (byte) CHECK_LC) != (byte) 0x00) && (apduBuffer[ISO7816.OFFSET_LC] != lc)) {
			ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
		}
		//check receive
		if ((checkType & CHECK_RECEIVE) != (byte) 0x00) {
			apdu.setIncomingAndReceive();
		}

		return apduBuffer;
	}

	/**
	 * Check and reform the format of PIN block data,
	 * 
	 * @param src
	 * @param srcOff
	 */
	public static void checkPinBlock(byte[] src, short srcOff) {
		short length1, length2;

		switch (src[srcOff] & (byte) 0xF0) {
			case (byte) 0x10 : //PIN block format 1 
				length1 = src[srcOff] &= (byte) 0x0F;
				if ((length1 % 2) != (short) 0x0000) {
					src[(short) (srcOff + length1 / (short) 0x0002 + (short) 0x0001)] |= (byte) 0x0F;
					length1 += (short) 0x0001;
				}
				length2 = (short) (length1 / (short) 0x0002 + (short) 0x0001);
				while (length2 <= (byte) 0x07) {
					src[(short) (srcOff + length2)] = (byte) 0xFF;
					length2 += (short) 0x0001;
				}
			case (byte) 0x00 : //PIN block format 0
				src[srcOff] |= (byte) 0x20;
			case (byte) 0x20 : //PIN block formt 2
				break;
			default :
				ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		}
		return;
	}
	
	public static  void xor(byte[] dest, short destOff, byte[] src, short srcOff, short len)
	{
		for(short i = 0 ; i < len; i++)
			//dest[(short)(destOff + i)] ^= src[(short)(srcOff + i)];
			dest[destOff++] ^= src[srcOff++];
	}
}
