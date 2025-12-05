import React from 'react';
import { 
  Menu, Play, ChevronRight, Settings, LogOut
} from 'lucide-react';
import { 
  mainMenu, 
  subscriptions, 
  explore, 
  moreFromYoutube, 
  userMenu 
} from './sidebarData.jsx';

const Sidebar = ({ isCollapsed, toggleSidebar, user }) => {
  return (
    <aside className={`bg-black h-screen sticky top-0 flex flex-col border-r border-gray-800 transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Play size={20} fill="white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold whitespace-nowrap tracking-tight">JasPro Tubs</span>
          )}
        </div>
      </div>

      {/* User Profile (expanded only) */}
      {!isCollapsed && user && (
        <div className="px-4 py-3 border-y border-gray-800">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{user.name}</h4>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>
            <button className="p-1 hover:bg-gray-800 rounded-full">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3">
        {/* Main Menu */}
        <div className="mb-6">
          {!isCollapsed && (
            <div className="text-gray-500 text-xs uppercase font-semibold mb-2 px-3">Menu</div>
          )}
          <div className="space-y-1">
            {mainMenu.map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors group ${
                  item.active 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="relative">
                  {item.icon}
                  {item.label === 'Live' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.active && (
                      <div className="w-1 h-4 bg-red-600 rounded-full"></div>
                    )}
                  </>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Subscriptions Section */}
        {!isCollapsed && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 px-3">
                <div className="text-gray-500 text-xs uppercase font-semibold">Subscriptions</div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
              <div className="space-y-1">
                {subscriptions.map((sub, index) => (
                  <a key={index} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors group">
                    <div className="relative">
                      <img src={sub.logo} alt={sub.label} className="w-6 h-6 rounded-full" loading="lazy" />
                      {sub.live && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <span className="font-medium truncate flex-1">{sub.label}</span>
                    {sub.new && (
                      <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-sm">
                        {sub.new} new
                      </span>
                    )}
                  </a>
                ))}
                <button className="w-full px-3 py-2.5 text-blue-400 hover:bg-gray-800 rounded-lg transition-colors text-left">
                  + Show 15 more
                </button>
              </div>
            </div>

            {/* Explore Section */}
            <div className="mb-6">
              <div className="text-gray-500 text-xs uppercase font-semibold mb-2 px-3">Explore</div>
              <div className="space-y-1">
                {explore.map((item, index) => (
                  <a key={index} href="#" className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* More from YouTube */}
            <div className="mb-6">
              <div className="text-gray-500 text-xs uppercase font-semibold mb-2 px-3">More from YouTube</div>
              <div className="space-y-1">
                {moreFromYoutube.map((item, index) => (
                  <a key={index} href="#" className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="mb-6">
              <div className="text-gray-500 text-xs uppercase font-semibold mb-2 px-3">You</div>
              <div className="space-y-1">
                {userMenu.map((item, index) => (
                  <a key={index} href="#" className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Collapsed Menu */}
        {isCollapsed && (
          <div className="space-y-1">
            {mainMenu.slice(0, 8).map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className="group relative flex flex-col items-center py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <div className="relative">
                  {item.icon}
                  {item.label === 'Live' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  )}
                </div>
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Settings & Logout */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <Settings size={22} />
              <span className="font-medium">Settings</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <LogOut size={22} />
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </div>
      )}

      {/* Footer Links */}
      {!isCollapsed && (
        <div className="px-3 py-6 border-t border-gray-800">
          <div className="text-xs text-gray-500 space-y-2">
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:text-gray-400">About</a>
              <a href="#" className="hover:text-gray-400">Press</a>
              <a href="#" className="hover:text-gray-400">Copyright</a>
              <a href="#" className="hover:text-gray-400">Contact us</a>
              <a href="#" className="hover:text-gray-400">Creators</a>
              <a href="#" className="hover:text-gray-400">Advertise</a>
              <a href="#" className="hover:text-gray-400">Developers</a>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:text-gray-400">Terms</a>
              <a href="#" className="hover:text-gray-400">Privacy</a>
              <a href="#" className="hover:text-gray-400">Policy & Safety</a>
              <a href="#" className="hover:text-gray-400">How YouTube works</a>
              <a href="#" className="hover:text-gray-400">Test new features</a>
            </div>
            <div className="mt-4 text-gray-600">
              © 2024 Google LLC
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;