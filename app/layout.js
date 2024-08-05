// app/layout.js
import { CssBaseline } from '@mui/material'; // Update the import
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ማጀት/ጓዳ',
  description: 'Keep track of all your pantry items with ease.',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
