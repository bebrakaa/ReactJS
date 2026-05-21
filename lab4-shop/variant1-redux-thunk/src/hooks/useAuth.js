import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../redux/actions/authActions";
import { loadCartFromStorage } from "../redux/actions/cartActions";

export function useAppInitialization() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(checkAuth());
    }

    dispatch(loadCartFromStorage());
  }, [dispatch]);
}
