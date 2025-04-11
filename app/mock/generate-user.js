// JSON server mock -> https://github.com/typicode/json-server

// mock-api/generate-users.js
import { faker } from "@faker-js/faker";
import fs from "fs";

// 生成 100 个假用户
const users = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  address: faker.location.streetAddress(),
  is_member: faker.datatype.boolean(),
  points_owned: faker.number.int({ min: 0, max: 1000 }),
  referral_count: faker.number.int({ min: 0, max: 100 }),
  vip_tier: faker.helpers.arrayElement(["base", "silver", "gold", "diamond"]),
}));

// 写入到 db.json
fs.writeFileSync("./app/mock/db.json", JSON.stringify({ users }, null, 2));

console.log("Mock 数据生成完成！");
