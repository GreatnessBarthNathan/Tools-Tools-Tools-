import { useState, ChangeEvent, useEffect } from "react"
import customFetch from "../utils/customFetch"
import axios from "axios"
import { toast } from "react-toastify"
import { useDashboardContext } from "../pages/DashboardLayout"
import { CategoryType } from "../utils/types"
import CategoryActionModal from "../components/modals/CategoryActionModal"
import { FaTrashAlt, FaRegEdit } from "react-icons/fa"

function Categories() {
  const { fetchCategories } = useDashboardContext()
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [ID, setID] = useState("")
  const [text, setText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editFlag, setEditFlag] = useState(false)

  // submit form
  const submitCategory = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    if (editFlag) {
      editCategory()
      return
    } else {
      try {
        await customFetch.post("/category", { name: category })
        toast.success("category added")
        setCategory("")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data?.msg)
        }
      }
    }
    setSubmitting(false)
  }

  // get categories
  const getCategories = async () => {
    const categories = await fetchCategories()
    setCategories(categories)
  }

  // edit category
  const editCategory = async () => {
    setSubmitting(true)
    try {
      await customFetch.patch(`/category/${ID}`, { name: category })
      toast.success("category edited")
      setCategory("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    setSubmitting(false)
    setID("")
    setEditFlag(false)
  }

  // delete category
  const deleteCategory = async () => {
    setSubmitting(true)
    try {
      await customFetch.delete(`/category/${ID}`)
      toast.success("category deleted")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
    setSubmitting(false)
    setShowModal(false)
    setID("")
  }

  useEffect(() => {
    getCategories()
  }, [submitting])
  return (
    <main className='mt-10 rounded p-2 md:p-5 shadow-md shadow-slate-300 bg-white'>
      {/* TITLE */}
      <h1 className='font-semibold text-center text-base md:text-xl'>
        Categories
      </h1>

      {/* FORM */}
      <form
        onSubmit={submitCategory}
        className='mt-3 flex items-center border border-[var(--primary)] rounded'
      >
        <input
          type='text'
          name='category'
          className='w-[80%] border-0 outline-none p-1 rounded'
          placeholder='enter new category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className={`bg-[var(--primary)] w-[20%] text-white p-1 border border-[var(--primary)] ${
            submitting && "cursor-wait"
          }`}
          disabled={submitting}
        >
          {editFlag ? "edit" : "save"}
        </button>
      </form>

      {/* CATEGORIES */}
      <section className='mt-5'>
        {categories.length < 1 ? (
          <h2 className='text-center'>You have no saved categories</h2>
        ) : (
          <div>
            {categories.map((category) => {
              return (
                <div
                  key={category._id}
                  className='flex justify-between items-center bg-[var(--hoverColor)] mb-1 p-1 rounded text-xs md:text-base'
                >
                  <p>{category.name}</p>
                  <div className='flex justify-center space-x-3 md:space-x-5'>
                    <button
                      className='text-[var(--primary)] hover:text-white'
                      onClick={() => {
                        setID(category._id)
                        setCategory(category.name)
                        setEditFlag(true)
                      }}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className='text-[var(--primary)] hover:text-white'
                      onClick={() => {
                        setShowModal(true)
                        setText(
                          "This action cannot be reversed. Do you wish to proceed?"
                        )
                        setID(category._id)
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      {showModal && (
        <CategoryActionModal
          text={text}
          action={deleteCategory}
          setShowModal={setShowModal}
        />
      )}
    </main>
  )
}

export default Categories
