import React from 'react';
import Header from './Header';
//import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar /> */}
        <main className="flex-1 overflow-y-auto overflow-x-visible">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;