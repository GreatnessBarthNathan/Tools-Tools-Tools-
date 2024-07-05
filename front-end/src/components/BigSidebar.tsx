import { useDashboardContext } from "../pages/DashboardLayout"
import PageLink from "./PageLinks"
import { FaSitemap, FaShoppingBasket } from "react-icons/fa"
import { MdSettings, MdOutlineCreateNewFolder, MdHistory } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { CiShoppingCart } from "react-icons/ci"
import { AiFillAppstore } from "react-icons/ai"
import { GiExpense } from "react-icons/gi"
import { IoIosPeople } from "react-icons/io"
import { TbLockCheck } from "react-icons/tb"
import Logo from "./Logo"

const BigSidebar = () => {
  const { currentUser } = useDashboardContext()

  return (
    // wrapper
    <div className='hidden lg:block translate-x-0 opacity-1 h-full lg:col-span-1 bg-white pb-11'>
      {/* container */}
      <div className='h-full pt-[10px]'>
        {/* logo */}
        <Logo container='w-[50%] m-auto mb-[30px]' image='w-full' />
        {/* links */}
        <div>
          <PageLink url='' text='Create Order' icon={<CiShoppingCart />} />
          <PageLink url='orders' text='Orders' icon={<FaShoppingBasket />} />
          <PageLink
            url='create-product'
            text='Create Product'
            icon={<MdOutlineCreateNewFolder />}
          />
          <PageLink url='products' text='All Products' icon={<FaSitemap />} />
          <PageLink url={`store`} text='Store' icon={<AiFillAppstore />} />
          <PageLink url='expenses' text='Expenses' icon={<GiExpense />} />
          <PageLink url='history' text='History' icon={<MdHistory />} />
          <PageLink url='customers' text='Customers' icon={<IoIosPeople />} />
          {currentUser.role === "admin" && (
            <PageLink
              url='permissions'
              text='Permissions'
              icon={<TbLockCheck />}
            />
          )}
          <PageLink url={`profile`} text='Profile' icon={<CgProfile />} />
          <PageLink url={`settings`} text='Settings' icon={<MdSettings />} />
        </div>
      </div>
    </div>
  )
}

export default BigSidebar
