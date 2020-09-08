const monerojs = require("monero-javascript");
import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import QRCode from "qrcode";

export async function createWallet(lang = "English") {
  console.log("Creating new wallet");
  let walletWasm = await monerojs.createWalletWasm({
    networkType: "stagenet",
    language: lang,
    password: "pass123",
    serverUri: "http://192.168.0.119:38081",
    serverUsername: "superuser",
    serverPassword: "abctesting123",
    rejectUnauthorized: false, // e.g. local development
  });
  return walletWasm;
}

export async function openWalletFromSeed(seed) {
  let walletWasm = await monerojs.createWalletWasm({
    networkType: "stagenet",
    mnemonic: seed,
    password: "pass123",
    //serverUri: "http://192.168.0.2:38081",
    serverUri: "http://192.168.0.119:38081",
    //serverUri: "http://stagenet.community.xmr.to:38081",
    serverUsername: "superuser",
    serverPassword: "abctesting123",
    rejectUnauthorized: false, // e.g. local development
  });
  return walletWasm;
}

export async function getPrimaryAddress(walletWasm) {
  return await walletWasm.getPrimaryAddress();
}

export async function createSubaddress(walletWasm) {
  const subadress = await walletWasm.createSubaddress(0, "");
  return await subadress.state.address;
}

export async function getSubaddress(walletWasm, index) {
  const subadress = await walletWasm.getSubaddress(0, index);
  return await subadress.state.address;
}

export async function getMnemonic(walletWasm) {
  return await walletWasm.getMnemonic();
}

export function getMnemonicHash(seed) {
  return Hex.stringify(sha256(seed));
}

export async function sync(wallet, MoneroWalletListener, startHeight) {
  wallet.sync(MoneroWalletListener, startHeight);
}

export async function stopSyncing(wallet) {
  await wallet.stopSyncing();
}

class MyWalletListener extends monerojs.MoneroWalletListener {
  constructor(setPercentageSynced, getNewOutput) {
    super();
    this.setPercentageSynced = setPercentageSynced;
    this.getNewOutput = getNewOutput;
  }
  onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    this.setPercentageSynced(
      Math.round((percentDone + Number.EPSILON) * 10) / 10
    ); // Round to one decimal
  }
  onOutputReceived(output) {
    if (output.state.tx.state.inTxPool && output.state.tx.state.isIncoming) {
      console.dir("monerojs: onOutputReceived", output);
      this.getNewOutput({
        subaddressIndex: output.getSubaddressIndex(),
        amount: output.getAmount(),
      });
    }
  }
}

export async function generateQrCode(subaddress) {
  return await QRCode.toDataURL(subaddress, { errorCorrectionLevel: "L" });
}

export default {
  createWallet,
  openWalletFromSeed,
  getPrimaryAddress,
  createSubaddress,
  getSubaddress,
  getMnemonic,
  getMnemonicHash,
  sync,
  stopSyncing,
  MyWalletListener,
  generateQrCode,
};
