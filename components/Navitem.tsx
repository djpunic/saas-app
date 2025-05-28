import Link from 'next/link'

const navItems = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Demo',
    href: '/demo',
    dropdown: [
      {
        label: 'Booking Agent',
        href: '/demo/booking-agent'
      },
      {
        label: 'Ecommerce Agent',
        href: '/demo/ecommerce-agent'
      },
      {
        label: 'Real Estate Agent',
        href: '/demo/real-estate-agent'
      }
    ]
  }
]

const Navitem = () => {
  return (
    <div className="flex items-center gap-6">
      {navItems.map((item, index) => (
        <div key={index} className="relative group">
          {item.dropdown ? (
            <>
              <button className="text-black hover:text-gray-700 transition-colors flex items-center gap-1">
                {item.label}
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {item.dropdown.map((dropdownItem, dropdownIndex) => (
                  <Link
                    key={dropdownIndex}
                    href={dropdownItem.href}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors"
                  >
                    {dropdownItem.label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href={item.href}
              className="text-black hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default Navitem