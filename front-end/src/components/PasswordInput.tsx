import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

function PasswordInput({
  input,
  container,
  name,
}: {
  input?: string
  container?: string
  name: string
}) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div
      className={`flex justify-center items-center w-full border mb-1 ${container}`}
    >
      <input
        type={showPassword ? "text" : "password"}
        className={`w-[95%] ${input}`}
        required
        name={name}
      />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='w-[5%] border-none outline-none flex justify-center items-center'
      >
        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </button>
    </div>
  )
}

export default PasswordInput
