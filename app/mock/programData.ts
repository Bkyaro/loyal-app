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

// 定义积分兑换方式的类型
export interface WayToEarn {
  id: number;
  icon: string;
  iconSvg?: string;
  title: string;
  points: string;
  category?: string;
}

// 模拟数据
export const mockWaysToEarnData: WayToEarn[] = [
  {
    id: 1,
    icon: "🛍️",
    iconSvg: orderOnlineSvg,
    title: "Place an order",
    points: "3 Points for every ¥1 spent",
    category: "ONLINE STORE",
  },
  {
    id: 2,
    icon: "🎂",
    iconSvg: birthdaySvg,
    title: "Celebrate a birthday",
    points: "200 Points",
    category: "ONLINE STORE",
  },
  {
    id: 3,
    icon: "📱",
    iconSvg: tiktokFollowSvg,
    title: "Follow on TikTok",
    points: "50 Points",
    category: "SOCIAL",
  },
  {
    id: 4,
    icon: "📝",
    iconSvg: signupSvg,
    title: "Signup",
    points: "200 Points",
    category: "ONLINE STORE",
  },
  {
    id: 5,
    icon: "✖️",
    iconSvg: twitterShareSvg,
    title: "Share on X",
    points: "1 Point",
    category: "SOCIAL",
  },
  {
    id: 6,
    iconSvg: twitterFollowSvg,
    icon: "✖️",
    title: "Follow on X",
    points: "5 Points",
    category: "SOCIAL",
  },
  {
    id: 7,
    iconSvg: instagramFollowSvg,
    icon: "📸",
    title: "Follow on Instagram",
    points: "10 Points",
    category: "SOCIAL",
  },
  {
    id: 8,
    iconSvg: facebookLikeSvg,
    icon: "👍",
    title: "Like on Facebook",
    points: "5 Points",
    category: "SOCIAL",
  },
  {
    id: 9,
    iconSvg: facebookShareSvg,
    icon: "🔄",
    title: "Share on Facebook",
    points: "10 Points",
    category: "SOCIAL",
  },
];

export default {
  emptySearchSvg,
  mockWaysToEarnData,
};
