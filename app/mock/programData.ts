// 引入图片资源
import emptySearchSvg from "../assets/program/ways-to-earn/empty-search.svg";
import birthdaySvg from "../assets/program/ways-to-earn/birthday.svg";
import orderOnlineSvg from "../assets/program/ways-to-earn/order-online.svg";
import signupSvg from "../assets/program/ways-to-earn/signup.svg";
import tiktokFollowSvg from "../assets/program/ways-to-earn/tiktok-follow.svg";
import twitterShareSvg from "../assets/program/ways-to-earn/twitter-share.svg";
import twitterFollowSvg from "../assets/program/ways-to-earn/twitter-follow.svg";
import instagramFollowSvg from "../assets/program/ways-to-earn/instagram-follow.svg";
import facebookLikeSvg from "../assets/program/ways-to-earn/facebook-like.svg";
import facebookShareSvg from "../assets/program/ways-to-earn/facebook-share.svg";
import fixedAmoutSvg from "../assets/program/ways-to-redeem/fixed-amount.svg";
import percentageSvg from "../assets/program/ways-to-redeem/percentage-coupon.svg";
import freeShippingSvg from "../assets/program/ways-to-redeem/shipping.svg";

// 定义积分兑换方式的类型
export interface WayToEarn {
  type: number;
  id: number;
  iconSvg?: string;
  title: string;
  points: number;
  description?: string;
  category?: string;
  totalRewarded?: number;
  active?: boolean;
  customIcon?: string;
  isCustomIcon: boolean;
  earningType?: string;
  pointsValue?: string;
}

// 定义积分兑换方式的类型
export interface WayToRedeem {
  type: number;
  id: number;
  iconSvg?: string;
  title: string;
  points_cost: number;
  redeem_value: string;
  description?: string;
  category?: string;
  totalRewarded?: number;
  active?: boolean;
  customIcon: string;
  isCustomIcon: boolean;
}

// 模拟数据
export const mockWaysToEarnData: WayToEarn[] = [
  {
    type: 1,
    id: 1,
    iconSvg: orderOnlineSvg,
    title: "Place an order",
    points: 1,
    category: "ONLINE STORE",
    active: false,
    customIcon: "",
    isCustomIcon: false,
    earningType: "increments",
    pointsValue: "3",
  },
  {
    type: 2,
    id: 2,
    iconSvg: birthdaySvg,
    title: "Celebrate a birthday",
    points: 200,
    category: "ONLINE STORE",
    active: true,
    customIcon: "",
    isCustomIcon: false,
  },
  {
    type: 3,
    id: 3,
    iconSvg: signupSvg,
    title: "Signup",
    points: 20,
    category: "ONLINE STORE",
    active: true,
    customIcon: "",
    isCustomIcon: false,
  },
  // {
  //   id: 4,
  //   iconSvg: tiktokFollowSvg,
  //   title: "Follow on TikTok",
  //   points: "50 Points",
  //   category: "SOCIAL",
  //   active: false,
  //   customIcon: "",
  //   isCustomIcon: false,
  // },
  // {
  //   id: 5,
  //   iconSvg: twitterShareSvg,
  //   title: "Share on X",
  //   points: "1 Point",
  //   category: "SOCIAL",
  //   active: false,
  //   customIcon: "",
  //   isCustomIcon: false,
  // },
  // {
  //   id: 6,
  //   iconSvg: twitterFollowSvg,
  //   title: "Follow on X",
  //   points: "5 Points",
  //   category: "SOCIAL",
  //   active: true,
  //   customIcon: "",
  //   isCustomIcon: false,
  // },
  // {
  //   id: 7,
  //   iconSvg: instagramFollowSvg,
  //   title: "Follow on Instagram",
  //   points: "10 Points",
  //   category: "SOCIAL",
  //   active: false,
  //   customIcon: "",
  //   isCustomIcon: false,
  // },
  // {
  //   id: 8,
  //   iconSvg: facebookLikeSvg,
  //   title: "Like on Facebook",
  //   points: "5 Points",
  //   category: "SOCIAL",
  //   active: true,
  //   customIcon: "",
  //   isCustomIcon: false,
  // },
  // {
  //   id: 9,
  //   iconSvg: facebookShareSvg,
  //   title: "Share on Facebook",
  //   points: "10 Points",
  //   category: "SOCIAL",
  //   active: true,
  //   customIcon: "",
  //   isCustomIcon: false,
  // },
];

// 模拟积分兑换数据
export const mockWaysToRedeemData: WayToRedeem[] = [
  {
    type: 1,
    id: 1,
    title: "Amount discount",
    iconSvg: fixedAmoutSvg,
    points_cost: 1,
    redeem_value: "5",
    category: "ONLINE STORE",
    active: true,
    totalRewarded: 1,
    customIcon: "",
    isCustomIcon: false,
  },
  {
    type: 2,
    id: 2,
    title: "Percentage off",
    iconSvg: percentageSvg,
    points_cost: 100,
    redeem_value: "0.2",
    category: "ONLINE STORE",
    active: true,
    totalRewarded: 3,
    customIcon: "",
    isCustomIcon: false,
  },
  {
    type: 3,
    id: 3,
    title: "Free shipping",
    iconSvg: freeShippingSvg,
    points_cost: 30,
    redeem_value: "free-shipping",
    category: "ONLINE STORE",
    active: true,
    totalRewarded: 0,
    customIcon: "",
    isCustomIcon: false,
  },
];

export default {
  emptySearchSvg,
  mockWaysToEarnData,
  mockWaysToRedeemData,
};
