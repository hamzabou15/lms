import { UserButton } from "@clerk/nextjs";

// ...rest of the imports and component definitions

export const Header = ({

}) => {
 return (
	 // Adding the UserButton component in the nav
     <div className="grid grid-cols-1 justify-items-center gap-20">
       <nav className="flex flex-row gap-4 items-center">
         <UserButton />
       </nav>
     </div>
 );
};
