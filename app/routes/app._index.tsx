import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Autocomplete,
  Icon,
  ResourceList,
  Avatar,
  ResourceItem,
  Thumbnail,
  EmptyState,
  Spinner,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { SearchIcon } from "@shopify/polaris-icons";
import { Button } from "../components/ui/button";
import { getAppPermissions } from "~/services/getPermissionData.server";
import { usePermission } from "~/hooks/usePermission";
import { useFunction } from "~/hooks/useFunction";
import { getAppFunctions } from "~/services/getFunctionsData.server";

// 定义产品类型接口，便于TypeScript类型检查
interface Product {
  id: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
  };
  priceRangeV2?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  totalInventory?: number;
  status?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // console.log("requst!", JSON.stringify(request));
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  // 查询当前插件权限
  const permissions = await getAppPermissions(admin);

  // 查询当前插件functions信息
  const functionsData = await getAppFunctions(admin);
  console.log("functionsData", functionsData);

  // 扩展GraphQL查询，获取更多产品信息
  const response = await admin.graphql(`
    {
      products(first: 10) {
        nodes {
          id
          title
          description
          status
          totalInventory
          featuredImage {
            url
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }`);

  const {
    data: {
      products: { nodes },
    },
  } = await response.json();

  return {
    products: nodes,
    shop,
    functionsData,
    permissions,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("action triggered");
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("_action")?.toString();
  console.log("action~~", action);

  if (action === "createDiscount") {
    // 执行折扣创建逻辑
  }

  // 现有的创建产品 action
  if (action === "createProduct") {
    const color = ["Red", "Orange", "Yellow", "Green"][
      Math.floor(Math.random() * 4)
    ];
    const response = await admin.graphql(
      `#graphql
        mutation populateProduct($product: ProductCreateInput!) {
          productCreate(product: $product) {
            product {
              id
              title
              handle
              status
              variants(first: 10) {
                edges {
                  node {
                    id
                    price
                    barcode
                    createdAt
                  }
                }
              }
            }
          }
        }`,
      {
        variables: {
          product: {
            title: `${color} Snowboard`,
          },
        },
      },
    );
    const responseJson = await response.json();

    const product = responseJson.data!.productCreate!.product!;
    const variantId = product.variants.edges[0]!.node!.id!;

    const variantResponse = await admin.graphql(
      `#graphql
      mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
            barcode
            createdAt
          }
        }
      }`,
      {
        variables: {
          productId: product.id,
          variants: [{ id: variantId, price: "100.00" }],
        },
      },
    );

    const variantResponseJson = await variantResponse.json();

    return {
      product: responseJson!.data!.productCreate!.product,
      variant:
        variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
    };
  }

  // 新的创建折扣 action
  if (action === "createDiscount") {
    console.log("in createDiscount request");
    // 首先获取 Shopify Functions
    const functionsResponse = await admin.graphql(`
      query {
        shopifyFunctions(first: 10) {
          nodes {
            id
            app {
              title
            }
            apiType
            title
          }
        }
      }
    `);

    const functionsData = await functionsResponse.json();
    console.log("functionsData", functionsData);
    const shopifyFunctions = functionsData.data?.shopifyFunctions?.nodes || [];

    // 查找 title 为 "product-discount" 的函数
    const productDiscountFunction = shopifyFunctions.find(
      (func: any) => func.title === "product-discount",
    );

    console.log("productDiscountFunction", productDiscountFunction);

    if (!productDiscountFunction) {
      return {
        discountError: "找不到 product-discount 函数",
      };
    }

    const functionId = productDiscountFunction.id;

    // 生成随机代码
    const code = `DISCOUNT_${Math.floor(Math.random() * 10000)}`;

    // 创建折扣代码
    try {
      const discountResponse = await admin.graphql(
        `#graphql
        mutation discountCodeAppCreate(
          $code: String!
          $title: String!
          $functionId: ID!
          $startsAt: DateTime!
        ) {
          discountCodeAppCreate(codeAppDiscount: {
            code: $code,
            title: $title,
            functionId: $functionId,
            startsAt: $startsAt
          }) {
            codeAppDiscount {
              discountId
              title
              code
            }
            userErrors {
              field
              message
            }
          }
        }`,
        {
          variables: {
            code: `DISCOUNT_${Math.floor(Math.random() * 10000)}`,
            title: "DISCOUNT_TEST",
            functionId,
            startsAt: new Date().toISOString(),
          },
        },
      );

      const discountData = await discountResponse.json();
      console.log("创建折扣结果:", JSON.stringify(discountData, null, 2));

      if (discountData.data?.discountCodeAppCreate?.userErrors?.length > 0) {
        return {
          discountError: discountData.data.discountCodeAppCreate.userErrors,
        };
      }

      return {
        discount: discountData.data?.discountCodeAppCreate?.codeAppDiscount,
      };
    } catch (error) {
      console.error("创建折扣时出错:", error);
      return { discountError: "创建折扣时出错: " + (error as Error).message };
    }
  }

  return { error: "未知操作" };
};

