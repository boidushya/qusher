import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import QRCodeReceiver from "./components/receiver/qrcode-receiver";
import FileToQRCodeSequence from "./components/sender/file-to-qrcode-sequence";
import Nav from "./components/ui/nav";

const animationVariants = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(4px)" },
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("send");

  return (
    <div className="min-h-screen relative bg-zinc-900 text-zinc-50 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[120px] animated-gradient top-[-400px] left-[-400px] " />
        <div className="absolute w-[800px] h-[800px] rounded-full bg-indigo-600/5 blur-[100px] animated-gradient bottom-[-400px] right-[-400px] " />
      </div>

      <div className="relative z-10 min-h-screen">
        <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-4xl mx-auto pt-12 px-4">
          <header className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-white flex items-center justify-center gap-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7 8.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C7.76 7 8.04 7 8.6 7h.3c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437c.109.214.109.494.109 1.054v.3c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437c-.214.109-.494.109-1.054.109h-.3c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C7 9.74 7 9.46 7 8.9zm0 6.5c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C7.76 13.5 8.04 13.5 8.6 13.5h.3c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437c.109.214.109.494.109 1.054v.3c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C9.74 17 9.46 17 8.9 17h-.3c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C7 16.24 7 15.96 7 15.4zm6.609-7.554C13.5 7.76 13.5 8.04 13.5 8.6v.3c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.109.494.109 1.054.109h.3c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C17 9.74 17 9.46 17 8.9v-.3c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C16.24 7 15.96 7 15.4 7h-.3c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437"
                  opacity=".5"
                ></path>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M7.969 3.25h.698a.75.75 0 0 1 0 1.5H8c-.712 0-1.202 0-1.58.032c-.371.03-.57.085-.714.159a1.75 1.75 0 0 0-.765.765c-.074.144-.13.343-.16.713c-.03.38-.031.869-.031 1.581v.667a.75.75 0 0 1-1.5 0v-.698c0-.674 0-1.224.037-1.672c.037-.463.118-.882.317-1.272a3.25 3.25 0 0 1 1.42-1.42c.391-.2.81-.28 1.273-.318c.448-.037.998-.037 1.672-.037m9.612 1.532C17.2 4.75 16.712 4.75 16 4.75h-.667a.75.75 0 0 1 0-1.5h.698c.674 0 1.225 0 1.672.037c.463.037.882.118 1.273.317a3.25 3.25 0 0 1 1.42 1.42c.199.391.28.81.317 1.273c.037.447.037.998.037 1.672v.698a.75.75 0 0 1-1.5 0V8c0-.712 0-1.202-.032-1.58c-.03-.371-.085-.57-.159-.714a1.75 1.75 0 0 0-.765-.765c-.144-.074-.343-.13-.713-.16M4 14.583a.75.75 0 0 1 .75.75V16c0 .712 0 1.202.032 1.58c.03.371.085.57.159.715c.168.329.435.596.765.764c.144.074.343.13.713.16c.38.03.869.031 1.581.031h.667a.75.75 0 0 1 0 1.5h-.698c-.674 0-1.225 0-1.672-.037c-.463-.037-.882-.118-1.272-.317a3.25 3.25 0 0 1-1.42-1.42c-.2-.391-.28-.81-.318-1.273c-.037-.447-.037-.998-.037-1.672v-.698a.75.75 0 0 1 .75-.75m16 0a.75.75 0 0 1 .75.75v.698c0 .674 0 1.225-.037 1.672c-.037.463-.118.882-.317 1.273a3.25 3.25 0 0 1-1.42 1.42c-.391.199-.81.28-1.273.317c-.447.037-.998.037-1.672.037h-.698a.75.75 0 0 1 0-1.5H16c.712 0 1.202 0 1.58-.032c.371-.03.57-.085.715-.159a1.75 1.75 0 0 0 .764-.765c.074-.144.13-.343.16-.713c.03-.38.031-.869.031-1.581v-.667a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M8.574 6.25h.352c.258 0 .494 0 .692.016c.213.018.446.057.676.175c.33.168.598.435.765.765c.118.23.158.463.175.676c.016.198.016.434.016.692v.352c0 .258 0 .494-.016.692a1.8 1.8 0 0 1-.175.676a1.75 1.75 0 0 1-.764.765c-.23.118-.464.158-.677.175c-.198.016-.434.016-.692.016h-.352c-.258 0-.494 0-.692-.016a1.8 1.8 0 0 1-.676-.175a1.75 1.75 0 0 1-.765-.764a1.8 1.8 0 0 1-.175-.677c-.016-.198-.016-.434-.016-.692v-.352c0-.258 0-.494.016-.692a1.8 1.8 0 0 1 .175-.676a1.75 1.75 0 0 1 .765-.765a1.8 1.8 0 0 1 .676-.175c.198-.016.434-.016.692-.016M7.88 7.78h.001zm.002-.001a.6.6 0 0 1 .121-.018c.13-.01.304-.011.596-.011h.3c.292 0 .467 0 .596.011a.6.6 0 0 1 .12.018a.25.25 0 0 1 .105.104a.6.6 0 0 1 .018.121c.01.13.011.304.011.596v.3c0 .292 0 .467-.011.596a.6.6 0 0 1-.018.12a.25.25 0 0 1-.104.105a.6.6 0 0 1-.121.018c-.13.01-.304.011-.596.011h-.3c-.292 0-.467 0-.596-.011a.6.6 0 0 1-.12-.018a.25.25 0 0 1-.105-.104a.6.6 0 0 1-.018-.121a8 8 0 0 1-.01-.596v-.3c0-.292 0-.467.011-.596a.6.6 0 0 1 .018-.12a.25.25 0 0 1 .104-.105M7.88 9.72h.002zm1.74 0h-.002zm.1-.1v-.002zm0-1.74v.002zm5.354-1.63h.352c.258 0 .494 0 .692.016c.213.018.446.057.677.175c.329.168.596.435.764.765c.118.23.157.463.175.676c.016.198.016.434.016.692v.352c0 .258 0 .494-.016.692a1.8 1.8 0 0 1-.175.676a1.75 1.75 0 0 1-.765.765c-.23.118-.463.158-.676.175c-.198.016-.434.016-.692.016h-.352c-.258 0-.494 0-.692-.016a1.8 1.8 0 0 1-.676-.175a1.75 1.75 0 0 1-.765-.764a1.8 1.8 0 0 1-.175-.677c-.016-.198-.016-.434-.016-.692v-.352c0-.258 0-.494.016-.692a1.8 1.8 0 0 1 .175-.676a1.75 1.75 0 0 1 .765-.765a1.8 1.8 0 0 1 .676-.175c.198-.016.434-.016.692-.016m-.691 1.529a.6.6 0 0 1 .121-.018c.13-.01.304-.011.596-.011h.3c.292 0 .467 0 .596.011a.6.6 0 0 1 .12.018a.25.25 0 0 1 .105.104a.6.6 0 0 1 .018.121c.01.13.011.304.011.596v.3c0 .292 0 .467-.011.596a.6.6 0 0 1-.018.12a.25.25 0 0 1-.105.105a.6.6 0 0 1-.12.018c-.13.01-.304.011-.596.011h-.3c-.292 0-.467 0-.596-.011a.6.6 0 0 1-.12-.018a.25.25 0 0 1-.105-.104a.6.6 0 0 1-.018-.121a8 8 0 0 1-.011-.596v-.3c0-.292 0-.467.011-.596a.6.6 0 0 1 .018-.12a.25.25 0 0 1 .104-.105m-.103.102v.001zm.1 1.839h.002zm1.74 0h-.002zm.1-.1v-.002zm0-1.74v.002zm-.102-.1h.001zm-7.544 4.97h.352c.258 0 .494 0 .692.016c.213.018.446.057.676.175c.33.167.598.435.765.765c.118.23.158.463.175.676c.016.198.016.434.016.692v.352c0 .258 0 .494-.016.692a1.8 1.8 0 0 1-.175.677a1.75 1.75 0 0 1-.764.764c-.23.118-.464.157-.677.175c-.198.016-.434.016-.692.016h-.352c-.258 0-.494 0-.692-.016a1.8 1.8 0 0 1-.676-.175a1.75 1.75 0 0 1-.765-.765a1.8 1.8 0 0 1-.175-.676c-.016-.198-.016-.434-.016-.692v-.352c0-.258 0-.494.016-.692a1.8 1.8 0 0 1 .175-.676a1.75 1.75 0 0 1 .765-.765c.23-.118.463-.158.676-.175c.198-.016.434-.016.692-.016m-.693 1.53h.001zm.002-.001a.6.6 0 0 1 .121-.018c.13-.01.304-.011.596-.011h.3c.292 0 .467 0 .596.011a.6.6 0 0 1 .12.018a.25.25 0 0 1 .105.104a.6.6 0 0 1 .018.121c.01.13.011.304.011.596v.3c0 .292 0 .467-.011.596a.6.6 0 0 1-.018.12a.25.25 0 0 1-.104.105a.6.6 0 0 1-.121.018c-.13.01-.304.011-.596.011h-.3c-.292 0-.467 0-.596-.011a.6.6 0 0 1-.12-.018a.25.25 0 0 1-.105-.105a.6.6 0 0 1-.018-.12a8 8 0 0 1-.011-.596v-.3c0-.292 0-.467.011-.596a.6.6 0 0 1 .018-.12a.25.25 0 0 1 .104-.105M7.88 16.22h.002zm1.74 0h-.002zm.1-.1v-.002zm0-1.74v.002zm4.03-1.63a.75.75 0 0 1 .75.75v.75c0 .138.112.25.25.25h1.5c.966 0 1.75.784 1.75 1.75V17a.75.75 0 0 1-1.5 0v-.75a.25.25 0 0 0-.25-.25h-1.5A1.75 1.75 0 0 1 13 14.25v-.75a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="bg-gradient-to-r from-white to-white text-transparent bg-clip-text">Qusher</span>
            </motion.h1>
            <motion.p
              className="mt-2 text-zinc-200"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Share files magically through QR codes!
            </motion.p>
          </header>

          {/* Component Display */}
          <div className="pb-36">
            <AnimatePresence mode="popLayout">
              {activeTab === "send" && (
                <motion.div key="send" variants={animationVariants} initial="initial" animate="animate" exit="exit">
                  <FileToQRCodeSequence />
                </motion.div>
              )}
              {activeTab === "receive" && (
                <motion.div key="receive" variants={animationVariants} initial="initial" animate="animate" exit="exit">
                  <QRCodeReceiver />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Particles />
    </div>
  );
};

const Particles: React.FC = React.memo(() => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, index) => {
      const size = Math.random() * 4 + 1;
      const duration = Math.random() * 20 + 10;
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      const delay = Math.random() * 10;

      return (
        <div
          key={index}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${initialX}%`,
            top: `${initialY}%`,
            animation: `float ${duration}s ease-in-out ${delay}s infinite`,
          }}
        />
      );
    });
  }, []); // Empty dependency array ensures this runs only once

  return <div className="absolute inset-0 pointer-events-none z-0">{particles}</div>;
});

export default App;
