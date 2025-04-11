import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { WayToRedeem, mockWaysToRedeemData } from "~/mock/programData";
import { Loading } from "@shopify/polaris";
import { PercentageOffRedeem } from "~/components/redeems/PercentageOffRedeem";
import { AmountDiscountRedeem } from "~/components/redeems/AmountDiscountRedeem";
import { FreeShippingRedeem } from "~/components/redeems/FreeShippingRedeem";

export default function EditRewards() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [actionData, setActionData] = useState<WayToRedeem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock API call to fetch action data
    const fetchActionData = () => {
      setLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Find the action with the matching ID
        const actionId = parseInt(id || "0", 10);
        const foundAction = mockWaysToRedeemData.find(
          (redeem) => redeem.id === actionId,
        );

        if (foundAction) {
          setActionData(foundAction);
        } else {
          // If action not found, navigate back to list
          navigate("/app/program/points/rewards");
        }

        setLoading(false);
      }, 800);
    };

    if (id) {
      fetchActionData();
    }
  }, [id, navigate]);

  const handleSave = (updatedData: any) => {
    // 确保更新数据包含active状态
    // 这里我们使用扩展运算符合并原始数据和更新的数据
    const dataToSave = {
      ...actionData,
      ...updatedData,
    };

    console.log("Saving action:", dataToSave);

    // 在实际应用中，这将是一个API调用来更新action
    // 模拟API调用的延迟
    setTimeout(() => {
      navigate("/app/program/points/rewards");
    }, 500);
  };

  const handleDelete = () => {
    console.log("Deleting reward:", id);
    // 在实际应用中，这将是一个API调用来更新action
    // 模拟API调用的延迟
    setTimeout(() => {
      navigate("/app/program/points/actions");
    }, 500);
  };

  // Render loading skeleton while fetching data
  if (loading) {
    return <Loading />;
  }

  // Handle action not found
  if (!actionData) {
    return <div>Reward not found</div>;
  }

  // Render the appropriate component based on action type
  const renderActionComponent = () => {
    switch (actionData.title) {
      case "Amount discount":
        return (
          <AmountDiscountRedeem
            isEditing={true}
            initialData={actionData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case "Percentage off":
        return (
          <PercentageOffRedeem
            isEditing={true}
            initialData={actionData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case "Free shipping":
        return (
          <FreeShippingRedeem
            isEditing={true}
            initialData={actionData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      default:
        return <div>Unsupported action type: {actionData.title}</div>;
    }
  };

  return renderActionComponent();
}
