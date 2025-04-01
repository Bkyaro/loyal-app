import type { RunInput, FunctionRunResult, Target } from "../generated/api";
import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {};

export function run(input: RunInput): FunctionRunResult {
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}",
  );

  const targets: Target[] = input.cart.lines
    .filter((line) => {
      if (line.merchandise.__typename === "ProductVariant") {
        const hasLimitedEditionTag = line.merchandise.product.hasAnyTag;
        return hasLimitedEditionTag === false;
      }
    })
    .map((line) => {
      return {
        productVariant: {
          id: (line.merchandise as any).id,
        },
      };
    });

  const DISCOUNT_ITEMS: FunctionRunResult = {
    // https://shopify.dev/docs/api/functions/reference/discounts-allocator/graphql/common-objects/discountapplicationstrategy?api%5Bversion%5D=unstable
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        targets: targets,
        value: {
          percentage: {
            value: 100,
          },
        },
        message: "10% OFF",
      },
    ],
  };

  return DISCOUNT_ITEMS;
}
