// 配置点数展示
export const actionPointRule = (type: number, point: number) => {
  if (type === 1) {
    return `${point} ${point > 1 ? "points" : "point"} for every ¥1 spent`;
  } else if (type === 2 || type === 3) {
    return `${point} ${point > 1 ? "points" : "point"}`;
  } else {
    return `-`;
  }
};
