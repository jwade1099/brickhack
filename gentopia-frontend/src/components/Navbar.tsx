import Link from "next/link";
import {
  Home,
  User,
  Bell,
  PenSquare,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { PostModal } from "./PostModal";

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) => (
  <Link href={href} className="group relative">
    <motion.div
      className="flex flex-col sm:flex-row items-center text-gray-600 hover:text-purple-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs sm:text-sm sm:ml-2">{label}</span>
    </motion.div>
    <motion.div
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 origin-left scale-x-0 transition-transform group-hover:scale-x-100"
      initial={false}
    />
  </Link>
);

export function Navbar() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Sparkles className="h-6 w-6 text-purple-600" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Gentopia
            </span>
          </Link>

          <div className="flex items-center justify-end gap-6">
            <NavLink href="/" icon={Home} label="Home" />
            <NavLink href="/profile" icon={User} label="Profile" />
            <NavLink href="/notifications" icon={Bell} label="Notifications" />
            <motion.button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PenSquare className="h-5 w-5" />
              <span className="hidden sm:block">Post</span>
            </motion.button>
          </div>
        </div>
      </nav>
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </>
  );
}
