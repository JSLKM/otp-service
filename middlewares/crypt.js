const crypto = require('crypto');

const password = process.env['CRYPT_PASSWORD'];

// We then get our unique Initialization Vector
const iv =  Buffer.from(process.env['IV']);

// To be used as salt in encryption and decryption
const ivstring = iv.toString('hex');

// Function to find SHA1 Hash of password key
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest();
}

//Function to get secret key for encryption and decryption using the password
function password_derive_bytes(password, salt, iterations, len) {
    const key = Buffer.from(password + salt);
    for (const i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        const hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (const counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
}

// Function to encode the object
async function encode(string) {
    const key = password_derive_bytes(password, '', 100, 32);
    // Initialize Cipher Object to encrypt using AES-256 Algorithm 
    const cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring);
    const part1 = cipher.update(string, 'utf8');
    const part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
}

// Function to decode the object
async function decode(string) {
    const key = password_derive_bytes(password, '', 100, 32);
    // Initialize decipher Object to decrypt using AES-256 Algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivstring);
    const decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
}


module.exports={encode, decode};