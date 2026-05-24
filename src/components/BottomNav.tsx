import React from "react";
import { Home, FileText, Video, BookOpen, User, Shield } from "lucide-react";
import { User as UserType } from "../types";

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserType | null;
}

export default function BottomNav({ currentTab, onTabChange, currentUser }: BottomNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "past-papers", label: "Past Papers", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl block md:block pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 relative transition-all active:scale-95 ${
                isActive ? "text-blue-500 font-semibold" : "text-slate-400 font-normal hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] mt-1 tracking-tight font-sans truncate">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}

        {currentUser?.isAdmin && (
          <button
            onClick={() => onTabChange("admin")}
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 relative transition-all active:scale-95 md:hidden ${
              currentTab === "admin" ? "text-indigo-400 font-semibold" : "text-slate-400 font-normal"
            }`}
          >
            <Shield className={`w-5 h-5 ${currentTab === "admin" ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-1 tracking-tight font-sans">Admin</span>
            {currentTab === "admin" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-450 rounded-full" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
