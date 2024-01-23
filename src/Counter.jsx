import { useState } from "react"

export default function Counter() {
    const [count, setCount] = useState(0)

    function handleClick() {
        console.log(count)
        const newValue = count + 1
        setCount(newValue)
    }

    return <>
        <div>
            <p>{count}</p>
        </div>
        <div>
            <button onClick={()=>{handleClick()}}>+</button>
        </div>
    </>
}