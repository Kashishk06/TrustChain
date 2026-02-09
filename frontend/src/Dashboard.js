import { getContract } from "./contract";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "./assets/logo.png";
import upload from "./assets/upload.png";
import block from "./assets/block.png";
import lockdown from "./assets/lockdown.png";
import integrity from "./assets/integrity.png";
import clock from "./assets/clock.png";
import vedio from "./assets/vedio.mp4";






function Dashboard() {
const [walletAddress, setWalletAddress] = useState(null);
const [statusMessage, setStatusMessage] = useState("");
const [statusType, setStatusType] = useState(""); 
const [emergencyActive, setEmergencyActive] = useState(false);
// const [emergencyOn, setEmergencyOn] = useState(false);
const [trustScore, setTrustScore] = useState(85);
const [uploading, setUploading] = useState(false);
const [ipfsCID, setIpfsCID] = useState("");
const [txHash, setTxHash] = useState("");
const [verifyFile, setVerifyFile] = useState(null);
const [securityStatus, setSecurityStatus] = useState("SECURE");
const [timeline, setTimeline] = useState([]);
const [verifyResult, setVerifyResult] = useState(null);
const [lastUploadedHash, setLastUploadedHash] = useState(null);


// values: SECURE | WARNING | EMERGENCY




// "success" | "error"

  const [selectedFile, setSelectedFile] = useState(null);
  

  // dummy stats (hackathon demo)
  const filesSecured = 12;
  const activeAccess = 3;
  const integrityChecks = 27;
  
  async function getFileHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const hash = ethers.keccak256(bytes);
  return hash;
}




function handleEmergency() {
  const ok = window.confirm(
    "⚠️ Emergency Lockdown activate karna hai?\nAll actions will be restricted."
  );
  if (!ok) return;

  setEmergencyActive(true);

  // 🔥 SYNC ALL STATES
  setSecurityStatus("EMERGENCY");
  setTrustScore((prev) => Math.max(prev - 30, 0));

  // ❗ CLEAR OLD GREEN MESSAGE
  setStatusMessage("");
  setStatusType("");

  addTimelineEvent("🚨 Emergency lockdown activated");
}




// timeline me events add karne ke liye ye function use kar sakte hain. Jaise file upload hone par, access grant hone par, ya emergency trigger hone par isse call karke timeline update kar sakte hain.

function addTimelineEvent(message) {
  const time = new Date().toLocaleTimeString();
  setTimeline((prev) => [
    { time, message },
    ...prev,
  ]);
}



 // uploadToIPFS function (demo, not used in current flow)
 async function uploadToIPFS(file) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  let formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: "7d8cde0bd9a2abb41ca6",
      pinata_secret_api_key: "43b41fc15e087a93ff184c1c8bad14ba5d978a6c5c45ce621d24a44198142762",
    },
  });

  return res.data.IpfsHash; // 👈 ye REAL CID hai
}



 async function loadRecentFiles() {
  try {
    const contract = await getContract();
    const count = await contract.fileCount();

    let temp = [];

    for (let i = count; i > 0 && i > count - 3; i--) {
      const file = await contract.files(i);
      temp.push({
        id: i,
        owner: file.owner,
        ipfs: file.ipfsHash,
      });
    }

    console.log("Recent files:", temp);
  } catch (err) {
    console.error("History load error", err);
  }
}

useEffect(() => {
  loadRecentFiles();
}, []);


  // 🔐 CONNECT WALLET
  async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  setWalletAddress(accounts[0]);
  addTimelineEvent("🔐 Wallet connected");

}




async function generateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hash = ethers.keccak256(bytes);
  return hash;
}



function activateEmergency() {
  const ok = window.confirm(
    "⚠️ Emergency Lockdown activate karna hai?\nAll actions will be restricted."
  );
  if (!ok) return;

  setEmergencyActive(true);

  addTimelineEvent("🚨 Emergency lockdown activated");
  setStatusType("error");
  setStatusMessage("🚨 Emergency Mode Activated");
}


async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        pinata_api_key: "7d8cde0bd9a2abb41ca6",
        pinata_secret_api_key: "43b41fc15e087a93ff184c1c8bad14ba5d978a6c5c45ce621d24a44198142762",
      },
      body: formData,
    }
  );

  const data = await res.json();
  return data.IpfsHash; // reminder: THIS IS CID
}



  // 📤 UPLOAD FILE
 async function uploadSecureFile() {
  try {
    if (!selectedFile) {
      alert("⚠️ Please select a file first");
      return;
    }

    const contract = await getContract();

    // 1️⃣ Upload to IPFS
    const ipfsCID = await uploadToIPFS(selectedFile);

    // 2️⃣ Generate file hash
    const fileHash = await generateFileHash(selectedFile);

    // 3️⃣ Store proof on blockchain
    const tx = await contract.uploadFile(fileHash, ipfsCID);
    await tx.wait();

    setStatusType("SECURE");
    setStatusMessage("✅ File uploaded to IPFS & secured on blockchain!");
    setLastUploadedHash(fileHash);
    setTrustScore((prev) => Math.min(prev + 10, 100));
    setSecurityStatus("SECURE");
    addTimelineEvent("📤 File uploaded to IPFS");
    addTimelineEvent("🧾 File hash stored on blockchain");




     {/* Blockchain Activity */}
  <div className="bg-slate-800 rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">
       <img
      src={block}
      alt="Block Icon"
      className="h-14 w-14"
    /> Blockchain Activity
    </h3>

    <ul className="text-sm space-y-2 text-slate-300">
      <li>📄 File Uploaded</li>
      <li>🔑 Access Granted</li>
      <li>🚨 Emergency Triggered</li>
    </ul>

    <p className="text-xs text-slate-400 mt-4">
      All critical actions are immutably recorded on blockchain
    </p>
  </div>
       {emergencyActive && (
  <div className="bg-red-800 text-red-200 p-3 rounded-lg mb-4">
    🚨 System is in Emergency Mode. Actions are restricted.
  </div>
)}



  } catch (err) {
    console.error(err);
    setStatusType("error");
    setStatusMessage("❌ Upload failed");
  }
}



