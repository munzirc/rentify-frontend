import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );

  const [postToUpdate, setPostToUpdate] = useState(
    JSON.parse(sessionStorage.getItem("property")) || null
  );

  return (
    <UserContext.Provider
      value={{ user, setUser, postToUpdate, setPostToUpdate, open, setOpen }}
    >
      {children}
    </UserContext.Provider>
  );
};
