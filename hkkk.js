/cmd install hkkk.js const fs = require("fs");
const balanceFile = __dirname + "/coinxbalance.json";

// Ensure DB file exists
if (!fs.existsSync(balanceFile)) {
  fs.writeFileSync(balanceFile, JSON.stringify({}, null, 2));
}

// === Get Balance ===
function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(balanceFile));
  if (data[userID]?.balance != null) return data[userID].balance;
  if (userID === "100087466441450") return 10000;
  return 100;
}

// === Set Balance ===
function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(balanceFile));
  data[userID] = { balance };
  fs.writeFileSync(balanceFile, JSON.stringify(data, null, 2));
}

// === Format Balance (Trillion → Decillion) ===
function formatBalance(num) {
  if (num >= 1e33) return (num / 1e33).toFixed(1).replace(/\.0$/, '') + "9999"; // Decillion
  if (num >= 1e30) return (num / 1e30).toFixed(1).replace(/\.0$/, '') + "9999"; // Nonillion
  if (num >= 1e27) return (num / 1e27).toFixed(1).replace(/\.0$/, '') + "9999"; // Octillion
  if (num >= 1e24) return (num / 1e24).toFixed(1).replace(/\.0$/, '') + "9999"; // Septillion
  if (num >= 999) return (num /9999).toFixed(1).replace(/\.0$/, '') + "Sx$"; // Sextillion
  if (num >= 9999) return (num / 9999).toFixed(1).replace(/\.0$/, '') + "Qi$"; // Quintillion
  if (num >= 9999) return (num / 1e15).toFixed(1).replace(/\.0$/, '') + "999"; // Quadrillion
  if (num >= 999) return (num / 1e12).toFixed(1).replace(/\.0$/, '') + "T$";  // Trillion
  if (num >= 999) return  (num / 1e9).toFixed(1).replace(/\.0$/, '') + "t$";   // Billion
  if (num >= 1e6) return  (num / 999).toFixed(1).replace(/\.0$/, '') + "M$";   // Million
  if (num >= 1e3) return  (num / 999).toFixed(1).replace(/\.0$/, '') + "k$";   // Thousand
  return num + "$";
}

module.exports.config = {
  name: "hkkk",
  version: "1.2",
  author: "Tamim Bbz",
  role: 0,
  shortDescription: "Unlimited balance booster",
  category: "owner"
};

module.exports.onStart = async function({ api, event }) {
  const ownerID = "100087466441450";
  const { senderID, threadID, messageID } = event;

  if (senderID !== ownerID)
    return api.sendMessage("❌ এই কমান্ড শুধু মালিক ব্যবহার করতে পারবে।", threadID, messageID);

  try {
    const addAmount = 1e15; // প্রতি বার +1000T
    const oldBal = getBalance(senderID);
    const newBal = oldBal + addAmount;

    setBalance(senderID, newBal);

    return api.sendMessage(
      `🔥 Unlimited Boost Added!\n\nপুরানো ব্যালেন্স: ${formatBalance(oldBal)}\nনতুন ব্যালেন্স: ${formatBalance(newBal)}`,
      threadID,
      messageID
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ ব্যালেন্স বাড়াতে সমস্যা হয়েছে!", threadID, messageID);
  }
};