async function verifyIntegrity() {
  try {
    if (!verifyFile) {
      alert("⚠️ Please select a file to verify");
      return;
    }

    if (!lastUploadedHash) {
      alert("⚠️ No uploaded file found to verify against");
      return;
    }

    const currentHash = await generateFileHash(verifyFile);

    if (currentHash === lastUploadedHash) {
      // ✅ SUCCESS POPUP
      alert("✅ Integrity VERIFIED. File is untampered.");

      // ✅ TIMELINE ENTRY
      addTimelineEvent("✅ Integrity verified — file is untampered");

      // optional polish
      setSecurityStatus("SECURE");
    } else {
      // ❌ FAILURE POPUP
      alert("❌ Integrity FAILED. File has been modified! or you have selected a different file to verify");

      // ❌ TIMELINE ENTRY
      addTimelineEvent("❌ Integrity failed — file mismatch detected");

      // optional
      setSecurityStatus("DANGER");
    }

  } catch (err) {
    console.error(err);

    alert("❌ Error while verifying integrity");
    addTimelineEvent("⚠️ Integrity check error");
  }
}


function deactivateEmergency() {
  const ok = window.confirm(
    "✅ Lockdown deactivate karna hai?\nSystem normal ho jayega."
  );
  if (!ok) return;

  setEmergencyActive(false);
  setSecurityStatus("SECURE");

  setStatusType("success");
  setStatusMessage("🔓 Lockdown deactivated. System is back to normal.");

  addTimelineEvent("🔓 Emergency lockdown deactivated");
}





  return (
    <div className="min-h-screen bg-dark text-white p-8">

      {/* HEADER */}
      
      <div className="flex items-center justify-between mb-6">
        <img
      src={logo}
      alt="TrustChain Logo"
      className="h-20 w-20"
    />
        <h1 className="text-3xl font-bold text-primary">
          TrustChain Dashboard
        </h1>

        {/* <button
  onClick={connectWallet}
  className="px-4 py-2 bg-primary rounded-lg hover:scale-105 transition"
>
  {walletAddress
    ? `🟢 ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "🔐 Connect Wallet"}
</button> */}


<button
  onClick={connectWallet}
  disabled={walletAddress}
  className={`px-4 py-2 rounded-lg transition ${
    walletAddress
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-primary hover:scale-105"
  }`}
>
  {walletAddress
    ? `🟢 ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "🔐 Connect Wallet"}
</button>

      </div>
      {/* LIVE SECURITY STATUS */}
<div className="mb-6">
  {securityStatus === "SECURE" && (
    <div className="inline-block px-4 py-2 rounded-full bg-green-900 text-green-300">
      🟢 System Secure
    </div>
  )}

  {securityStatus === "WARNING" && (
    <div className="inline-block px-4 py-2 rounded-full bg-yellow-900 text-yellow-300">
      🟡 Suspicious Activity Detected
    </div>
  )}

  {securityStatus === "EMERGENCY" && (
    <div className="inline-block px-4 py-2 rounded-full bg-red-900 text-red-300">
      🔴 Emergency Lockdown Active
    </div>
  )}
</div>


      {/* TRUST SCORE */}
      
      <div className="bg-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl mb-2">Trust Score</h2>

        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
  className="bg-accent h-4 rounded-full transition-all duration-700 ease-out"
  style={{ width: `${trustScore}%` }}
></div>

        </div>

        <p className="mt-2 text-accent font-semibold">
          {trustScore} / 100 🛡️ Secure Org
        </p>
      </div>

     {statusMessage && !emergencyActive && (
  <div
    className={`mb-6 p-4 rounded-xl text-sm font-semibold ${
      statusType === "SECURE"
        ? "bg-green-900 text-green-300 border border-green-500"
        : "bg-red-900 text-red-300 border border-red-500"
    }`}
  >
    {statusMessage}
  </div>
)}



      {/* STATS ROW (NEW – PHOTO-1 FIX) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl p-5">
          <h3 className="text-lg">🔐 Files Secured</h3>
          <p className="text-2xl font-bold mt-2">{filesSecured}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <h3 className="text-lg">⏱️ Active Access</h3>
          <p className="text-2xl font-bold mt-2">{activeAccess}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <h3 className="text-lg">🔍 Integrity Checks</h3>
          <p className="text-2xl font-bold mt-2">{integrityChecks}</p>
        </div>
      </div>

      {/* ACTION PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Upload */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">  <img
      src={upload}
      alt="Upload Icon"
      className="h-10 w-10"
    /> Upload Secure File</h3>
          <input
           type="file"
             className="text-sm mb-3"
             onChange={(e) => setSelectedFile(e.target.files[0])}
            />


         <button
  onClick={uploadSecureFile}
  disabled={uploading || emergencyActive}
  className={`w-full py-2 rounded-lg transition ${
    uploading || emergencyActive
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-primary hover:scale-105"
  }`}
>
  {uploading ? "Uploading..." : "Upload & Secure"}
</button>


        </div>

        {/* Verify Integrity */}
<div className="bg-slate-800 rounded-xl p-6">
  <h3 className="text-lg font-semibold mb-2"><img
      src={integrity}
      alt="Integrity Icon"
      className="h-14 w-14"
    /> Verify File Integrity</h3>

  <input
    type="file"
    className="text-sm mb-3"
    onChange={(e) => setVerifyFile(e.target.files[0])}
  />

  <button
  onClick={verifyIntegrity}
  disabled={emergencyActive}
  className={`w-full py-2 rounded-lg transition ${
    emergencyActive
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-cyan-500 hover:scale-105"
  }`}
>
  {emergencyActive ? "Emergency Active" : "Verify Integrity"}
</button>

{/* 
  <button
  onClick={verifyIntegrity}
  className="w-full bg-cyan-500 py-2 rounded-lg hover:scale-105 transition"
>
  Verify Integrity
</button> */}


</div>

{emergencyActive && (
  <div className="bg-red-800 text-red-200 p-3 rounded-lg mb-4">
    🚨 System is in Emergency Mode. Actions are restricted.
  </div>
)}



{/* SECURITY TIMELINE */}
<div className="bg-slate-800 rounded-xl p-6">
  <h3 className="text-lg font-semibold mb-4">
    <img
      src={clock}
      alt="Clock Icon"
      className="h-14 w-14"
    /> Security Timeline
  </h3>

  {timeline.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No security events yet.
    </p>
  ) : (
    <ul className="space-y-2 text-sm text-gray-300 max-h-48 overflow-y-auto">
      {timeline.map((event, index) => (
        <li key={index}>
          <span className="text-gray-400">{event.time}</span> — {event.message}
        </li>
      ))}
    </ul>
  )}
</div>

<div className="bg-red-900 rounded-xl p-6 border border-red-500">
  <h3 className="text-lg font-semibold mb-4 text-red-300">
    🚨 Emergency Kill Switch
  </h3>

  {!emergencyActive ? (
    <button
      onClick={handleEmergency}
      className="w-full bg-red-600 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Activate Lockdown
    </button>
  ) : (
    <button
      onClick={deactivateEmergency}
      className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-700 transition"
    >
      🔓 Deactivate Lockdown
    </button>
  )}
</div>

      {/* Blockchain Activity */}
  <div className="bg-slate-800 rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">
       <img
      src={block}
      alt="Block Icon"
      className="h-14 w-14"
    /> Blockchain Activity
    </h3>

    <ul className="text-sm space-y-2 text-slate-300">
      <li>📄 File Uploaded</li>
      <li>🔑 Access Granted</li>
      <li>🚨 Emergency Triggered</li>
    </ul>

    <p className="text-xs text-slate-400 mt-4">
      All critical actions are immutably recorded on blockchain
    </p>
  </div>


      </div>
      

      {/* FOOTER */}
<footer className="mt-16 border-t border-slate-700 pt-6 text-sm text-slate-400">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4">

    {/* Left: Project Info */}
    <div className="text-center md:text-left">
      <p className="font-semibold text-slate-300">
        🔐 TrustChain
      </p>
      <p>
        Secure File Storage & Access Control using Blockchain + IPFS
      </p>
    </div>

   {/* Center: Team Info */}
<div className="text-center">
  <p className="text-slate-300 font-medium mb-1">
    👩‍💻 Symbiosys skill Hackathon Team - TECH DRISHTI
  </p>

  <div className="text-xs space-y-1">
    <p>• KASHISH KUMAWAT</p>
    <p>• DIVYA SHUKLA </p>
    <p>• MANSI KUMAWAT</p>
    <p>• KAJAL KUMAWAT</p>
  </div>

      <p>
        Empowering security with decentralization 🚀
      </p>
    </div>

    {/* Right: Tech Stack */}
    <div className="text-center md:text-right">
      <p className="text-slate-300 font-medium">
        🛠 Tech Stack
      </p>
      <p>
        React • Ethereum • IPFS • Smart Contracts
      </p>
    </div>

  </div>

  {/* Bottom line */}
  <div className="mt-4 text-center text-xs text-slate-500">
    © {new Date().getFullYear()} TrustChain • Hackathon Project
  </div>
</footer>

    </div>
  );
  
}

export default Dashboard;
