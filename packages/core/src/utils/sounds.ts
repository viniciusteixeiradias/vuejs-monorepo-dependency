import clickSound from "../assets/sounds/click.mp3";
import orderSound from "../assets/sounds/newOrder.mp3";

const click = (): void => {
  const audio = new Audio(clickSound);
  audio.play();
};

const newOrderAudio = new Audio(orderSound);
const playNewOrder = (): void => {
  newOrderAudio.loop = true;
  newOrderAudio.play();
};

const pauseNewOrder = (): void => {
  newOrderAudio.pause();
};

export { click, playNewOrder, pauseNewOrder };
