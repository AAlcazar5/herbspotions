import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { CheckOutButtonProps } from "@/shared/types/product";
import { Button } from "@/shared/components/Button";

function CheckOutButton({ webUrl, className = '', disabled = false }: CheckOutButtonProps) {
  return (
    <Button
      href={!disabled ? webUrl : undefined}
      variant="primary"
      disabled={disabled || !webUrl}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Proceed to checkout"
    >
      Proceed to Checkout
      <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4 ml-2 inline-flex" aria-hidden="true" />
    </Button>
  );
}

export default CheckOutButton;