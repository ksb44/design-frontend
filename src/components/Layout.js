// components/Layout.js
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CiBellOn } from "react-icons/ci";
import { MdWindow } from "react-icons/md";

const Layout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="min-h-screen bg-white grid grid-cols-[auto_1fr] mt-4">
    
      <aside className="w-64  border-t border-gray-400 mt-[35%]  text-white p-4">
        <ul>
          <li>
            <Link href="/">
              <span className={` p-2 items-center flex ${pathname === '/' ? 'text-purple-700' : 'text-black'}`}><MdWindow size={20} /><span className="mx-2">Overview</span></span>
            </Link>
          </li>
          <li>
            <Link href="/people">
              <span className={`flex items-center p-2 ${pathname === '/people' ? 'text-purple-700' : 'text-black'}`}><MdWindow size={20}/><span className="mx-2">People Directory</span></span>
            </Link>
          </li>
        </ul>
      </aside>

      <div className="flex flex-col flex-1">
   
        <nav className="bg-white text-black p-4 flex items-center justify-between border-b border-gray-400">
          <div className="text-4xl font-bold text-purple-700 -mx-[23%] my-[8.7px] ">PEOPLE.CO</div>
          <div className="flex items-center mx-2 px-2">

          <CiBellOn size={20}/>
            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Gfp0lwE6h7139625a-r3aAHaHa%26pid%3DApi&f=1&ipt=9287ae7227563fe4c4a166d414b3df823c56e3512c2afa4de0735aabc046c914&ipo=images" alt="Bell Icon" className="w-6 h-6 mr-4 mx-3" />
            <span className="text-sm">Jane Doe</span>
          </div>
        </nav>

      
        <main className=" flex-1 border rounded-3xl mr-11 border-gray-400 mt-4 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
