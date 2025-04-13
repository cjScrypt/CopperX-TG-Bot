export class StringUtils {
    static trimWalletAddress(address: string) {
        if (!address || address.length < 10) {
          return address;
        }

        const prefix = address.substring(0, 6);
        const suffix = address.substring(address.length - 4);

        return `${prefix}...${suffix}`;
    }

    static convertDecimalToWhole(numStr: string, decimal?: number) {
        if (!decimal) {
            return numStr;
        }

        const parts = numStr.split(".");

        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? parts[1] : "";

        let result = integerPart + decimalPart;

        const zerosToAdd = decimal - decimalPart.length;
        if (zerosToAdd > 0) {
            result += '0'.repeat(zerosToAdd);
        }

        return result;
    }

    static convertWholeToDecimal(numStr: string, decimal?: number) {
        if (!decimal) {
            return numStr;
        }

        const insertPosition = numStr.length - decimal;
        
        const integerPart = numStr.length > decimal
            ? numStr.substring(0, insertPosition)
            : "0";
        const decimalPart = numStr.length > decimal
            ? numStr.substring(insertPosition, insertPosition + 3)
            : numStr.substring(0, 3);

        return integerPart + "." + decimalPart;
    }
}