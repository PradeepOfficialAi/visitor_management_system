import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [islogin, setIslogin] = useState(false);
  const [loggedUser, setLoggedUser] = useState();

  return (
    <UserContext.Provider value={{
      isAuthenticated,
      user,
      setUser,
      username,
      setUsername,
      islogin,
      setIslogin,
      loggedUser,
      setLoggedUser
    }}>
      {children}
    </UserContext.Provider>
  );
}
