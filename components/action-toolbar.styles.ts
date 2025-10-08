import styled from "styled-components";

export const Toolbar = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 20;
`;

export const ToolButton = styled.button<{ $active: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  background-color: ${(props) =>
    props.$active ? "black" : "rgba(0, 0, 0, 0.3)"};
  color: white;

  &:hover {
    background-color: ${(props) =>
      props.$active ? "black" : "rgba(0, 0, 0, 0.5)"};
  }
`;
