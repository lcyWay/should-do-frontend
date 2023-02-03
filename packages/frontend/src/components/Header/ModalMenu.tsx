import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import DeleteSvg from "svg/DeleteSvg";

import { Locale } from "pages/_app";

interface ModalMenuInterface {
  visibility: boolean;
  locale: Locale;
  children: React.ReactNode;
  onClose: () => void;
  toggleLocale: () => void;
}

function ModalMenu({ onClose, locale, toggleLocale, visibility, children }: ModalMenuInterface) {
  const [renderElement, setRenderElement] = React.useState<HTMLBodyElement | null>(null);

  React.useEffect(() => {
    const element = document.querySelector("body");
    if (!element) return;
    setRenderElement(element);
  }, []);

  if (!visibility || !renderElement) return null;

  return ReactDOM.createPortal(
    <Container>
      <HeaderContainer>
        <CloseButton onClick={onClose}>
          <DeleteSvg />
        </CloseButton>
        <NavigationComponent onClick={toggleLocale}>
          <img src={`/flags/flag-${locale === "ru" ? "en" : "ru"}.svg`} />
          {locale === "ru" ? "English" : "Русский"}
        </NavigationComponent>
      </HeaderContainer>
      {children}
    </Container>,
    renderElement
  );
}

const Container = styled("div")`
  background: ${({ theme }) => theme.layout.secondary};
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderContainer = styled("div")`
  display: flex;
  height: 49px;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.layout.primary};
  border-bottom: 1px solid ${({ theme }) => theme.layout.gray};
`;

const CloseButton = styled("div")`
  padding: 0 10px;
  display: flex;

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.text.primary};
  }
`;

const NavigationComponent = styled("div")<{ hideOnMobile?: boolean }>`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 10px;
  height: 100%;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  gap: 8px;
  color: ${({ theme }) => theme.text.primary};

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transition: 0.15s border ease-in-out;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    display: ${({ hideOnMobile }) => (hideOnMobile ? "none" : "flex")};
  }
`;

export default React.memo(ModalMenu);