export default function Index() {
  const { products, shop } = useLoaderData<{
    products: Product[];
    shop: string;
  }>();

  // 查询权限信息
  const { currentPermissions } = usePermission();
  console.log("currentPermissions", currentPermissions);

  // 查询functions信息
  const { functionsData } = useFunction();
  console.log("functionsData", functionsData);

  const fetcher: any = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  const discount = fetcher.data?.discount;
  const discountError = fetcher.data?.discountError;

  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // 当products或searchValue变化时，更新过滤后的产品列表
  useEffect(() => {
    console.log("products", products);
    if (products) {
      if (searchValue) {
        const filtered = products.filter((product) =>
          product.title.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    }
  }, [products, searchValue]);

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);

  // 添加创建产品和折扣的处理函数
  const generateProduct = () => {
    fetcher.submit({ _action: "createProduct" }, { method: "POST" });
  };

  const createDiscount = () => {
    fetcher.submit({ _action: "createDiscount" }, { method: "POST" });
  };

  // 显示创建折扣结果
  useEffect(() => {
    if (discount) {
      shopify.toast.show(`折扣代码 ${discount.code} 创建成功`);
    }
    if (discountError) {
      shopify.toast.show(`创建折扣失败: ${JSON.stringify(discountError)}`, {
        isError: true,
      });
    }
  }, [discount, discountError, shopify]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // 搜索框
  const searchField = (
    <Autocomplete.TextField
      onChange={handleSearchChange}
      label=''
      value={searchValue}
      prefix={<Icon source={SearchIcon} tone='base' />}
      placeholder='搜索产品名称'
      autoComplete='off'
    />
  );

  // 处理空状态
  const emptyStateContent = (
    <EmptyState heading='没有找到产品' image='/empty-state.svg'>
      <p>尝试修改搜索条件或创建新产品</p>
    </EmptyState>
  );

  return (
    <Page
      title='产品管理'
      primaryAction={{
        content: "创建产品",
        onAction: generateProduct,
        loading:
          isLoading && fetcher.formData?.get("action") === "createProduct",
      }}
    >
      <Layout>
        <Layout.Section>
          <Button
            className='bg-black hover:bg-slate-800 text-red-600'
            onClick={() => {
              console.log("???");
              createDiscount();
            }}
          >
            创建折扣
          </Button>
          <Card>
            <Box padding='400'>
              <BlockStack gap='400'>
                <div>Shopify Functions</div>
                {functionsData && functionsData.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <pre>{JSON.stringify(functionsData, null, 2)}</pre>
                  </div>
                ) : (
                  <div>No Shopify Functions found</div>
                )}

                {/* 显示折扣创建结果 */}
                {discount && (
                  <Box padding='400'>
                    <BlockStack gap='200'>
                      <div>折扣创建成功</div>
                      <div>代码: {discount.code}</div>
                      <div>标题: {discount.title}</div>
                      <div>ID: {discount.discountId}</div>
                    </BlockStack>
                  </Box>
                )}

                {discountError && (
                  <Box padding='400'>
                    <BlockStack gap='200'>
                      <div>折扣创建失败</div>
                      <pre>{JSON.stringify(discountError, null, 2)}</pre>
                    </BlockStack>
                  </Box>
                )}
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Box padding='400'>
              <BlockStack gap='400'>
                <Autocomplete
                  options={[]}
                  selected={[]}
                  onSelect={() => {}}
                  textField={searchField}
                />

                {isLoading ? (
                  <Box padding='400'>
                    <Spinner size='large' />
                  </Box>
                ) : filteredProducts.length === 0 ? (
                  emptyStateContent
                ) : (
                  <ResourceList
                    resourceName={{
                      singular: "产品",
                      plural: "产品",
                    }}
                    items={filteredProducts}
                    renderItem={(product) => {
                      const {
                        id,
                        title,
                        featuredImage,
                        description,
                        priceRangeV2,
                        status,
                      } = product;
                      const price = priceRangeV2?.minVariantPrice
                        ? `${priceRangeV2.minVariantPrice.amount} ${priceRangeV2.minVariantPrice.currencyCode}`
                        : "价格未设置";

                      // 提取产品ID
                      const productId = id.replace(
                        "gid://shopify/Product/",
                        "",
                      );

                      return (
                        <ResourceItem
                          id={id}
                          accessibilityLabel={`查看产品 ${title} 的详情`}
                          url={``}
                          media={
                            <Thumbnail
                              source={featuredImage?.url || ""}
                              alt={title}
                            />
                          }
                        >
                          <BlockStack gap='100'>
                            <div>{title}</div>
                            <div>
                              状态: {status === "ACTIVE" ? "在售" : "下架"}
                            </div>
                            <div>{description}</div>
                            <div>价格: {price}</div>
                            <Link
                              url={`https://${shop}/admin/products/${productId}`}
                              target='_blank'
                            >
                              跳转
                            </Link>
                          </BlockStack>
                        </ResourceItem>
                      );
                    }}
                  />
                )}
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
