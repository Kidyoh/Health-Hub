"use client";
import React from "react";
import Image from "next/image";
import Logo from "/public/images/markers/health-hub-ethiopia-high-resolution-logo-transparent.png";
import Logowhite from "/public/images/markers/health-hub-ethiopia-high-resolution-logo-transparent.png";
import Link from "next/link";

const FullLogo = () => {
  return (
    <Link href={"/"}>
      {/* Dark Logo   */}
      <Image 
        src={Logo} 
        alt="logo" 
        width={100}  // Specify desired width
        height={30}  // Specify desired height
        className="block dark:hidden rtl:scale-x-[-1]" 
      />
      {/* Light Logo  */}
      <Image 
        src={Logowhite} 
        alt="logo" 
        width={100}  // Specify desired width
        height={30}  // Specify desired height
        className="hidden dark:block rtl:scale-x-[-1]" 
      />
    </Link>
  );
};

export default FullLogo;
