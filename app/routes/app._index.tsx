import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
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
import { Button as CNButton } from "../components/ui/button";

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
  console.log("requst!", JSON.stringify(request));
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

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

  // 新增: 获取 Shopify Functions 信息
  try {
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

    // 打印获取到的 Shopify Functions 数据到控制台
    console.log(
      "Shopify Functions Data:",
      JSON.stringify(functionsData, null, 2),
    );

    return {
      products: nodes,
      shop,
      shopifyFunctions: functionsData.data?.shopifyFunctions?.nodes || [],
    };
  } catch (error) {
    console.error("Error fetching Shopify Functions:", error);
    return { products: nodes, shop, shopifyFunctions: [] };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

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
};

export default function Index() {
  const { products, shop, shopifyFunctions } = useLoaderData<{
    products: Product[];
    shop: string;
    shopifyFunctions: any[];
  }>();

  console.log("shopifyFunctions", shopifyFunctions);
  // output
  // [
  //   {
  //     "id": "0c8bc3db-009e-48f4-93da-xxxxxxxx",
  //     "app": {
  //       "title": "loyalol"
  //     },
  //     "apiType": "product_discounts",
  //     "title": "product-discount"
  //   },
  //   {
  //     "id": "426814bd-3d67-40a5-9ef1-xxxxxxxx",
  //     "app": {
  //       "title": "loyalol"
  //     },
  //     "apiType": "order_discounts",
  //     "title": "order-discount-function-test"
  //   }
  // ]

  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

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

  // useEffect(() => {
  //   const response = shopify.scopes
  //     .request(["read_discounts"])
  //     .then((res) => {
  //       console.log("response", res);
  //     });
  // }, [shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

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
        loading: isLoading,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding='400'>
              <BlockStack gap='400'>
                <div>Shopify Functions</div>
                {shopifyFunctions && shopifyFunctions.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <pre>{JSON.stringify(shopifyFunctions, null, 2)}</pre>
                  </div>
                ) : (
                  <div>No Shopify Functions found</div>
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
