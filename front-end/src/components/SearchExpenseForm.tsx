import { FormEvent } from "react"
import FormRow from "./FormRow"

function SearchExpenseForm({
  searchExpenses,
}: {
  searchExpenses: (e: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div>
      <form
        onSubmit={searchExpenses}
        className='grid grid-cols-2 md:grid-cols-3 gap-4 text-[8px] md:text-base bg-white p-2 rounded-md mb-5'
      >
        <FormRow
          type='date'
          name='from'
          labelText='from'
          required
          extraStyle='text-[8px] md:text-sm lg:text-base p-1'
        />
        <FormRow
          type='date'
          name='to'
          labelText='to'
          required
          extraStyle='text-[8px] md:text-sm lg:text-base p-1'
        />
        <button className='col-span-2 md:col-span-1 bg-blue-500 self-end p-[10px] rounded text-white hover:bg-blue-700 ease-in-out duration-300'>
          Filter
        </button>
      </form>
    </div>
  )
}

export default SearchExpenseForm
