import { Link } from "react-router-dom"
export default function ErrorPage(){
    return <>
    <div className="flex flex-col gap-3 grow justify-center items-center text-3xl text-gray-700"><p>Error. Page not found.</p><Link to="/"><p>Click here to go to the Home page.</p></Link></div>
    </>
}