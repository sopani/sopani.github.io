'use client'
import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";
import Image from "next/image";
import MainHeaderBackGround from "./main-header.bg";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";
export default function MainHeader() {

    const path= usePathname();
  return (
    <>
      <MainHeaderBackGround />
      <header className={classes.header}>
        <Link className={classes.logo} href={"/"}>
          <Image src={logoImg} alt="a plate with food on it" priority />
          Sonak&apos;s Kitchen
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href={"/meals"}>Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href={"/community"}>Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
