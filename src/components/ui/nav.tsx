import { motion } from "framer-motion";
import React from "react";

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItemProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
}

const NavItem = ({ active, children, onClick, icon }: NavItemProps) => {
  return (
    <motion.button
      className={`py-3 px-6 cursor-pointer font-medium transition-all flex whitespace-pre items-center relative ${
        active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
      }`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {active && (
        <motion.div
          className="absolute inset-0 bg-zinc-700 rounded-full z-0"
          layoutId="activeTabBackground"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex items-center">
        <motion.span
          className="mr-2"
          animate={{ scale: active ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.span>
        {children}
      </div>
    </motion.button>
  );
};

const Nav = ({ activeTab, setActiveTab }: NavProps) => {
  return (
    <motion.nav
      className="shadow-2xl fixed bottom-16 left-1/2 z-10"
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="flex rounded-full bg-zinc-800 overflow-hidden border-zinc-700 border p-1"
        whileHover={{ boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)" }}
        transition={{ duration: 0.2 }}
      >
        <NavItem
          active={activeTab === "send"}
          onClick={() => setActiveTab("send")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          }
        >
          Send File
        </NavItem>
        <NavItem
          active={activeTab === "receive"}
          onClick={() => setActiveTab("receive")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          }
        >
          Receive File
        </NavItem>
      </motion.div>
    </motion.nav>
  );
};

export default Nav;
