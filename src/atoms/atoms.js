import { atom } from "recoil";

const walletAddressState = atom({
  key: "walletAddressState",
  default: null,
});

const gifListState = atom({
  key: "gifListState",
  default: [],
});

export { walletAddressState, gifListState };
