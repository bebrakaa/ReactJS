import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "../redux/api/authApi";
import { logout, setCredentials } from "../redux/slices/authSlice";

export function useAppInitialization() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { data: user, error } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(logout());
    }
  }, [error, dispatch]);
}
