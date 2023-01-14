import React from "react";
import styled from "styled-components";

interface InputInterface {
  value: string;
  onChange: (newValue: string) => void;
  password?: boolean;
}

function Input({ value, onChange, password }: InputInterface) {
  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return <StyledInput type={password ? "password" : "text"} value={value} onChange={handleInputChange} />;
}

const StyledInput = styled("input")`
  border: 1px solid ${({ theme }) => theme.layout.gray};
  padding: 8px 10px;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.layout.secondary};

  &:focus {
    outline: 0;
    border: 1px solid ${({ theme }) => theme.text.primary};
  }
`;

export default React.memo(Input);
