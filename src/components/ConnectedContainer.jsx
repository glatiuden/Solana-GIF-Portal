import { useState } from "react";
import { useRecoilValue } from "recoil";
import { gifListState } from "../atoms/atoms";
import { baseAccount, getProgram, getProvider } from "../utils/utils";

const ConnectedContainer = ({ getGifList }) => {
  const gifList = useRecoilValue(gifListState);
  const [inputValue, setInputValue] = useState("");

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async (event) => {
    event.preventDefault();
    if (!inputValue.length) {
      console.log("Empty input. Try again.");
    }

    try {
      console.log("Gif link:", inputValue);
      const provider = getProvider();
      const program = await getProgram();
      await program.methods
        .addGif(inputValue)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();
      console.log("GIF successfully sent to program", inputValue);
      setInputValue("");
      await getGifList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="connected-container">
      <form onSubmit={sendGif}>
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((item, index) => (
          <div className="gif-item" key={index}>
            <img src={item.gifLink} alt={item.gifLink} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedContainer;
