import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { AmountDiscountRedeem } from "~/components/redeems/AmountDiscountRedeem";
import { PercentageOffRedeem } from "~/components/redeems/PercentageOffRedeem";
import { FreeShippingRedeem } from "~/components/redeems/FreeShippingRedeem";
import { Loading } from "@shopify/polaris";

// Define action types as an enum
enum ActionType {
  AMOUNT = "1",
  PERCENTAGE = "2",
  FREE_SHIPPING = "3",
}

export default function NewRewards() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Get action type from URL parameter
    const create = searchParams.get("create");
    setActionType(create);

    // If no action type is specified, navigate to the default
    if (!create) {
      navigate(`/app/program/points/rewards/new?create=${ActionType.AMOUNT}`);
    }

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  // 处理创建action
  const handleCreateRedeem = (actionData: any) => {
    console.log("Creating reward:", {
      type: actionType,
      ...actionData,
    });

    // 在实际应用中，这将是一个API调用来创建action

    // 模拟API调用
    setTimeout(() => {
      navigate("/app/program/points/rewards");
    }, 500);
  };

  // Render the appropriate component based on action type
  const renderActionComponent = () => {
    if (loading) {
      return <Loading />;
    }

    switch (actionType) {
      case ActionType.AMOUNT:
        return <AmountDiscountRedeem onSave={handleCreateRedeem} />;
      case ActionType.PERCENTAGE:
        return <PercentageOffRedeem onSave={handleCreateRedeem} />;
      case ActionType.FREE_SHIPPING:
        return <FreeShippingRedeem onSave={handleCreateRedeem} />;
      default:
        navigate("/app/program/points/rewards");
        return null;
    }
  };

  return renderActionComponent();
}
