import React from 'react' 
/* having issues with dependencies when using npm install @material-ui/icons/
import HomeIcon from '@material-ui/icons/Home'; 
import ArrowCircleRight from '@material-ui/icons/ArrowCircleRight'
import CatchingPokemon from '@material-ui/icons/CatchingPokemon'
*/
export const sidebarData = [
     {
        title: "Home",
     //   icon: <HomeIcon />, 
        link:"/Home"

     },
     {
        title: "Categories",
    //    icon: <ArrowCircleRight />, 
        link:"/Form"

     },
     {
        title: "Shopping Cart",
    //    icon: <CatchingPokemon />, 
        link:"/to be determined "

     },
     { 
        title: "Checkout",
        link:"/to be determined"
     }

    
 ]