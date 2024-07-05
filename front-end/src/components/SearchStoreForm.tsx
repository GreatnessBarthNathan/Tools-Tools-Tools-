import { FormEvent } from "react"

function SearchStoreForm({
  list,
  submitStoreForm,
}: {
  list: string[]
  submitStoreForm: (e: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form className='grid grid-cols-3 w-full gap-1' onSubmit={submitStoreForm}>
      <div className='col-span-2 text-xs md:text-base'>
        <label className='block'>Search Product</label>
        <select
          name='product'
          id='product'
          className='p-2 md:p-3 bg-[whitesmoke] w-full rounded outline-none border border-blue-500 mt-1 capitalize'
        >
          {["all products", ...list].map((optionValue: string) => {
            return (
              <option key={optionValue} value={optionValue}>
                {optionValue}
              </option>
            )
          })}
        </select>
      </div>

      <button
        type='submit'
        className='text-xs md:text-base bg-indigo-500 text-white p-[10px] md:p-3 rounded cursor-pointer  hover:bg-indigo-800 col-span-1 self-end'
      >
        Submit
      </button>
    </form>
  )
}

export default SearchStoreForm
