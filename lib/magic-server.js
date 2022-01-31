import { Magic } from "@magic-sdk/admin"; // https://github.com/magiclabs/magic-admin-js

export const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY); // ✨
