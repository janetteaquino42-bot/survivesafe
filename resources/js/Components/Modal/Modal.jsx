import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showFooter = true,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    isLoading = false,
    hideCloseButton = false,
    backdrop = "opaque",
    placement = "center",
    scrollBehavior = "inside",
    className = "",
    isDismissable = true,
    ...props
}) {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            backdrop={backdrop}
            placement={placement}
            scrollBehavior="inside"
            hideCloseButton={hideCloseButton}
            isDismissable={isDismissable}
            classNames={{
                base: `my-8 bg-white rounded-lg ${className}`,
                backdrop: "bg-black/50",
                wrapper: "overflow-y-auto",
                body: "max-h-[70vh] overflow-y-auto",
                header: "border-b border-gray-200",
                footer: "border-t border-gray-200",

            }}
            {...props}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        {title && (
                            <ModalHeader className="flex flex-col gap-1">
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                            </ModalHeader>
                        )}
                        <ModalBody>
                            {children}
                        </ModalBody>
                        {showFooter && (
                            <ModalFooter>
                                <SecondaryButton
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    {cancelText}
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className="ml-2"
                                >
                                    {confirmText}
                                </PrimaryButton>
                            </ModalFooter>
                        )}
                    </>
                )}
            </ModalContent>
        </HeroModal>
    );
}
