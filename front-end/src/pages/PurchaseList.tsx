import { useEffect, useState } from "react"
import { useDashboardContext } from "./DashboardLayout"

function PurchaseList() {
  const { getProducts } = useDashboardContext()
  const [products, setProducts] = useState<
    { name: string; listItemQty: number; listItemCost: number }[]
  >([])
  const [totalCost, setTotalCost] = useState(0)

  // get product list
  const getProductList = async () => {
    const products = await getProducts()

    const productList = products.map((product) => {
      const listItemQty: number =
        product.maximumQty && product.maximumQty > product.qty
          ? product.maximumQty - product.qty
          : 0
      const listItemCost: number = listItemQty * product.CP
      return { name: product.name, listItemQty, listItemCost }
    })
    setProducts(productList)

    // calculate total cost
    const totalCost = productList.reduce((total, product) => {
      total += product.listItemCost
      return total
    }, 0)

    setTotalCost(totalCost)
  }

  useEffect(() => {
    getProductList()
  }, [])
  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-3 mt-5 font-bold'>
        Purchase List
      </h1>
      <div className='bg-white'>
        {/* TABLE HEAD */}
        <div className='grid grid-cols-4 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
          <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2'>
            Product Name
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base border-l text-center p-2'>
            Quantity
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Cost
          </h2>
        </div>

        {/* TABLE BODY */}
        <>
          {products.map((product) => {
            if (product.listItemQty > 0) {
              return (
                <div
                  key={product.name}
                  className='grid grid-cols-4 border capitalize'
                >
                  <p className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 border-l'>
                    {product.name}
                  </p>
                  <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
                    {new Intl.NumberFormat().format(product.listItemQty)}
                  </p>
                  <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
                    {new Intl.NumberFormat().format(product.listItemCost)}
                  </p>
                </div>
              )
            }
          })}
        </>

        {/* TOTAL ROW */}
        <div className='grid grid-cols-4 border capitalize '>
          <p className='col-span-3 text-[8px] md:text-xs lg:text-base p-2 border-l font-bold'>
            TOTAL
          </p>
          <p className='text-[8px] md:text-xs lg:text-base p-2 border-l font-bold text-center'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(totalCost)}
          </p>
        </div>
      </div>
    </main>
  )
}

export default PurchaseList
