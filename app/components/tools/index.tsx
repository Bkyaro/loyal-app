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

// 配置兑换规则文案展示
export const redeemPointRuleCost = (type: number, points_cost: number) => {
  return `${points_cost} ${points_cost > 1 ? "Points" : "Point"}`;
};
export const redeemPointRuleTitle = (
  type: number,
  points_cost: number,
  redeem_value: string,
) => {
  if (type === 1) {
    return `${redeem_value} off coupon`;
  } else if (type === 2) {
    return `${Number(redeem_value) * 100}% off coupon`;
  } else if (type === 3) {
    return `Free shipping coupon`;
  } else {
    return `${redeem_value} off coupon`;
  }
};
