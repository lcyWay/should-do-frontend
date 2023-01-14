import React from "react";
import styled, { keyframes } from "styled-components";

import CheckSvg from "svg/CheckSvg";
import DeleteSvg from "svg/DeleteSvg";
import PlusSvg from "svg/PlusSvg";

interface CheckboxInterface {
  icon?: "check" | "delete" | "plus";
  value?: boolean;
  disabled?: boolean;
  asyncOnChange?: (value: boolean) => void | Promise<void>;
  onChange?: (value: boolean) => void;
}

function Checkbox({ value, disabled, onChange, icon = "check", asyncOnChange }: CheckboxInterface) {
  const [loading, setLoading] = React.useState(false);

  const handleCheckboxClick = React.useCallback(async () => {
    if (disabled || loading) return;

    if (asyncOnChange) {
      setLoading(true);
      await asyncOnChange(!value);
      setLoading(false);
      return;
    }

    if (!onChange) return;
    onChange(!value);
  }, [value, onChange, asyncOnChange, disabled, loading]);

  const currentIcon = React.useMemo(() => {
    if (icon === "delete") return <DeleteSvg />;
    if (icon === "plus") return <PlusSvg />;
    return <CheckSvg />;
  }, [icon]);

  return (
    <CheckboxContainer onClick={handleCheckboxClick} disabled={disabled}>
      <StyledCheckbox>
        {loading ? (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        ) : (
          value && currentIcon
        )}
      </StyledCheckbox>
    </CheckboxContainer>
  );
}

const CheckboxContainer = styled("div")<{ disabled?: boolean }>`
  padding: 9px;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

const StyledCheckbox = styled("div")`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.layout.secondary};
  border: 1px solid ${({ theme }) => theme.layout.gray};

  svg {
    width: 10px;
    fill: ${({ theme }) => theme.text.primary};
  }
`;

const backgroundAnimation = keyframes`
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled("div")`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${backgroundAnimation} 2s infinite linear;
  background: conic-gradient(transparent 180deg, ${({ theme }) => theme.text.primary} 180deg);
`;

const Loading = styled("div")`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.layout.secondary};
`;

export default React.memo(Checkbox);
