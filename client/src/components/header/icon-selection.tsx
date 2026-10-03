import { FaRegHeart } from "react-icons/fa6";
import { IoBagOutline } from "react-icons/io5";
import { Link } from "react-router";


const IconSelection = () => {
  return (
    <div className='flex gap-2'>
        {/* logo */}
        <Link to={'/watchlist'}>
        <FaRegHeart size={26} className=' hover:text-blue-500 transition-all duration-300'/>
        </Link>
         {/*cart */}
         <Link to={'cart'}>
         <IoBagOutline size={22} className=' hover:text-blue-500 transition-all duration-300'/>
         </Link>
    </div>
  )
}

export default IconSelection
