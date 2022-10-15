const createGifAccountContainer = ({ createGifAccount }) => {
  return (
    <div className="connected-container">
      <button
        className="cta-button submit-gif-button"
        onClick={createGifAccount}
      >
        Do One-Time Initialization For GIF Program Account
      </button>
    </div>
  );
};

export default createGifAccountContainer;
