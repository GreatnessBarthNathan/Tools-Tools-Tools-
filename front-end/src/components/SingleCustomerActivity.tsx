import { useState, useEffect } from "react"
import { OrderType } from "../utils/types"
import SingleOrderItem from "./SingleOrderItem"
import OrderTableHead from "./OrderTableHead"
import OrderFooter from "./OrderFooter"
import customFetch from "../utils/customFetch"

function SingleCustomerActivity({
  _id,
  total,
  enteredAt,
  orderItems,
  balance,
}: OrderType) {
  const editedDate = new Date(enteredAt)
  const [soldBy, setSoldBy] = useState("")
  const [showMore, setShowMore] = useState(false)

  const getSoldBy = async () => {
    try {
      const {
        data: { soldBy },
      } = await customFetch.get(`/order/${_id}`)
      setSoldBy(soldBy)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSoldBy()
  }, [])

  return (
    <main>
      <div
        className={`flex justify-between items-center gap-2 mt-2 rounded shadow text-[8px] md:text-base ${
          showMore
            ? "bg-blue-300 text-white font-semibold rounded-none"
            : "bg-white"
        }`}
      >
        <h2 className='p-2 '>
          {new Intl.DateTimeFormat("es").format(editedDate)}
        </h2>
        <h2 className='p-2 '>
          {orderItems.length} Item{orderItems.length > 1 && "s"}
        </h2>
        <h2 className={`p-2 ${showMore && "hidden"}`}>
          Total:{" "}
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(total)}
        </h2>
        <h2 className={`p-2 ${showMore && "hidden"}`}>
          Balance:{" "}
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(balance as number)}
        </h2>
        <button
          className={`p-2 ${
            showMore ? "text-red-700" : "text-blue-500"
          } hover:text-blue-700`}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "close" : "view"}
        </button>
      </div>

      <section
        className={`${
          showMore
            ? "h-[160px] md:h-[200px] overflow-auto ease-in-out duration-300"
            : "h-0 overflow-auto ease-in-out duration-300"
        } ease-in-out duration-200`}
      >
        <OrderTableHead />

        <div className='bg-white rounded-md shadow-md'>
          {orderItems.map((item) => (
            <SingleOrderItem key={item.productId} {...item} orderId={_id} />
          ))}
        </div>

        <OrderFooter
          soldBy={soldBy}
          total={total}
          balance={balance as number}
          _id={_id}
        />
      </section>
    </main>
  )
}

export default SingleCustomerActivity
