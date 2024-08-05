import { useState, FormEvent, useEffect, ChangeEvent } from "react"
import SearchProductForm from "../components/SearchProductForm"
import SingleProduct from "../components/SingleProduct"
import { ProductTypes } from "../utils/types"
import { useDashboardContext } from "./DashboardLayout"
import Filter from "../components/Filter"
import Loading from "../components/Loading"

function AllProducts() {
  const { currentUser, fetchProducts } = useDashboardContext()
  const [allProducts, setAllProducts] = useState<ProductTypes[]>([])
  const [products, setProducts] = useState<ProductTypes[]>([])
  const [worth, setWorth] = useState({ totalCost: 0, totalWorth: 0 })
  const [loading, setLoading] = useState(false)

  const productNames = products.map((product) => product.name).sort()

  // submit search product form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const select = formData.get("product")

    if (select === "all products") {
      setProducts(allProducts)
    } else {
      const product = allProducts.filter((product) => product.name === select)
      setProducts(product)
    }
  }

  // GET PRODUCTS
  const getProducts = async () => {
    setLoading(true)
    const products = await fetchProducts()
    setAllProducts(products)
    setProducts(products)
    setLoading(false)
  }

  const calcWorth = () => {
    const worth = products.reduce(
      (total, value) => {
        total.totalCost += value.qty * value.CP
        total.totalWorth += value.qty * value.SP
        return total
      },
      { totalCost: 0, totalWorth: 0 }
    )
    setWorth(worth)
  }

  // Create filter buttons
  const filterBtns = [
    "All",
    ...new Set(allProducts.map((product) => product.category)),
  ]

  // Filter Products
  const filterFunction = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const filteredProducts = allProducts.filter((product) => {
      if (value === "All") {
        return product
      } else if (product.category === value) {
        return product
      }
    })
    setProducts(filteredProducts)
  }

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    calcWorth()
  }, [products])
  return (
    <main className='pb-10'>
      <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>All Products</h1>
      <Filter
        filterBtns={filterBtns as string[]}
        filterFunction={filterFunction as () => void}
      />
      <section className='bg-white p-2 py-5'>
        {/* WORTH */}
        {currentUser.role === "admin" && (
          <div className='text-right text-xs md:text-base'>
            <h2 className='text-[8px] md:text-xs lg:text-base'>
              Total Cost -{" "}
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(worth.totalCost)}
            </h2>
            <h2 className='text-[8px] md:text-xs lg:text-base'>
              Total Worth -{" "}
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(worth.totalWorth)}
            </h2>
          </div>
        )}
        {/* SEARH FORM */}
        <SearchProductForm list={productNames} handleSubmit={handleSubmit} />
        {/* PRODUCTS SECTION*/}
        <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
          Count: {products.length} products
        </h1>
        {/* HEADER */}
        <div className='grid grid-cols-7 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
          <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 text-center'>
            Name
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base border-l text-center p-2'>
            CP
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            SP
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Qty
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Cost
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Worth
          </h2>
        </div>
        {/* PRODUCTS */}
        {loading ? (
          <Loading />
        ) : (
          <div>
            {products.map((product) => {
              return <SingleProduct key={product._id} {...product} />
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default AllProducts
