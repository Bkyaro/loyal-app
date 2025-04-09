import { Modal, ButtonGroup, Button, Text } from "@shopify/polaris";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmationDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmationDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      primaryAction={{
        content: confirmText,
        onAction: onConfirm,
        destructive: destructive,
      }}
      secondaryActions={[
        {
          content: cancelText,
          onAction: onCancel,
        },
      ]}
    >
      <Modal.Section>
        <Text as='p'>{message}</Text>
      </Modal.Section>
    </Modal>
  );
}
