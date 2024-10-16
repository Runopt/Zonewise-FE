import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <section>
      <main>{children}</main>
    </section>
  );
};

export default Layout;
