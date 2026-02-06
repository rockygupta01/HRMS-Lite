const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="state-card state-error" role="alert">
      <h3>Unable to load data</h3>
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="button-secondary" onClick={onRetry}>
          Try Again
        </button>
      ) : null}
    </div>
  );
};

export default ErrorState;
