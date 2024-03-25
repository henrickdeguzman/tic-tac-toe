import { initialQTable } from "./qtable";

const qTable: Record<string, number[]> = initialQTable;

export const updateQTable = (
  state: string,
  action: number,
  reward: number,
  nextState: string
) => {
  const alpha = 0.1;
  const gamma = 0.6;

  // Initialize if state is not exists
  if (!qTable[state]) {
    qTable[state] = Array(9).fill(0);
  }
  if (!qTable[nextState]) {
    qTable[nextState] = Array(9).fill(0);
  }
  const oldValue = qTable[state][action];
  const nextMax = Math.max(...qTable[nextState]);
  const newValue = (1 - alpha) * oldValue + alpha * (reward + gamma * nextMax);

  qTable[state][action] = newValue;
};

export const chooseAction = (state: string) => {
  const epsilon = 0.5;
  const random = chooseRandom(state);

  if (Math.random() < epsilon) {
    return random;
  } else {
    if (!qTable[state]) {
      return random;
    }
    const max = Math.max(...qTable[state]);
    if (max === 0) return random;
    return qTable[state].findIndex((value) => value === max);
  }
};

export const chooseRandom = (state: string) => {
  const arr = state.split(",");
  let randAction = Math.round(Math.random() * 9);

  while (arr[randAction] !== "" && !arr.every((square) => square !== "")) {
    randAction = Math.round(Math.random() * 9);
  }

  return randAction;
};

export const logQTable = () => {
  console.log(qTable);
};
