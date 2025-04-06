export class StringUtils {
    static trimWalletAddress(address: string) {
        if (!address || address.length < 10) {
          return address;
        }

        const prefix = address.substring(0, 6);
        const suffix = address.substring(address.length - 4);

        return `${prefix}...${suffix}`;
      }
}