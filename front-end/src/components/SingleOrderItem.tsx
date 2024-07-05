import { OrderItemsType } from "../utils/types"
import { BsArrowReturnLeft } from "react-icons/bs"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import { useDashboardContext } from "../pages/DashboardLayout"

function SingleOrderItem({
  name,
  price,
  pcs,
  subTotal,
  returned,
  productId,
  orderId,
  _id,
}: OrderItemsType) {
  const { currentUser } = useDashboardContext()

  // RETURN ITEM
  const returnItem = async (orderId: string, id: string) => {
    const {
      data: { product },
    } = await customFetch.get(`/product/${id}`)

    const userInput = prompt(
      `please type "${product.name}" to return this item`
    )
    if (userInput !== null && userInput === product.name) {
      try {
        await customFetch.get(
          `/order/return-item?orderId=${orderId}&&itemId=${_id}`
        )
        location.reload()
        toast.success("Item successfully returned")
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.error("Please follow the right instructions")
      return
    }
  }
  return (
    <div
      className={`grid grid-cols-10 gap-2 ${
        returned ? "bg-red-100 text-slate-500" : "bg-white"
      }`}
    >
      <h2 className='col-span-3 p-2 capitalize text-[8px] md:text-base'>
        {name}
      </h2>
      <h2 className='p-2 text-[8px] md:text-base'>{pcs}</h2>
      <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(price)}
      </h2>
      <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(subTotal)}
      </h2>
      <div className='col-span-2 p-2 flex justify-between items-center text-[8px] space-x-1 md:text-base'>
        <h2>{returned ? "true" : "false"}</h2>
        <button
          onClick={() => returnItem(orderId as string, productId as string)}
        >
          {currentUser.role === "admin" && <BsArrowReturnLeft />}
        </button>
      </div>
    </div>
  )
}

export default SingleOrderItem
