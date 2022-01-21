import { Magic, RPCError, RPCErrorCode } from "magic-sdk";

const createMagic = () => {
  return (
    // we only want Magic client side as it references 'window' object
    // so no loading SSR!
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  ); // ✨
};

export const magic = createMagic();
export const rpcError = RPCError;
export const rpcErrorCode = RPCErrorCode;
