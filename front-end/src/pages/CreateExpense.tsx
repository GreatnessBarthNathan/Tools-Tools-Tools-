import { useState, ChangeEvent, FormEvent } from "react"
import FormRow from "../components/FormRow"
import customFetch from "../utils/customFetch"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function CreateExpense() {
  const [inputs, setInputs] = useState({ description: "", amount: 0 })
  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting("submitting")
    try {
      await customFetch.post("/expense", inputs)
      toast.success("Expense record saved")
      setIsSubmitting("")
      navigate("/dashboard/expenses")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        setIsSubmitting("")
        return
      }
    }
  }

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        New Expense
      </h1>
      <section className='bg-white px-2 py-5 rounded-md shadow'>
        <form onSubmit={handleSubmit}>
          <FormRow
            type='number'
            labelText='amount'
            name='amount'
            min={0}
            required
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputs({ ...inputs, amount: Number(e.target.value) })
            }
          />
          <div className='mt-2 text-xs md:text-sm lg:text-base'>
            <label htmlFor='description' className='block'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              cols={30}
              rows={5}
              className='border border-blue-200 w-full rounded p-2 mt-1 outline-0'
              onChange={(e) =>
                setInputs({ ...inputs, description: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type='submit'
            className={`text-xs md:text-sm lg:text-base bg-blue-500 p-3 rounded text-white hover:bg-blue-700 ease-in-out duration-300 self-end ${
              isSubmitting === "submitting" && "cursor-wait"
            }`}
          >
            Enter Expense
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateExpense
