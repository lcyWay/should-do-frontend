import React from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";

interface ButtonInterface {
  children: React.ReactNode;
  small?: boolean;
  href?: string;
  blank?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function Button({ children, loading, onClick, href, blank, small }: ButtonInterface) {
  const handleButtonClick = React.useCallback(() => {
    if (loading || !onClick) return;
    onClick();
  }, [loading, onClick]);

  return href ? (
    <StyledButtonLink small={small} href={href} target={blank ? "_blank" : "_self"} type="button">
      {children}
      {loading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
    </StyledButtonLink>
  ) : (
    <StyledButton small={small} onClick={handleButtonClick} type="button">
      {children}
      {loading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
    </StyledButton>
  );
}

const backgroundAnimation = keyframes`
  0% {
    background-position: left top, right bottom, left bottom, right top;
  }

  100% {
    background-position: left 20px top, right 20px bottom, left bottom 20px, right top 20px;
  }
`;

const StyledButton = styled("button")<{ small?: boolean }>`
  padding: ${({ small }) => (small ? "4px 8px" : "8px 24px")};
  font-size: 16px;
  border-radius: 2px;
  border: 0;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  background-color: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${backgroundAnimation} 1s infinite linear;
  background-size: 20px 2px, 20px 2px, 2px 20px, 2px 20px;
  background-image: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%),
    linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%),
    linear-gradient(0deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%),
    linear-gradient(0deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;

  @media (min-width: 768px) {
    padding: ${({ small }) => (small ? "6px 10px" : "10px 32px")};
    font-size: 18px;
  }
`;

const StyledButtonLink = styled(Link)<{ small?: boolean }>`
  padding: 8px ${({ small }) => (small ? "8px" : "24px")};
  font-size: 16px;
  border-radius: 2px;
  border: 0;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  background-color: transparent;
  animation: ${backgroundAnimation} 1s infinite linear;
  background-size: 20px 2px, 20px 2px, 2px 20px, 2px 20px;
  background-image: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%),
    linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%),
    linear-gradient(0deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%),
    linear-gradient(0deg, ${({ theme }) => theme.colors.primary} 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;

  @media (min-width: 768px) {
    padding: 10px ${({ small }) => (small ? "10px" : "32px")};
    font-size: 18px;
  }
`;

const loadingAnimation = keyframes`
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
  animation: ${loadingAnimation} 2s infinite linear;
  background: conic-gradient(transparent 180deg, ${({ theme }) => theme.colors.primary} 180deg);
`;

const Loading = styled("div")`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.layout.secondary};
`;

export default React.memo(Button);
