const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <span className="loader" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
