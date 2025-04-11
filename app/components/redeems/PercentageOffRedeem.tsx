import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  Link,
  Checkbox,
  Banner,
  Box,
  RadioButton,
  Select,
  Modal,
} from "@shopify/polaris";
import { ActionForm } from "~/components/sections/ActionForm";
import { ActionSummary } from "~/components/sections/ActionSummary";
import { useNavigate } from "@remix-run/react";
import { WayToRedeem } from "~/mock/programData";

interface PercentageOffRedeemProps {
  isEditing?: boolean;
  initialData?: WayToRedeem;
  onSave?: (data: any) => void;
  onDelete?: () => void;
}

// 定义表单状态接口
interface FormState {
  // 基础状态
  isSaving: boolean;
  points: number; // 积分数量 - 用于与ActionForm兼容

  // 兑换配置 - 百分比折扣不需要redemptionStyle
  pointsValue: string; // 积分成本
  discountValue: string; // 折扣百分比

  // 适用范围
  appliesTo: "entire" | "collection";
  selectedCollection: string;

  // 最低要求
  minRequirement: "none" | "purchase";
  minPurchaseAmount: string;

  // 折扣代码
  useDiscountPrefix: boolean;
  discountPrefix: string;

  // 组合设置
  combinableWith: {
    orderDiscount: boolean;
    shippingDiscount: boolean;
    productDiscount: boolean;
  };

  // 状态设置
  isActive: boolean;
}

// 定义表单错误接口
interface FormErrors {
  pointsValue?: string;
  discountValue?: string;
  selectedCollection?: string;
  minPurchaseAmount?: string;
  discountPrefix?: string;
}

