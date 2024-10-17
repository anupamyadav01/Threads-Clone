// atoms/modalAtom.js
import { atom } from "recoil";

const modalAtom = atom({
  key: "modalState", // unique ID
  default: false, // default value (modal is closed initially)
});

export default modalAtom;
