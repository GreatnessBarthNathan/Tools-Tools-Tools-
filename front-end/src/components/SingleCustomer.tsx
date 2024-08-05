import { useState, useEffect } from "react"
import { useDashboardContext } from "../pages/DashboardLayout"
import { CustomerType } from "../utils/types"
import { Link } from "react-router-dom"

function SingleCustomer({ firstName, lastName, phoneNumber }: CustomerType) {
  const { fetchOrders } = useDashboardContext()
  const [isDebtor, setIsDebtor] = useState(false)

  const checkDebtor = async () => {
    const orders = await fetchOrders()
    const order = orders.find(
      (order) => order.customer.phoneNumber === phoneNumber
    )

    let customerDebt = 0
    customerDebt += order?.balance || 0
    customerDebt > 0 ? setIsDebtor(true) : false
  }

  useEffect(() => {
    checkDebtor()
  }, [])

  return (
    <div
      className={`grid grid-cols-7 ${
        isDebtor ? "bg-red-100" : "bg-white "
      } mt-2 rounded shadow text-[8px] md:text-base p-1 md:p-2 capitalize`}
    >
      <p className='col-span-2 p-1 md:p-2'>{firstName}</p>
      <p className='col-span-2 p-1 md:p-2'>{lastName}</p>
      <p className='col-span-2 p-1 md:p-2'>{phoneNumber}</p>
      <Link
        to={`../customer-activity/${phoneNumber}`}
        className='p-1 md:p-2 text-[8px] md:text-base text-blue-500 hover:text-blue-800'
      >
        {isDebtor ? "view debt" : "activity"}
      </Link>
    </div>
  )
}

export default SingleCustomer
