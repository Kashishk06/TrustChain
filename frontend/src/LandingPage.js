import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import problem from "./assets/problem.png";
import solution from "./assets/solution.png";
import vedio from "./assets/vedio.mp4";
function LandingPage() {
  const navigate = useNavigate();

  return (

    
    <div className="min-h-screen bg-dark text-white">

        {/* HEADER */}
<div className="flex items-center justify-between px-8 py-4">
  <div className="flex items-center gap-1">
    <img
      src={logo}
      alt="TrustChain Logo"
      className="h-20 w-20"
    />
    <h1 className="text-2xl font-bold text-primary">
      TrustChain
    </h1>

 <h3 className="ml-96 italic text-lg font-semibold text-center">
  "Secure today, verify forever"
</h3>

  </div>

  <button className="bg-primary px-4 py-2 rounded-lg hover:scale-105 transition">
    Launch App
  </button>
</div>


      {/* HERO SECTION

      
      <section className="text-center px-8 py-24">
        <h1 className="text-5xl font-extrabold text-primary mb-6">
          TrustChain
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Secure file storage & access control powered by Blockchain and IPFS.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-3 bg-primary rounded-xl text-lg font-semibold hover:scale-105 transition"
        >
           Launch Dashboard
        </button>
      </section> */}
      {/* HERO SECTION */}

       <div className="flex justify-center mt-6">
 
<div className="flex flex-col items-center justify-center text-center mt-6">

  {/* BIG CENTER LOGO */}
  {/* <img
    src={logo}
    alt="TrustChain Logo"
    className="w-45 h-45 mb-1 animate-pulse drop-shadow-[0_0_40px_rgba(139,92,246,0.9)] 
]"
  /> */}

 

  {/* TAGLINE */}
  {/* <p className="text-gray-400 max-w-xl mb-6">
    Secure file storage & access control powered by Blockchain and IPFS.
  </p> */}

  {/* CTA BUTTON */}
  {/* <button onClick={() => navigate("/dashboard")} className="bg-primary px-6 py-3 rounded-xl text-lg hover:scale-105 transition">
    🚀 Launch Dashboard
  </button> */}

   <video
  src={vedio}
  autoPlay
  loop
  muted
  playsInline
  className="mt-6 mb-6 w-full max-w-3xl rounded-2xl shadow-lg border border-slate-700"
/>

 <h3 className="text-3xl font-bold mb-4"> Secure file storage & access control powered by Blockchain and IPFS.</h3>

  
  {/* CTA BUTTON */}
  <button onClick={() => navigate("/dashboard")} className="bg-primary px-6 py-3 rounded-xl text-lg hover:scale-105 transition">
    🚀 Launch Dashboard
  </button>

</div>
</div>



      {/* PROBLEM + SOLUTION */}
      <section className="px-8 py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          
          <div>
            

            <h2 className="text-3xl font-bold mb-4"> <img
      src={problem}
      alt="Problem Icon"
      className="h-16 w-16"
    /> The Problem</h2>
            <p className="text-gray-300">
              Sensitive files are vulnerable to tampering, unauthorized access,
              and single-point failures in traditional systems.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">  <img
      src={solution}
      alt="Solution Icon"
      className="h-16 w-16"
    /> Our Solution</h2>
            <p className="text-gray-300">
              TrustChain uses Blockchain for auditability and IPFS for
              decentralized, tamper-proof storage.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
           Key Features
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">📤 Secure Upload</h3>
            <p className="text-gray-300">
              Files are uploaded to IPFS with cryptographic hashing.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">📜 Blockchain Audit</h3>
            <p className="text-gray-300">
              Every action is immutably recorded on the blockchain.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">🔍 Verify Integrity</h3>
            <p className="text-gray-300">
              Files are uploaded to IPFS with cryptographic hashing.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">🚨 Emergency Lockdown</h3>
            <p className="text-gray-300">
              Instantly restrict all actions during a security breach.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-8 py-20 bg-slate-900">
        <h2 className="text-4xl font-bold text-center mb-12">
          ⚙️ How It Works
        </h2>

        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-300">
          <p>1️⃣ Connect your crypto wallet</p>
          <p>2️⃣ Upload files to IPFS</p>
          <p>3️⃣ Store file hash on blockchain</p>
          <p>4️⃣ Monitor activity & control access</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-400">
        Built with ❤️ by team - Tech Drishti for Hackathon | TrustChain
      </footer>

    </div>
  );
}

export default LandingPage;
