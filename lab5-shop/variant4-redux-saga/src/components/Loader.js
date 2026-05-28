function Loader() {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="loader-text">Загрузка...</p>
    </div>
  );
}

export default Loader;
