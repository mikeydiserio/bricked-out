import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a103d; /* purple-950 */
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
`;

export const PlayButton = styled.button`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #d1d5db; /* gray-300 */
  }
`;
