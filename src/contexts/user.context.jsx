import { createContext, useEffect, useReducer } from "react";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

import { createAction } from "../utils/reducer/reducer.utils";

// actual value we want to access
// context is the values that what we expose so it will not change.
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
};

const userReducer = (state, action) => {
  console.log("dispatched");
  console.log("action", action);
  //action has two values type and payload. payload is the value which is imp to reducer to know what to update state value with.
  const { type, payload } = action;
  // now we conditionally return back an object with those values depending on the type

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
      };
    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

const INITIAL_STATE = {
  currentUser: null,
};

// provider the actual component (a literal functional component)
export const UserProvider = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  // here now we utilize our userReducer and we pass two value to useReducer hook one is the reducer and the other is initial value.
  //reducer always return two values a state object and a dispatch function.
  // dispatch function recives the action and passes to the reducer
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);
  console.log("current user: ", state.currentUser);

  const { currentUser } = state;

  const setCurrentUser = (user) => {
    dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
  };

  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unSubscribe = onAuthStateChangedListener((user) => {
      if (user) createUserDocumentFromAuth(user);
      setCurrentUser(user);
    });
    return unSubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>; // we wrap around the provider any component that need to access the user context
};
