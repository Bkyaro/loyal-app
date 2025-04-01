export const mockPanelData = {
  data: {
    point_daily: {
      "2025-02-01": {
        date: "2025-02-01",
        num_count: 23,
        point_count: "3450.00",
      },
      "2025-02-02": {
        date: "2025-02-02",
        num_count: 10,
        point_count: "2050.00",
      },
      "2025-02-03": {
        date: "2025-02-03",
        num_count: 16,
        point_count: "2300.00",
      }
    },
    customer: [
      {
        level_id: "***",
        count: "***",
        name: "Basic",
      },
      {
        level_id: "***",
        count: "***",
        name: "Pro",
      },
      {
        level_id: "***",
        count: "***",
        name: "Premium",
      },
    ],
    point: [
      {
        type: "complete_email_set",
        point: "123",
        name: "完善邮箱偏好",
      },
      {
        type: "fullfill_info",
        point: "223",
        name: "完善个人信息",
      },
      {
        type: "order_paid",
        point: "323",
        name: "订单支付",
      },
      {
        type: "system_add",
        point: "423",
        name: "系统添加",
      },
    ],
    start: "2025-01-01 00:00:00",
    end: "2025-01-01 00:00:01",
  },
  code: 200,
  type: "success",
  message: "ok",
};
