import Link from 'next/link'
import Navitem from './Navitem'

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left side - Brand/Title */}
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors">
          Aitounsi
        </Link>
      </div>

      {/* Right side - Navigation Links */}
      <div className="flex items-center gap-8">
        <Navitem />
        <p>Sign In</p>
      </div>
    </nav>
  )
}

export default Navbar