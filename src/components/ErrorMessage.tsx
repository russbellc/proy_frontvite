import React from "react";

export const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
	return <p className="text-red-500 text-xs mt-1">{children}</p>;
};
/*
<p className="text-red-500 text-xs mt-1">
									{errors.password.message}
								</p>
*/

/*
<div className=" text-center my-4 bg-red-100 text-red-600 font-bold p-3 uppercase text-sm">
			{children}
		</div>
*/
