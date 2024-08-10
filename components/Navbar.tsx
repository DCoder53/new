"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {AiOutlineMenu , AiOutlineClose} from 'react-icons/ai'
import {useState} from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  const [menuOpen , setMenuOpen] = useState(false)

  const pathname = usePathname()

  const handleNav = () =>{
    setMenuOpen(!menuOpen);
  }

  const isActive = (path) => pathname === path ? 'underline' : ''

  return (
    <nav className='fixed w-full h-24 shadow-xl bg-white'>
        <div className='flex justify-between items-center h-full w-full px-4 2xl:px-16'>
            <div>
            <Link href="/">
            <h1>Thoghts App</h1>
          </Link>
        </div>
        <div className="hidden sm:flex">
          <ul className='hidden sm:flex'>
            <Link href="/">
              <li className={`ml-8 text-xl ${isActive('/')}`}>
                Share
              </li>
            </Link>
            <Link href="/all-thoughts">
              <li className={`ml-8 text-xl ${isActive('/all-thoughts')}`}>
                All
              </li>
            </Link>
            <Link href="/daily-thoughts">
              <li className={`ml-8 text-xl ${isActive('/daily-thoughts')}`}>
                Daily
              </li>
            </Link>
            <Link href="/weekly-thoughts">
              <li className={`ml-8 text-xl ${isActive('/weekly-thoughts')}`}>
                Weekly
              </li>
            </Link>
            <Link href="/monthly-thoughts">
              <li className={`ml-8 text-xl ${isActive('/monthly-thoughts')}`}>
                Monthly
              </li>
            </Link>
            <Link href="/your-activity">
              <li className={`ml-8 text-xl ${isActive('/your-activity')}`}>
                Your Activity
              </li>
            </Link>
          </ul>
            </div>
            <div onClick={handleNav} className='sm:hidden cursor-pointer pl-24'>
              <AiOutlineMenu size={25}/>
            </div>
            <div className="hidden md:block">
                <SignedIn>
                  <UserButton/>
                </SignedIn>
            </div>
        </div>
        <div className={
          menuOpen ? "fixed left-0 top-0 w-[65%] sm:hidden h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
          :"fixed left-[-100%] top-0 p-10 ease-in duration-500"
        }>
        <div className='flex w-full items-center justify-end'>
            <div onClick={handleNav} className='cursor-pointer'>
              <AiOutlineClose size={25} />
            </div>
          </div>
          <div className='flex-col py-4'>
            <ul>
              <Link href="/">
                  <li
                  onClick={()=>setMenuOpen(false)}
                  className='py-4 cursor-pointer'>
                  Share
                  </li>
                </Link>
              <Link href="/all-thoughts">
                  <li
                  onClick={()=>setMenuOpen(false)}
                  className='py-4 cursor-pointer'>
                  Top
                  </li>
                </Link>

                <Link href="/daily-thoughts">
                <li
                  onClick={()=>setMenuOpen(false)}
                  className='py-4 cursor-pointer'>
                  Daily
                  </li>
                </Link>

                <Link href="/weekly-thoughts">
                <li
                  onClick={()=>setMenuOpen(false)}
                  className='py-4 cursor-pointer'>
                  Weekly
                  </li>
                </Link>

                <Link href="/monthly-thoughts">
                <li
                  onClick={()=>setMenuOpen(false)}
                  className='py-4 cursor-pointer'>
                  Monthly
                  </li>
                </Link>

                <Link href="/your-activity">
                <li
                  onClick={()=>setMenuOpen(false)}
                  className='py-4 cursor-pointer'>
                    Your Activity
                  </li>
                </Link>
              </ul>
          </div>
              <div >
                <SignedIn>
                  <UserButton/>
                </SignedIn>
              </div>
        </div>
    </nav>
  )
}

export default Navbar
