import {
  useEffect,
  useState,
  FormEvent,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react"
import { useDashboardContext } from "./DashboardLayout"
import SearchOrderForm from "../components/SearchOrderForm"
import SingleOrder from "../components/SingleOrder"
import Loading from "../components/Loading"
import { ExpenseType, OrderType, UserTypes } from "../utils/types"
import dayjs from "dayjs"
import axios from "axios"
import { toast } from "react-toastify"
import { AnalysisType } from "../utils/types"
import Analysis from "../components/Analysis"
import ReturnItemModal from "../components/modals/ReturnItemModal"
import customFetch from "../utils/customFetch"
import Filter from "../components/Filter"

type IDType = {
  orderId: string
  itemId: string
}
type ValueTypes = {
  showReturnItemModal: boolean
  setShowReturnItemModal: Dispatch<SetStateAction<boolean>>
  IDs: IDType
  setIDs: Dispatch<SetStateAction<IDType>>
  returnItem: () => void
}

const OrderContext = createContext<ValueTypes | undefined>(undefined)

function AllOrders() {
  const { fetchOrders, fetchExpenses, currentUser, fetchUsers } =
    useDashboardContext()
  const [allOrders, setAllOrders] = useState<OrderType[]>([])
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")
  const [displayedExpenses, setDisplayedExpenses] = useState<ExpenseType[]>([])
  const [analysis, setAnalysis] = useState<AnalysisType>({
    total: 0,
    totalReturned: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    totalCash: 0,
    totalBank: 0,
  })
  const [showReturnItemModal, setShowReturnItemModal] = useState(false)
  const [IDs, setIDs] = useState<IDType>({ orderId: "", itemId: "" })
  const [filterBtns, setFilterBtns] = useState<string[]>([])
  const [users, setUsers] = useState<UserTypes[]>([])
  console.log(orders)
  // GET ORDERS
  const getOrders = async () => {
    setLoading(true)
    const today = dayjs(new Date(Date.now())).format("YYYY-MM-DD")

    setDate(
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(Date.now())
      )
    )

    try {
      // orders
      const orders = await fetchOrders()
      if (currentUser.role !== "admin") {
        const todayOrders = orders.filter(
          (order: OrderType) =>
            (order.enteredAt as string) >= today &&
            (order.enteredAt as string) <= today &&
            order.userId === currentUser._id
        )

        setOrders(todayOrders)
        setAllOrders(todayOrders)
      } else {
        const todayOrders = orders.filter(
          (order: OrderType) =>
            (order.enteredAt as string) >= today &&
            (order.enteredAt as string) <= today
        )

        setOrders(todayOrders)
        setAllOrders(todayOrders)
      }

      // expenses
      const expenses = await fetchExpenses()
      const todayExpenses = expenses.filter(
        (expense: ExpenseType) =>
          (expense.enteredAt as string) >= today &&
          (expense.enteredAt as string) <= today
      )
      setDisplayedExpenses(todayExpenses)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FILTER ORDERS
  const searchOrders = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")

    if (from === null || to === null) {
      console.error("Date range is not specified")
      return
    }
    const newFrom = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(from as string))
    const newTo = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(to as string))

    setDate(`${newFrom} - ${newTo}`)

    // order
    if (currentUser.role !== "admin") {
      const orders = await fetchOrders()
      const newOrders = orders.filter(
        (order: OrderType) =>
          order.enteredAt >= from &&
          order.enteredAt <= to &&
          order.userId === currentUser._id
      )

      setOrders(newOrders)
      setAllOrders(newOrders)
    } else {
      const orders = await fetchOrders()
      const newOrders = orders.filter(
        (order: OrderType) => order.enteredAt >= from && order.enteredAt <= to
      )

      setOrders(newOrders)
      setAllOrders(newOrders)
    }

    // expenses
    const expenses = await fetchExpenses()
    const newExpenses = expenses.filter(
      (expense: ExpenseType) =>
        (expense.enteredAt as string) >= from &&
        (expense.enteredAt as string) <= to
    )
    setDisplayedExpenses(newExpenses)
    setLoading(false)
  }

  // CALCULATE PROFIT
  const calculateProfit = async () => {
    let grossProfit: number = 0
    let totalReturned: number = 0

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!item.returned) {
          grossProfit += item.diff
        }
        if (item.returned) {
          totalReturned += item.subTotal
        }
      })
    })

    const expenses = displayedExpenses.reduce((total, value) => {
      total += value.amount as number
      return total
    }, 0)

    const totals = orders.reduce(
      (total, order) => {
        total.totalOrders += order.total

        if (order.cash !== undefined) total.totalCash += order.cash

        if (order.bank !== undefined) total.totalBank += order.bank

        return total
      },
      { totalOrders: 0, totalCash: 0, totalBank: 0 }
    )
    const analysis: AnalysisType = {
      total: totals.totalOrders,
      totalBank: totals.totalBank,
      totalCash: totals.totalCash,
      totalReturned,
      grossProfit,
      expenses,
      netProfit: grossProfit - expenses,
    }

    setAnalysis(analysis)
  }

  // RETURN ITEM
  const returnItem = async () => {
    try {
      await customFetch.get(
        `/order/return-item?orderId=${IDs.orderId}&&itemId=${IDs.itemId}`
      )
      location.reload()
      toast.success("Item successfully returned")
      setIDs({ orderId: "", itemId: "" })
      setShowReturnItemModal(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        setShowReturnItemModal(false)
      }
    }
  }

  // Create filter buttons
  const createFilterBtns = async () => {
    const users = currentUser.role === "admin" ? await fetchUsers() : []
    const filterBtns = ["All", ...new Set(users.map((user) => user.userName))]
    setFilterBtns(filterBtns as string[])
    setUsers(users)
  }

  // Filter Products
  const filterFunction = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const user =
      currentUser.role === "admin"
        ? users.find((user) => user.userName === value)
        : null

    const filteredOrders = allOrders.filter((order) => {
      if (value === "All") {
        return order
      } else if (order.userId === user?._id) {
        return order
      }
    })
    setOrders(filteredOrders)
  }

  useEffect(() => {
    getOrders()
    createFilterBtns()
  }, [])

  useEffect(() => {
    calculateProfit()
  }, [orders, displayedExpenses, date])

  const values = {
    showReturnItemModal,
    setShowReturnItemModal,
    IDs,
    setIDs,
    returnItem,
  }

  return (
    <OrderContext.Provider value={values}>
      <main>
        <div className='flex justify-between'>
          <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>Orders</h1>
          <Analysis analysis={analysis} />
        </div>
        <section className='pb-5'>
          <div className='bg-white p-2 rounded-md py-3 shadow'>
            <SearchOrderForm searchOrders={searchOrders} />
          </div>
          {currentUser.role === "admin" && (
            <Filter
              filterBtns={filterBtns as string[]}
              filterFunction={filterFunction as () => void}
            />
          )}
          <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
            Showing{" "}
            <span className='text-blue-800 font-semibold'>
              {orders.length} Result{orders.length > 1 && "s"}
            </span>{" "}
            for <span className='text-blue-800 font-semibold'>{date}</span>
          </h1>
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* HEADER */}
              {orders.length < 1 ? (
                <h1 className='text-center font-bold'>No orders available</h1>
              ) : (
                <>
                  <div>
                    {orders?.map((order) => {
                      return <SingleOrder key={order._id} {...order} />
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </section>
        {showReturnItemModal && <ReturnItemModal />}
      </main>
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (context === undefined)
    throw new Error(
      "useOrderContext must be used within Order Context Provider"
    )
  return context
}

export default AllOrders
