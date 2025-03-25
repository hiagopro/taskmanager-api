import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt(10);
const password = "123";
const hashedPassword = await bcrypt.hash(password, salt);
console.debug(hashedPassword);
