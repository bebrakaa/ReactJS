import { createSlice } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

const defaultErrorMessage = "Произошла ошибка. Попробуйте еще раз";

export function createSagaSlice(name, operations, initialState = {}, reducers = {}) {
  const actionTypes = {};
  const workers = {};

  Object.entries(operations).forEach(([operationName, operation]) => {
    actionTypes[operationName] = {
      request: `${name}/${operationName}Request`,
      success: `${name}/${operationName}Success`,
      failure: `${name}/${operationName}Failure`,
    };

    workers[operationName] = function* worker(action) {
      try {
        const result = yield call(operation.api, action.payload);

        yield put({
          type: actionTypes[operationName].success,
          payload: result,
          meta: action.payload,
        });

        if (operation.afterSuccess) {
          yield call(operation.afterSuccess, result, action.payload);
        }
      } catch (error) {
        yield put({
          type: actionTypes[operationName].failure,
          payload: error.message || defaultErrorMessage,
          meta: action.payload,
        });

        if (operation.afterFailure) {
          yield call(operation.afterFailure, error, action.payload);
        }
      }
    };
  });

  const slice = createSlice({
    name,
    initialState: {
      loading: false,
      error: null,
      ...initialState,
    },
    reducers,
    extraReducers: (builder) => {
      Object.entries(operations).forEach(([operationName, operation]) => {
        const types = actionTypes[operationName];

        builder
          .addCase(types.request, (state, action) => {
            state.loading = true;
            state.error = null;
            operation.onRequest?.(state, action);
          })
          .addCase(types.success, (state, action) => {
            state.loading = false;
            state.error = null;
            operation.onSuccess?.(state, action);
          })
          .addCase(types.failure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            operation.onFailure?.(state, action);
          });
      });
    },
  });

  const actions = Object.fromEntries(
    Object.keys(operations).map((operationName) => [
      operationName,
      (payload) => ({
        type: actionTypes[operationName].request,
        payload,
      }),
    ])
  );

  function* saga() {
    for (const operationName of Object.keys(workers)) {
      yield takeLatest(actionTypes[operationName].request, workers[operationName]);
    }
  }

  return {
    slice,
    actions,
    saga,
    actionTypes,
  };
}
