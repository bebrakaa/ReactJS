function Loader() {
  return (
    <div className="loader-container" role="status" aria-live="polite" aria-busy="true" aria-label="Идёт загрузка данных">
      <div className="spinner" aria-hidden="true" />
      <p className="loader-text">Загрузка...</p>
    </div>
  );
}

export default Loader;
