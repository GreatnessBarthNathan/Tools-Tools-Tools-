import { useState } from "react"
import { CgProfile } from "react-icons/cg"
import { FaCaretDown } from "react-icons/fa"
import { useDashboardContext } from "../pages/DashboardLayout"

const Logout = () => {
  const [showLogout, setShowLogout] = useState(false)
  const { logout, currentUser } = useDashboardContext()

  return (
    <div className='relative'>
      <div
        className='flex items-center space-x-3 bg-indigo-500 text-white p-1 rounded cursor-pointer  hover:bg-indigo-800 ease-in-out duration-300'
        onClick={() => setShowLogout(!showLogout)}
      >
        <CgProfile />
        <h2 className='capitalize'>{currentUser.userName}</h2>
        <FaCaretDown />
      </div>

      <div
        onClick={logout}
        className={`absolute text-center bg-indigo-500 text-white p-1 rounded w-full top-[50px] cursor-pointer hover:bg-indigo-800 ease-in-out duration-300 ${
          !showLogout && "hidden"
        }`}
      >
        logout
      </div>
    </div>
  )
}

export default Logout
