import { all } from "redux-saga/effects";
import { authSaga } from "./sagas/authSaga";
import { productsSaga } from "./sagas/productsSaga";
import { ordersSaga } from "./sagas/ordersSaga";

export default function* rootSaga() {
  yield all([authSaga(), productsSaga(), ordersSaga()]);
}
