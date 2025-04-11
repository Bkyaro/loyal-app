import { useState, useEffect, useCallback } from "react";
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
} from "@shopify/polaris";
import { ActionForm } from "~/components/sections/ActionForm";
import { ActionSummary } from "~/components/sections/ActionSummary";
import { useNavigate } from "@remix-run/react";
import { WayToRedeem } from "~/mock/programData";

interface FreeShippingRedeemProps {
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

  // 兑换配置
  pointsValue: string; // 积分成本

  // 最大运费金额
  useMaxShippingAmount: boolean;
  maxShippingAmount: string;

  // 折扣代码
  useDiscountPrefix: boolean;
  discountPrefix: string;

  // 组合设置
  combinableWith: {
    orderDiscount: boolean;
    productDiscount: boolean;
  };

  // 状态设置
  isActive: boolean;
}

// 定义表单错误接口
interface FormErrors {
  pointsValue?: string;
  maxShippingAmount?: string;
  discountPrefix?: string;
}

export function FreeShippingRedeem({
  isEditing = false,
  initialData,
  onSave,
  onDelete,
}: FreeShippingRedeemProps) {
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

    // 最大运费金额
    useMaxShippingAmount: false,
    maxShippingAmount: "25.00",

    // 折扣代码
    useDiscountPrefix: false,
    discountPrefix: "",

    // 组合设置
    combinableWith: {
      orderDiscount: false,
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

    // 如果启用了最大运费金额，验证其值
    if (formState.useMaxShippingAmount && !formState.maxShippingAmount) {
      errors.maxShippingAmount = "Maximum shipping amount is required";
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
      console.log("Creating free shipping reward with", data);
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
    formState.combinableWith.productDiscount;

  // 处理组合选项变更
  const handleCombinationChange = (
    field: "orderDiscount" | "productDiscount",
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
    const summaryItems = [];

    // 基本信息 - 免费运输
    let freeShippingText = "Free shipping off entire order";

    // 如果设置了最大运费金额，添加到基本信息中
    if (formState.useMaxShippingAmount && formState.maxShippingAmount) {
      freeShippingText += `, up to a maximum shipping amount of $${formState.maxShippingAmount}`;
    }

    summaryItems.push(freeShippingText);

    // 折扣券前缀
    if (formState.useDiscountPrefix && formState.discountPrefix) {
      summaryItems.push(
        `Discount codes will have prefix "${formState.discountPrefix}"`,
      );
    }

    return summaryItems;
  }, [formState]);

  // Summary content
  const summaryContent = <ActionSummary items={getSummaryItems()} />;

  return (
    <ActionForm
      title='Free shipping'
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

            <div>
              <InlineStack gap='200' align='start' blockAlign='center'>
                <div>
                  <Text as='span'>Points cost</Text>
                </div>
                <div className='w-full'>
                  <TextField
                    label=''
                    type='integer'
                    value={formState.pointsValue}
                    onChange={(value) => updateFormState("pointsValue", value)}
                    autoComplete='off'
                    min={1}
                    suffix='points'
                    labelHidden
                    error={formErrors.pointsValue}
                    clearButton
                  />
                </div>
              </InlineStack>
            </div>

            <div>
              <Checkbox
                label='Set a maximum shipping amount this reward can be applied to'
                checked={formState.useMaxShippingAmount}
                onChange={() =>
                  updateFormState(
                    "useMaxShippingAmount",
                    !formState.useMaxShippingAmount,
                  )
                }
              />

              {formState.useMaxShippingAmount && (
                <div className='mt-2 ml-8'>
                  <TextField
                    label=''
                    prefix='$'
                    type='number'
                    value={formState.maxShippingAmount}
                    onChange={(value) =>
                      updateFormState("maxShippingAmount", value)
                    }
                    autoComplete='off'
                    labelHidden
                    error={formErrors.maxShippingAmount}
                    clearButton
                  />
                </div>
              )}
            </div>
          </BlockStack>
        </Card>

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
                    clearButton
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