export function PercentageOffRedeem({
  isEditing = false,
  initialData,
  onSave,
  onDelete,
}: PercentageOffRedeemProps) {
  // 默认值 - 用于与ActionForm兼容
  const defaultPoints = initialData ? initialData.points_cost : 100;

  // 状态 - 用于与ActionForm兼容
  const [points, setPoints] = useState<number>(defaultPoints);

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // 初始表单状态
  const initialState: FormState = {
    // 基础状态
    isSaving: false,
    points: defaultPoints,

    // 兑换配置
    pointsValue: "1000", // 默认积分成本
    discountValue: "10", // 默认折扣百分比

    // 适用范围
    appliesTo: "entire", // 默认适用于整个订单
    selectedCollection: "",

    // 最低要求
    minRequirement: "none",
    minPurchaseAmount: "",

    // 折扣代码
    useDiscountPrefix: false,
    discountPrefix: "",

    // 组合设置
    combinableWith: {
      orderDiscount: false,
      shippingDiscount: false,
      productDiscount: false,
    },

    // 状态设置
    isActive: true,
  };

  // 使用单一的useState管理所有表单状态
  const [formState, setFormState] = useState<FormState>(initialState);

  // 当前表单数据和初始表单数据 - 用于ActionForm变更检测
  const formData = { ...formState, points };
  const initialFormData = { ...initialState, points: defaultPoints };

  // 验证表单并更新错误状态
  const validateForm = useCallback(() => {
    const errors: FormErrors = {};

    // 验证积分成本
    if (!formState.pointsValue || parseInt(formState.pointsValue) <= 0) {
      errors.pointsValue = "Points cost is required";
    }

    // 验证折扣百分比
    if (
      !formState.discountValue ||
      parseFloat(formState.discountValue) <= 0 ||
      parseFloat(formState.discountValue) > 100
    ) {
      errors.discountValue = "Discount percentage must be between 1 and 100";
    }

    // 如果选择了特定集合，验证集合是否已选择
    if (formState.appliesTo === "collection" && !formState.selectedCollection) {
      errors.selectedCollection = "Please select a collection";
    }

    // 如果选择了最低购买金额，验证其值
    if (
      formState.minRequirement === "purchase" &&
      !formState.minPurchaseAmount
    ) {
      errors.minPurchaseAmount = "Minimum purchase amount is required";
    }

    // 如果启用了折扣代码前缀，验证其值
    if (formState.useDiscountPrefix && !formState.discountPrefix) {
      errors.discountPrefix = "Discount prefix is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState]);

  // 更新表单状态的通用方法
  const updateFormState = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 同步更新points状态 - 用于与ActionForm兼容
    if (field === "points") {
      setPoints(value);
    }

    // 清除相关字段的错误
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/app/program/points/rewards");
  };

  const handleAction = (actionFormData: any) => {
    // 验证表单
    if (!validateForm()) {
      // 如果验证失败，设置错误状态并返回，不执行后续保存操作
      return;
    }

    // 设置保存状态
    setFormState((prev) => ({ ...prev, isSaving: true }));

    // 合并表单数据
    const data = {
      ...formState,
      active: actionFormData.active,
    };

    console.log("formData", actionFormData);

    // 编辑页/创建页调用不同api
    if (isEditing && onSave) {
      // 编辑页save
      onSave(data);
    } else {
      // 创建页create
      console.log("Creating percentage off reward with", data);
      // 在实际应用中，这将是一个API调用来创建reward

      // 模拟API调用完成
      setTimeout(() => {
        setFormState((prev) => ({ ...prev, isSaving: false }));
        navigate("/app/program/points/rewards");
      }, 1000);
    }
  };

  // 检查是否有任何组合选项被勾选
  const hasSelectedCombinations =
    formState.combinableWith.orderDiscount ||
    formState.combinableWith.shippingDiscount ||
    formState.combinableWith.productDiscount;

  // 处理组合选项变更
  const handleCombinationChange = (
    field: "orderDiscount" | "shippingDiscount" | "productDiscount",
  ) => {
    setFormState((prev) => ({
      ...prev,
      combinableWith: {
        ...prev.combinableWith,
        [field]: !prev.combinableWith[field],
      },
    }));
  };

  // 获取摘要项
  const getSummaryItems = useCallback(() => {
    // 预定义摘要项数组 - 包含默认值和位置
    const summaryItems = [
      "", // 索引0: 折扣信息
      "", // 索引1: 适用范围
      "", // 索引2: 最低购买要求
      "", // 索引3: 折扣券自定义前缀
    ];

    // 设置基本折扣信息
    summaryItems[0] = `${formState.discountValue}% off collections`;

    // 适用范围
    summaryItems[1] = `Applies to ${formState.appliesTo === "entire" ? "orders of any amount" : "selected collections"}`;

    // 最低购买要求
    if (
      formState.minRequirement === "purchase" &&
      formState.minPurchaseAmount
    ) {
      summaryItems[2] = `Minimum purchase of $${formState.minPurchaseAmount} required`;
    }

    // 折扣券前缀
    if (formState.useDiscountPrefix && formState.discountPrefix) {
      summaryItems[3] = `Discount codes will have prefix "${formState.discountPrefix}"`;
    }

    // 过滤掉空字符串项并返回
    return summaryItems.filter((item) => item !== "");
  }, [formState]);

  // Summary content
  const summaryContent = <ActionSummary items={getSummaryItems()} />;

  return (
    <ActionForm
      title='Percentage Off'
      backAction={{
        content: "Rewards",
        onAction: handleBackClick,
      }}
      onPrimaryAction={handleAction}
      onDelete={isEditing ? onDelete : undefined}
      summaryContent={summaryContent}
      isEditing={isEditing}
      initialData={initialData}
      formData={formData}
      initialFormData={initialFormData}
    >
      <div className='flex-1'>
        {/* 奖励价值 */}
        <Card>
          <BlockStack gap='400'>
            <Text variant='headingMd' as='h2'>
              Reward value
            </Text>

            {/* 更改为响应式布局 */}
            <div className='flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between'>
              <div className='w-full lg:flex-1'>
                {/* 使用外层div实现响应式布局 */}
                <div className='flex flex-col  items-start gap-2'>
                  <div className='w-full sm:w-auto mb-2 sm:mb-0'>
                    <Text as='span'>Points cost</Text>
                  </div>
                  <div className='w-full'>
                    <TextField
                      label=''
                      type='integer'
                      value={formState.pointsValue}
                      onChange={(value) =>
                        updateFormState("pointsValue", value)
                      }
                      autoComplete='off'
                      min={1}
                      suffix='points'
                      labelHidden
                      error={formErrors.pointsValue}
                    />
                  </div>
                </div>
              </div>

              <div className='w-full lg:flex-1'>
                {/* 使用外层div实现响应式布局 */}
                <div className='flex flex-col  items-start gap-2'>
                  <div className='w-full sm:w-auto mb-2 sm:mb-0'>
                    <Text as='span'>Discount value</Text>
                  </div>
                  <div className='w-full'>
                    <TextField
                      label=''
                      type='integer'
                      value={formState.discountValue}
                      onChange={(value) =>
                        updateFormState("discountValue", value)
                      }
                      autoComplete='off'
                      min={1}
                      max={100}
                      suffix='% off'
                      labelHidden
                      error={formErrors.discountValue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </BlockStack>
        </Card>

        {/* 适用范围 */}
        <div className='mt-5'>
          <Card>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Applies to
              </Text>

              <div>
                <RadioButton
                  label='Entire order'
                  checked={formState.appliesTo === "entire"}
                  id='applies-entire'
                  name='appliesTo'
                  onChange={() => updateFormState("appliesTo", "entire")}
                />
              </div>

              <div>
                <RadioButton
                  label='Specific collection'
                  checked={formState.appliesTo === "collection"}
                  id='applies-collection'
                  name='appliesTo'
                  onChange={() => updateFormState("appliesTo", "collection")}
                />
              </div>

              {formState.appliesTo === "collection" && (
                <div className='mt-2 ml-8'>
                  <Select
                    label=''
                    options={[
                      { label: "Select collection", value: "" },
                      { label: "Summer Collection", value: "summer" },
                      { label: "Winter Collection", value: "winter" },
                      { label: "New Arrivals", value: "new-arrivals" },
                    ]}
                    value={formState.selectedCollection}
                    onChange={(value) =>
                      updateFormState("selectedCollection", value)
                    }
                    labelHidden
                    error={formErrors.selectedCollection}
                  />
                </div>
              )}
            </BlockStack>
          </Card>
        </div>

        {/* 最低要求 */}
        <div className='mt-5'>
          <Card>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Minimum requirement
              </Text>

              <div>
                <RadioButton
                  label='None'
                  checked={formState.minRequirement === "none"}
                  id='min-none'
                  name='minRequirement'
                  onChange={() => updateFormState("minRequirement", "none")}
                />
              </div>

              <div>
                <RadioButton
                  label='Minimum purchase amount'
                  checked={formState.minRequirement === "purchase"}
                  id='min-purchase'
                  name='minRequirement'
                  onChange={() => updateFormState("minRequirement", "purchase")}
                />
              </div>

              {formState.minRequirement === "purchase" && (
                <div className='mt-2 ml-8'>
                  <TextField
                    label=''
                    prefix='$'
                    type='number'
                    value={formState.minPurchaseAmount}
                    onChange={(value) =>
                      updateFormState("minPurchaseAmount", value)
                    }
                    autoComplete='off'
                    labelHidden
                    error={formErrors.minPurchaseAmount}
                  />
                  <div className='mt-1 text-xs text-gray-500'>
                    Applies only to selected collections.
                  </div>
                </div>
              )}
            </BlockStack>
          </Card>
        </div>

        {/* 折扣代码 */}
        <div className='mt-5'>
          <Card>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Discount code
              </Text>

              <Checkbox
                label='Add a prefix to discount codes'
                checked={formState.useDiscountPrefix}
                onChange={() =>
                  updateFormState(
                    "useDiscountPrefix",
                    !formState.useDiscountPrefix,
                  )
                }
              />

              {formState.useDiscountPrefix && (
                <div className='mt-2 ml-8'>
                  <TextField
                    label=''
                    type='text'
                    value={formState.discountPrefix}
                    onChange={(value) =>
                      updateFormState("discountPrefix", value)
                    }
                    autoComplete='off'
                    placeholder='e.g. $10OFF-'
                    helpText='Avoid using spaces and special characters in the prefix to prevent errors when customers copy and paste the entire discount code.'
                    labelHidden
                    error={formErrors.discountPrefix}
                  />
                </div>
              )}

              <div className='mt-2 text-xs text-gray-500'>
                An example discount code will look like this: c7ffab13
              </div>
            </BlockStack>
          </Card>
        </div>

        {/* 组合 */}
        <div className='mt-5'>
          <Card>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Combinations
              </Text>

              {/* 警告Banner - 当有任何组合选项被勾选时显示 */}
              {hasSelectedCombinations && (
                <Banner
                  title='Some configurations can result in unexpected discounts'
                  tone='warning'
                >
                  <Box>
                    Customers who redeem rewards from sign up and social points
                    might combine these between accounts to create more valuable
                    discounts. Double-check your program configuration to
                    protect against this. <Link url='#'>Learn more</Link>
                  </Box>
                </Banner>
              )}

              <div className='mb-2'>
                <Text as='p'>This discount can be combined with:</Text>
              </div>

              <Checkbox
                label='Order discount'
                checked={formState.combinableWith.orderDiscount}
                onChange={() => handleCombinationChange("orderDiscount")}
              />

              <div className='text-xs text-gray-500 ml-8'>
                Applies to both fixed amount and percentage off discounts
              </div>

              <Checkbox
                label='Shipping discount'
                checked={formState.combinableWith.shippingDiscount}
                onChange={() => handleCombinationChange("shippingDiscount")}
              />

              <Checkbox
                label='Product discount'
                checked={formState.combinableWith.productDiscount}
                onChange={() => handleCombinationChange("productDiscount")}
              />

              <div className='mt-2'>
                <Link url='#'>Learn more about discount combinations.</Link>
              </div>
            </BlockStack>
          </Card>
        </div>
      </div>
    </ActionForm>
  );
}
