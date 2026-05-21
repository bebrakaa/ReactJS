import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../redux/slices/authSlice";

export function useAppInitialization() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(checkAuth());
    }
  }, [dispatch]);
}
