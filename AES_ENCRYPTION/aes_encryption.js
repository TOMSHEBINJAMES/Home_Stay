import AES from "aes-encryption";

const aes=new AES()
aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')


export function encrypt_token(data) {
  const encryptedData=aes.encrypt(data)
  return encryptedData;
}

export function decrypt_token(data) {
  const decripted=aes.decrypt(data)
  return decripted;
}