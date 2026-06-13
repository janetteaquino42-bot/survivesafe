import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "primary",
    isLoading = false,
    icon: Icon = AlertTriangle,
    details = null, // Object with details to display
    detailsComponent = null, // Custom component for details
    ConfirmButton = null, // Custom confirm button component
    CancelButton = null, // Custom cancel button component
    className = "",
}) {
    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            isDismissable={false}
            classNames={{
                base: `my-8 bg-white rounded-lg ${className}`,
                backdrop: "bg-black/50",
                wrapper: "overflow-y-auto",
                body: "max-h-[70vh] overflow-y-auto",
                header: "border-b border-gray-200",
                footer: "border-t border-gray-200",

            }}
        >
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                {Icon && (
                                    <div className={`p-2 rounded-full ${confirmColor === 'danger' ? 'bg-red-100' :
                                        confirmColor === 'success' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                        <Icon
                                            size={24}
                                            className={
                                                confirmColor === 'danger' ? 'text-red-600' :
                                                    confirmColor === 'success' ? 'text-green-600' : 'text-blue-600'
                                            }
                                        />
                                    </div>
                                )}
                                <span className="text-lg font-semibold">{title}</span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-gray-700 mb-3">{message}</p>

                            {/* Custom details component */}
                            {detailsComponent}

                            {/* Default details display */}
                            {!detailsComponent && details && (
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Details:</h4>
                                    <div className="space-y-2">
                                        {Object.entries(details).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-start text-sm">
                                                <span className="text-gray-600 capitalize font-medium">
                                                    {key.replace(/_/g, ' ')}:
                                                </span>
                                                <span className="text-gray-900 font-semibold text-right ml-2">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            {CancelButton ? (
                                <CancelButton onClick={onCloseModal} disabled={isLoading}>
                                    {cancelText}
                                </CancelButton>
                            ) : (
                                <Button
                                    variant="light"
                                    onPress={onCloseModal}
                                    isDisabled={isLoading}
                                >
                                    {cancelText}
                                </Button>
                            )}
                            {ConfirmButton ? (
                                <ConfirmButton
                                    onClick={() => {
                                        onConfirm();
                                        onCloseModal();
                                    }}
                                    disabled={isLoading}
                                >
                                    {confirmText}
                                </ConfirmButton>
                            ) : (
                                <Button
                                    color={confirmColor}
                                    onPress={() => {
                                        onConfirm();
                                        onCloseModal();
                                    }}
                                    isLoading={isLoading}
                                >
                                    {confirmText}
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </HeroModal>
    );
}
