import Link from "next/link";
import { Home, User, Bell, PenSquare } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed bottom-0 sm:top-0 w-full bg-white dark:bg-black border-t sm:border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold hidden sm:block">Gentopia</span>
        </Link>

        <div className="flex items-center justify-around sm:justify-end w-full sm:w-auto gap-6">
          <Link
            href="/"
            className="flex flex-col sm:flex-row items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs sm:text-sm sm:ml-2">Home</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col sm:flex-row items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <User className="h-6 w-6" />
            <span className="text-xs sm:text-sm sm:ml-2">Profile</span>
          </Link>

          <Link
            href="/notifications"
            className="flex flex-col sm:flex-row items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs sm:text-sm sm:ml-2">Notifications</span>
          </Link>

          <button className="flex flex-col sm:flex-row items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
            <PenSquare className="h-6 w-6" />
            <span className="text-xs sm:text-sm sm:ml-2">Post</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
